import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          We are a company dedicated to simplifying invoice analysis using AI technology. Our goal is to help businesses streamline their financial processes and improve efficiency.
        </Typography>
        <Typography variant="body1" paragraph>
          Our Invoice Analyzer tool uses advanced machine learning algorithms to extract key information from invoices, making it easier for you to process and manage your financial documents.
        </Typography>
      </Box>
    </Container>
  );
}

export default About;