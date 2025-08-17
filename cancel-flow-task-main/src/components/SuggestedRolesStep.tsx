'use client';

import Image from 'next/image';

type SuggestedRolesStepProps = {
  onBack: () => void;
  onContinue: () => void;     // proceed to whatever your next step is
  onClose?: () => void;
  imageUrl?: string;
};

export default function SuggestedRolesStep({
  onBack,
  onContinue,
  onClose,
  imageUrl = '/nyc.jpg',
}: SuggestedRolesStepProps) {
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
      {/* Header: Back | centered title | Stepper */}
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

        <div className="text-sm font-semibold text-gray-900">Subscription</div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
            <span className="h-2.5 w-6 rounded-full bg-gray-800" />
            <span className="h-2.5 w-6 rounded-full bg-gray-300" />
          </div>
          <span>Step 2 of 3</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2">
        {/* Left column: copy + “job card” + CTA */}
        <div className="sm:pr-6">
          <h1 className="text-4xl font-semibold leading-tight text-gray-900">
            Awesome — we’ve pulled together
            <br /> a few roles that
            <br /> seem like a great fit for you.
          </h1>

          <p className="mt-3 text-base text-gray-600">
            Take a look and see what sparks your interest.
          </p>

          {/* Job card */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-5">
              {/* Title + meta */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#2d9cdb] flex items-center justify-center text-white font-bold">
                      r
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        Automation Controls Engineer
                      </p>
                      <p className="text-sm text-gray-500">Randstad USA • Memphis, Tennessee</p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-wrap gap-2">
                  {['Full Time', 'Associate', "Bachelor's", 'On-Site'].map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Salary + visa pills */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-emerald-600 font-semibold mr-2">NEW JOB</span>
                  <span className="text-gray-800 font-medium">$150,000/yr – $170,000/yr</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px]">
                  {/* tiny visa stat pills to match the vibe */}
                  {['Green Card', 'AU E-3', 'CA/MX TN', 'OPT'].map(pill => (
                    <span
                      key={pill}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-6 text-gray-700">
                The Electrical Automation Controls Engineer will design, implement, and maintain industrial
                automation systems, specializing in PLC programming using Siemens TIA Portal. Ideal candidates
                have 4+ years experience and a Bachelor’s degree in Electrical Engineering…
              </p>

              {/* Footer actions */}
              <div className="mt-5 flex items-center justify-end gap-3">
                <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
                  Save Job
                </button>
                <button className="rounded-xl bg-[#a78bfa] px-5 py-2 text-sm font-semibold text-white hover:bg-[#977cf6]">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Big CTA */}
          <button
            onClick={onContinue}
            className="mt-6 w-full rounded-2xl bg-[#a78bfa] px-6 py-4 text-base font-semibold text-white hover:bg-[#977cf6] focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            Land your dream role
          </button>
        </div>

        {/* Right image: render exactly the same as other steps */}
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

      {/* Optional floating close */}
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
