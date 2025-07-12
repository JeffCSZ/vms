import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';

const Profile = ({ onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const clearRecentScans = () => {
    if (window.confirm('Are you sure you want to clear all recent scans?')) {
      localStorage.removeItem('recentScans');
      alert('Recent scans cleared successfully');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p className="mb-0">Manage your account</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {/* User Info */}
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Account Information</h5>
          </Card.Header>
          <Card.Body>
            <div className="text-center mb-3">
              <div style={{ fontSize: '4rem' }}>🛡️</div>
              <h5>Security Guard</h5>
              <p className="text-muted">VMS Guard Application</p>
            </div>
            
            <Alert variant="info">
              <strong>Role:</strong> Security Personnel<br />
              <strong>Access Level:</strong> QR Code Scanner<br />
              <strong>Status:</strong> Active
            </Alert>
          </Card.Body>
        </Card>

        {/* App Information */}
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Application Info</h5>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-6">
                <strong>Version:</strong>
              </div>
              <div className="col-6">
                1.0.0
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-6">
                <strong>Build:</strong>
              </div>
              <div className="col-6">
                Guard-2024
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-6">
                <strong>Platform:</strong>
              </div>
              <div className="col-6">
                PWA
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Actions */}
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Actions</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-grid gap-2">
              <Button 
                variant="outline-warning" 
                onClick={clearRecentScans}
              >
                🗑️ Clear Recent Scans
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={handleLogout}
              >
                🚪 Logout
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Help & Support */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Help & Support</h5>
          </Card.Header>
          <Card.Body>
            <p className="mb-2">
              <strong>How to use:</strong>
            </p>
            <ul className="mb-3">
              <li>Tap "Scanner" to scan visitor QR codes</li>
              <li>View scan results and visitor details</li>
              <li>Check recent scans on the dashboard</li>
            </ul>
            
            <Alert variant="light">
              <small>
                <strong>Need help?</strong><br />
                Contact your system administrator for technical support.
              </small>
            </Alert>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
