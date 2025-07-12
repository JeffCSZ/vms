import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    expiredRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
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

      const requests = await apiService.getAllVisitorRequests();
      const now = new Date();

      const active = requests.filter(req => new Date(req.expiry) > now);
      const expired = requests.filter(req => new Date(req.expiry) <= now);

      setStats({
        totalRequests: requests.length,
        activeRequests: active.length,
        expiredRequests: expired.length,
      });

      // Get 3 most recent requests
      const recent = requests
        .sort((a, b) => new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated))
        .slice(0, 3);
      setRecentRequests(recent);

    } catch (err) {
      console.error('Dashboard API error:', err);
      // Check if it's an authentication error
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else {
        setError('Unable to load data. Please check your connection or try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1>Dashboard</h1>
        <p className="mb-0">Welcome to VMS Tenant</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xs={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.totalRequests}</h3>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.activeRequests}</h3>
              <small className="text-muted">Active</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.expiredRequests}</h3>
              <small className="text-muted">Expired</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Header>Quick Actions</Card.Header>
        <Card.Body>
          <Row>
            <Col xs={6}>
              <Button
                as={Link}
                to="/add-request"
                variant="primary"
                className="w-100 mb-2"
              >
                ➕ New Request
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                as={Link}
                to="/requests"
                variant="outline-primary"
                className="w-100 mb-2"
              >
                📋 View All
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Requests */}
      <Card>
        <Card.Header>Recent Requests</Card.Header>
        <Card.Body>
          {recentRequests.length === 0 ? (
            <p className="text-muted text-center">No visitor requests yet</p>
          ) : (
            recentRequests.map((request) => (
              <div key={request.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                  <strong>{request.visitorName}</strong>
                  <br />
                  <small className="text-muted">
                    {formatDate(request.visitDateTime)}
                  </small>
                </div>
                <div className="text-end">
                  <span className={`badge ${new Date(request.expiry) > new Date() ? 'bg-success' : 'bg-warning'}`}>
                    {new Date(request.expiry) > new Date() ? 'Active' : 'Expired'}
                  </span>
                </div>
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
