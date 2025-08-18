'use client';

import { useEffect, useState } from 'react';
import { UserService, SubscriptionService, AnalyticsService } from '../services/userService';
import { DatabaseService } from '../services/databaseService';
import { AB_TESTING_CONFIG, BUSINESS_CONFIG, STORAGE_KEYS } from '../constants/config';
import { validateInput, validationSchemas } from '../lib/security';

// Types
export type ModalStage =
  | 'initial'
  | 'downsell'
  | 'roles'
  | 'reason'
  | 'finalReason'
  | 'done'
  // left path
  | 'foundJob1'
  | 'foundJob2'
  | 'foundJob3'
  | 'foundJobDone';

export type ABBucket = 'A' | 'B'; // A = sees downsell, B = skips downsell

export type FoundJobData = {
  foundWithMate: '' | 'Yes' | 'No';
  appsApplied?: string;
  companiesEmailed?: string;
  companiesInterviewed?: string;
  feedback?: string;
  hasCompanyLawyer?: boolean;
  visa?: string;
};

export type SubscriptionData = {
  id?: string; // Add optional id field
  status: string;
  isTrialSubscription: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
  monthlyPrice: number;
  isUCStudent: boolean;
  hasManagedAccess: boolean;
  managedOrganization: string | null;
  downsellAccepted: boolean;
};

export type UserData = {
  email: string;
  id: string;
};

// Additional types for form payloads
export type CancelReasonPayload = {
  reason: string;
  details?: string;
};

export type FoundJobPayload = Partial<FoundJobData>;

export type UserSettings = {
  emailNotifications: boolean;
  marketingEmails: boolean;
  profileVisibility: 'public' | 'private';
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
};

export type Invoice = {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
};

export function useCancelFlow() {
  // UI State
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Cancel-flow modal router state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modalStage, setModalStage] = useState<ModalStage>('initial');
  const [abBucket, setAbBucket] = useState<ABBucket>('A');
  const [sawDownsellThisSession, setSawDownsellThisSession] = useState(false);

  // Left-path collected data
  const [foundJobData, setFoundJobData] = useState<FoundJobData>({
    foundWithMate: ''
  });

  // User and subscription data
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [currentCancellationId, setCurrentCancellationId] = useState<string | null>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await UserService.getUserData();
        const subscription = await UserService.getSubscriptionData();
        
        setUserData(user);
        setSubscriptionData(subscription);
        
        // Get or create A/B bucket from database
        if (user?.id) {
          try {
            const bucket = await DatabaseService.getOrCreateABBucket(user.id);
            setAbBucket(bucket);
            
            // Store in localStorage for frontend consistency
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(STORAGE_KEYS.AB_TEST_BUCKET, bucket);
            }
            
            AnalyticsService.trackABTest(bucket);
            console.log(`A/B Test: User assigned to bucket ${bucket} from database`);
          } catch (error) {
            console.error('Failed to get A/B bucket from database, using localStorage fallback:', error);
            
            // Fallback to localStorage
            const savedBucket = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.AB_TEST_BUCKET) : null;
            
            if (savedBucket === BUSINESS_CONFIG.AB_BUCKETS.A || savedBucket === BUSINESS_CONFIG.AB_BUCKETS.B) {
              setAbBucket(savedBucket as ABBucket);
              AnalyticsService.trackABTest(savedBucket as ABBucket);
            } else {
              const bucket: ABBucket = Math.random() < AB_TESTING_CONFIG.DEFAULT_DISTRIBUTION ? 'A' : 'B';
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEYS.AB_TEST_BUCKET, bucket);
              }
              setAbBucket(bucket);
              AnalyticsService.trackABTest(bucket);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Business Logic Functions
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await UserService.signOut();
      AnalyticsService.trackAction('user_signed_out');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleClose = () => {
    AnalyticsService.trackAction('navigate_to_jobs');
    console.log('Navigate to jobs');
  };

  // LEFT PATH: user clicked "Yes, I've found a job"
  const handleFoundJob = () => {
    setFoundJobData({ foundWithMate: '' });
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.FOUND_JOB_1);
    AnalyticsService.trackAction('found_job_selected');
  };

  // RIGHT PATH: user clicked "Not yet"
  const handleStillLooking = async () => {
    console.log(`A/B Test: User selected "Not yet", current bucket: ${abBucket}`);
    
    if (AB_TESTING_CONFIG.FORCE_DOWNSELL || abBucket === BUSINESS_CONFIG.AB_BUCKETS.A) {
      // Bucket A: Show downsell (50% of users)
      setSawDownsellThisSession(true);
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.DOWNSELL);
      AnalyticsService.trackAction('downsell_shown', { bucket: abBucket });
      console.log('A/B Test: Showing downsell to user (Bucket A)');
    } else {
      // Bucket B: Skip downsell (50% of users)
      setSawDownsellThisSession(false);
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
      AnalyticsService.trackAction('downsell_skipped', { bucket: abBucket });
      console.log('A/B Test: Skipping downsell for user (Bucket B)');
    }
  };

  const openCancelFlow = async () => {
    setShowCancelModal(true);
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.INITIAL);
    setSawDownsellThisSession(false);
    setFoundJobData({ foundWithMate: '' });
    
    // Create cancellation record in database
    if (userData?.id && subscriptionData) {
      try {
        const cancellationId = await DatabaseService.createCancellation({
          user_id: userData.id,
          subscription_id: subscriptionData.id || 'mock-subscription-id',
          downsell_variant: abBucket,
          reason: 'Cancel flow opened',
          accepted_downsell: false
        });
        
        if (cancellationId) {
          setCurrentCancellationId(cancellationId);
          console.log('Created cancellation record:', cancellationId);
        }
      } catch (error) {
        console.error('Failed to create cancellation record:', error);
      }
    }
    
    AnalyticsService.trackAction('cancel_flow_opened');
  };

  const closeCancelFlow = () => {
    setShowCancelModal(false);
    setCurrentCancellationId(null);
    AnalyticsService.trackAction('cancel_flow_closed');
  };

  const handleFoundJobNext = (stage: ModalStage, payload?: FoundJobPayload) => {
    if (payload) {
      setFoundJobData((prev) => ({ ...prev, ...payload }));
      AnalyticsService.trackAction('found_job_data_updated', payload);
    }
    setModalStage(stage);
  };

  const handleFoundJobBack = (stage: ModalStage) => {
    setModalStage(stage);
    AnalyticsService.trackAction('found_job_navigation', { from: modalStage, to: stage });
  };

  const handleFoundJobComplete = async (payload: FoundJobPayload) => {
    try {
      setFoundJobData((prev) => ({ ...prev, ...payload }));
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.FOUND_JOB_DONE);
      
      // Track form completion
      AnalyticsService.trackFormCompletion('found_job', payload);
      
      // Save to database
      if (userData?.id) {
        try {
          const recordId = await DatabaseService.createFoundJobRecord(userData.id, payload);
          if (recordId) {
            console.log('Saved found job record to database:', recordId);
          }
        } catch (error) {
          console.error('Failed to save found job record to database:', error);
        }
      }
    } catch (error) {
      console.error('Failed to complete found job flow:', error);
    }
  };

  const handleDownsellAccept = async () => {
    try {
      await SubscriptionService.acceptDownsellOffer();
      
      // Update database
      if (currentCancellationId) {
        await DatabaseService.updateCancellationDownsell(currentCancellationId, true);
      }
      
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.ROLES);
      AnalyticsService.trackAction('downsell_accepted');
    } catch (error) {
      console.error('Failed to accept downsell offer:', error);
    }
  };

  const handleDownsellDecline = async () => {
    try {
      // Update database
      if (currentCancellationId) {
        await DatabaseService.updateCancellationDownsell(currentCancellationId, false);
      }
      
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
      AnalyticsService.trackAction('downsell_declined');
    } catch (error) {
      console.error('Failed to decline downsell offer:', error);
    }
  };

  const handleRolesContinue = () => {
    closeCancelFlow();
    AnalyticsService.trackAction('roles_continue_clicked');
  };

  const handleReasonNext = () => {
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.FINAL_REASON);
    AnalyticsService.trackAction('reason_next_clicked');
  };

  const handleReasonBack = () => {
    const targetStage = sawDownsellThisSession ? BUSINESS_CONFIG.MODAL_STAGES.DOWNSELL : BUSINESS_CONFIG.MODAL_STAGES.INITIAL;
    setModalStage(targetStage);
    AnalyticsService.trackAction('reason_back_clicked', { targetStage });
  };

  const handleFinalReasonComplete = async (payload: CancelReasonPayload) => {
    try {
      console.log('Final cancel payload (right path):', payload);
      
      // Validate input
      const reasonValidation = validateInput(validationSchemas.cancellationReason, payload.reason);
      if (!reasonValidation.success) {
        console.error('Invalid reason:', reasonValidation.errors);
        return;
      }
      
      // Update database
      if (currentCancellationId) {
        await DatabaseService.updateCancellationReason(currentCancellationId, payload.reason);
      }
      
      // Mark subscription as pending cancellation
      if (userData?.id && subscriptionData?.id) {
        try {
          await DatabaseService.updateSubscriptionStatus(subscriptionData.id, { status: 'pending_cancellation' });
          console.log('Marked subscription as pending cancellation');
        } catch (error) {
          console.error('Failed to update subscription status:', error);
        }
      }
      
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.DONE);
      
      // Track form completion
      AnalyticsService.trackFormCompletion('cancel_reason', payload);
    } catch (error) {
      console.error('Failed to complete cancel reason flow:', error);
    }
  };

  const handleFinalReasonBack = () => {
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
    AnalyticsService.trackAction('final_reason_back_clicked');
  };

  const handleCancelComplete = () => {
    closeCancelFlow();
    AnalyticsService.trackAction('cancel_complete_clicked');
    console.log('Back to jobs');
  };

  const handleFoundJobFinish = () => {
    closeCancelFlow();
    AnalyticsService.trackAction('found_job_finish_clicked');
    console.log('Finish clicked');
  };

  const handleSupportContact = () => {
    AnalyticsService.trackAction('support_contact_clicked');
    console.log('Support contact clicked');
  };

  const handleUpdateCard = () => {
    AnalyticsService.trackAction('update_card_clicked');
    console.log('Update card clicked');
  };

  const handleInvoiceHistory = () => {
    AnalyticsService.trackAction('invoice_history_clicked');
    console.log('Invoice history clicked');
  };

  const handleSettingsToggle = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
    AnalyticsService.trackAction('settings_toggled', { showAdvancedSettings: !showAdvancedSettings });
    console.log('Settings toggled:', !showAdvancedSettings);
  };

  return {
    // State
    isSigningOut,
    showAdvancedSettings,
    showCancelModal,
    modalStage,
    foundJobData,
    mockUser: userData,
    mockSubscriptionData: subscriptionData,
    sawDownsellThisSession,
    abBucket,
    
    // Actions
    handleSignOut,
    handleClose,
    handleFoundJob,
    handleStillLooking,
    openCancelFlow,
    closeCancelFlow,
    handleFoundJobNext,
    handleFoundJobBack,
    handleFoundJobComplete,
    handleDownsellAccept,
    handleDownsellDecline,
    handleRolesContinue,
    handleReasonNext,
    handleReasonBack,
    handleFinalReasonComplete,
    handleFinalReasonBack,
    handleCancelComplete,
    handleFoundJobFinish,
    handleSupportContact,
    handleUpdateCard,
    handleInvoiceHistory,
    handleSettingsToggle,
  };
}
