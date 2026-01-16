import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
          <div className="max-w-md w-full text-center">
            <h2 className="text-4xl font-black text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              An unexpected error occurred. Please refresh to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-4 rounded-full transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
