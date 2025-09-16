import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  className, 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

interface LoadingPageProps {
  title?: string;
  description?: string;
}

export const LoadingPage = ({ 
  title = 'Chargement...', 
  description = 'Veuillez patienter pendant le chargement du contenu' 
}: LoadingPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <LoadingSpinner size="lg" />
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  children: React.ReactNode;
}

export const LoadingOverlay = ({ 
  show, 
  text = 'Chargement...', 
  children 
}: LoadingOverlayProps) => {
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
};