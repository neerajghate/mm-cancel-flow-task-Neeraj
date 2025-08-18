import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  showStepText?: boolean;
  stepText?: string;
}

export default function Progress({ 
  currentStep, 
  totalSteps, 
  className,
  showStepText = true,
  stepText
}: ProgressProps) {
  return (
    <div className={cn('progress', className)}>
      {/* Progress pills */}
      <div className="progress-pills">
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={cn('progress-pill', index < currentStep ? 'progress-pill--active' : 'progress-pill--inactive')}
          />
        ))}
      </div>
      
      {/* Step text */}
      {showStepText && (
        <span className="progress-text">
          {stepText || `Step ${currentStep} of ${totalSteps}`}
        </span>
      )}
    </div>
  );
}

// Step Progress Component (for multi-step forms)
export interface StepProgressProps {
  steps: Array<{
    title: string;
    description?: string;
    status: 'pending' | 'current' | 'completed';
  }>;
  className?: string;
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={cn('step-progress', className)}>
      {steps.map((step, index) => (
        <div key={index} className="step">
          {/* Step indicator */}
          <div className={cn(
            'step-indicator',
            step.status === 'completed' && 'step-indicator--completed',
            step.status === 'current' && 'step-indicator--current',
            step.status === 'pending' && 'step-indicator--pending'
          )}>
            {step.status === 'completed' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          
          {/* Step content */}
          <div className="flex-1">
            <h3 className={cn(
              'step-title',
              step.status === 'completed' && 'step-title--completed',
              step.status === 'current' && 'step-title--current',
              step.status === 'pending' && 'step-title--pending'
            )}>
              {step.title}
            </h3>
            {step.description && (
              <p className="step-description">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
