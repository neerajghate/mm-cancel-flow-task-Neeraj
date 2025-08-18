import React from 'react';

// Import modal components
import CancelModal from './CancelModal';
import DownsellStep from './DownsellStep';
import SuggestedRolesStep from './SuggestedRolesStep';
import ReasonStep from './ReasonStep';
import FinalReasonStep from './FinalReasonStep';
import CancelCompleteStep from './CancelCompleteStep';
import FoundJobIntroStep from './FoundJobIntroStep';
import FoundJobFeedbackStep from './FoundJobFeedbackStep';
import FoundJobVisaYesStep from './FoundJobVisaYesStep';
import FoundJobVisaNoStep from './FoundJobVisaNoStep';
import FoundJobCompleteStep from './FoundJobCompleteStep';

// Import types from the hook
import { ModalStage, FoundJobPayload, CancelReasonPayload, FoundJobData, SubscriptionData } from '../hooks/useCancelFlow';

interface ModalRouterProps {
  modalStage: ModalStage;
  foundJobData: FoundJobData;
  mockSubscriptionData: SubscriptionData | null;
  sawDownsellThisSession: boolean; // Whether user saw the downsell step
  abBucket: 'A' | 'B'; // A/B test variant
  onClose: () => void;
  onFoundJob: () => void;
  onStillLooking: () => void;
  onFoundJobBack: (stage: ModalStage) => void;
  onFoundJobNext: (stage: ModalStage, payload?: FoundJobPayload) => void;
  onFoundJobComplete: (payload: FoundJobPayload) => Promise<void>;
  onFoundJobFinish: () => void;
  onDownsellAccept: () => Promise<void>;
  onDownsellDecline: () => void;
  onRolesContinue: () => void;
  onReasonNext: () => void;
  onReasonBack: () => void;
  onFinalReasonComplete: (payload: CancelReasonPayload) => Promise<void>;
  onFinalReasonBack: () => void;
  onCancelComplete: () => void;
}

export default function ModalRouter({
  modalStage,
  foundJobData,
  mockSubscriptionData,
  sawDownsellThisSession,
  abBucket,
  onClose,
  onFoundJob,
  onStillLooking,
  onFoundJobBack,
  onFoundJobNext,
  onFoundJobComplete,
  onFoundJobFinish,
  onDownsellAccept,
  onDownsellDecline,
  onRolesContinue,
  onReasonNext,
  onReasonBack,
  onFinalReasonComplete,
  onFinalReasonBack,
  onCancelComplete,
}: ModalRouterProps) {
  // Initial modal stage
  if (modalStage === 'initial') {
    return (
      <CancelModal
        open
        embedded
        onClose={onClose}
        onFoundJob={onFoundJob}
        onStillLooking={onStillLooking}
      />
    );
  }

  // LEFT PATH (Found a job)
  if (modalStage === 'foundJob1') {
    return (
      <FoundJobIntroStep
        onBack={() => onFoundJobBack('initial')}
        onNext={(payload) => onFoundJobNext('foundJob2', payload)}
        onClose={onClose}
      />
    );
  }

  if (modalStage === 'foundJob2') {
    return (
      <FoundJobFeedbackStep
        onBack={() => onFoundJobBack('foundJob1')}
        onNext={(payload) => onFoundJobNext('foundJob3', payload)}
        onClose={onClose}
        foundJobData={foundJobData}
      />
    );
  }

  if (modalStage === 'foundJob3') {
    const answeredYes = (foundJobData.foundWithMate || '').toString().trim().toLowerCase() === 'yes';
    
    return answeredYes ? (
      <FoundJobVisaYesStep
        onBack={() => onFoundJobBack('foundJob2')}
        onComplete={onFoundJobComplete}
        onClose={onClose}
      />
    ) : (
      <FoundJobVisaNoStep
        onBack={() => onFoundJobBack('foundJob2')}
        onComplete={onFoundJobComplete}
        onClose={onClose}
      />
    );
  }

  if (modalStage === 'foundJobDone') {
    return (
      <FoundJobCompleteStep
        hasCompanyLawyer={!!foundJobData.hasCompanyLawyer}
        onFinish={onFoundJobFinish}
        onClose={onClose}
      />
    );
  }

  // RIGHT PATH (Still looking)
  if (modalStage === 'downsell') {
    return (
      <DownsellStep
        onBack={onReasonBack}
        onAccept={onDownsellAccept}
        onDecline={onDownsellDecline}
        onClose={onClose}
        abBucket={abBucket}
        monthlyPrice={mockSubscriptionData?.monthlyPrice || 25}
      />
    );
  }

  if (modalStage === 'roles') {
    return (
      <SuggestedRolesStep
        onBack={onReasonBack}
        onContinue={onRolesContinue}
        onClose={onClose}
      />
    );
  }

  if (modalStage === 'reason') {
    return (
      <ReasonStep
        onBack={onReasonBack}
        onNext={onReasonNext}
        onClose={onClose}
        sawDownsell={sawDownsellThisSession}
      />
    );
  }

  if (modalStage === 'finalReason') {
    return (
      <FinalReasonStep
        onBack={onFinalReasonBack}
        onComplete={onFinalReasonComplete}
        onClose={onClose}
        sawDownsell={sawDownsellThisSession}
      />
    );
  }

  if (modalStage === 'done') {
    return (
      <CancelCompleteStep
        onJobs={onCancelComplete}
        onClose={onClose}
        endDate={
          mockSubscriptionData?.currentPeriodEnd
            ? new Date(mockSubscriptionData.currentPeriodEnd).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : 'XX date'
        }
        sawDownsell={sawDownsellThisSession}
      />
    );
  }

  // Fallback - should not happen in normal flow
  return null;
}
