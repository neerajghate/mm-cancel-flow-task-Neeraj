import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
};

const roundedClasses = {
  none: '',
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
};

export default function Card({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'md',
  rounded = 'lg'
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        paddingClasses[padding],
        shadowClasses[shadow],
        roundedClasses[rounded],
        className
      )}
    >
      {children}
    </div>
  );
}

// Card Header Component
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function CardHeader({ children, className, border = true }: CardHeaderProps) {
  return (
    <div className={cn(
      'card-header',
      border && 'card-header--border',
      className
    )}>
      {children}
    </div>
  );
}

// Card Body Component
export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn('card-body', className)}>
      {children}
    </div>
  );
}

// Card Footer Component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function CardFooter({ children, className, border = true }: CardFooterProps) {
  return (
    <div className={cn(
      'card-footer',
      border && 'card-footer--border',
      className
    )}>
      {children}
    </div>
  );
}

// Info Card Component (for subscription status, etc.)
export interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  value?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  showStatusText?: boolean;
  className?: string;
}

export function InfoCard({ icon, title, value, status, showStatusText = false, className }: InfoCardProps) {
  return (
    <div className={cn(
      'info-card',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <p className="text-sm font-medium text-gray-900">{title}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {status && (
            <span className={cn(
              'badge',
              status === 'success' && 'badge--success',
              status === 'warning' && 'badge--warning',
              status === 'error' && 'badge--error',
              status === 'info' && 'badge--info'
            )}>
              {showStatusText && (
                <>
                  {status === 'success' && 'Active'}
                  {status === 'warning' && 'Warning'}
                  {status === 'error' && 'Error'}
                  {status === 'info' && 'Info'}
                </>
              )}
            </span>
          )}
          {value && (
            <p className="text-sm font-medium text-gray-900">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
