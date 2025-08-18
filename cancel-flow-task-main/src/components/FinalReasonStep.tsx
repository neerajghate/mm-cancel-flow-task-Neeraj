'use client';

import React, { useMemo, useState } from 'react';
import { Button, ModalHeader, ModalBody, TextInput, Textarea, FormField } from './ui';

type FinalReasonStepProps = {
  onBack: () => void;
  onComplete: (payload: {
    reason: string;
    details?: string;
    priceMax?: number | null;
  }) => void;
  onClose?: () => void;
  imageUrl?: string;
  initialReason?: string; // optional seed if you want to preselect
  sawDownsell?: boolean; // Whether user saw the downsell step (affects step counting)
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
  initialReason,
  sawDownsell = false
}: FinalReasonStepProps) {
  const [reason, setReason] = useState<OptionKey | ''>(
    (initialReason as OptionKey) || ''
  );
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState<string>(''); // keep as string for input
  const [touched, setTouched] = useState(false);

  const current = reason ? OPTIONS[reason] : undefined;
  const needsText = current?.requires === 'text';
  const needsPrice = current?.requires === 'price';

  const detailLen = details.trim().length;
  const detailOk = !needsText || detailLen >= 25;
  const priceNum = useMemo(() => {
    const n = Number(price.replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : NaN;
  }, [price]);
  const priceOk = !needsPrice || (price.trim() !== '' && priceNum > 0);

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
      reason,
      details: needsText ? details.trim() : undefined,
      priceMax: needsPrice ? priceNum : null
    });
  };

  const resetFollowups = (key: OptionKey) => {
    setReason(key);
    setTouched(false);
    setDetails('');
    setPrice('');
  };

  return (
    <div className="modal-panel">
      {/* Header */}
      <ModalHeader onClose={onClose}>
        {/* Back (left) */}
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

        {/* Center: title + progress + step text */}
        <div className="flex items-center gap-3">
          <div className="section-title">Subscription Cancellation</div>
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
          {/* Left column */}
          <div className="sm:pr-6">
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
                      className={`flex items-center gap-3 w-full rounded-xl border bg-white px-4 py-3 text-left text-gray-800 hover:bg-gray-50 ${
                        active ? 'border-gray-400' : 'border-gray-200'
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full border ${
                          active ? 'border-gray-800' : 'border-gray-400'
                        }`}
                      >
                        {active ? (
                          <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                        )}
                      </span>
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Follow-up blocks */}
            {reason && current?.requires !== 'none' && (
              <>
                <div className="divider" />
                {/* Textarea follow-up */}
                {needsText && (
                  <FormField
                    label={current?.prompt || ''}
                    error={showTextError ? 'Please enter at least 25 characters so we can understand your feedback*' : undefined}
                  >
                    <Textarea
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      placeholder="Enter reason here..."
                      rows={5}
                      helperText={`Min 25 characters (${detailLen}/25)`}
                    />
                  </FormField>
                )}

                {/* Price follow-up */}
                {needsPrice && (
                  <FormField
                    label={current?.prompt || ''}
                    error={showPriceError ? 'Please enter a positive number.' : undefined}
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-gray-500">
                        $
                      </span>
                      <TextInput
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        inputMode="decimal"
                        placeholder="$"
                        className="pl-7"
                      />
                    </div>
                  </FormField>
                )}
              </>
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
