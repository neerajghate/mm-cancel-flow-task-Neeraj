'use client';
import Image from 'next/image';

type DownsellStepProps = {
  onBack: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onClose?: () => void;                // ← add this
  imageUrl?: string;
};

const GREEN = '#34c759';

export default function DownsellStep({
  onBack,
  onAccept,
  onDecline,
  onClose,                              // ← receive it
  imageUrl = '/nyc.jpg'
}: DownsellStepProps) {
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
      {/* Header (Back | centered title+progress | Close) */}
      <div className="relative px-6 py-4 border-b border-gray-100 flex items-center justify-center">
        {/* Back (absolute left) */}
        <button
          onClick={onBack}
          className="absolute left-4 top-3.5 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Center: title + progress */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xs sm:text-sm font-semibold text-gray-900">Subscription Cancellation</div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-5 sm:h-2.5 sm:w-6 rounded-full bg-gray-800" />
            <span className="h-2 w-5 sm:h-2.5 sm:w-6 rounded-full bg-gray-300" />
            <span className="h-2 w-5 sm:h-2.5 sm:w-6 rounded-full bg-gray-300" />
          </div>
          <span className="text-[11px] sm:text-xs text-gray-600">Step 1 of 3</span>
        </div>

        {/* Close (absolute right) */}
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

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 px-6 sm:px-8 py-6 sm:py-8 sm:grid-cols-2">
        {/* Left: copy + offer */}
        <div className="sm:pr-6">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight text-gray-900">
            We built this to help you land the
            <br /> job, this makes it a little easier.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600">
            We’ve been there and we’re here to help you.
          </p>

          <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4 sm:p-5 shadow-sm">
            <p className="text-lg sm:text-xl text-gray-900">
              Here’s <span className="font-bold">50% off</span> until you find a job.
            </p>

            <div className="mt-2 flex items-baseline gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl font-semibold text-violet-700">$12.50</span>
              <span className="text-xs sm:text-sm text-violet-700">/month</span>
              <span className="text-xs sm:text-sm text-gray-400 line-through">$25 /month</span>
            </div>

            <button
              onClick={onAccept}
              className="mt-4 w-full rounded-xl bg-green-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              Get 50% off
            </button>

            <p className="mt-3 text-center text-[11px] sm:text-xs text-gray-500">
              You won’t be charged until your next billing date.
            </p>
          </div>

          <button
            onClick={onDecline}
            className="mt-5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            No thanks
          </button>
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
    </div>
  );
}
