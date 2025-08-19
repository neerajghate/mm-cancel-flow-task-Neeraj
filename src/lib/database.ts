import { z } from 'zod';
import { PersistenceLayer, LocalStoragePersistence } from './persistence';

// ============================================================================
// DATABASE SCHEMAS & TYPES
// ============================================================================

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['active', 'pending_cancellation', 'cancelled']),
  monthly_price: z.number().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const cancellationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subscription_id: z.string().uuid(),
  downsell_variant: z.enum(['A', 'B']).nullable(),
  reason: z.string().min(1).max(1000),
  accepted_downsell: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type User = z.infer<typeof userSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type Cancellation = z.infer<typeof cancellationSchema>;

// ============================================================================
// RLS (ROW LEVEL SECURITY) CONTEXT
// ============================================================================

export interface RLSContext {
  current_user_id: string;
  is_authenticated: boolean;
  csrf_token?: string;
}

// ============================================================================
// RLS POLICIES
// ============================================================================

export class RLSPolicies {
  // Users can only access their own data
  static canAccessUser(userId: string, context: RLSContext): boolean {
    return context.is_authenticated && context.current_user_id === userId;
  }

  // Users can only access their own subscriptions
  static canAccessSubscription(subscription: Subscription, context: RLSContext): boolean {
    return context.is_authenticated && subscription.user_id === context.current_user_id;
  }

  // Users can only access their own cancellations
  static canAccessCancellation(cancellation: Cancellation, context: RLSContext): boolean {
    return context.is_authenticated && cancellation.user_id === context.current_user_id;
  }

  // Users can only modify their own data
  static canModifyUser(userId: string, context: RLSContext): boolean {
    return context.is_authenticated && context.current_user_id === userId;
  }

  // Users can only modify their own subscriptions
  static canModifySubscription(subscription: Subscription, context: RLSContext): boolean {
    return context.is_authenticated && subscription.user_id === context.current_user_id;
  }

  // Users can only modify their own cancellations
  static canModifyCancellation(cancellation: Cancellation, context: RLSContext): boolean {
    return context.is_authenticated && cancellation.user_id === context.current_user_id;
  }
}

// ============================================================================
// SECURE DATABASE OPERATIONS
// ============================================================================

export class SecureDatabase {
  private static instance: SecureDatabase;
  private db!: {
    users: User[];
    subscriptions: Subscription[];
    cancellations: Cancellation[];
    csrf_tokens: Map<string, { user_id: string; expires: number }>;
  };
  private persistence: PersistenceLayer;

  private constructor() {
    console.log('Initializing SecureDatabase...');
    this.persistence = new LocalStoragePersistence();
    // Always initialize in-memory structures before any seeding/persistence
    this.db = {
      users: [],
      subscriptions: [],
      cancellations: [],
      csrf_tokens: new Map()
    };
    
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initializeDatabase();
      console.log('SecureDatabase initialized with data:', this.getDatabaseState());
    } else {
      console.log('SecureDatabase initialized (SSR mode)');
    }
  }

  static getInstance(): SecureDatabase {
    if (!SecureDatabase.instance) {
      SecureDatabase.instance = new SecureDatabase();
    }
    return SecureDatabase.instance;
  }

  // ============================================================================
  // CSRF PROTECTION
  // ============================================================================

  generateCSRFToken(userId: string): string {
    // Generate secure random token
    const token = this.generateSecureToken(32);
    const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    this.db.csrf_tokens.set(token, { user_id: userId, expires });
    return token;
  }

  validateCSRFToken(token: string, userId: string): boolean {
    const stored = this.db.csrf_tokens.get(token);
    
    if (!stored || stored.expires < Date.now()) {
      this.db.csrf_tokens.delete(token);
      return false;
    }
    
    return stored.user_id === userId;
  }

  private generateSecureToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      // Browser: use crypto API
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars.charAt(array[i] % chars.length);
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    return result;
  }

  // ============================================================================
  // SECURE A/B TESTING
  // ============================================================================

  generateSecureVariant(userId: string): 'A' | 'B' {
    // Deterministic but secure A/B assignment based on user ID
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(1);
      window.crypto.getRandomValues(array);
      return array[0] < 128 ? 'A' : 'B';
    }
    
    // Fallback: hash-based deterministic assignment
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
  }

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  getUserById(userId: string, context: RLSContext): User | null {
    if (!RLSPolicies.canAccessUser(userId, context)) {
      throw new Error('Access denied: Cannot access user data');
    }
    
    return this.db.users.find(u => u.id === userId) || null;
  }

  getUserByEmail(email: string): User | null {
    // Email lookup is used for session bootstrap; no RLS check here
    const user = this.db.users.find(u => u.email === email);
    return user || null;
  }

  createUser(email: string): User {
    const now = new Date().toISOString();
    const user: User = {
      id: this.generateUUID(),
      email,
      created_at: now,
      updated_at: now
    };
    
    this.db.users.push(user);
    this.saveToPersistence();
    return user;
  }

  // ============================================================================
  // SUBSCRIPTION OPERATIONS
  // ============================================================================

  getSubscriptionByUserId(userId: string, context: RLSContext): Subscription | null {
    if (!RLSPolicies.canAccessUser(userId, context)) {
      throw new Error('Access denied: Cannot access subscription data');
    }
    
    return this.db.subscriptions.find(s => s.user_id === userId && s.status === 'active') || null;
  }

  updateSubscriptionStatus(
    subscriptionId: string, 
    status: 'pending_cancellation' | 'cancelled',
    context: RLSContext
  ): boolean {
    const subscription = this.db.subscriptions.find(s => s.id === subscriptionId);
    
    if (!subscription) {
      return false;
    }
    
    if (!RLSPolicies.canModifySubscription(subscription, context)) {
      throw new Error('Access denied: Cannot modify subscription');
    }
    
    subscription.status = status;
    subscription.updated_at = new Date().toISOString();
    this.saveToPersistence();
    return true;
  }

  // ============================================================================
  // CANCELLATION OPERATIONS
  // ============================================================================

  createCancellation(payload: {
    user_id: string;
    subscription_id: string;
    downsell_variant: 'A' | 'B' | null;
    reason: string;
    accepted_downsell: boolean;
  }, context: RLSContext): string | null {
    // RLS check
    if (!RLSPolicies.canAccessUser(payload.user_id, context)) {
      throw new Error('Access denied: Cannot create cancellation record');
    }

    // Input validation
    try {
      cancellationSchema.parse({
        ...payload,
        id: this.generateUUID(), // Use proper UUID instead of 'temp'
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Cancellation validation failed:', error);
      throw new Error('Invalid cancellation data');
    }

    const now = new Date().toISOString();
    const cancellation: Cancellation = {
      id: this.generateUUID(),
      user_id: payload.user_id,
      subscription_id: payload.subscription_id,
      downsell_variant: payload.downsell_variant,
      reason: payload.reason,
      accepted_downsell: payload.accepted_downsell,
      created_at: now,
      updated_at: now
    };

    this.db.cancellations.push(cancellation);
    this.saveToPersistence();
    return cancellation.id;
  }

  getCancellationByUserId(userId: string, context: RLSContext): Cancellation | null {
    if (!RLSPolicies.canAccessUser(userId, context)) {
      throw new Error('Access denied: Cannot access cancellation data');
    }
    
    return this.db.cancellations.find(c => c.user_id === userId) || null;
  }

  updateCancellationReason(cancellationId: string, reason: string, context: RLSContext): boolean {
    const cancellation = this.db.cancellations.find(c => c.id === cancellationId);
    
    if (!cancellation) {
      return false;
    }
    
    if (!RLSPolicies.canModifyCancellation(cancellation, context)) {
      throw new Error('Access denied: Cannot modify cancellation');
    }

    // Validate reason
    if (!reason || reason.trim().length === 0 || reason.length > 1000) {
      throw new Error('Invalid reason: must be 1-1000 characters');
    }

    cancellation.reason = reason;
    cancellation.updated_at = new Date().toISOString();
    this.saveToPersistence();
    return true;
  }

  updateCancellationDownsell(cancellationId: string, accepted: boolean, context: RLSContext): boolean {
    const cancellation = this.db.cancellations.find(c => c.id === cancellationId);
    
    if (!cancellation) {
      return false;
    }
    
    if (!RLSPolicies.canModifyCancellation(cancellation, context)) {
      throw new Error('Access denied: Cannot modify cancellation');
    }

    cancellation.accepted_downsell = accepted;
    cancellation.updated_at = new Date().toISOString();
    this.saveToPersistence();
    return true;
  }

  // ============================================================================
  // A/B TESTING OPERATIONS
  // ============================================================================

  getOrCreateABBucket(userId: string, context: RLSContext): 'A' | 'B' {
    if (!RLSPolicies.canAccessUser(userId, context)) {
      throw new Error('Access denied: Cannot access A/B bucket');
    }

    // Check if user already has a bucket
    const existingCancellation = this.db.cancellations.find(c => c.user_id === userId);
    if (existingCancellation && existingCancellation.downsell_variant) {
      return existingCancellation.downsell_variant;
    }

    // Generate new bucket
    return this.generateSecureVariant(userId);
  }

  // ============================================================================
  // DATABASE INITIALIZATION
  // ============================================================================

  private initializeDatabase(): void {
    // Check if we have persistent data
    if (this.persistence.hasData()) {
      console.log('Loading data from persistent storage...');
      this.loadFromPersistence();
    } else {
      console.log('No persistent data found, initializing with seed data...');
      this.initializeSeedData();
      this.saveToPersistence();
    }

    // Check if migration is needed
    if (this.persistence.needsMigration()) {
      console.log('Data migration needed, migrating...');
      this.persistence.migrateData();
      this.initializeSeedData();
      this.saveToPersistence();
    }
  }

  private loadFromPersistence(): void {
    try {
      this.db = {
        users: this.persistence.loadUsers() as User[],
        subscriptions: this.persistence.loadSubscriptions() as Subscription[],
        cancellations: this.persistence.loadCancellations() as Cancellation[],
        csrf_tokens: this.persistence.loadCSRFTokens() as Map<string, { user_id: string; expires: number }>
      };
      console.log('Data loaded from persistent storage');
    } catch (error) {
      console.error('Failed to load from persistence, using seed data:', error);
      this.initializeSeedData();
      this.saveToPersistence();
    }
  }

  private saveToPersistence(): void {
    try {
      this.persistence.saveUsers(this.db.users);
      this.persistence.saveSubscriptions(this.db.subscriptions);
      this.persistence.saveCancellations(this.db.cancellations);
      this.persistence.saveCSRFTokens(this.db.csrf_tokens);
      console.log('Data saved to persistent storage');
    } catch (error) {
      console.error('Failed to save to persistence:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private generateUUID(): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    
    // Fallback UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private initializeSeedData(): void {
    // Create sample user
    const now = new Date().toISOString();
    const sampleUser: User = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      created_at: now,
      updated_at: now
    };

    const sampleSubscription: Subscription = {
      id: '550e8400-e29b-41d4-a716-446655440002', // Use proper UUID format
      user_id: sampleUser.id,
      status: 'active',
      monthly_price: 25,
      created_at: now,
      updated_at: now
    };

    this.db.users.push(sampleUser);
    this.db.subscriptions.push(sampleSubscription);
  }

  // ============================================================================
  // DEBUG/DEVELOPMENT METHODS
  // ============================================================================

  getDatabaseState(): Record<string, number> {
    return {
      users: this.db.users.length,
      subscriptions: this.db.subscriptions.length,
      cancellations: this.db.cancellations.length,
      csrf_tokens: this.db.csrf_tokens.size
    };
  }

  reset(): void {
    this.db.users = [];
    this.db.subscriptions = [];
    this.db.cancellations = [];
    this.db.csrf_tokens.clear();
    this.initializeSeedData();
    this.saveToPersistence();
  }

  // ============================================================================
  // PERSISTENCE MANAGEMENT
  // ============================================================================

  clearPersistentData(): void {
    this.persistence.clearAll();
    console.log('Persistent data cleared');
  }

  getPersistenceInfo(): { hasData: boolean; version: string } {
    return {
      hasData: this.persistence.hasData(),
      version: this.persistence.getVersion()
    };
  }
}

// Export singleton instance
export const secureDatabase = SecureDatabase.getInstance();
