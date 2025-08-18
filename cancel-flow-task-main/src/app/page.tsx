'use client';

import { Button, Card, CardBody, InfoCard } from '../components/ui';
import { useCancelFlow } from '../hooks/useCancelFlow';
import ModalRouter from '../components/ModalRouter';

export default function ProfilePage() {
  // Use custom hook for all business logic
  const {
    // State
    isSigningOut,
    showAdvancedSettings,
    showCancelModal,
    modalStage,
    foundJobData,
    mockUser,
    mockSubscriptionData,
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
  } = useCancelFlow();

  return (
    <div className="page-container">
      <div className="page-layout">
        <Card shadow="lg" rounded="lg" className="overflow-hidden">
          {/* Header */}
          <div className="page-header">
            <div className="header-container">
              <h1 className="page-title">
                <span className="page-title--mobile">Profile</span>
                <span className="page-title--desktop">My Profile</span>
              </h1>
              <div className="header-actions">
                <Button
                  onClick={handleClose}
                  variant="primary"
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  }
                  aria-label="Back to jobs"
                >
                  <span className="page-title--mobile">Jobs</span>
                  <span className="page-title--desktop">Back to jobs</span>
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  loading={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </Button>
              </div>
            </div>
          </div>

          {/* Account info */}
          <CardBody>
            <h2 className="heading-4 mb-4">Account Information</h2>
            <div className="account-section">
              <div className="account-field">
                <p className="account-label">Email</p>
                <p className="account-value">{mockUser?.email || 'Loading...'}</p>
              </div>
              <div className="account-field--spaced">
                <InfoCard
                  icon="💳"
                  title="Subscription Status"
                  value={mockSubscriptionData?.status || 'Loading...'}
                  status={mockSubscriptionData?.status === 'active' ? 'success' : 'warning'}
                />
                <InfoCard
                  icon="📅"
                  title="Next Payment"
                  value={mockSubscriptionData ? new Date(mockSubscriptionData.currentPeriodEnd).toLocaleDateString() : 'Loading...'}
                  status="info"
                />
              </div>
            </div>
          </CardBody>

          {/* Support */}
          <CardBody>
            <Button
              onClick={handleSupportContact}
              title="Send email to support"
              variant="primary"
              fullWidth
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="icon--medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              Contact support
            </Button>
          </CardBody>

          {/* Settings */}
          <CardBody>
            <Button
              onClick={handleSettingsToggle}
              variant="secondary"
              fullWidth
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              rightIcon={
                <svg
                  className={`icon--chevron ${showAdvancedSettings ? 'icon--chevron--rotated' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              }
            >
              Manage Subscription
            </Button>

            {/* Collapsible Settings Content */}
            <div className={`settings-toggle ${showAdvancedSettings ? 'settings-toggle--expanded' : 'settings-toggle--collapsed'}`}>
              <div className="settings-content">
                <div>
                  <div className="settings-actions">
                    <Button
                      onClick={handleUpdateCard}
                      variant="secondary"
                      fullWidth
                      leftIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      }
                    >
                      Update payment method
                    </Button>
                    <Button
                      onClick={handleInvoiceHistory}
                      variant="secondary"
                      fullWidth
                      leftIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      }
                    >
                      View billing history
                    </Button>
                    <Button
                      onClick={openCancelFlow}
                      variant="danger"
                      fullWidth
                      leftIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      }
                    >
                      Cancel Migrate Mate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal overlay router */}
      {showCancelModal && (
        <div className="modal-overlay">
          {/* Backdrop */}
          <button aria-hidden="true" onClick={closeCancelFlow} className="modal-backdrop" />

          {/* Close button floating top-right of overlay */}
          <button
            onClick={closeCancelFlow}
            aria-label="Close"
            className="modal-close-button"
          >
            <svg className="icon--medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Router - Handles all modal stage logic */}
          <ModalRouter
            modalStage={modalStage}
            foundJobData={foundJobData}
            mockSubscriptionData={mockSubscriptionData}
            sawDownsellThisSession={sawDownsellThisSession}
            abBucket={abBucket}
            onClose={closeCancelFlow}
            onFoundJob={handleFoundJob}
            onStillLooking={handleStillLooking}
            onFoundJobBack={handleFoundJobBack}
            onFoundJobNext={handleFoundJobNext}
            onFoundJobComplete={handleFoundJobComplete}
            onFoundJobFinish={handleFoundJobFinish}
            onDownsellAccept={handleDownsellAccept}
            onDownsellDecline={handleDownsellDecline}
            onRolesContinue={handleRolesContinue}
            onReasonNext={handleReasonNext}
            onReasonBack={handleReasonBack}
            onFinalReasonComplete={handleFinalReasonComplete}
            onFinalReasonBack={handleFinalReasonBack}
            onCancelComplete={handleCancelComplete}
          />
        </div>
      )}
    </div>
  );
}

