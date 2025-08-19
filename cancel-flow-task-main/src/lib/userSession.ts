import { secureDatabase, RLSContext } from './database';

// ============================================================================
// USER SESSION MANAGEMENT
// ============================================================================

export class UserSession {
  private currentUserId: string | null = null;
  private csrfToken: string | null = null;
  
  // Debug instance properties
  debugProperties() {
    console.log('Debug instance properties:');
    console.log('  currentUserId:', this.currentUserId);
    console.log('  csrfToken:', this.csrfToken ? 'present' : 'null');
    console.log('  this:', this);
  }

  // ============================================================================
  // SESSION INITIALIZATION
  // ============================================================================

  initializeSession(): string {
    try {
      console.log('Initializing session...');
      this.debugProperties();
      
      // Get or create user (no RLS context needed for initial setup)
      const user = secureDatabase.getUserByEmail('user@example.com');
      console.log('User lookup result:', user);
      
      if (!user) {
        // Create new user if none exists
        console.log('Creating new user...');
        const newUser = secureDatabase.createUser('user@example.com');
        this.currentUserId = newUser.id;
        console.log('New user created with ID:', this.currentUserId);
      } else {
        this.currentUserId = user.id;
        console.log('Existing user found with ID:', this.currentUserId);
      }

      // Generate CSRF token
      this.csrfToken = secureDatabase.generateCSRFToken(this.currentUserId);
      console.log('CSRF token generated:', this.csrfToken ? 'success' : 'failed');
      
      console.log('Session initialized successfully. User ID:', this.currentUserId);
      this.debugProperties();
      return this.currentUserId;
    } catch (error) {
      console.error('Session initialization failed:', error);
      throw error;
    }
  }

  // ============================================================================
  // SESSION STATE
  // ============================================================================

  getCurrentUserId(): string {
    console.log('getCurrentUserId: Checking currentUserId:', this.currentUserId);
    if (!this.currentUserId) {
      console.error('getCurrentUserId: No active session. Call initializeSession() first.');
      throw new Error('No active session. Call initializeSession() first.');
    }
    console.log('getCurrentUserId: Returning user ID:', this.currentUserId);
    return this.currentUserId;
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  getCSRFToken(): string {
    if (!this.csrfToken) {
      throw new Error('No CSRF token available. Call initializeSession() first.');
    }
    return this.csrfToken;
  }

  // ============================================================================
  // RLS CONTEXT
  // ============================================================================

  getRLSContext(): RLSContext {
    try {
      console.log('getRLSContext: Getting current user ID...');
      const currentUserId = this.getCurrentUserId();
      console.log('getRLSContext: Current user ID:', currentUserId);
      
      const isAuthenticated = this.isAuthenticated();
      console.log('getRLSContext: Is authenticated:', isAuthenticated);
      
      const csrfToken = this.csrfToken || undefined;
      console.log('getRLSContext: CSRF token:', csrfToken ? 'present' : 'missing');
      
      const context = {
        current_user_id: currentUserId,
        is_authenticated: isAuthenticated,
        csrf_token: csrfToken
      };
      
      console.log('getRLSContext: Returning context:', context);
      return context;
    } catch (error) {
      console.error('getRLSContext failed:', error);
      throw error;
    }
  }

  // ============================================================================
  // USER DATA OPERATIONS
  // ============================================================================

  async getUserData() {
    try {
      console.log('getUserData: Getting RLS context...');
      const context = this.getRLSContext();
      console.log('getUserData: RLS context:', context);
      
      console.log('getUserData: Getting user by ID:', this.getCurrentUserId());
      const user = secureDatabase.getUserById(this.getCurrentUserId(), context);
      console.log('getUserData: User from database:', user);
      
      if (!user) {
        throw new Error('User not found');
      }

      const result = {
        email: user.email,
        id: user.id
      };
      console.log('getUserData: Returning user data:', result);
      return result;
    } catch (error) {
      console.error('getUserData failed:', error);
      throw error;
    }
  }

  async getSubscriptionData() {
    const context = this.getRLSContext();
    const subscription = secureDatabase.getSubscriptionByUserId(this.getCurrentUserId(), context);
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    return {
      id: subscription.id,
      status: subscription.status,
      isTrialSubscription: false, // Mock data for now
      cancelAtPeriodEnd: false,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyPrice: subscription.monthly_price,
      isUCStudent: false,
      hasManagedAccess: false,
      managedOrganization: null,
      downsellAccepted: false
    };
  }

  // ============================================================================
  // A/B TESTING OPERATIONS
  // ============================================================================

  async getOrCreateABBucket(): Promise<'A' | 'B'> {
    const context = this.getRLSContext();
    return secureDatabase.getOrCreateABBucket(this.getCurrentUserId(), context);
  }

  // ============================================================================
  // CANCELLATION OPERATIONS
  // ============================================================================

  async createCancellation(payload: {
    downsell_variant: 'A' | 'B' | null;
    reason: string;
    accepted_downsell: boolean;
  }): Promise<string | null> {
    const context = this.getRLSContext();
    const subscription = await this.getSubscriptionData();
    
    return secureDatabase.createCancellation({
      user_id: this.getCurrentUserId(),
      subscription_id: subscription.id,
      downsell_variant: payload.downsell_variant,
      reason: payload.reason,
      accepted_downsell: payload.accepted_downsell
    }, context);
  }

  async getCancellationByUserId(): Promise<unknown> {
    const context = this.getRLSContext();
    return secureDatabase.getCancellationByUserId(this.getCurrentUserId(), context);
  }

  async updateCancellationReason(cancellationId: string, reason: string): Promise<boolean> {
    const context = this.getRLSContext();
    return secureDatabase.updateCancellationReason(cancellationId, reason, context);
  }

  async updateCancellationDownsell(cancellationId: string, accepted: boolean): Promise<boolean> {
    const context = this.getRLSContext();
    return secureDatabase.updateCancellationDownsell(cancellationId, accepted, context);
  }

  // ============================================================================
  // SUBSCRIPTION OPERATIONS
  // ============================================================================

  async updateSubscriptionStatus(subscriptionId: string, status: 'pending_cancellation' | 'cancelled'): Promise<boolean> {
    const context = this.getRLSContext();
    return secureDatabase.updateSubscriptionStatus(subscriptionId, status, context);
  }

  // ============================================================================
  // SESSION CLEANUP
  // ============================================================================

  clearSession(): void {
    this.currentUserId = null;
    this.csrfToken = null;
  }

  // ============================================================================
  // DEBUG/DEVELOPMENT
  // ============================================================================

  getSessionInfo(): Record<string, unknown> {
    return {
      currentUserId: this.currentUserId,
      isAuthenticated: this.isAuthenticated(),
      hasCSRFToken: !!this.csrfToken,
      databaseState: secureDatabase.getDatabaseState()
    };
  }

  resetDatabase(): void {
    secureDatabase.reset();
    this.clearSession();
  }
}

// Export singleton instance
export const userSession = new UserSession();
