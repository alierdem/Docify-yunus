import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Paper, CircularProgress, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileRemove = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
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
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
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

  const renderPreview = () => {
    if (!file) return null;

    const fileType = file.type.split('/')[0];
    return (
      <Box sx={{ position: 'relative', mt: 2, textAlign: 'center' }}>
        <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={handleFileRemove}
        >
          <CloseIcon />
        </IconButton>
        {fileType === 'image' ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
            onLoad={() => URL.revokeObjectURL(file)}
          />
        ) : (
          <Box>
            <FileIcon sx={{ fontSize: 100, color: 'primary.main' }} />
            <Typography variant="body1">{file.name}</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    const filteredResult = Object.entries(result).filter(([, value]) => value !== '' && value !== null);

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Analysis Result:
        </Typography>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f8f8f8' }}>
          {filteredResult.map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary" fontWeight="bold">
                {key.replace(/_/g, ' ').toUpperCase()}:
              </Typography>
              <Typography variant="body1">{value}</Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Invoice Analyzer
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            backgroundColor: isDragActive ? '#e3f2fd' : 'white',
            transition: 'background-color 0.3s',
          }}
        >
          <Box {...getRootProps()} sx={{ textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {!file && (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported file types: Images, PDFs, and more
                </Typography>
              </>
            )}
            {file && renderPreview()}
          </Box>
          {file && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Analyzing...' : 'Analyze Invoice'}
              </Button>
            </Box>
          )}
        </Paper>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        {renderResult()}
      </Box>
    </Container>
  );
}

export default Home;
