import os
import logging
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Azure Form Recognizer settings from environment variables
endpoint = os.getenv("AZURE_FORM_RECOGNIZER_ENDPOINT")
key = os.getenv("AZURE_FORM_RECOGNIZER_KEY")

# Ensure a directory for uploads exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filename)
        result = analyze_invoice(filename)
        return jsonify(result), 200
    
def analyze_invoice(file_path):
    client = DocumentAnalysisClient(endpoint, AzureKeyCredential(key))
    with open(file_path, "rb") as f:
        poller = client.begin_analyze_document("prebuilt-invoice", document=f)
    result = poller.result()

    if len(result.documents) > 0:
        invoice = result.documents[0].fields
        invoice_data = {}
        for field_name, field_value in invoice.items():
            # Convert camelCase to Title Case
            human_readable_field_name = re.sub(r'(?<!^)(?=[A-Z])', ' ', field_name).title()
            invoice_data[human_readable_field_name] = field_value.content if field_value else None
        
        # Log the invoice data
        logging.info(f"Extracted invoice data: {invoice_data}")
        
        return invoice_data
    else:
        logging.error('No invoice found in the document')
        return {'error': 'No invoice found in the document'}
    

def analyze_invoice_for_field(file_path, field):
    client = DocumentAnalysisClient(endpoint, AzureKeyCredential(key))
    with open(file_path, "rb") as f:
        poller = client.begin_analyze_document("prebuilt-invoice", document=f)
    result = poller.result()

    found_field = {}
    if len(result.documents) > 0:
        invoice = result.documents[0]
        
        # Search in fields
        for field_name, field_value in invoice.fields.items():
            if field.lower() in field_name.lower():
                found_field[field] = field_value.content if field_value else None
                break
        
        # If not found in fields, search in the entire document content
        if not found_field:
            content = ' '.join([line.content for page in result.pages for line in page.lines])
            pattern = rf'{re.escape(field)}\s*[:=]?\s*(\S+)'
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                found_field[field] = match.group(1)

    if found_field:
        logging.info(f"Found additional field: {found_field}")
        return {'result': found_field, 'found': True}
    else:
        logging.warning(f'Field "{field}" not found in the document')
        return {'result': {}, 'found': False, 'message': f'Field "{field}" not found in the document'}

@app.route('/api/search_additional_field', methods=['POST'])
def search_additional_field():
    data = request.json
    file_path = os.path.join(UPLOAD_FOLDER, data['file_path'])
    field = data['field']
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    result = analyze_invoice_for_field(file_path, field)
    return jsonify(result), 200

   
if __name__ == '__main__':
    app.run(debug=True)