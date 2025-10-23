"use client";

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StandardLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6', 
  lg: 'size-8'
};

export function StandardLoader({ 
  size = 'md', 
  className,
  message,
  variant = 'spinner'
}: StandardLoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'bg-primary rounded-full animate-pulse',
                  size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn(
            'bg-primary rounded-full animate-pulse',
            sizeClasses[size]
          )} />
        );
      
      default:
        return <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      {renderLoader()}
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

// Table-specific loader component
export function TableLoader({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <StandardLoader size="md" message={message} />
    </div>
  );
}

// Page-specific loader component  
export function PageLoader({ message = 'Loading page...' }: { message?: string }) {
  return (
    <div className="flex h-[600px] items-center justify-center">
      <StandardLoader size="lg" message={message} />
    </div>
  );
}

// Inline loader for buttons and small components
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <StandardLoader size={size} variant="spinner" />;
}
