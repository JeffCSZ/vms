import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';

const QRScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopScanner();
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const hasCamera = await QrScanner.hasCamera();
      setHasCamera(hasCamera);
      if (!hasCamera) {
        setError('No camera found on this device');
      }
    } catch (err) {
      console.error('Camera check error:', err);
      setError('Unable to access camera');
    }
  };

  const startScanner = async () => {
    if (!videoRef.current || !hasCamera) return;

    try {
      setError('');
      setScanning(true);

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          handleQRCodeDetected(result.data);
        },
        {
          onDecodeError: (err) => {
            console.log('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (err) {
      console.error('Scanner start error:', err);
      setError('Failed to start camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  const handleQRCodeDetected = (qrData) => {
    stopScanner();
    
    // Extract UUID from QR code data
    // Assuming QR code contains just the UUID or a URL with UUID
    let uuid = qrData;
    
    // If it's a URL, extract the UUID from it
    if (qrData.includes('/')) {
      const parts = qrData.split('/');
      uuid = parts[parts.length - 1];
    }

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      setError('Invalid QR code format');
      return;
    }

    // Save scan to recent scans
    const scanData = {
      uuid,
      scannedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const recentScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    recentScans.unshift(scanData);
    localStorage.setItem('recentScans', JSON.stringify(recentScans.slice(0, 10)));

    // Navigate to visitor details
    navigate(`/visitor/${uuid}`);
  };

  return (
    <div>
      <div className="page-header">
        <h1>QR Code Scanner</h1>
        <p className="mb-0">Scan visitor QR codes</p>
      </div>

      <div className="px-3 pb-5 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <Card>
          <Card.Body className="scanner-container">
            {!hasCamera ? (
              <div className="text-center">
                <h5>Camera Not Available</h5>
                <p className="text-muted">
                  This device doesn't have a camera or camera access is not available.
                </p>
              </div>
            ) : (
              <>
                <div className="scanner-overlay">
                  <video
                    ref={videoRef}
                    className="scanner-video"
                    style={{ display: scanning ? 'block' : 'none' }}
                  />
                  {scanning && <div className="scanner-frame"></div>}
                </div>

                {!scanning ? (
                  <div className="text-center">
                    <h5>Ready to Scan</h5>
                    <p className="text-muted mb-3">
                      Position the QR code within the camera view
                    </p>
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={startScanner}
                      className="d-flex align-items-center justify-content-center mx-auto"
                    >
                      <span className="me-2">📷</span>
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <div className="text-center mt-3">
                    <p className="text-muted mb-3">
                      Point your camera at a QR code to scan
                    </p>
                    <Button 
                      variant="outline-secondary" 
                      onClick={stopScanner}
                    >
                      Stop Scanner
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Body>
            <h6>Instructions:</h6>
            <ul className="mb-0">
              <li>Ensure good lighting for best results</li>
              <li>Hold the device steady</li>
              <li>Position the QR code within the frame</li>
              <li>The scan will happen automatically</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;
