'use client';

import React, { useState } from 'react';
import { Button, ModalHeader, ModalBody, FormField, TextInput } from './ui';

type FoundJobVisaNoStepProps = {
  onBack: () => void;
  onComplete: (payload: { hasCompanyLawyer: boolean; visa: string }) => void;
  onClose?: () => void;
  imageUrl?: string;
};

export default function FoundJobVisaNoStep({
  onBack,
  onComplete,
  onClose,
  imageUrl = '/nyc.jpg',
}: FoundJobVisaNoStepProps) {
  const [answer, setAnswer] = useState<'' | 'yes' | 'no'>('');
  const [visa, setVisa] = useState('');
  const [touched, setTouched] = useState(false);

  const visaValid = visa.trim().length > 0;
  const canSubmit = !!answer && visaValid;

  const submit = () => {
    if (!canSubmit) {
      setTouched(true);
      return;
    }
    onComplete({ hasCompanyLawyer: answer === 'yes', visa: visa.trim() });
  };

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
            <span className="step-text">Step 3 of 3</span>
            <div className="flex gap-1">
              <div className="progress-pill--step"></div>
              <div className="progress-pill--step"></div>
              <div className="progress-pill--step"></div>
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
              You landed the job!
              <br />
              <span className="italic">That&apos;s what we live for.</span>
            </h1>

            <p className="text-body text-muted">
              Even if it wasn&apos;t through Migrate Mate,
              <br /> let us help get your visa sorted.
            </p>

            <div className="section section--large">
              <div className="section--compact">
                <p className="text-body--large">
                  Would you like us to help you secure your visa?
                </p>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="radio"
                      name="visa-lawyer"
                      className="checkbox-input"
                      checked={answer === 'yes'}
                      onChange={() => setAnswer('yes')}
                    />
                    <span className="checkbox-label">Yes</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="radio"
                      name="visa-lawyer"
                      className="checkbox-input"
                      checked={answer === 'no'}
                      onChange={() => setAnswer('no')}
                    />
                    <span className="checkbox-label">No</span>
                  </label>
                </div>

                {answer !== '' && (
                  <div className="section--small">
                    {answer === 'no' ? (
                      <>
                        <p className="text-muted">
                          We can connect you with one of our trusted partners.
                        </p>
                        <FormField label="Which visa would you like to apply for?" required>
                          <TextInput
                            value={visa}
                            onChange={(e) => setVisa(e.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="e.g., H-1B, O-1, Green Card"
                            error={touched && !visaValid ? 'Please enter a visa type.' : undefined}
                          />
                        </FormField>
                      </>
                    ) : (
                      <FormField label="What visa will you be applying for?" required>
                        <TextInput
                          value={visa}
                          onChange={(e) => setVisa(e.target.value)}
                          onBlur={() => setTouched(true)}
                          placeholder="e.g., H-1B, O-1, Green Card"
                          error={touched && !visaValid ? 'Please enter a visa type.' : undefined}
                        />
                      </FormField>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="section">
              <Button
                disabled={!canSubmit}
                onClick={submit}
                variant="primary"
                fullWidth
                size="lg"
                className="btn--gray"
              >
                Complete cancellation
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
