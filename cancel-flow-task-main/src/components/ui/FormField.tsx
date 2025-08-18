import React from 'react';
import { cn } from '../../lib/utils';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, required = false, error, className, children }: FormFieldProps) {
  return (
    <div className={cn('form-field', className)}>
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      {children}
      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
}

// Pill Selection Component (for multiple choice questions)
export interface PillSelectionProps<T extends string = string> {
  options: readonly T[] | T[];
  value: T | '';
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function PillSelection<T extends string = string>({ 
  options, 
  value, 
  onChange, 
  columns = 2, 
  className 
}: PillSelectionProps<T>) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={cn(`grid gap-3 ${gridCols[columns]}`, className)}>
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'pill',
              isActive ? 'pill--active' : 'pill--inactive'
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

// Text Input Component
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextInput({ label, error, helperText, className, ...props }: TextInputProps) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {props.required && <span className="form-required">*</span>}
        </label>
      )}
      <input
        className={cn(
          'input',
          error && 'border-red-300 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {helperText && <p className="form-helper">{helperText}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, className, ...props }: TextareaProps) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {props.required && <span className="form-required">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'textarea',
          error && 'border-red-300 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {helperText && <p className="form-helper">{helperText}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
