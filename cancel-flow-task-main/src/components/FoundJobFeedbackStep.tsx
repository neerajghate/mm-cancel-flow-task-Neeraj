'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  onBack: () => void;
  onNext: (payload: { feedback: string }) => void;
  onClose?: () => void;
  imageUrl?: string;
};

const GREEN = '#34c759';

export default function FoundJobFeedbackStep({
  onBack,
  onNext,
  onClose,
  imageUrl = '/nyc.jpg',
}: Props) {
  const [text, setText] = useState('');
  const MIN = 25;
  const valid = text.trim().length >= MIN;

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
            <span className="h-2.5 w-6 rounded-full bg-gray-400" />
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
          </div>

          <span className="text-sm text-gray-600">Step 2 of 3</span>
        </div>

        {/* Close (extreme right) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left column */}
        <div className="sm:pr-6">
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-gray-900">
            What’s one thing you wish we
            <br /> could’ve helped you with?
          </h1>

          <p className="mt-3 text-gray-700">
            We’re always looking to improve, your thoughts can help us
            <br /> make Migrate Mate more useful for others.*
          </p>

          <div className="mt-4">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder=""
                className={[
                  'w-full h-40 rounded-xl border px-3 py-2 text-sm',
                  'focus:outline-none focus:ring-2',
                  valid
                    ? 'border-gray-300 focus:ring-green-200'
                    : 'border-gray-300 focus:ring-gray-200',
                ].join(' ')}
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                Min {MIN} characters ({Math.min(text.trim().length, MIN)}/{MIN})
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-6">
            <button
              onClick={() => valid && onNext({ feedback: text.trim() })}
              disabled={!valid}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-500"
              style={valid ? { backgroundColor: '#111827', color: '#fff' } : undefined}
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
        </button>
      )}
    </div>
  );
}
