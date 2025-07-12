import React from 'react';
import { Alert, Container, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>⚠️ Application Error</Alert.Heading>
            <p>
              Something went wrong with the VMS Tenant application. 
              This error has been logged for debugging.
            </p>
            
            <hr />
            
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Error Details (for developers)</summary>
              <br />
              <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              <br />
              <strong>Stack Trace:</strong>
              <br />
              {this.state.errorInfo.componentStack}
            </details>
            
            <hr />
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-primary" 
                onClick={() => window.location.reload()}
              >
                🔄 Reload Page
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
