import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  variant: NotificationVariant;
  title: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200'
  }
};

export const Notification = ({
  variant,
  title,
  description,
  className,
  onClose
}: NotificationProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 border rounded-lg',
      config.className,
      className
    )}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm opacity-90 mt-1">{description}</p>
        )}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};