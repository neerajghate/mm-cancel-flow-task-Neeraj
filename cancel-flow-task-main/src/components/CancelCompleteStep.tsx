'use client';

import Image from 'next/image';

type CancelCompleteStepProps = {
  onBack: () => void;
  onJobs: () => void;          // primary CTA
  onClose?: () => void;
  imageUrl?: string;
  endDate?: string;            // formatted date string
};

const GREEN = '#34c759';
const PURPLE = '#8952fc';
const PURPLE_HOVER = '#7b40fc';

export default function CancelCompleteStep({
  onBack,
  onJobs,
  onClose,
  imageUrl = '/nyc.jpg',
  endDate = 'XX date'
}: CancelCompleteStepProps) {
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
          Subscription Cancelled
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
          </div>
          <span>Completed</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left copy */}
        <div className="sm:pr-6">
          <h1 className="text-4xl font-semibold leading-tight text-gray-900">
            Sorry to see you go, mate.
          </h1>

          <h2 className="mt-4 text-3xl font-semibold leading-snug text-gray-900">
            Thanks for being with us, and you’re
            <br /> always welcome back.
          </h2>

          <p className="mt-6 text-gray-700">
            Your subscription is set to end on <span className="font-medium">{endDate}</span>.
            <br />
            You’ll still have full access until then. No further charges after that.
          </p>

          <p className="mt-4 text-gray-600">
            Changed your mind? You can reactivate anytime before your end date.
          </p>

          <div className="my-6 border-t border-gray-200" />

          <button
            onClick={onJobs}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: PURPLE }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = PURPLE_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = PURPLE)}
          >
            Back to Jobs
          </button>
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
