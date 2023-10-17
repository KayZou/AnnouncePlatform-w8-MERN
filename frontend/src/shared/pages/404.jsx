import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} className="text-center mt-5">
          <FaExclamationTriangle size={100} className="text-warning" />
          <h2 className="mt-4">404 - Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <Button href="/authenticate" variant="primary">Go to Home</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
