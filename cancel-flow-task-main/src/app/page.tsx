'use client';

import { useEffect, useState } from 'react';

// Toggle while testing A/B: force showing downsell on "Not yet"
const FORCE_DOWNSELL = false;

/* ---------------- Right-path components ---------------- */
import CancelModal from '../components/CancelModal';
import DownsellStep from '../components/DownsellStep';
import SuggestedRolesStep from '../components/SuggestedRolesStep';
import ReasonStep from '../components/ReasonStep';
import FinalReasonStep from '../components/FinalReasonStep';
import CancelCompleteStep from '../components/CancelCompleteStep';

/* ---------------- Left-path components ---------------- */
import FoundJobIntroStep from '../components/FoundJobIntroStep';
import FoundJobFeedbackStep from '../components/FoundJobFeedbackStep';
import FoundJobVisaYesStep from '../components/FoundJobVisaYesStep';
import FoundJobVisaNoStep from '../components/FoundJobVisaNoStep';
import FoundJobCompleteStep from '../components/FoundJobCompleteStep';

/* ---------------- Mock data ---------------- */
const mockUser = {
  email: 'user@example.com',
  id: '1'
};

const mockSubscriptionData = {
  status: 'active',
  isTrialSubscription: false,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  monthlyPrice: 25,
  isUCStudent: false,
  hasManagedAccess: false,
  managedOrganization: null,
  downsellAccepted: false
};

type ModalStage =
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

type ABBucket = 'A' | 'B'; // A = sees downsell, B = skips downsell

type FoundJobData = {
  foundWithMate: '' | 'Yes' | 'No';
  appsApplied?: string;
  companiesEmailed?: string;
  companiesInterviewed?: string;
  feedback?: string;
  hasCompanyLawyer?: boolean;
};

export default function ProfilePage() {
  const [loading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Settings accordion
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

  useEffect(() => {
    // Persist A/B bucket so users don't flip each click
    try {
      const key = 'mm_cancel_ab';
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (saved === 'A' || saved === 'B') {
        setAbBucket(saved as ABBucket);
      } else {
        const bucket: ABBucket = Math.random() < 0.5 ? 'A' : 'B';
        window.localStorage.setItem(key, bucket);
        setAbBucket(bucket);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setTimeout(() => {
      console.log('User signed out');
      setIsSigningOut(false);
    }, 1000);
  };

  const handleClose = () => {
    console.log('Navigate to jobs');
  };

  /* ---------------- Clicks from CancelModal ---------------- */
  // LEFT PATH: user clicked "Yes, I’ve found a job"
  const handleFoundJob = () => {
    setFoundJobData({ foundWithMate: '' });
    setModalStage('foundJob1');
  };

  // RIGHT PATH: user clicked "Not yet"
  const handleStillLooking = () => {
    if (FORCE_DOWNSELL || abBucket === 'A') {
      setSawDownsellThisSession(true);
      setModalStage('downsell'); // show downsell
    } else {
      setModalStage('reason'); // skip downsell
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="h-8 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="flex space-x-3">
                  <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="h-6 w-56 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="space-y-6">
                <div>
                  <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-36 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            </div>
            <div className="px-6 py-6">
              <div className="h-6 w-56 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse delay-75"></div>
                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="sm:hidden">Profile</span>
                <span className="hidden sm:inline">My Profile</span>
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#8952fc] rounded-lg hover:bg-[#7b40fc] transition-colors"
                  aria-label="Back to jobs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="sm:hidden">Jobs</span>
                  <span className="hidden sm:inline">Back to jobs</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-md text-gray-900">{mockUser.email}</p>
              </div>
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Subscription status</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mockSubscriptionData.status === 'active' && !mockSubscriptionData.isTrialSubscription && !mockSubscriptionData.cancelAtPeriodEnd && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {mockSubscriptionData.status === 'active' && !mockSubscriptionData.isTrialSubscription && !mockSubscriptionData.cancelAtPeriodEnd && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Next payment</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {mockSubscriptionData.currentPeriodEnd &&
                        new Date(mockSubscriptionData.currentPeriodEnd).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="px-6 py-6 border-b border-gray-200">
            <button
              onClick={() => {
                console.log('Support contact clicked');
              }}
              title="Send email to support"
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#8952fc] text-white rounded-lg hover:bg-[#7b40fc] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Contact support</span>
            </button>
          </div>

          {/* Settings */}
          <div className="px-6 py-6">
            <button
              onClick={() => {
                setShowAdvancedSettings(!showAdvancedSettings);
                console.log('Settings toggled:', !showAdvancedSettings);
              }}
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Manage Subscription</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAdvancedSettings ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Settings Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedSettings ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        console.log('Update card clicked');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm font-medium">Update payment method</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log('Invoice history clicked');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-sm font-medium">View billing history</span>
                    </button>
                    <button
                      onClick={() => {
                        // Open cancel flow modal
                        setShowCancelModal(true);
                        setModalStage('initial');
                        setSawDownsellThisSession(false);
                        setFoundJobData({ foundWithMate: '' });
                        console.log('Cancel flow opened');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm font-medium">Cancel Migrate Mate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end settings section */}
        </div>
      </div>

      {/* Modal overlay router */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <button aria-hidden="true" onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/50" />

          {/* Close button floating top-right of overlay */}
          <button
            onClick={() => setShowCancelModal(false)}
            aria-label="Close"
            className="absolute right-6 top-6 z-[110] rounded-full p-2 text-gray-500 hover:bg-white/70 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Stage switcher */}
          {modalStage === 'initial' && (
            <CancelModal
              open
              embedded
              onClose={() => setShowCancelModal(false)}
              onFoundJob={handleFoundJob}
              onStillLooking={handleStillLooking}
            />
          )}

          {/* ---------- LEFT PATH (Found a job) ---------- */}
          {modalStage === 'foundJob1' && (
            <FoundJobIntroStep
              onBack={() => setModalStage('initial')}
              onNext={(payload) => {
                setFoundJobData((prev) => ({
                  ...prev,
                  foundWithMate: payload.foundWithMate,
                  appsApplied: payload.appsApplied,
                  companiesEmailed: payload.companiesEmailed,
                  companiesInterviewed: payload.companiesInterviewed
                }));
                setModalStage('foundJob2');
              }}
            />
          )}

          {modalStage === 'foundJob2' && (
            <FoundJobFeedbackStep
              onBack={() => setModalStage('foundJob1')}
              onNext={(payload) => {
                setFoundJobData((prev) => ({ ...prev, feedback: payload.feedback }));
                setModalStage('foundJob3');
              }}
            />
          )}

          {modalStage === 'foundJob3' &&
            (foundJobData.foundWithMate === 'Yes' ? (
              <FoundJobVisaYesStep
                onBack={() => setModalStage('foundJob2')}
                onComplete={(payload) => {
                  setFoundJobData((prev) => ({ ...prev, hasCompanyLawyer: payload.hasCompanyLawyer }));
                  setModalStage('foundJobDone'); // left-path completion
                }}
              />
            ) : (
              <FoundJobVisaNoStep
                onBack={() => setModalStage('foundJob2')}
                onComplete={(payload) => {
                  setFoundJobData((prev) => ({ ...prev, hasCompanyLawyer: payload.hasCompanyLawyer }));
                  setModalStage('foundJobDone'); // left-path completion
                }}
              />
            ))}

          {modalStage === 'foundJobDone' && (
            <FoundJobCompleteStep
              hasCompanyLawyer={!!foundJobData.hasCompanyLawyer}
              onFinish={() => {
                setShowCancelModal(false);
                console.log('Finish clicked');
              }}
              onClose={() => setShowCancelModal(false)}
            />
          )}

          {/* ---------- RIGHT PATH (Still looking) ---------- */}
          {modalStage === 'downsell' && (
            <DownsellStep
              onBack={() => {
                setModalStage('initial');
              }}
              onAccept={() => {
                // Accept offer → roles, then close on continue
                setModalStage('roles');
              }}
              onDecline={() => {
                // Declined → go to survey (ReasonStep)
                setModalStage('reason');
              }}
            />
          )}

          {modalStage === 'roles' && (
            <SuggestedRolesStep
              onBack={() => setModalStage('downsell')}
              onContinue={() => {
                // Terminal screen for the "accept offer" path
                setShowCancelModal(false);
              }}
            />
          )}

          {modalStage === 'reason' && (
            <ReasonStep
              onBack={() => {
                setModalStage(sawDownsellThisSession ? 'downsell' : 'initial');
              }}
              onNext={() => {
                setModalStage('finalReason'); // single modal with internal states
              }}
            />
          )}

          {modalStage === 'finalReason' && (
            <FinalReasonStep
              onBack={() => setModalStage('reason')}
              onComplete={(payload) => {
                console.log('Final cancel payload (right path):', payload);
                setModalStage('done');
              }}
            />
          )}

          {modalStage === 'done' && (
            <CancelCompleteStep
              onBack={() => setModalStage('initial')}
              onJobs={() => {
                setShowCancelModal(false);
                console.log('Back to jobs');
              }}
              onClose={() => setShowCancelModal(false)}
              endDate={
                mockSubscriptionData.currentPeriodEnd
                  ? new Date(mockSubscriptionData.currentPeriodEnd).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'XX date'
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
