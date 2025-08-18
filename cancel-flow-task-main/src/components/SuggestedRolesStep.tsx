'use client';

import React from 'react';
import { Button, ModalHeader, ModalBody, Progress } from './ui';

type SuggestedRolesStepProps = {
  onBack: () => void;
  onContinue: () => void;     // proceed to whatever your next step is
  onClose?: () => void;
  imageUrl?: string;
};

export default function SuggestedRolesStep({
  onBack,
  onContinue,
  onClose,
  imageUrl = '/nyc.jpg',
}: SuggestedRolesStepProps) {
  return (
    <div className="modal-panel">
      {/* Header: Back | centered title | Stepper */}
      <ModalHeader onClose={onClose}>
        <button
          onClick={onBack}
          className="back-link"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

                    <div className="section-title">Subscription</div>

        <Progress currentStep={2} totalSteps={3} />
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left column: copy + "job card" + CTA */}
          <div className="sm:pr-6">
            <h1 className="heading-1">
              Awesome — we&apos;ve pulled together
              <br /> a few roles that
              <br /> seem like a great fit for you.
            </h1>

            <p className="text-body text-muted">
              Take a look and see what sparks your interest.
            </p>

            {/* Job card */}
            <div className="section">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="p-5">
                  {/* Title + meta */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="job-avatar">
                          r
                        </div>
                        <div>
                                                  <p className="job-title">
                          Automation Controls Engineer
                        </p>
                                                      <p className="job-meta">Randstad USA • Memphis, Tennessee</p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-wrap gap-2">
                      {['Full Time', 'Associate', "Bachelor's", 'On-Site'].map(tag => (
                        <span
                          key={tag}
                          className="job-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Salary + visa pills */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="job-status">NEW JOB</span>
                      <span className="job-salary">$150,000/yr – $170,000/yr</span>
                    </div>
                    <div className="job-visa-container">
                      {/* tiny visa stat pills to match the vibe */}
                      {['Green Card', 'AU E-3', 'CA/MX TN', 'OPT'].map(pill => (
                        <span
                          key={pill}
                          className="job-visa-pill"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="job-description">
                    The Electrical Automation Controls Engineer will design, implement, and maintain industrial
                    automation systems, specializing in PLC programming using Siemens TIA Portal. Ideal candidates
                    have 4+ years experience and a Bachelor&apos;s degree in Electrical Engineering…
                  </p>

                  {/* Footer actions */}
                  <div className="job-actions">
                    <Button variant="outline" size="sm">
                      Save Job
                    </Button>
                    <Button variant="primary" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Big CTA */}
            <Button
              onClick={onContinue}
              variant="primary"
              fullWidth
              size="xl"
              className="section"
            >
              Land your dream role
            </Button>
          </div>

          {/* Right image: render exactly the same as other steps */}
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
