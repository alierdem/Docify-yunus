import React from 'react';
import { Typography, Box } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        © 2024 Invoice Analyzer by Cebren Finance. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;