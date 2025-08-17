'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  onBack: () => void;
  onComplete: (payload: { hasCompanyLawyer: boolean; visa: string }) => void;
  onClose?: () => void;
  imageUrl?: string;
};

const GREEN = '#34c759';

export default function FoundJobVisaNoStep({
  onBack,
  onComplete,
  onClose,
  imageUrl = '/nyc.jpg',
}: Props) {
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
    <div
      className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
      style={{
        fontFamily:
          'DF Sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        {/* Back (left) */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Center: title + progress + step text */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-gray-900">Subscription Cancellation</div>

          {/* Step 1: progress pills should be grey */}
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full bg-gray-400" />
          </div>

          <span className="text-sm text-gray-600">Step 3 of 3</span>
        </div>

        {/* Close (extreme right) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left column */}
        <div className="sm:pr-6">
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-gray-900">
            You landed the job!
            <br />
            <span className="italic">That’s what we live for.</span>
          </h1>

          <p className="mt-3 text-gray-700">
            Even if it wasn’t through Migrate Mate,
            <br /> let us help get your visa sorted.
          </p>

          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-700">
              Is your company providing an immigration lawyer to help with your visa?
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visa-lawyer"
                  className="h-4 w-4 text-gray-900"
                  checked={answer === 'yes'}
                  onChange={() => setAnswer('yes')}
                />
                <span className="text-gray-800">Yes</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visa-lawyer"
                  className="h-4 w-4 text-gray-900"
                  checked={answer === 'no'}
                  onChange={() => setAnswer('no')}
                />
                <span className="text-gray-800">No</span>
              </label>
            </div>

            {answer !== '' && (
              <div className="mt-4">
                {answer === 'no' ? (
                  <>
                    <p className="text-sm text-gray-600">
                      We can connect you with one of our trusted partners.
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      Which visa would you like to apply for?*
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-700">What visa will you be applying for?*</p>
                )}

                <input
                  value={visa}
                  onChange={(e) => setVisa(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={[
                    'mt-2 w-full rounded-xl border px-3 py-2 text-sm',
                    'focus:outline-none focus:ring-2',
                    touched && !visaValid
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-green-200',
                  ].join(' ')}
                  placeholder="e.g., H-1B, O-1, Green Card"
                />
                {touched && !visaValid && (
                  <p className="mt-1 text-xs text-red-600">Please enter a visa type.</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              disabled={!canSubmit}
              onClick={submit}
              className={[
                'w-full rounded-xl px-4 py-3 text-sm font-semibold',
                canSubmit ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-500',
              ].join(' ')}
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
