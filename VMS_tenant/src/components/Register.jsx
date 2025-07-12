import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    unitNo: '',
    streetNo: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register(formData);
      onLogin(response.token);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h2>🏠 VMS Tenant</h2>
          <p className="mb-0">Create your account</p>
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

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unit No</Form.Label>
                  <Form.Control
                    type="text"
                    name="unitNo"
                    value={formData.unitNo}
                    onChange={handleChange}
                    placeholder="e.g., A101"
                    maxLength={20}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Street No</Form.Label>
                  <Form.Control
                    type="text"
                    name="streetNo"
                    value={formData.streetNo}
                    onChange={handleChange}
                    placeholder="e.g., 123"
                    maxLength={20}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none">
                Sign in here
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
