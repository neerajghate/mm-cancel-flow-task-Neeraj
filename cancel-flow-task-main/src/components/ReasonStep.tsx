'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, ModalHeader, ModalBody, FormField, PillSelection } from './ui';

type ReasonStepProps = {
  onBack: () => void;
  onNext: (payload: { appsApplied: string; companiesEmailed: string; companiesInterviewed: string }) => void;
  onClose?: () => void;
  sawDownsell?: boolean; // Whether user saw the downsell step (affects step counting)
};

const Q1 = ['0', '1 – 5', '6 – 20', '20+'];
const Q2 = ['0', '1–5', '6–20', '20+'];
const Q3 = ['0', '1–2', '3–5', '5+'];

export default function ReasonStep({
  onBack,
  onNext,
  onClose,
  sawDownsell = false
}: ReasonStepProps) {
  const [appsApplied, setAppsApplied] = useState('');
  const [companiesEmailed, setCompaniesEmailed] = useState('');
  const [companiesInterviewed, setCompaniesInterviewed] = useState('');
  const [touched, setTouched] = useState(false);
  const [triedContinue, setTriedContinue] = useState(false); // drives red button state after invalid click

  const q1Ref = useRef<HTMLDivElement | null>(null);
  const q2Ref = useRef<HTMLDivElement | null>(null);
  const q3Ref = useRef<HTMLDivElement | null>(null);

  const invalidQ1 = touched && !appsApplied;
  const invalidQ2 = touched && !companiesEmailed;
  const invalidQ3 = touched && !companiesInterviewed;

  const isValid = Boolean(appsApplied && companiesEmailed && companiesInterviewed);

  useEffect(() => {
    // as soon as the form becomes valid, clear the red state
    if (isValid && triedContinue) setTriedContinue(false);
  }, [isValid, triedContinue]);

  const handleContinue = () => {
    if (!isValid) {
      setTouched(true);
      setTriedContinue(true); // flip the button to red
      if (!appsApplied && q1Ref.current) {
        q1Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!companiesEmailed && q2Ref.current) {
        q2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!companiesInterviewed && q3Ref.current) {
        q3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    onNext({ appsApplied, companiesEmailed, companiesInterviewed });
  };

  return (
    <div className="modal-panel">
      {/* Header */}
      <ModalHeader onClose={onClose}>
        {/* Back (left) */}
        <button
          onClick={onBack}
          className="back-link"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Center: title + progress + step text */}
        <div className="flex items-center gap-3">
          <div className="section-title">Subscription Cancellation</div>
          <div className="flex items-center gap-2">
            <span className="step-text">
              {sawDownsell ? 'Step 3 of 4' : 'Step 2 of 3'}
            </span>
            <div className="flex gap-1">
              {sawDownsell ? (
                // 4 steps: Initial -> Downsell -> Reason -> Final Reason -> Done
                <>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step--inactive"></div>
                </>
              ) : (
                // 3 steps: Initial -> Reason -> Final Reason -> Done
                <>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step"></div>
                  <div className="progress-pill--step--inactive"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: questions */}
          <div className="sm:pr-4">
            <h1 className="heading-1 mb-3 sm:mb-4">
              Help us understand how you
              <br className="hidden sm:block" /> were using Migrate Mate.
            </h1>

            <div className="space-y-3 sm:space-y-4">
              {/* Q1 */}
              <div ref={q1Ref}>
                <FormField 
                  label="How many roles did you apply for through Migrate Mate?"
                  error={invalidQ1 ? 'Please select an option to continue.' : undefined}
                >
                  <PillSelection
                    options={Q1}
                    value={appsApplied}
                    onChange={setAppsApplied}
                    columns={2}
                  />
                </FormField>
              </div>

              {/* Q2 */}
              <div ref={q2Ref}>
                <FormField 
                  label="How many companies did you email directly?"
                  error={invalidQ2 ? 'Please select an option to continue.' : undefined}
                >
                  <PillSelection
                    options={Q2}
                    value={companiesEmailed}
                    onChange={setCompaniesEmailed}
                    columns={2}
                  />
                </FormField>
              </div>

              {/* Q3 */}
              <div ref={q3Ref}>
                <FormField 
                  label="How many different companies did you interview with?"
                  error={invalidQ3 ? 'Please select an option to continue.' : undefined}
                >
                  <PillSelection
                    options={Q3}
                    value={companiesInterviewed}
                    onChange={setCompaniesInterviewed}
                    columns={2}
                  />
                </FormField>
              </div>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* CTA: stacked full-width buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  console.log('Offer clicked');
                }}
                variant="success"
                fullWidth
                size="lg"
              >
                Get 50% off | $12.50 <span className="opacity-80 line-through ml-1">$25</span>
              </Button>

              <Button
                onClick={handleContinue}
                variant={!isValid && triedContinue ? 'danger' : 'primary'}
                fullWidth
                size="lg"
                disabled={!isValid}
              >
                Continue
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
