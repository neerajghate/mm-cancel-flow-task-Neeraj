// Configuration constants - Centralized business logic and configuration values

export const AB_TESTING_CONFIG = {
  DEFAULT_DISTRIBUTION: 0.5, // 50% chance for each bucket
  FORCE_DOWNSELL: false, // Toggle while testing A/B: force showing downsell on "Not yet"
} as const;

export const MODAL_CONFIG = {
  SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
    FULL: 'full',
  },
  BACKDROP_BEHAVIOR: {
    CLOSE_ON_CLICK: true,
    SHOW_BACKDROP: true,
  },
} as const;

export const VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    REASON: true,
    FEEDBACK: false,
    COMPANY_NAME: true,
  },
  MIN_LENGTH: {
    REASON: 10,
    FEEDBACK: 5,
  },
  MAX_LENGTH: {
    REASON: 500,
    FEEDBACK: 1000,
  },
} as const;

export const BUSINESS_CONFIG = {
  AB_BUCKETS: {
    A: 'A', // sees downsell
    B: 'B', // skips downsell
  },
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
  },
  SUBSCRIPTION: {
    TRIAL_PERIOD_DAYS: 30,
    DEFAULT_MONTHLY_PRICE: 25,
    CANCELLATION_GRACE_PERIOD_DAYS: 7,
  },
  ANALYTICS: {
    TRACK_USER_ACTIONS: true,
    TRACK_FORM_COMPLETIONS: true,
    TRACK_AB_TESTING: true,
  },
} as const;

export const API_ENDPOINTS = {
  USER: {
    PROFILE: '/api/user/profile',
    SUBSCRIPTION: '/api/user/subscription',
    SETTINGS: '/api/user/settings',
    PAYMENT_METHODS: '/api/user/payment-methods',
    INVOICE_HISTORY: '/api/user/invoices',
  },
  SUBSCRIPTION: {
    CANCEL: '/api/subscription/cancel',
    DOWNSELL_ACCEPT: '/api/subscription/downsell-accept',
    SUGGESTED_ROLES: '/api/subscription/suggested-roles',
  },
  ANALYTICS: {
    TRACK: '/api/analytics/track',
    AB_TEST: '/api/analytics/ab-test',
    FORM_COMPLETION: '/api/analytics/form-completion',
  },
} as const;

export const STORAGE_KEYS = {
  AB_TEST_BUCKET: 'mm_cancel_ab',
  USER_PREFERENCES: 'mm_user_preferences',
  FORM_DRAFTS: 'mm_form_drafts',
  SESSION_DATA: 'mm_session_data',
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: {
    REQUIRED: 'This field is required.',
    MIN_LENGTH: (min: number) => `Must be at least ${min} characters.`,
    MAX_LENGTH: (max: number) => `Must be no more than ${max} characters.`,
  },
  SUBSCRIPTION: {
    CANCELLATION_FAILED: 'Failed to cancel subscription. Please try again.',
    DOWNSELL_FAILED: 'Failed to process downsell offer. Please try again.',
  },
} as const;

export const SUCCESS_MESSAGES = {
  SUBSCRIPTION: {
    CANCELLED: 'Your subscription has been cancelled successfully.',
    DOWNSELL_ACCEPTED: 'Your downsell offer has been accepted.',
  },
  FORM: {
    SUBMITTED: 'Form submitted successfully.',
    SAVED: 'Your information has been saved.',
  },
} as const;
