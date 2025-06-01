import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 0.5rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #2B52DD;
  font-weight: 600;
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #2B52DD;
  border-color: #2B52DD;

  &:hover {
    background: #1E3FAA;
    border-color: #1E3FAA;
  }
`;

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path and message from location state
  const from = location.state?.from || '/';
  const message = location.state?.message;

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(credentials);
      if (result.success) {
        console.log('Login successful, redirecting to:', from);
        navigate(from);
      } else {
        setError(result.error || 'Failed to login. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login to Continue</Title>
        
        {message && (
          <Alert variant="info" className="mb-3">
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <StyledButton type="submit">
            Login
          </StyledButton>
        </Form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          New user?{' '}
          <span
            style={{ color: '#2B52DD', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/register')}
          >
            Sign up
          </span>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
