'use client';

import React, { useState } from 'react';
import { Button, ModalHeader, ModalBody, PillSelection } from './ui';

type FoundJobIntroStepProps = {
  onBack: () => void;
  onNext: (payload: {
    foundWithMate: 'Yes' | 'No';
    appsApplied: string;
    companiesEmailed: string;
    companiesInterviewed: string;
  }) => void;
  onClose: () => void;
};

const YESNO = ['Yes', 'No'] as const;
const APPLICATIONS = ['0', '1-5', '6-20', '20+'] as const;
const COMPANIES_EMAILED = ['0', '1-5', '6-20', '20+'] as const;
const COMPANIES_INTERVIEWED = ['0', '1-2', '3-5', '5+'] as const;

export default function FoundJobIntroStep({
  onBack,
  onNext,
  onClose,
}: FoundJobIntroStepProps) {
  const [foundWithMate, setFoundWithMate] = useState<'' | 'Yes' | 'No'>('');
  const [appsApplied, setAppsApplied] = useState<'' | string>('');
  const [companiesEmailed, setCompaniesEmailed] = useState<'' | string>('');
  const [companiesInterviewed, setCompaniesInterviewed] = useState<'' | string>('');

  const handleNext = () => {
    if (!foundWithMate || !appsApplied || !companiesEmailed || !companiesInterviewed) {
      return;
    }

    const payload = {
      foundWithMate,
      appsApplied,
      companiesEmailed,
      companiesInterviewed,
    };
    
    onNext(payload);
  };

  const canContinue = foundWithMate && appsApplied && companiesEmailed && companiesInterviewed;

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
            <span className="step-text">Step 1 of 3</span>
                          <div className="flex gap-1">
                <div className="progress-pill--step"></div>
                <div className="progress-pill--step--inactive"></div>
                <div className="progress-pill--step--inactive"></div>
              </div>
          </div>
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: copy + actions */}
          <div className="sm:pr-4">
            <h1 className="heading-1 mb-3 sm:mb-4">
              Congrats on the new role! 🎉
            </h1>

            <div className="space-y-3 sm:space-y-4">
              {/* Q1: Did you find this job with MigrateMate? */}
              <div>
                <p className="text-body mb-2 font-medium">
                  Did you find this job with MigrateMate?*
                </p>
                <PillSelection
                  options={YESNO}
                  value={foundWithMate}
                  onChange={setFoundWithMate}
                  columns={2}
                />
              </div>

              {/* Q2: How many roles did you apply for? */}
              <div>
                <p className="text-body mb-2 font-medium">
                  How many roles did you apply for through Migrate Mate?*
                </p>
                <PillSelection
                  options={APPLICATIONS}
                  value={appsApplied}
                  onChange={setAppsApplied}
                  columns={2}
                />
              </div>

              {/* Q3: How many companies did you email directly? */}
              <div>
                <p className="text-body mb-2 font-medium">
                  How many companies did you email directly?*
                </p>
                <PillSelection
                  options={COMPANIES_EMAILED}
                  value={companiesEmailed}
                  onChange={setCompaniesEmailed}
                  columns={2}
                />
              </div>

              {/* Q4: How many different companies did you interview with? */}
              <div>
                <p className="text-body mb-2 font-medium">
                  How many different companies did you interview with?*
                </p>
                <PillSelection
                  options={COMPANIES_INTERVIEWED}
                  value={companiesInterviewed}
                  onChange={setCompaniesInterviewed}
                  columns={2}
                />
              </div>
            </div>

            <Button 
              onClick={handleNext} 
              disabled={!canContinue}
              className="mt-4 sm:mt-5 w-full"
            >
              Continue
            </Button>
          </div>

          {/* Right: image */}
          <div className="image-container">
            <img 
              src="/nyc.jpg" 
              alt="NYC skyline with Empire State Building" 
              className="h-full w-full object-cover" 
            />
          </div>
        </div>
      </ModalBody>
    </div>
  );
}
