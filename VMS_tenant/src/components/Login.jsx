import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData);
      onLogin(response.token);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h2>🏠 VMS Tenant</h2>
          <p className="mb-0">Welcome back!</p>
        </div>
        <Card.Body className="auth-body">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none">
                Sign up here
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
