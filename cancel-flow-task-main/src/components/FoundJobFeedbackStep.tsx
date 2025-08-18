'use client';

import React, { useState } from 'react';
import { Button, ModalHeader, ModalBody, Textarea } from './ui';

interface FoundJobFeedbackStepProps {
  onBack: () => void;
  onNext: (payload: { feedback: string; foundWithMate: '' | 'Yes' | 'No'; appsApplied?: string; companiesEmailed?: string; companiesInterviewed?: string }) => void;
  onClose?: () => void;
  imageUrl?: string;
  foundJobData: {
    foundWithMate: '' | 'Yes' | 'No';
    appsApplied?: string;
    companiesEmailed?: string;
    companiesInterviewed?: string;
  };
}

export default function FoundJobFeedbackStep({
  onBack,
  onNext,
  onClose,
  imageUrl = '/nyc.jpg',
  foundJobData,
}: FoundJobFeedbackStepProps) {
  const [text, setText] = useState('');
  const MIN = 25;
  const valid = text.trim().length >= MIN;

  return (
    <div className="modal-panel">
      {/* Header */}
      <ModalHeader onClose={onClose}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
                         <button
               onClick={onBack}
               className="back-link"
               aria-label="Go back"
             >
               <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
               Back
             </button>
            <div className="section-title">Subscription Cancellation</div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="step-text">Step 2 of 3</span>
            <div className="flex gap-1">
              <div className="progress-pill--step"></div>
              <div className="progress-pill--step"></div>
              <div className="progress-pill--step--inactive"></div>
            </div>
          </div>
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left column */}
          <div className="sm:pr-6">
            <h1 className="heading-1">
              What&apos;s one thing you wish we
              <br /> could&apos;ve helped you with?
            </h1>

            <p className="text-body text-muted">
              We&apos;re always looking to improve, your thoughts can help us
              <br /> make Migrate Mate more useful for others.*
            </p>

            <div className="section--small">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder=""
                rows={10}
                className="h-40"
                helperText={`Min ${MIN} characters (${Math.min(text.trim().length, MIN)}/${MIN})`}
              />
            </div>

            {/* Footer actions */}
            <div className="section">
              <Button
                onClick={() => valid && onNext({ feedback: text.trim(), ...foundJobData })}
                disabled={!valid}
                variant="primary"
                fullWidth
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>

          {/* Right image */}
          <div className="image-container">
            <img
              src={imageUrl}
              alt="NYC skyline"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </ModalBody>
    </div>
  );
}
