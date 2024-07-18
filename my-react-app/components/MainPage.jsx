import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FileUpload from './FileUpload.jsx';
import ApiInfo from './ApiInfo.jsx';

function MainPage() {
  return (
    <Container className="mt-5">
      <h1>Main Page</h1>
      <Row>
        <Col md={6}>
          <FileUpload />
        </Col>
        <Col md={6}>
          <ApiInfo />
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;