import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Modal, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const VisitorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await apiService.getAllVisitorRequests();
      // Sort by creation date, newest first
      const sortedData = data.sort((a, b) =>
        new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
      );
      setRequests(sortedData);
    } catch (err) {
      console.error('Visitor requests API error:', err);
      // Check if it's an authentication error
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else {
        setError('Failed to load visitor requests. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteVisitorRequest(requestToDelete.id);
      setRequests(requests.filter(req => req.id !== requestToDelete.id));
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (err) {
      console.error('Delete visitor request error:', err);
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        // Don't show error message, let the app handle logout automatically
        console.log('Authentication required - app will handle logout');
      } else {
        setError('Failed to delete visitor request. Please try again later.');
      }
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

  return (
    <div>
      <div className="page-header">
        <h1>Visitor Requests</h1>
        <p className="mb-0">Manage your visitor requests</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-3">
        <Button as={Link} to="/add-request" variant="primary">
          ➕ Add New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5>No visitor requests yet</h5>
            <p className="text-muted">Create your first visitor request to get started</p>
            <Button as={Link} to="/add-request" variant="primary">
              Create Request
            </Button>
          </Card.Body>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id} className="mb-3">
            <Card.Body>
              <Row>
                <Col xs={8}>
                  <h6 className="mb-1">{request.visitorName}</h6>
                  <p className="text-muted mb-1">
                    🚗 {request.vehiclePlateNumber}
                  </p>
                  <small className="text-muted">
                    Visit: {formatDate(request.visitDateTime)}
                  </small>
                  <br />
                  <small className="text-muted">
                    Expires: {formatDate(request.expiry)}
                  </small>
                </Col>
                <Col xs={4} className="text-end">
                  <div className="mb-2">
                    <span className={`badge ${isExpired(request.expiry) ? 'bg-warning' : 'bg-success'}`}>
                      {isExpired(request.expiry) ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <Button
                      as={Link}
                      to={`/qr/${request.uuid}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      📱 QR
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setRequestToDelete(request);
                        setShowDeleteModal(true);
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the visitor request for{' '}
          <strong>{requestToDelete?.visitorName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
};

export default VisitorRequests;
