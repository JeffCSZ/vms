import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Services
import apiService from './services/api';

// Import components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VisitorRequests from './components/VisitorRequests';
import AddVisitorRequest from './components/AddVisitorRequest';
import QRCodeView from './components/QRCodeView';
import Profile from './components/Profile';
import BottomNavigation from './components/BottomNavigation';
import PWAInstallPrompt from './components/PWAInstallPrompt';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Debug logging (safe for production)
  useEffect(() => {
    console.log('VMS_tenant App component loaded');
    console.log('Current URL:', window.location.href);
    console.log('Environment:', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port
    });
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      apiService.setToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);

    // Listen for authentication errors
    const handleAuthError = (event) => {
      console.log('Authentication error detected:', event.detail.message);
      handleLogout();
    };

    window.addEventListener('authError', handleAuthError);

    // Register service worker (temporarily disabled for debugging)
    if ('serviceWorker' in navigator && false) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    return () => {
      window.removeEventListener('authError', handleAuthError);
    };
  }, []);

  const handleLogin = (token) => {
    apiService.setToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiService.removeToken();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* <PWAInstallPrompt /> */}
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/requests" element={<VisitorRequests />} />
                <Route path="/add-request" element={<AddVisitorRequest />} />
                <Route path="/qr/:uuid" element={<QRCodeView />} />
                <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <BottomNavigation />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
