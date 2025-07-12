import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const VisitorDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchVisitorRequest();
  }, [uuid]);

  const fetchVisitorRequest = async () => {
    try {
      const data = await apiService.getVisitorRequestByUUID(uuid);
      setRequest(data);

      // Determine status based on request date and expiry
      const now = new Date();
      const expiryDate = new Date(data.expiry);
      const requestDate = new Date(data.visitDateTime);

      // Get today's date (without time)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get request date (without time)
      const requestDateOnly = new Date(requestDate);
      requestDateOnly.setHours(0, 0, 0, 0);

      // Check if request is expired first
      if (expiryDate <= now) {
        setStatus('expired');
        updateRecentScan('expired', data.visitorName);
      }
      // Check if request date is not today
      else if (requestDateOnly.getTime() !== today.getTime()) {
        setStatus('wrong-date');
        updateRecentScan('wrong-date', data.visitorName);
      }
      // Request is for today and not expired
      else {
        setStatus('valid');
        updateRecentScan('valid', data.visitorName);
      }

    } catch (err) {
      console.error('Visitor request fetch error:', err);
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Visitor request not found.');
        setStatus('not-found');
        updateRecentScan('not-found', 'Unknown');
      } else {
        setError('Unable to load visitor details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRecentScan = (scanStatus, visitorName) => {
    const recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    const scanIndex = recentScans.findIndex(scan => scan.uuid === uuid);
    
    if (scanIndex !== -1) {
      recentScans[scanIndex].status = scanStatus;
      recentScans[scanIndex].visitorName = visitorName;
      localStorage.setItem('recentScans', JSON.stringify(recentScans));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'valid':
        return <Badge className="status-badge status-valid">✅ Request is Valid</Badge>;
      case 'expired':
        return <Badge className="status-badge status-expired">⚠️ Warning, Expired Request</Badge>;
      case 'wrong-date':
        return <Badge className="status-badge status-warning">⚠️ Warning, RequestDate is not Today</Badge>;
      case 'not-found':
        return <Badge className="status-badge status-not-found">❌ Not Found</Badge>;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'valid':
        return 'This visitor has valid access for today. Allow entry.';
      case 'expired':
        return 'This visitor request has expired. Entry should be denied.';
      case 'wrong-date':
        return 'This visitor request is not for today. Verify with resident before allowing entry.';
      case 'not-found':
        return 'No visitor request found for this QR code.';
      default:
        return '';
    }
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

  return (
    <div>
      <div className="page-header">
        <h1>Visitor Details</h1>
        <p className="mb-0">Scan verification result</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {error && !request && (
          <Alert variant="danger" className="text-center">
            <h5>⚠️ {error}</h5>
            <p className="mb-0">{getStatusMessage()}</p>
          </Alert>
        )}

        {request && (
          <>
            {/* Status Card */}
            <Card className="mb-3">
              <Card.Body className="text-center">
                {getStatusBadge()}
                <p className="mt-2 mb-0 text-muted">{getStatusMessage()}</p>
              </Card.Body>
            </Card>

            {/* Visitor Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">Visitor Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-4">
                    <strong>Name:</strong>
                  </div>
                  <div className="col-8">
                    {request.visitorName}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-4">
                    <strong>Vehicle:</strong>
                  </div>
                  <div className="col-8">
                    🚗 {request.vehiclePlateNumber}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-4">
                    <strong>Visit Time:</strong>
                  </div>
                  <div className="col-8">
                    {formatDate(request.visitDateTime)}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-4">
                    <strong>Expires:</strong>
                  </div>
                  <div className="col-8">
                    {formatDate(request.expiry)}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-4">
                    <strong>Created:</strong>
                  </div>
                  <div className="col-8">
                    {formatDate(request.dateTimeCreated)}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/scanner')}
          >
            📷 Scan Another QR Code
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/')}
          >
            🏠 Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetails;
