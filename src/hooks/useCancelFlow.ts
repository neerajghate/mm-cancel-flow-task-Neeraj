'use client';

import { useEffect, useState } from 'react';
import { AB_TESTING_CONFIG, BUSINESS_CONFIG, STORAGE_KEYS } from '../config/constants';
import { userSession } from '../lib/userSession';
import { validateInput, validationSchemas, sanitizeFoundJobData } from '../lib/validation';

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
        console.log('Starting to load user data...');
        
        // Initialize secure session
        console.log('Calling userSession.initializeSession()...');
        const userId = userSession.initializeSession();
        console.log('Session initialized with user ID:', userId);
        
        // Get user data from secure database
        console.log('Getting user data...');
        const user = await userSession.getUserData();
        console.log('User data received:', user);
        
        console.log('Getting subscription data...');
        const subscription = await userSession.getSubscriptionData();
        console.log('Subscription data received:', subscription);
        
        setUserData(user);
        setSubscriptionData(subscription);
        
        // Get A/B bucket from secure database
        console.log('Getting A/B bucket...');
        const bucket = await userSession.getOrCreateABBucket();
        console.log('A/B bucket received:', bucket);
        setAbBucket(bucket);
        
        // Store in localStorage for frontend consistency
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEYS.AB_TEST_BUCKET, bucket);
        }
        
        // Check if user has already seen downsell this session
        console.log('Checking existing cancellations...');
        const existingCancellation = await userSession.getCancellationByUserId();
        if (existingCancellation) {
          setSawDownsellThisSession(true);
        }
        
        console.log(`A/B Test: User assigned to bucket ${bucket}`);
        console.log('User data loading completed successfully');
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
      // Clear secure session
      userSession.clearSession();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleClose = () => {
    console.log('Navigate to jobs');
  };

  // LEFT PATH: user clicked "Yes, I've found a job"
  const handleFoundJob = () => {
    setFoundJobData({ foundWithMate: '' });
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.FOUND_JOB_1);
    console.log('Found job selected');
  };

  // RIGHT PATH: user clicked "Not yet"
  const handleStillLooking = async () => {
    console.log(`A/B Test: User selected "Not yet", current bucket: ${abBucket}`);
    
    if (AB_TESTING_CONFIG.FORCE_DOWNSELL || abBucket === BUSINESS_CONFIG.AB_BUCKETS.A) {
      // Bucket A: Show downsell (50% of users)
      setSawDownsellThisSession(true);
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.DOWNSELL);
      console.log('A/B Test: Showing downsell to user (Bucket A)');
    } else {
      // Bucket B: Skip downsell (50% of users)
      setSawDownsellThisSession(false);
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
      console.log('A/B Test: Skipping downsell for user (Bucket B)');
    }
  };

  const openCancelFlow = async () => {
    setShowCancelModal(true);
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.INITIAL);
    setSawDownsellThisSession(false);
    setFoundJobData({ foundWithMate: '' });
    
    // Create cancellation record in secure database
    if (userData?.id) {
      try {
        const cancellationId = await userSession.createCancellation({
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
    
    console.log('Cancel flow opened');
  };

  const closeCancelFlow = () => {
    setShowCancelModal(false);
    setCurrentCancellationId(null);
    console.log('Cancel flow closed');
  };

  const handleFoundJobNext = (stage: ModalStage, payload?: FoundJobPayload) => {
    if (payload) {
      setFoundJobData((prev) => ({ ...prev, ...payload }));
      console.log('Found job data updated:', payload);
    }
    setModalStage(stage);
  };

  const handleFoundJobBack = (stage: ModalStage) => {
    setModalStage(stage);
    console.log('Found job navigation:', { from: modalStage, to: stage });
  };

  const handleFoundJobComplete = async (payload: FoundJobPayload) => {
    try {
      setFoundJobData((prev) => ({ ...prev, ...payload }));
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.FOUND_JOB_DONE);
      
      // Track form completion
      console.log('Found job form completed:', payload);
      
      // Save to secure database
      if (userData?.id) {
        try {
          // Sanitize input data
          const sanitizedData = sanitizeFoundJobData(payload);
          
          // Validate data
          const validation = validateInput(validationSchemas.foundJobData, sanitizedData);
          if (!validation.success) {
            console.error('Invalid found job data:', validation.errors);
            return;
          }
          
          // Create cancellation record with found job metadata
          const cancellationId = await userSession.createCancellation({
            downsell_variant: 'A', // Default for found job path
            reason: `FOUND_JOB: ${sanitizedData.foundWithMate}`,
            accepted_downsell: false
          });
          
          if (cancellationId) {
            console.log('Saved found job record to secure database:', cancellationId);
          }
        } catch (error) {
          console.error('Failed to save found job record to secure database:', error);
        }
      }
    } catch (error) {
      console.error('Failed to complete found job flow:', error);
    }
  };

  const handleDownsellAccept = async () => {
    try {
      // Accept downsell offer
      console.log('Downsell offer accepted');
      
      // Update secure database
      if (currentCancellationId) {
        try {
          await userSession.updateCancellationDownsell(currentCancellationId, true);
          console.log('Updated cancellation downsell to true in secure database');
        } catch (error) {
          console.error('Failed to update cancellation downsell:', error);
        }
      }
      
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.ROLES);
      console.log('Downsell accepted');
    } catch (error) {
      console.error('Failed to accept downsell offer:', error);
    }
  };

  const handleDownsellDecline = async () => {
    try {
      // Update secure database
      if (currentCancellationId) {
        try {
          await userSession.updateCancellationDownsell(currentCancellationId, false);
          console.log('Updated cancellation downsell to false in secure database');
        } catch (error) {
          console.error('Failed to update cancellation downsell:', error);
        }
      }
      
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
      console.log('Downsell declined');
    } catch (error) {
      console.error('Failed to decline downsell offer:', error);
    }
  };

  // Back from downsell → go to initial
  const handleDownsellBack = () => {
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.INITIAL);
    console.log('Downsell back clicked');
  };

  const handleRolesContinue = () => {
    closeCancelFlow();
    console.log('Roles continue clicked');
  };

  const handleReasonNext = () => {
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.FINAL_REASON);
    console.log('Reason next clicked');
  };

  const handleReasonBack = () => {
    const targetStage = sawDownsellThisSession ? BUSINESS_CONFIG.MODAL_STAGES.DOWNSELL : BUSINESS_CONFIG.MODAL_STAGES.INITIAL;
    setModalStage(targetStage);
    console.log('Reason back clicked:', { targetStage });
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
      
      // Update secure database
      if (currentCancellationId) {
        try {
          await userSession.updateCancellationReason(currentCancellationId, payload.reason);
          console.log('Updated cancellation reason in secure database:', payload.reason);
        } catch (error) {
          console.error('Failed to update cancellation reason:', error);
        }
      }
      
      // Mark subscription as pending cancellation
      if (userData?.id && subscriptionData?.id) {
        try {
          await userSession.updateSubscriptionStatus(subscriptionData.id, 'pending_cancellation');
          console.log('Marked subscription as pending cancellation in secure database');
        } catch (error) {
          console.error('Failed to update subscription status:', error);
        }
      }
      
      setModalStage(BUSINESS_CONFIG.MODAL_STAGES.DONE);
      
      // Mock form completion tracking
      console.log('Cancel reason form completed:', payload);
    } catch (error) {
      console.error('Failed to complete cancel reason flow:', error);
    }
  };

  const handleFinalReasonBack = () => {
    setModalStage(BUSINESS_CONFIG.MODAL_STAGES.REASON);
    console.log('Final reason back clicked');
  };

  const handleCancelComplete = () => {
    closeCancelFlow();
    console.log('Cancel complete clicked');
    console.log('Back to jobs');
  };

  const handleFoundJobFinish = () => {
    closeCancelFlow();
    console.log('Found job finish clicked');
    console.log('Finish clicked');
  };

  const handleSupportContact = () => {
    console.log('Support contact clicked');
  };

  const handleUpdateCard = () => {
    console.log('Update card clicked');
  };

  const handleInvoiceHistory = () => {
    console.log('Invoice history clicked');
  };

  const handleSettingsToggle = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
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
    handleDownsellBack,
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
