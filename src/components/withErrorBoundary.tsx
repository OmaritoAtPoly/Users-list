import "./styles/ErrorBoundary.css";

import { Component } from "react";
import type { ComponentType, ErrorInfo, ReactNode } from "react";

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: WithErrorBoundaryOptions
): ComponentType<P> {
  return class WithErrorBoundary extends Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
      console.error("ErrorBoundary caught:", errorInfo.componentStack);
      options?.onError?.(_error);
    }

    retry = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <p>Something went wrong.</p>
            {this.state.error && (
              <p className="error-boundary-message">{this.state.error.message}</p>
            )}
            <button
              type="button"
              className="error-boundary-retry"
              onClick={this.retry}
            >
              Try again
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withErrorBoundary;
