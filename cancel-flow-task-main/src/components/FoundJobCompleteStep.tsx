'use client';

import React from 'react';
import { Button, ModalHeader, ModalBody } from './ui';

type FoundJobCompleteStepProps = {
  hasCompanyLawyer: boolean;
  onFinish: () => void;
  onClose: () => void;
};

export default function FoundJobCompleteStep({
  hasCompanyLawyer,
  onFinish,
  onClose,
}: FoundJobCompleteStepProps) {
  return (
    <div className="modal-panel">
             {/* Header: responsive layout - mobile: title+progress left, desktop: original layout */}
       <ModalHeader onClose={onClose}>
         <div className="flex items-center w-full">
           {/* Mobile: title and progress stacked on left */}
           <div className="flex flex-col gap-2 sm:hidden">
             <div className="section-title text-left">Subscription Cancelled</div>
             <div className="flex items-center gap-2">
               <div className="flex gap-1">
                 <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
                 <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
                 <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
               </div>
               <div className="text-xs text-gray-600">Complete</div>
             </div>
           </div>

           {/* Desktop: original layout */}
           <div className="hidden sm:flex items-center w-full">
             <div className="flex items-center gap-3 mx-auto">
               <div className="section-title">Subscription Cancelled</div>
               <div className="flex items-center gap-2">
                 <span className="step-text">Complete</span>
                 <div className="flex gap-1">
                   <div className="progress-pill--step"></div>
                   <div className="progress-pill--step"></div>
                   <div className="progress-pill--step"></div>
                 </div>
               </div>
             </div>
           </div>
         </div>
               </ModalHeader>

       {/* NYC Image below header - Mobile only, only when company doesn't have lawyer */}
       {!hasCompanyLawyer && (
         <div className="px-6 py-4 sm:hidden">
           <div className="image-container image-container--small">
             <img
               src="/nyc.jpg"
               alt="NYC skyline"
               className="h-full w-full object-cover"
             />
           </div>
         </div>
       )}

       {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: copy + actions */}
          <div className="sm:pr-6">
            <h1 className="heading-3">
              {hasCompanyLawyer ? (
                <>
                  Perfect! You&apos;re all set with your new role and visa support.
                </>
              ) : (
                <>
                  Great! We&apos;ll help you get the visa support you need.
                </>
              )}
            </h1>

            {hasCompanyLawyer ? (
              <div className="contact-card">
                <div className="contact-info">
                  <div className="contact-avatar">
                    <img
                      src="/milaho.jpg"
                      alt="Mihailo Bozic"
                      className="h-12 w-12 object-cover rounded-full"
                    />
                  </div>
                  <div className="contact-details">
                    <div className="contact-name">Mihailo Bozic</div>
                    <div className="contact-email">&lt;mihailo@migratemate.co&gt;</div>
                  </div>
                </div>
                <p className="mt-4 section-title">
                  Your dedicated success manager
                </p>
                <p className="mt-3 text-sm text-gray-800">
                  Mihailo will be in touch within 24 hours to help you with your visa process.
                </p>
                <p className="mt-3 text-sm text-gray-800">
                  He&apos;ll coordinate with your company&apos;s legal team to ensure everything goes smoothly.
                </p>
              </div>
            ) : (
              <div className="section">
                <h1 className="heading-3">
                  We&apos;ll connect you with our trusted visa partners
                </h1>
                <p className="text-body text-muted">
                  Our network of immigration lawyers will help you navigate the visa process step by step.
                </p>
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={onFinish}
                variant="primary"
                fullWidth
                size="lg"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Right: image - Desktop only */}
          <div className="hidden sm:block image-container">
            <img
              src="/nyc.jpg"
              alt="NYC skyline"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </ModalBody>
    </div>
  );
}
