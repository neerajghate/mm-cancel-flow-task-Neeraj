'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, ModalHeader, ModalBody, FormField, PillSelection } from './ui';

type ReasonStepProps = {
  onBack: () => void;
  onNext: (payload: { appsApplied: string; companiesEmailed: string; companiesInterviewed: string }) => void;
  onClose?: () => void;
};

const Q1 = ['0', '1 – 5', '6 – 20', '20+'];
const Q2 = ['0', '1–5', '6–20', '20+'];
const Q3 = ['0', '1–2', '3–5', '5+'];

export default function ReasonStep({
  onBack,
  onNext,
  onClose
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
               className="back-link flex items-center gap-2"
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
          {/* Left: questions */}
          <div className="sm:pr-4">
            <h1 className="heading-1 mb-3 sm:mb-4">
              Help us understand how you
              <br className="hidden sm-block" /> were using Migrate Mate.
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
                    columns={4}
                    className={invalidQ1 ? 'pill--error' : ''}
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
                    columns={4}
                    className={invalidQ2 ? 'pill--error' : ''}
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
                    columns={4}
                    className={invalidQ3 ? 'pill--error' : ''}
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

          {/* Right: image - Desktop only */}
          <div className="hidden sm:block image-container">
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
