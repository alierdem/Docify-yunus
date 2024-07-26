import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.error || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Invoice Analyzer
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
              Upload File
            </Button>
          </label>
          {file && <Typography sx={{ mt: 2 }}>Selected file: {file.name}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={!file || loading}
          >
            Analyze Invoice
          </Button>
        </form>
        {loading && <Typography sx={{ mt: 2 }}>Analyzing invoice...</Typography>}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Analysis Result:
            </Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;