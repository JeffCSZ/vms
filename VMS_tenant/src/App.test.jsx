import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Minimal test component to verify production build works
function TestApp() {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h1 className="mb-0">🏠 VMS Tenant - Production Test</h1>
        </div>
        <div className="card-body">
          <div className="alert alert-success">
            <h4>✅ Production Build Working!</h4>
            <p className="mb-0">
              If you can see this message, the production build is working correctly.
              The issue might be with specific components or features.
            </p>
          </div>
          
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card border-primary">
                <div className="card-body text-center">
                  <h3 className="text-primary">✓</h3>
                  <small>React Loading</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-success">
                <div className="card-body text-center">
                  <h3 className="text-success">✓</h3>
                  <small>Bootstrap CSS</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info">
                <div className="card-body text-center">
                  <h3 className="text-info">✓</h3>
                  <small>Production Build</small>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5>Environment Info:</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>URL:</strong> {window.location.href}
              </li>
              <li className="list-group-item">
                <strong>Hostname:</strong> {window.location.hostname}
              </li>
              <li className="list-group-item">
                <strong>Protocol:</strong> {window.location.protocol}
              </li>
              <li className="list-group-item">
                <strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...
              </li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <button 
              className="btn btn-primary me-2"
              onClick={() => alert('Button click working!')}
            >
              Test Button
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
