import { PureComponent } from 'react';

export class ErrorBoundary extends PureComponent {
  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error, errorInfo);
    }
    //   try {
    //     LambdaHandler.wrapLambda(reportSLA)({
    //       name: 'client_error',
    //       tags: { path: window?.location.pathname ?? '' },
    //       message: error.message,
    //       stack: errorInfo.componentStack,
    //     });
    //     slardar('captureException', error, errorInfo);
    //   } catch (e) {
    //     // ignore
    //   }
  }
  render() {
    // @ts-ignore
    return <>{this.props.children}</>;
  }
}
