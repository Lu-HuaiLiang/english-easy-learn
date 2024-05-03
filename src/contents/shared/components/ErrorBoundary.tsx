import { PureComponent } from 'react';

export class ErrorBoundary extends PureComponent {
  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error, errorInfo);
    }
  }
  render() {
    // @ts-ignore
    return <>{this.props.children}</>;
  }
}
