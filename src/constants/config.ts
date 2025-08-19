// Configuration constants - Centralized business logic and configuration values

// A/B Testing Configuration
export const AB_TESTING_CONFIG = {
  // Toggle while testing A/B: force showing downsell on "Not yet"
  FORCE_DOWNSELL: false,
  
  // A/B test bucket storage key
  STORAGE_KEY: 'mm_cancel_ab',
  
  // Default bucket distribution (50/50)
  DEFAULT_DISTRIBUTION: 0.5,
  
  // Variant pricing
  VARIANTS: {
    A: {
      name: '50% off',
      discount: 50,
      prices: {
        25: 12.50,
        29: 14.50
      }
    },
    B: {
      name: '$10 off',
      discount: 'fixed',
      prices: {
        25: 15,
        29: 19
      }
    }
  }
} as const;

// Modal Configuration
export const MODAL_CONFIG = {
  // Z-index for modal overlay
  OVERLAY_Z_INDEX: 100,
  
  // Z-index for modal content
  CONTENT_Z_INDEX: 110,
  
  // Backdrop opacity
  BACKDROP_OPACITY: 50, // 50%
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  // Minimum characters for feedback text
  MIN_FEEDBACK_LENGTH: 25,
  
  // Minimum characters for reason text
  MIN_REASON_LENGTH: 25,
  
  // Required fields for different form types
  REQUIRED_FIELDS: {
    foundJob: ['foundWithMate'],
    feedback: ['feedback'],
    reason: ['reason'],
    visa: ['visa'],
  },
} as const;

// Business Logic Constants
export const BUSINESS_CONFIG = {
  // Subscription pricing
  SUBSCRIPTION: {
    MONTHLY_PRICE: 25,
    DOWNSELL_PRICE: 12.50,
    DOWNSELL_DISCOUNT: 50, // 50%
  },
  
  // A/B test buckets
  AB_BUCKETS: {
    A: 'A', // sees downsell
    B: 'B', // skips downsell
  } as const,
  
  // Modal stages for routing
  MODAL_STAGES: {
    INITIAL: 'initial',
    DOWNSELL: 'downsell',
    ROLES: 'roles',
    REASON: 'reason',
    FINAL_REASON: 'finalReason',
    DONE: 'done',
    FOUND_JOB_1: 'foundJob1',
    FOUND_JOB_2: 'foundJob2',
    FOUND_JOB_3: 'foundJob3',
    FOUND_JOB_DONE: 'foundJobDone',
  } as const,
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  USER: {
    PROFILE: '/api/user/profile',
    SUBSCRIPTION: '/api/user/subscription',
    SETTINGS: '/api/user/settings',
    PAYMENT_METHODS: '/api/user/payment-methods',
    INVOICES: '/api/user/invoices',
  },
  SUBSCRIPTION: {
    CANCEL: '/api/subscription/cancel',
    DOWNSELL_ACCEPT: '/api/subscription/downsell-accept',
  },
  JOBS: {
    SUGGESTED: '/api/jobs/suggested',
  },
  ANALYTICS: {
    TRACK: '/api/analytics/track',
    AB_TEST: '/api/analytics/ab-test',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AB_TEST_BUCKET: 'mm_cancel_ab',
  USER_PREFERENCES: 'mm_user_preferences',
  FORM_DATA: 'mm_form_data',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    MIN_LENGTH: (min: number) => `Please enter at least ${min} characters`,
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PRICE: 'Please enter a valid price',
  },
  API: {
    NETWORK_ERROR: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SUBSCRIPTION_CANCELLED: 'Your subscription has been cancelled successfully.',
  DOWNSELL_ACCEPTED: 'Your discount has been applied successfully.',
  SETTINGS_UPDATED: 'Your settings have been updated successfully.',
  FORM_SUBMITTED: 'Your information has been submitted successfully.',
} as const;
