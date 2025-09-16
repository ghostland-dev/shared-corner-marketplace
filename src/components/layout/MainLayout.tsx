import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children?: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}

export const MainLayout = ({ children, className, showFooter = true }: MainLayoutProps) => {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        
        <main className={cn("flex-grow", className)}>
          {children || <Outlet />}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};