'use client';

import React, { useState, useMemo } from 'react';
import { Button, ModalHeader, ModalBody, FormField, TextInput, Textarea } from './ui';
import { CancelReasonPayload } from '../hooks/useCancelFlow';

type FinalReasonStepProps = {
  onBack: () => void;
  onComplete: (payload: CancelReasonPayload) => Promise<void>;
  onClose?: () => void;
  imageUrl?: string;
  initialReason?: string;
};

type OptionKey =
  | 'too_expensive'
  | 'not_helpful'
  | 'not_enough_jobs'
  | 'decided_not_move'
  | 'other';

const OPTIONS: Record<
  OptionKey,
  { label: string; requires: 'none' | 'price' | 'text'; prompt?: string }
> = {
  too_expensive: {
    label: 'Too expensive',
    requires: 'price',
    prompt: 'What would be the maximum you would be willing to pay?*'
  },
  not_helpful: {
    label: 'Platform not helpful',
    requires: 'text',
    prompt: 'What can we change to make the platform more helpful?*'
  },
  not_enough_jobs: {
    label: 'Not enough relevant jobs',
    requires: 'text',
    prompt: 'In which way can we make the jobs more relevant?*'
  },
  decided_not_move: {
    label: 'Decided not to move',
    requires: 'text',
    prompt: 'What changed for you to decide to not move?*'
  },
  other: {
    label: 'Other',
    requires: 'text',
    prompt: 'What would have helped you the most?*'
  }
};

export default function FinalReasonStep({
  onBack,
  onComplete,
  onClose,
  imageUrl = '/nyc.jpg',
  initialReason
}: FinalReasonStepProps) {
  const [reason, setReason] = useState<OptionKey | ''>(
    (initialReason as OptionKey) || ''
  );
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState<string>(''); // keep as string for input
  const [touched, setTouched] = useState(false);
  const [showReasonSelection, setShowReasonSelection] = useState(true);

  const current = reason ? OPTIONS[reason] : undefined;
  const needsText = current?.requires === 'text';
  const needsPrice = current?.requires === 'price';

  const detailLen = details.trim().length;
  const detailOk = !needsText || detailLen >= 25;
  const priceNum = useMemo(() => {
    const n = Number(price.replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : NaN;
  }, [price]);
  const priceOk = !needsPrice || (priceNum > 0 && priceNum <= 1000);

  const allValid = Boolean(reason) && detailOk && priceOk;

  const showReasonError = touched && !reason;
  const showTextError = touched && needsText && !detailOk;
  const showPriceError = touched && needsPrice && !priceOk;

  const handleSubmit = () => {
    if (!allValid) {
      setTouched(true);
      return;
    }
    onComplete({
      reason: reason || '',
      details: needsText ? details : undefined
    });
  };

  const handleBackToReasonSelection = () => {
    setShowReasonSelection(true);
    setReason('');
    setDetails('');
    setPrice('');
    setTouched(false);
  };

  const resetFollowups = (key: OptionKey) => {
    setReason(key);
    setTouched(false);
    setDetails('');
    setPrice('');
    setShowReasonSelection(false);
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
                 <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
               </div>
               <div className="text-xs text-gray-600">Step 3 of 3</div>
             </div>
           </div>

           {/* Desktop: original layout with back button in header */}
           <div className="hidden sm:flex items-center w-full">
             <button
               onClick={onBack}
               className="back-link flex items-center gap-2"
               aria-label="Go back"
             >
               <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
               Back
             </button>

             <div className="flex items-center gap-3 mx-auto">
               <div className="section-title">Subscription Cancellation</div>
               <div className="flex items-center gap-2">
                 <span className="step-text">Step 3 of 3</span>
                 <div className="flex gap-1">
                   <div className="progress-pill--step"></div>
                   <div className="progress-pill--step"></div>
                   <div className="progress-pill--step"></div>
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
           aria-label="Go back"
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
            {showReasonSelection ? (
              // REASON SELECTION VIEW
              <>
                <h1 className="heading-1">
                  What&apos;s the main
                  <br /> reason for cancelling?
                </h1>
                <p className="text-body text-muted">
                  Please take a minute to let us know why:
                </p>

                {/* Global validation note if nothing selected */}
                {showReasonError && (
                  <p className="text-error">
                    To help us understand your experience, please select a reason for cancelling*
                  </p>
                )}

                {/* Options */}
                <div className="section--small">
                  <div className="space-y-3">
                    {(Object.keys(OPTIONS) as OptionKey[]).map(key => {
                      const opt = OPTIONS[key];
                      const active = reason === key;
                      return (
                        <button
                          type="button"
                          key={key}
                          onClick={() => resetFollowups(key)}
                          className={`flex items-center gap-3 w-full rounded-xl border bg-white px-4 py-3 text-left text-gray-800 hover-bg-gray-50 ${
                            active ? 'border-gray-400' : 'border-gray-200'
                          }`}
                        >
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border ${
                              active ? 'border-gray-800' : 'border-gray-400'
                            }`}
                          >
                            {active ? (
                              <span className="h-2-5 w-2-5 rounded-full bg-gray-900" />
                            ) : (
                              <span className="h-2-5 w-2-5 rounded-full bg-transparent" />
                            )}
                          </span>
                          <span className="text-sm">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              // FOLLOW-UP VIEW
              <>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBackToReasonSelection}
                    className="back-link"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                </div>
                
                <h1 className="heading-1">
                  {current?.label}
                </h1>
                <p className="text-body text-muted">
                  {current?.prompt}
                </p>

                {/* Textarea follow-up */}
                {needsText && (
                  <FormField
                    label=""
                    error={showTextError ? 'Please enter at least 25 characters so we can understand your feedback*' : undefined}
                  >
                    <Textarea
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      placeholder="Enter reason here..."
                      rows={5}
                      helperText={`Min 25 characters (${detailLen}/25)`}
                      className={showTextError ? 'textarea--error' : ''}
                    />
                  </FormField>
                )}

                {/* Price follow-up */}
                {needsPrice && (
                  <FormField
                    label=""
                    error={showPriceError ? 'Please enter a positive number.' : undefined}
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-2-5 text-sm text-gray-500">
                        $
                      </span>
                      <TextInput
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        inputMode="decimal"
                        placeholder="$"
                        className={`pl-7 ${showPriceError ? 'input--error' : ''}`}
                      />
                    </div>
                  </FormField>
                )}

                {/* Divider */}
                <div className="divider" />

                {/* CTA buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => console.log('Offer CTA')}
                    variant="success"
                    fullWidth
                    size="lg"
                  >
                    Get 50% off | $12.50 <span className="opacity-80 line-through ml-1">$25</span>
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={!allValid}
                    variant="danger"
                    fullWidth
                    size="lg"
                  >
                    Complete cancellation
                  </Button>
                </div>
              </>
            )}
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
