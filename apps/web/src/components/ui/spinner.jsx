import * as React from 'react';
import { cn } from '@/lib/utils';

function Spinner({ className, size = 'default', ...props }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
    xl: 'h-12 w-12 border-4',
  };
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn(
        'animate-spin rounded-full border-primary/30 border-t-primary',
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
