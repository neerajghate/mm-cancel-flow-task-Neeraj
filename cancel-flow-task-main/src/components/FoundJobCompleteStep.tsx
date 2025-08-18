'use client';

import React from 'react';
import { Button, ModalHeader, ModalBody, Progress } from './ui';

type FoundJobCompleteStepProps = {
  hasCompanyLawyer: boolean;
  onFinish: () => void;
  onClose: () => void;
};

export default function FoundJobCompleteStep({
  hasCompanyLawyer,
  onFinish,
  onClose,
}: FoundJobCompleteStepProps) {
  return (
    <div className="modal-panel">
      {/* Header */}
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
                      <div className="section-title">Subscription Cancelled</div>
          <Progress currentStep={3} totalSteps={3} />
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: copy + actions */}
          <div className="sm:pr-6">
            <h1 className="heading-3">
              {hasCompanyLawyer ? (
                <>
                  Perfect! You&apos;re all set with your new role and visa support.
                </>
              ) : (
                <>
                  Great! We&apos;ll help you get the visa support you need.
                </>
              )}
            </h1>

            {hasCompanyLawyer ? (
              <div className="contact-card">
                <div className="contact-info">
                  <div className="contact-avatar">
                    <img
                      src="/mihailo.jpg"
                      alt="Mihailo Bozic"
                      className="h-12 w-12 object-cover"
                    />
                  </div>
                  <div className="contact-details">
                    <div className="contact-name">Mihailo Bozic</div>
                    <div className="contact-email">&lt;mihailo@migratemate.co&gt;</div>
                  </div>
                </div>
                <p className="mt-4 section-title">
                  Your dedicated success manager
                </p>
                <p className="mt-3 text-sm text-gray-800">
                  Mihailo will be in touch within 24 hours to help you with your visa process.
                </p>
                <p className="mt-3 text-sm text-gray-800">
                  He&apos;ll coordinate with your company&apos;s legal team to ensure everything goes smoothly.
                </p>
              </div>
            ) : (
              <div className="section">
                <h1 className="heading-3">
                  We&apos;ll connect you with our trusted visa partners
                </h1>
                <p className="text-body text-muted">
                  Our network of immigration lawyers will help you navigate the visa process step by step.
                </p>
              </div>
            )}

            <Button
              onClick={onFinish}
              variant="primary"
              fullWidth
              size="lg"
            >
              Get Started
            </Button>
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
