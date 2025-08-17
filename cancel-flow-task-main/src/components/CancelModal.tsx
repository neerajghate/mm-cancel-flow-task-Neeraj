'use client';

import Image from 'next/image';
import React from 'react';

type CancelModalProps = {
  open: boolean;
  onClose: () => void;
  onFoundJob?: () => void;
  onStillLooking?: () => void;
  imageUrl?: string;          // defaults to /nyc.jpg in public
  embedded?: boolean;         // if true, renders just the panel (no backdrop/overlay)
};

export default function CancelModal({
  open,
  onClose,
  onFoundJob,
  onStillLooking,
  imageUrl = '/nyc.jpg',
  embedded = false
}: CancelModalProps) {
  if (!open) return null;

  const Panel = (
    <div
      className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
      style={{
        fontFamily:
          'DF Sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial'
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Header: centered title, close button floats right */}
      <div className="relative flex items-center justify-center px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Subscription Cancellation</h3>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-3.5 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left: copy + actions */}
        <div className="sm:pr-6">
          <div className="space-y-3">
            <p className="text-3xl font-semibold leading-tight text-gray-900">
              Hey mate,
              <br/>Quick one before you go.
            </p>
            <p className="text-2xl italic font-semibold text-gray-900">
              Have you found a job yet?
            </p>
            <p className="text-gray-600">
              Whatever your answer, we just want to help you take the next step.
              With visa support, or by hearing how we can do better.
            </p>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="space-y-3">
            <button
              onClick={onFoundJob}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Yes, I’ve found a job
            </button>
            <button
              onClick={onStillLooking}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Not yet — I’m still looking
            </button>
          </div>
        </div>

        {/* Right: image */}
        <div className="overflow-hidden rounded-xl">
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

  if (embedded) {
    // Parent controls overlay/backdrop. Just return the panel.
    return Panel;
  }

  // Standalone: include overlay/backdrop
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      {Panel}
    </div>
  );
}
