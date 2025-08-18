'use client';

import React from 'react';
import { Button, ModalHeader, ModalBody } from './ui';

type CancelCompleteStepProps = {
  onJobs: () => void;
  onClose: () => void;
  endDate: string;
  sawDownsell?: boolean; // Whether user saw the downsell step (affects step counting)
};

export default function CancelCompleteStep({
  onJobs,
  onClose,
  endDate,
  sawDownsell = false,
}: CancelCompleteStepProps) {
  return (
    <div className="modal-panel">
      {/* Header */}
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="section-title">
            Subscription Cancelled
          </div>
          <div className="flex items-center gap-2">
            <span className="step-text">
              {sawDownsell ? 'Step 4 of 4' : 'Step 3 of 3'}
            </span>
            <div className="flex gap-1">
              {sawDownsell ? (
                // 4 steps: Initial -> Downsell -> Reason -> Final Reason -> Done
                <>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                </>
              ) : (
                // 3 steps: Initial -> Reason -> Final Reason -> Done
                <>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: copy + actions */}
          <div className="sm:pr-6">
            <h1 className="heading-1">
              Your subscription has been cancelled
            </h1>
            <h2 className="heading-2">
              We&apos;re sorry to see you go
            </h2>
            <p className="text-body">
              Your subscription is set to end on <span className="font-medium">{endDate}</span>.
            </p>
            <p className="text-muted text-muted--large">
              You&apos;ll continue to have access to all features until then.
            </p>

            <div className="divider" />

            <div className="section">
              <Button
                onClick={onJobs}
                variant="primary"
                fullWidth
                size="lg"
              >
                Back to Jobs
              </Button>
            </div>
          </div>

          {/* Right: image */}
          <div className="image-container">
            <img
              src="/nyc.jpg"
              alt="NYC skyline"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </ModalBody>
    </div>
  );
}
