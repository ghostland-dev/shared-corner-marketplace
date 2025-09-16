import React from 'react';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceMonitor } from './PerformanceMonitor';

interface AppErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const AppErrorFallback = ({ error, resetError }: AppErrorFallbackProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-destructive">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">
              Une erreur critique s'est produite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              L'application a rencontré une erreur inattendue. 
              Nos équipes ont été automatiquement notifiées.
            </p>
            
            {error && (
              <details className="text-xs">
                <summary className="cursor-pointer hover:text-foreground text-muted-foreground">
                  Détails techniques
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-2">
              {resetError && (
                <Button onClick={resetError} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Recharger la page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring compact */}
        <PerformanceMonitor showDetails={false} />
      </div>
    </div>
  );
};

// HOC pour wrapper l'application avec la gestion d'erreurs
export const withErrorBoundary = (Component: React.ComponentType<any>) => {
  const WrappedComponent = (props: any) => (
    <AppErrorBoundary fallback={AppErrorFallback}>
      <Component {...props} />
    </AppErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook pour la gestion d'erreurs dans les composants fonctionnels
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Application Error:', error, errorInfo);
    
    // En production, envoyer l'erreur à un service de monitoring
    if (import.meta.env.PROD) {
      // Ici on pourrait intégrer Sentry, LogRocket, etc.
      // sentry.captureException(error, { extra: errorInfo });
    }
  };

  return { handleError };
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<AppErrorFallbackProps> }>,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (import.meta.env.PROD) {
      // Log to external service in production
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || AppErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}