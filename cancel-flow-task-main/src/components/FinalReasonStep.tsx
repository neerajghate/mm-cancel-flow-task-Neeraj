'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

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
};

const GREEN = '#34c759';

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
    <div
      className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
      style={{
        fontFamily:
          'DF Sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial'
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-sm font-semibold text-gray-900">
          Subscription Cancellation
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
          </div>
          <span>Step 3 of 3</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left column */}
        <div className="sm:pr-6">
          <h1 className="text-4xl font-semibold leading-tight text-gray-900">
            What’s the main
            <br /> reason for cancelling?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please take a minute to let us know why:
          </p>

          {/* Global validation note if nothing selected */}
          {showReasonError && (
            <p className="mt-4 text-sm text-red-600">
              To help us understand your experience, please select a reason for cancelling*
            </p>
          )}

          {/* Options */}
          <div className="mt-4 space-y-3">
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

          {/* Follow-up blocks */}
          {reason && current?.requires !== 'none' && (
            <>
              <div className="my-4 border-t border-gray-200" />
              {/* Textarea follow-up */}
              {needsText && (
                <div>
                  <p className="text-sm text-gray-800">
                    {current?.prompt}
                  </p>

                  {showTextError && (
                    <p className="mt-2 text-sm text-red-600">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}

                  <div className={`relative mt-2`}>
                    <textarea
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      placeholder="Enter reason here..."
                      rows={5}
                      className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none ${
                        showTextError
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-gray-500'
                      }`}
                    />
                    <div
                      className={`pointer-events-none absolute bottom-2 right-3 text-xs ${
                        detailOk ? 'text-emerald-600' : 'text-gray-500'
                      }`}
                    >
                      Min 25 characters ({detailLen}/25)
                    </div>
                  </div>
                </div>
              )}

              {/* Price follow-up */}
              {needsPrice && (
                <div className="mt-2">
                  <p className="text-sm text-gray-800">
                    {current?.prompt}
                  </p>
                  {showPriceError && (
                    <p className="mt-2 text-sm text-red-600">
                      Please enter a positive number.
                    </p>
                  )}
                  <div className="mt-2 flex items-center">
                    <div className={`relative w-full`}>
                      <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-gray-500">
                        $
                      </span>
                      <input
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        inputMode="decimal"
                        placeholder="$"
                        className={`w-full rounded-xl border pl-7 pr-3 py-2 text-sm outline-none ${
                          showPriceError
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* CTA buttons */}
          <div className="space-y-3">
            <button
              onClick={() => console.log('Offer CTA')}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-green-200"
              style={{ backgroundColor: GREEN }}
            >
              Get 50% off | $12.50 <span className="opacity-80 line-through ml-1">$25</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!allValid}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
              style={{
                backgroundColor: allValid ? '#e23d3d' : '#e5e7eb',
                color: allValid ? '#fff' : '#6b7280'
              }}
            >
              Complete cancellation
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt="NYC skyline"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
            priority={false}
          />
        </div>
      </div>

      {/* Optional close */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-3.5 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
