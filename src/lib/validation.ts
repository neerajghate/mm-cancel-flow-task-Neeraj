import { z } from 'zod';

// ============================================================================
// INPUT VALIDATION SCHEMAS
// ============================================================================

// User input validation
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .min(1, 'Email is required');

// Cancellation reason validation
export const cancellationReasonSchema = z.string()
  .min(1, 'Reason is required')
  .max(1000, 'Reason too long (max 1000 characters)')
  .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Invalid characters in reason (only letters, numbers, spaces, and basic punctuation allowed)');

// Found job data validation
export const foundJobDataSchema = z.object({
  foundWithMate: z.enum(['Yes', 'No'], {
    errorMap: () => ({ message: 'Please select either Yes or No' })
  }),
  appsApplied: z.string()
    .max(500, 'Too many characters (max 500)')
    .optional(),
  companiesEmailed: z.string()
    .max(500, 'Too many characters (max 500)')
    .optional(),
  companiesInterviewed: z.string()
    .max(500, 'Too many characters (max 500)')
    .optional(),
  feedback: z.string()
    .max(1000, 'Feedback too long (max 1000 characters)')
    .optional(),
  hasCompanyLawyer: z.boolean().optional(),
  visa: z.string()
    .max(100, 'Visa type too long (max 100 characters)')
    .optional()
});

// A/B bucket validation
export const abBucketSchema = z.enum(['A', 'B'], {
  errorMap: () => ({ message: 'Invalid A/B bucket value' })
});

// Monthly price validation
export const monthlyPriceSchema = z.number()
  .positive('Price must be positive')
  .max(10000, 'Price too high (max $10,000)');

// User settings validation
export const userSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  profileVisibility: z.enum(['public', 'private'], {
    errorMap: () => ({ message: 'Invalid profile visibility setting' })
  })
});

// Payment method validation
export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'bank'], {
    errorMap: () => ({ message: 'Invalid payment method type' })
  }),
  last4: z.string()
    .length(4, 'Last 4 digits must be exactly 4 characters')
    .regex(/^\d{4}$/, 'Last 4 digits must be numbers only'),
  brand: z.string().optional(),
  expiryMonth: z.number()
    .min(1, 'Invalid expiry month')
    .max(12, 'Invalid expiry month')
    .optional(),
  expiryYear: z.number()
    .min(new Date().getFullYear(), 'Expiry year cannot be in the past')
    .max(new Date().getFullYear() + 20, 'Expiry year too far in the future')
    .optional()
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validateCancellationReason(reason: string): boolean {
  return cancellationReasonSchema.safeParse(reason).success;
}

export function validateFoundJobData(data: unknown): boolean {
  return foundJobDataSchema.safeParse(data).success;
}

export function validateABBucket(bucket: string): boolean {
  return abBucketSchema.safeParse(bucket).success;
}

export function validateMonthlyPrice(price: number): boolean {
  return monthlyPriceSchema.safeParse(price).success;
}

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email
    .trim()
    .toLowerCase()
    .substring(0, 255);
}

export function sanitizeReason(reason: string): string {
  return reason
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .substring(0, 1000); // Limit length
}

export function sanitizeFoundJobData(data: Record<string, unknown>): Record<string, unknown> {
  if (!data) return data;
  
  return {
    ...data,
    appsApplied: data.appsApplied ? sanitizeString(String(data.appsApplied)) : undefined,
    companiesEmailed: data.companiesEmailed ? sanitizeString(String(data.companiesEmailed)) : undefined,
    companiesInterviewed: data.companiesInterviewed ? sanitizeString(String(data.companiesInterviewed)) : undefined,
    feedback: data.feedback ? sanitizeString(String(data.feedback)) : undefined,
    visa: data.visa ? sanitizeString(String(data.visa)) : undefined
  };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function getValidationErrors(schema: z.ZodSchema<unknown>, data: unknown): string[] {
  try {
    schema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => err.message);
    }
    return ['Validation failed'];
  }
}

export function isFieldValid(fieldName: string, value: unknown, schema: z.ZodSchema<unknown>): boolean {
  try {
    schema.parse(value);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// EXPORT ALL SCHEMAS
// ============================================================================

export const validationSchemas = {
  email: emailSchema,
  cancellationReason: cancellationReasonSchema,
  foundJobData: foundJobDataSchema,
  abBucket: abBucketSchema,
  monthlyPrice: monthlyPriceSchema,
  userSettings: userSettingsSchema,
  paymentMethod: paymentMethodSchema
};
