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
        Welcome to Cebren Finans, a leading software development company specializing in cutting-edge technology solutions. Despite our name, which might suggest a financial focus, our expertise lies in creating innovative software products that cater to a wide range of industries. At Cebren Finans, we pride ourselves on delivering high-quality, customized software that empowers businesses to operate more efficiently and effectively.        </Typography>
        <Typography variant="body1" paragraph>
        Our team consists of talented software engineers, designers, and industry experts who are passionate about technology and innovation. We are committed to providing our clients with the best possible solutions, whether it's developing user-friendly web applications, mobile apps, or complex enterprise systems. Our diverse portfolio showcases our ability to tackle various technological challenges and deliver exceptional results.
        </Typography>
        <Typography variant="body1" paragraph>
        At Cebren Finans, we believe in a client-centric approach. We work closely with our clients to understand their unique needs and tailor our solutions accordingly. Our goal is to help businesses harness the power of technology to achieve their objectives, streamline processes, and enhance their overall performance.        </Typography>
        <Typography variant="body1" paragraph>
        Thank you for considering Cebren Finans for your software development needs. We look forward to partnering with you and turning your ideas into reality.        </Typography>
      </Box>
    </Container>
  );
}

export default About;