
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Une erreur s'est produite</AlertTitle>
          <AlertDescription className="mt-2">
            {this.state.error?.message || 'Impossible de charger le contenu'}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
