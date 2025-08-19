'use client';

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from './ui';

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
    <div className="modal-panel" role="dialog" aria-modal="true">
             {/* Header: simple title only */}
       <ModalHeader onClose={onClose} showCloseButton={true}>
         <div className="flex items-center w-full">
           <h3 className="section-title mx-auto">Subscription Cancellation</h3>
         </div>
               </ModalHeader>

       {/* NYC Image below header - Mobile only */}
       <div className="px-6 py-4 sm:hidden">
         <div className="image-container image-container--small">
           <img
             src={imageUrl}
             alt="NYC skyline"
             className="h-full w-full object-cover"
           />
         </div>
       </div>

       {/* Body */}
      <ModalBody>
        <div className="content-grid">
          {/* Left: copy + actions */}
          <div className="sm-pr-6">
            <div className="space-y-3">
              <p className="heading-1">
                Hey mate,
                <br/>Quick one before you go.
              </p>
              <p className="heading-3 italic">
                Have you found a job yet?
              </p>
              <p className="text-body text-muted">
                Whatever your answer, we just want to help you take the next step.
                With visa support, or by hearing how we can do better.
              </p>
            </div>

            <div className="divider" />

            <div className="space-y-3">
              <Button
                onClick={onFoundJob}
                variant="pill"
                fullWidth
                size="lg"
              >
                Yes, I&apos;ve found a job
              </Button>
              <Button
                onClick={onStillLooking}
                variant="pill"
                fullWidth
                size="lg"
              >
                Not yet — I&apos;m still looking
              </Button>
            </div>
          </div>

          {/* Right: image - Desktop only */}
          <div className="hidden sm:block image-container image-container--small">
            <img
              src={imageUrl}
              alt="NYC skyline"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </ModalBody>
    </div>
  );

  if (embedded) {
    // Parent controls overlay/backdrop. Just return the panel.
    return Panel;
  }

  // Standalone: include overlay/backdrop
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="xl"
      showBackdrop={true}
      closeOnBackdropClick={true}
    >
      {Panel}
    </Modal>
  );
}
