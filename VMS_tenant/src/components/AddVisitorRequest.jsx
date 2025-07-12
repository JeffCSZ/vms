import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AddVisitorRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitorName: '',
    vehiclePlateNumber: '',
    visitDateTime: '',
    expiry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
  }, []);

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

    // Validate that expiry is after visit date
    if (new Date(formData.expiry) <= new Date(formData.visitDateTime)) {
      setError('Expiry date must be after visit date');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.createVisitorRequest(formData);
      navigate(`/qr/${response.uuid}`);
    } catch (err) {
      console.error('Create visitor request error:', err);
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else {
        setError(err.message || 'Failed to create visitor request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get current date and time for minimum values
  const now = new Date();
  const currentDateTime = now.toISOString().slice(0, 16);

  // Default expiry to 24 hours from visit time
  const getDefaultExpiry = (visitDateTime) => {
    if (!visitDateTime) return '';
    const visit = new Date(visitDateTime);
    visit.setHours(visit.getHours() + 24);
    return visit.toISOString().slice(0, 16);
  };

  // Format datetime for iOS compatibility
  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    return dateTimeString;
  };

  // Create iOS-friendly datetime input
  const renderDateTimeInput = (name, value, onChange, min, label, helpText) => {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        {isIOS ? (
          <div className="ios-datetime-container">
            <Form.Control
              type="datetime-local"
              name={name}
              value={value}
              onChange={onChange}
              min={min}
              required
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
                backgroundColor: '#fff',
                border: '1px solid #ced4da',
                borderRadius: '0.375rem',
                padding: '0.375rem 0.75rem',
                fontSize: '1rem',
                lineHeight: '1.5',
                color: '#495057',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'none\' stroke=\'%23343a40\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M2 5l6 6 6-6\'/%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px 12px'
              }}
            />
            <small className="form-text text-muted">
              📅 Tap to select date and time
            </small>
          </div>
        ) : (
          <Form.Control
            type="datetime-local"
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            required
          />
        )}
        {helpText && (
          <Form.Text className="text-muted">
            {helpText}
          </Form.Text>
        )}
      </Form.Group>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add Visitor Request</h1>
        <p className="mb-0">Create a new visitor request</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Visitor Name</Form.Label>
              <Form.Control
                type="text"
                name="visitorName"
                value={formData.visitorName}
                onChange={handleChange}
                placeholder="Enter visitor's full name"
                maxLength={30}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicle Plate Number</Form.Label>
              <Form.Control
                type="text"
                name="vehiclePlateNumber"
                value={formData.vehiclePlateNumber}
                onChange={handleChange}
                placeholder="e.g., ABC123"
                maxLength={10}
                required
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Group>

            {renderDateTimeInput(
              'visitDateTime',
              formData.visitDateTime,
              (e) => {
                handleChange(e);
                // Auto-set expiry to 24 hours later
                if (e.target.value && !formData.expiry) {
                  setFormData(prev => ({
                    ...prev,
                    visitDateTime: e.target.value,
                    expiry: getDefaultExpiry(e.target.value)
                  }));
                }
              },
              currentDateTime,
              'Visit Date & Time',
              null
            )}

            {renderDateTimeInput(
              'expiry',
              formData.expiry,
              handleChange,
              formData.visitDateTime || currentDateTime,
              'Expiry Date & Time',
              'When should this visitor request expire?'
            )}

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  'Create Request'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/requests')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
};

export default AddVisitorRequest;
