'use client';

import React from 'react';
import { Button, ModalHeader, ModalBody } from './ui';
import { AB_TESTING_CONFIG } from '../config/constants';

type DownsellStepProps = {
  onBack: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
  abBucket: 'A' | 'B'; // A/B test variant
  monthlyPrice: number; // User's current monthly price
};

export default function DownsellStep({
  onBack,
  onAccept,
  onDecline,
  onClose,
  abBucket,
  monthlyPrice,
}: DownsellStepProps) {
  // Calculate pricing based on variant
  const variantConfig = AB_TESTING_CONFIG.VARIANTS[abBucket];
  const newPrice = variantConfig.prices[monthlyPrice as keyof typeof variantConfig.prices];
  const discountText = abBucket === 'A' ? '50% off' : '$10 off';
  
  return (
    <div className="modal-panel">
             {/* Header: responsive layout - mobile: title+progress left, desktop: original layout */}
       <ModalHeader onClose={onClose}>
         <div className="flex items-center w-full">
           {/* Mobile: title and progress stacked on left */}
           <div className="flex flex-col gap-2 sm:hidden">
             <div className="section-title text-left">Subscription Cancellation</div>
             <div className="flex items-center gap-2">
               <div className="flex gap-1">
                 <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
                 <div className="w-4 h-1.5 bg-gray-300 rounded-full"></div>
                 <div className="w-4 h-1.5 bg-gray-300 rounded-full"></div>
               </div>
               <div className="text-xs text-gray-600">Step 1 of 3</div>
             </div>
           </div>

           {/* Desktop: original layout with back button in header */}
           <div className="hidden sm:flex items-center w-full">
             <button
               onClick={onBack}
               className="back-link flex items-center gap-2"
               aria-label="Go back"
             >
               <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
               Back
             </button>

             <div className="flex items-center gap-3 mx-auto">
               <div className="section-title">Subscription Cancellation</div>
               <div className="flex items-center gap-2">
                 <span className="step-text">Step 1 of 3</span>
                 <div className="flex gap-1">
                   <div className="progress-pill--step"></div>
                   <div className="progress-pill--step--inactive"></div>
                   <div className="progress-pill--step--inactive"></div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </ModalHeader>

       {/* Mobile: Back button below header */}
       <div className="sm:hidden px-6 py-3 border-b border-gray-100">
         <button
           onClick={onBack}
           className="back-link flex items-center gap-2"
           aria-label="Go back"
         >
           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
           <span className="text-sm font-medium">Back</span>
         </button>
       </div>

      {/* Body */}
      <ModalBody>
        <div className="content-grid content-grid--compact">
          {/* Left: copy + actions */}
          <div className="sm:pr-6">
            <div className="section">
              <h1 className="responsive-heading font-semibold leading-tight text-gray-900">
                Wait! Before you go...
              </h1>
              <p className="text-muted text-muted--large">
                We&apos;d love to keep helping you find your next role.
              </p>
              
              {/* A/B Testing Indicator */}
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                A/B Test: Special Offer
              </div>
            </div>

            <div className="downsell-offer">
              <p className="heading-4 text-gray-900">
                Here&apos;s <span className="font-bold">{discountText}</span> until you find a job.
              </p>
              <div className="downsell-price">
                <span className="downsell-price--current">${newPrice}</span>
                <span className="downsell-price--unit">/month</span>
                <span className="downsell-price--original">${monthlyPrice} /month</span>
              </div>
            </div>

            <div className="section">
              <div className="space-y-3">
                <Button
                  onClick={onAccept}
                  variant="success"
                  fullWidth
                  size="lg"
                >
                  Accept {discountText} offer
                </Button>
                <Button
                  onClick={onDecline}
                  variant="outline"
                  fullWidth
                  size="lg"
                >
                  No thanks, cancel anyway
                </Button>
              </div>
            </div>

            <p className="mt-3 text-center responsive-text text-gray-500">
              You can cancel anytime. No questions asked.
            </p>
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
