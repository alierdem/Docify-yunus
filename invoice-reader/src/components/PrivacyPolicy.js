import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function PrivacyPolicy() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Privacy Policy
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="body1" paragraph>
            Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
          </Typography>
          <Typography variant="body1" paragraph>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
          </Typography>
          <Typography variant="body1" paragraph>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </Typography>
          <Typography variant="body1" paragraph>
            We don't share any personally identifying information publicly or with third-parties, except when required to by law.
          </Typography>
          <Typography variant="body1" paragraph>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </Typography>
          <Typography variant="body1" paragraph>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
          </Typography>
          <Typography variant="body1" paragraph>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </Typography>
          <Typography variant="body1">
            This policy is effective as of 1 August 2024.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default PrivacyPolicy;