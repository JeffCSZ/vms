import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const Profile = ({ onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  // Get user info from token (simplified - in real app you'd decode JWT)
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p className="mb-0">Manage your account</p>
      </div>

      <div className="px-3 pb-5 mb-5">

      <Card className="mb-3">
        <Card.Header>Account Information</Card.Header>
        <Card.Body>
          <Row>
            <Col xs={3}>
              <div className="text-center">
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    margin: '0 auto'
                  }}
                >
                  👤
                </div>
              </div>
            </Col>
            <Col xs={9}>
              <h6 className="mb-1">Resident</h6>
              <p className="text-muted mb-1">{userEmail}</p>
              <span className="badge bg-success">Active</span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>App Information</Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span>Version</span>
            <span className="text-muted">1.0.0</span>
          </div>
          <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span>Last Updated</span>
            <span className="text-muted">Dec 2024</span>
          </div>
          <div className="d-flex justify-content-between align-items-center py-2">
            <span>Developer</span>
            <span className="text-muted">VMS Team</span>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Settings</Card.Header>
        <Card.Body>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" disabled>
              🔔 Notifications (Coming Soon)
            </Button>
            <Button variant="outline-primary" disabled>
              🌙 Dark Mode (Coming Soon)
            </Button>
            <Button variant="outline-primary" disabled>
              🔒 Privacy Settings (Coming Soon)
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-grid gap-2">
            <Button variant="outline-secondary" disabled>
              📞 Contact Support
            </Button>
            <Button variant="outline-secondary" disabled>
              ❓ Help & FAQ
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              🚪 Logout
            </Button>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center mt-4">
        <small className="text-muted">
          VMS Tenant App v1.0.0<br />
          © 2024 Visitor Management System
        </small>
      </div>
      </div>
    </div>
  );
};

export default Profile;
