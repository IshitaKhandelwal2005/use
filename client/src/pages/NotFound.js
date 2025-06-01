import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="display-1 text-primary mb-4">404</div>
          <h1 className="mb-4">Page Not Found</h1>
          <p className="lead text-muted mb-5">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="d-flex justify-content-center gap-3">
            <Button 
              as={Link} 
              to="/" 
              variant="primary" 
              size="lg"
              className="d-flex align-items-center"
            >
              <FaHome className="me-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={() => window.history.back()}
              className="d-flex align-items-center"
            >
              <FaSearch className="me-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-5">
            <p className="text-muted">
              If you believe this is a mistake, please contact support.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
