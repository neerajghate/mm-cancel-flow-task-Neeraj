'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

type Props = {
  onBack: () => void;
  onNext: (payload: {
    foundWithMate: 'Yes' | 'No';
    appsApplied: string;
    companiesEmailed: string;
    companiesInterviewed: string;
  }) => void;
  onClose?: () => void;
  imageUrl?: string;
};

const PURPLE = '#7c5cff';
const GREEN = '#34c759';

const YESNO = ['Yes', 'No'] as const;
const Q1 = ['0', '1 – 5', '6 – 20', '20+'];
const Q2 = ['0', '1–5', '6–20', '20+'];
const Q3 = ['0', '1–2', '3–5', '5+'];

export default function FoundJobIntroStep({
  onBack,
  onNext,
  onClose,
  imageUrl = '/nyc.jpg',
}: Props) {
  const [foundWithMate, setFoundWithMate] = useState<'' | 'Yes' | 'No'>('');
  const [appsApplied, setAppsApplied] = useState('');
  const [companiesEmailed, setCompaniesEmailed] = useState('');
  const [companiesInterviewed, setCompaniesInterviewed] = useState('');
  const [touched, setTouched] = useState(false);

  const q0Ref = useRef<HTMLDivElement | null>(null);
  const q1Ref = useRef<HTMLDivElement | null>(null);
  const q2Ref = useRef<HTMLDivElement | null>(null);
  const q3Ref = useRef<HTMLDivElement | null>(null);

  const isValid =
    foundWithMate && appsApplied && companiesEmailed && companiesInterviewed;

  const pill = (active: boolean) =>
    [
      'h-10 rounded-xl text-sm border shadow-sm transition',
      active
        ? 'text-white'
        : 'text-gray-700 bg-gray-100 border-gray-200 hover:bg-gray-200',
    ].join(' ');

  const nudgeToFirstInvalid = () => {
    if (!foundWithMate && q0Ref.current)
      q0Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (!appsApplied && q1Ref.current)
      q1Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (!companiesEmailed && q2Ref.current)
      q2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (!companiesInterviewed && q3Ref.current)
      q3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleContinue = () => {
    if (!isValid) {
      setTouched(true);
      nudgeToFirstInvalid();
      return;
    }
    onNext({
      foundWithMate: foundWithMate as 'Yes' | 'No',
      appsApplied,
      companiesEmailed,
      companiesInterviewed,
    });
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
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
          </div>
          <span>Step 1 of 3</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left column */}
        <div className="sm:pr-6">
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-gray-900">
            Congrats on the new role! <span role="img" aria-label="party">🎉</span>
          </h1>

          <div className="mt-6 space-y-6">
            {/* Q0: Found via MigrateMate */}
            <div ref={q0Ref}>
              <p className="text-sm text-gray-700">
                Did you find this job with MigrateMate?*
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {YESNO.map(opt => {
                  const active = foundWithMate === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFoundWithMate(opt)}
                      className={pill(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {touched && !foundWithMate && (
                <p className="mt-1 text-xs text-red-600">Please select an option.</p>
              )}
            </div>

            {/* Q1 */}
            <div ref={q1Ref}>
              <p className="text-sm text-gray-700">
                How many roles did you <span className="underline underline-offset-2">apply</span> for through Migrate Mate?*
              </p>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {Q1.map(opt => {
                  const active = appsApplied === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAppsApplied(opt)}
                      className={pill(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {touched && !appsApplied && (
                <p className="mt-1 text-xs text-red-600">Please select an option.</p>
              )}
            </div>

            {/* Q2 */}
            <div ref={q2Ref}>
              <p className="text-sm text-gray-700">
                How many companies did you <span className="underline underline-offset-2">email</span> directly?*
              </p>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {Q2.map(opt => {
                  const active = companiesEmailed === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompaniesEmailed(opt)}
                      className={pill(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {touched && !companiesEmailed && (
                <p className="mt-1 text-xs text-red-600">Please select an option.</p>
              )}
            </div>

            {/* Q3 */}
            <div ref={q3Ref}>
              <p className="text-sm text-gray-700">
                How many different companies did you <span className="underline underline-offset-2">interview</span> with?*
              </p>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {Q3.map(opt => {
                  const active = companiesInterviewed === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompaniesInterviewed(opt)}
                      className={pill(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {touched && !companiesInterviewed && (
                <p className="mt-1 text-xs text-red-600">Please select an option.</p>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-6">
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isValid ? '#111827' : '#e5e7eb',
                color: isValid ? '#fff' : '#6b7280',
              }}
            >
              Continue
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
