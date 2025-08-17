'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ReasonStepProps = {
  onBack: () => void;
  onNext: (payload: {
    appsApplied: string;
    companiesEmailed: string;
    companiesInterviewed: string;
  }) => void;
  onClose?: () => void;
  imageUrl?: string;
  onOffer?: () => void;
};

const Q1 = ['0', '1 – 5', '6 – 20', '20+'];
const Q2 = ['0', '1–5', '6–20', '20+'];
const Q3 = ['0', '1–2', '3–5', '5+'];

const PURPLE = '#7c5cff';
const GREEN = '#34c759';
const GREEN_HOVER = '#2fb753';
const RED = '#e23d3d';
const RED_HOVER = '#cb3232';

export default function ReasonStep({
  onBack,
  onNext,
  onClose,
  onOffer,
  imageUrl = '/nyc.jpg'
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

  const pillClass = (active: boolean) =>
    [
      'h-10 rounded-xl text-sm border shadow-sm transition',
      active ? 'text-white' : 'text-gray-700 bg-gray-100 border-gray-200 hover:bg-gray-200'
    ].join(' ');

  // compute continue button classes based on state
  const continueClasses = [
    'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
    isValid
      ? 'bg-gray-900 text-white hover:bg-gray-800'
      : triedContinue
      ? 'text-white'
      : 'bg-gray-300 text-gray-700'
  ].join(' ');

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

        <div className="text-sm font-semibold text-gray-900 text-center">
          Subscription Cancellation
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
          </div>
          <span>Step 2 of 3</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left: questions */}
        <div className="sm:pr-6">
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-gray-900">
            Help us understand how you
            <br /> were using Migrate Mate.
          </h1>

          <div className="mt-6 space-y-6">
            {/* Q1 */}
            <div ref={q1Ref}>
              <p className="text-sm text-gray-700">
                How many roles did you <span className="underline underline-offset-2">apply</span> for through Migrate Mate?
              </p>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {Q1.map(opt => {
                  const active = appsApplied === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAppsApplied(opt)}
                      className={pillClass(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {invalidQ1 && (
                <p className="mt-1 text-xs text-red-600">Please select an option to continue.</p>
              )}
            </div>

            {/* Q2 */}
            <div ref={q2Ref}>
              <p className="text-sm text-gray-700">
                How many companies did you <span className="underline underline-offset-2">email</span> directly?
              </p>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {Q2.map(opt => {
                  const active = companiesEmailed === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompaniesEmailed(opt)}
                      className={pillClass(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {invalidQ2 && (
                <p className="mt-1 text-xs text-red-600">Please select an option to continue.</p>
              )}
            </div>

            {/* Q3 */}
            <div ref={q3Ref}>
              <p className="text-sm text-gray-700">
                How many different companies did you <span className="underline underline-offset-2">interview</span> with?
              </p>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {Q3.map(opt => {
                  const active = companiesInterviewed === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompaniesInterviewed(opt)}
                      className={pillClass(active)}
                      style={active ? { backgroundColor: PURPLE, borderColor: PURPLE } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {invalidQ3 && (
                <p className="mt-1 text-xs text-red-600">Please select an option to continue.</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* CTA: stacked full-width buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                if (onOffer) onOffer();
                else console.log('Offer clicked');
              }}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-green-200"
              style={{ backgroundColor: GREEN }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = GREEN_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = GREEN)}
            >
              Get 50% off | $12.50 <span className="opacity-80 line-through ml-1">$25</span>
            </button>

            <button
              onClick={handleContinue}
              className={continueClasses}
              style={
                !isValid && triedContinue
                  ? { backgroundColor: RED }
                  : undefined
              }
              onMouseEnter={e => {
                if (!isValid && triedContinue) e.currentTarget.style.backgroundColor = RED_HOVER;
              }}
              onMouseLeave={e => {
                if (!isValid && triedContinue) e.currentTarget.style.backgroundColor = RED;
              }}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Right: image */}
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
