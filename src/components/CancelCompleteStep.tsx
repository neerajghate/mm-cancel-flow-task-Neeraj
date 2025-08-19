'use client';

import React from 'react';
import { Button, ModalHeader, ModalBody } from './ui';

type CancelCompleteStepProps = {
  onJobs: () => void;
  onClose?: () => void;
  endDate: string;
};

export default function CancelCompleteStep({
  onJobs,
  onClose,
  endDate
}: CancelCompleteStepProps) {
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
               <div className="text-xs text-gray-600">Step 3 of 3</div>
             </div>
           </div>

           {/* Desktop: original layout */}
           <div className="hidden sm:flex items-center w-full">
             <div className="flex items-center gap-3 mx-auto">
               <div className="section-title">Subscription Cancelled</div>
               <div className="flex items-center gap-2">
                 <span className="step-text">Step 3 of 3</span>
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

       {/* NYC Image below header - Mobile only */}
       <div className="px-6 py-4 sm:hidden">
         <div className="image-container image-container--small">
           <img
             src="/nyc.jpg"
             alt="NYC skyline"
             className="h-full w-full object-cover"
           />
         </div>
       </div>

       {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: copy + actions */}
          <div className="sm:pr-6">
            <h1 className="heading-1">
              Your subscription has been cancelled
            </h1>
            <h2 className="heading-2">
              We&apos;re sorry to see you go
            </h2>
            <p className="text-body">
              Your subscription is set to end on <span className="font-medium">{endDate}</span>.
            </p>
            <p className="text-muted text-muted--large">
              You&apos;ll continue to have access to all features until then.
            </p>

            <div className="divider" />

            <div className="section">
              <Button
                onClick={onJobs}
                variant="primary"
                fullWidth
                size="lg"
              >
                Back to Jobs
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
