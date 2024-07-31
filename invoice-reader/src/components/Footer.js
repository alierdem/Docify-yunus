import React from 'react';
import { Typography, Box, Link } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        © 2024 Invoice Analyzer by Cebren Finance. By using this service, full responsibility for any actions taken based on the information provided is accepted.{' '}
        <Link href="/privacy-policy" color="inherit" underline="hover">
          All rights reserved.
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;
