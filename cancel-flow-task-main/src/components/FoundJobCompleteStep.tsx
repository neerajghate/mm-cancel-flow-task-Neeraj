'use client';

import Image from 'next/image';

type Props = {
  hasCompanyLawyer: boolean;   // true => show Mihailo card, false => short generic copy
  onFinish: () => void;
  onClose?: () => void;
  imageUrl?: string;
};

const GREEN = '#34c759';
const PURPLE = '#8952fc';
const AVATAR_SRC = '/milaho.jpg'; // change to '/milaho.png' if that’s your file

export default function FoundJobCompleteStep({
  hasCompanyLawyer,
  onFinish,
  onClose,
  imageUrl = '/nyc.jpg',
}: Props) {
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
  {/* Empty spacer on left (to balance center) */}
  <div className="w-6" />

  {/* Center: title + progress */}
  <div className="flex items-center gap-3">
    <div className="text-sm font-semibold text-gray-900">Subscription Cancelled</div>
    <div className="flex items-center gap-1">
      <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
      <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
      <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: GREEN }} />
    </div>
    <span className="text-sm text-gray-600">Completed</span>
  </div>

  {/* Right: close */}
  {onClose && (
    <button
      onClick={onClose}
      aria-label="Close"
      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )}
</div>


      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left copy */}
        <div className="sm:pr-6">
          {hasCompanyLawyer ? (
            <>
              <h1 className="text-2xl sm:text-[28px] font-semibold leading-snug text-gray-900">
                Your cancellation’s all sorted, mate,
                <br /> no more charges.
              </h1>

              {/* Mihailo message card */}
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={AVATAR_SRC}
                    alt="Mihailo Bozic"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="text-sm leading-tight">
                    <div className="font-semibold text-gray-900">Mihailo Bozic</div>
                    <div className="text-gray-600">&lt;mihailo@migratemate.co&gt;</div>
                  </div>
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-900">
                  I’ll be reaching out soon to help with the visa side of things.
                </p>
                <p className="mt-3 text-sm text-gray-800">
                  We’ve got your back, whether it’s questions, paperwork, or just
                  figuring out your options.
                </p>
                <p className="mt-3 text-sm text-gray-800">
                  Keep an eye on your inbox, I’ll be in touch{' '}
                  <a href="#" className="underline">shortly</a>.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-[28px] font-semibold leading-snug text-gray-900">
                All done, your cancellation’s
                <br /> been processed.
              </h1>
              <p className="mt-4 text-sm text-gray-700">
                We’re stoked to hear you’ve landed a job and sorted your visa.
                <br /> Big congrats from the team. 🎉
              </p>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={onFinish}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
              style={{ backgroundColor: PURPLE }}
            >
              Finish
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
    </div>
  );
}
