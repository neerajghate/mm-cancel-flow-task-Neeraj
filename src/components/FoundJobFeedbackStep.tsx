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
      {/* Header: responsive layout - mobile: title+progress left, desktop: original layout */}
      <ModalHeader onClose={onClose}>
        <div className="flex items-center w-full">
          {/* Mobile: title and progress stacked on left */}
          <div className="flex flex-col gap-2 sm:hidden">
            <div className="section-title text-left">Subscription Cancellation</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
                <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
                <div className="w-4 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-600">Step 2 of 3</div>
            </div>
          </div>

          {/* Desktop: original layout with back button in header */}
          <div className="hidden sm:flex items-center w-full">
            <button
              onClick={onBack}
              className="back-link"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="flex items-center gap-3 mx-auto">
              <div className="section-title">Subscription Cancellation</div>
              <div className="flex items-center gap-2">
                <span className="step-text">Step 2 of 3</span>
                <div className="flex gap-1">
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step--inactive"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalHeader>

      {/* Mobile: Back button below header */}
      <div className="sm:hidden px-6 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="back-link flex items-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

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

          {/* Right image - Desktop only */}
          <div className="hidden sm:block image-container">
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
