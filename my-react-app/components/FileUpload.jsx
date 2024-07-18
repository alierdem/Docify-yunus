import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { analyzeInvoice } from '../services/api';
import { uploadFile } from '../services/fileUpload';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setIsLoading(true);
      try {
        const result = await analyzeInvoice(file);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error analyzing invoice:', error);
        alert('An error occurred while analyzing the invoice.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please select a file');
    }
  };

  return (
    <div>
      <h2>Invoice Analysis</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Choose an invoice file</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Invoice'}
        </Button>
      </Form>
      {analysisResult && (
        <div className="mt-4">
          <h3>Analysis Result</h3>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FileUpload;