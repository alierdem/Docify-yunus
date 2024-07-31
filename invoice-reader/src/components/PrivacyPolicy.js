import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function PrivacyPolicy() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="body1" paragraph>
            At Cebren Finans, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Rights notice outlines your rights concerning the data we collect, process, and store.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            Information Collection
          </Typography>
          <Typography variant="body1" paragraph>
            We collect personal information that you provide to us directly, such as your name, email address, and contact details, as well as any other information necessary for us to provide our services. Additionally, we may collect data automatically through the use of cookies and similar technologies when you visit our website.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            Use of Information
          </Typography>
          <Typography variant="body1" paragraph>
            The information we collect is used to provide and improve our services, communicate with you, and ensure the security and functionality of our website. We may also use your information for marketing purposes, such as sending you updates about our services, unless you opt-out.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            Sharing of Information
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law. In some cases, we may share information with trusted partners who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to access, update, and delete your personal information. You may also object to or restrict the processing of your data under certain circumstances. To exercise these rights, please contact us using the contact information provided on our website.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no security measures can provide absolute protection, and we encourage you to take steps to protect your information.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Rights notice from time to time. Any changes will be posted on our website, and we encourage you to review this notice periodically to stay informed about how we are protecting your information.
          </Typography>

          <Typography variant="body1" paragraph>
            For any questions or concerns regarding our privacy practices, please contact us at the details provided on our website. We are committed to resolving any issues in a timely and transparent manner.
          </Typography>

          <Typography variant="body1" paragraph>
            Thank you for trusting Cebren Finans with your personal information.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default PrivacyPolicy;
