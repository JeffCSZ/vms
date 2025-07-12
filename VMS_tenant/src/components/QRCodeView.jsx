import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import apiService from '../services/api';

const QRCodeView = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [uuid]);

  const fetchRequest = async () => {
    try {
      const data = await apiService.getVisitorRequestByUUID(uuid);
      setRequest(data);
    } catch (err) {
      console.error('QR Code fetch error:', err);
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Visitor request not found.');
      } else {
        setError('Unable to load QR code. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Visitor Request QR Code',
          text: `Visitor request for ${request.visitorName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) <= new Date();
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="px-3 py-3">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/requests')}>
          Back to Requests
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>QR Code</h1>
        <p className="mb-0">Share this with your visitor</p>
      </div>

      <div className="px-3 pb-5 mb-5">

      <Card className="text-center">
        <Card.Body>
          <div className="qr-container">
            <div className="qr-code">
              <QRCode
                value={uuid}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            
            <h5 className="mt-3">{request.visitorName}</h5>
            <p className="text-muted mb-1">🚗 {request.vehiclePlateNumber}</p>
            
            <div className="mt-3">
              <span className={`badge ${isExpired(request.expiry) ? 'bg-warning' : 'bg-success'} mb-2`}>
                {isExpired(request.expiry) ? 'Expired' : 'Active'}
              </span>
            </div>

            <div className="text-start mt-3">
              <small className="text-muted d-block">
                <strong>Visit Time:</strong><br />
                {formatDate(request.visitDateTime)}
              </small>
              <small className="text-muted d-block mt-2">
                <strong>Expires:</strong><br />
                {formatDate(request.expiry)}
              </small>
              <small className="text-muted d-block mt-2">
                <strong>Resident:</strong><br />
                {request.userEmail} - Unit {request.unitNo || 'N/A'}
              </small>
            </div>
          </div>

          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" onClick={handleShare}>
              📤 Share QR Code
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/requests')}
            >
              Back to Requests
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-3">
        <Card.Body>
          <h6>Instructions for Visitor:</h6>
          <ol className="small text-muted">
            <li>Show this QR code to security at the gate</li>
            <li>Security will scan the code to verify your visit</li>
            <li>Make sure to arrive during the valid time period</li>
            <li>Have your ID ready for verification</li>
          </ol>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
};

export default QRCodeView;
