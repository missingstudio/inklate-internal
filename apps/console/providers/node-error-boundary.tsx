import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  nodeId: string;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="w-80 max-w-sm rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm">
    <div className="py-4 text-center">
      <p className="mb-3 text-sm text-red-600">Component Error: {error.message}</p>
    </div>
  </div>
);

export class NodeErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in node ${this.props.nodeId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}
