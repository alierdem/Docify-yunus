import os
from flask import Flask, request, render_template, jsonify
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

app = Flask(__name__)

# Azure Form Recognizer settings
endpoint = "https://docunalyze-1.cognitiveservices.azure.com/"
key = "d808277d16234f39adca19e3eb0d6256"

# Ensure a directory for uploads exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
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
        return jsonify(result), 200, {'Content-Type': 'application/json'}


def analyze_invoice(file_path):
    client = DocumentAnalysisClient(endpoint, AzureKeyCredential(key))
    with open(file_path, "rb") as f:
        poller = client.begin_analyze_document("prebuilt-invoice", document=f)
    result = poller.result()

    if len(result.documents) > 0:
        invoice = result.documents[0].fields
        invoice_data = {}
        for field_name, field_value in invoice.items():
            invoice_data[field_name] = field_value.content if field_value else None
        return invoice_data
    else:
        return {'error': 'No invoice found in the document'}


if __name__ == '__main__':
    app.run(debug=True)