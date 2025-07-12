import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    expiredRequests: 0,
  });
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check if we have a token first
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, skipping API call');
        setLoading(false);
        return;
      }

      console.log('Fetching visitor requests for guard dashboard...');
      const requests = await apiService.getAllVisitorRequests();
      console.log('Successfully fetched requests:', requests.length);

      const now = new Date();

      const active = requests.filter(req => new Date(req.expiry) > now);
      const expired = requests.filter(req => new Date(req.expiry) <= now);

      setStats({
        totalRequests: requests.length,
        activeRequests: active.length,
        expiredRequests: expired.length,
      });

      // Get recent scans from localStorage
      const scans = JSON.parse(localStorage.getItem('recentScans') || '[]');
      setRecentScans(scans.slice(0, 5));

    } catch (err) {
      console.error('Dashboard API error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });

      // Check if it's an authentication error
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else if (err.message.includes('Forbid') || err.message.includes('Only guards')) {
        setError('Access denied. This account is not registered as a guard. Please register a new guard account.');
      } else if (err.message.includes('User not found')) {
        setError('User account not found. Please log in again.');
      } else {
        setError(`Unable to load data: ${err.message}`);
      }
    } finally {
      setLoading(false);
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
        <h1>Security Dashboard</h1>
        <p className="mb-0">Welcome to VMS Guard</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col xs={4}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary mb-1">{stats.totalRequests}</h3>
                <small className="text-muted">Total</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success mb-1">{stats.activeRequests}</h3>
                <small className="text-muted">Active</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning mb-1">{stats.expiredRequests}</h3>
                <small className="text-muted">Expired</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Quick Actions</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-grid gap-2">
              <Button 
                as={Link} 
                to="/scanner" 
                variant="primary" 
                size="lg"
                className="d-flex align-items-center justify-content-center"
              >
                <span className="me-2">📷</span>
                Scan QR Code
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Scans */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Recent Scans</h5>
          </Card.Header>
          <Card.Body>
            {recentScans.length === 0 ? (
              <p className="text-muted text-center mb-0">No recent scans</p>
            ) : (
              recentScans.map((scan, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <strong>{scan.visitorName || 'Unknown'}</strong>
                    <br />
                    <small className="text-muted">
                      {new Date(scan.scannedAt).toLocaleString()}
                    </small>
                  </div>
                  <span className={`badge ${
                    scan.status === 'valid' ? 'bg-success' :
                    scan.status === 'expired' ? 'bg-danger' :
                    scan.status === 'wrong-date' ? 'bg-warning' : 'bg-danger'
                  }`}>
                    {scan.status === 'wrong-date' ? 'wrong date' : scan.status}
                  </span>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
