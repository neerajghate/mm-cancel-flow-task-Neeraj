// ============================================================================
// PERSISTENCE LAYER INTERFACE & IMPLEMENTATION
// ============================================================================

export interface PersistenceLayer {
  saveUsers(users: unknown[]): void;
  loadUsers(): unknown[];
  saveSubscriptions(subscriptions: unknown[]): void;
  loadSubscriptions(): unknown[];
  saveCancellations(cancellations: unknown[]): void;
  loadCancellations(): unknown[];
  saveCSRFTokens(tokens: Map<string, unknown>): void;
  loadCSRFTokens(): Map<string, unknown>;
  clearAll(): void;
  hasData(): boolean;
  getVersion(): string;
  setVersion(version: string): void;
  needsMigration(): boolean;
  migrateData(): void;
  initializeWithSeedData(seedData: {
    users: unknown[];
    subscriptions: unknown[];
    cancellations: unknown[];
  }): void;
}

export class LocalStoragePersistence implements PersistenceLayer {
  private readonly STORAGE_KEYS = {
    USERS: 'secure_db_users',
    SUBSCRIPTIONS: 'secure_db_subscriptions',
    CANCELLATIONS: 'secure_db_cancellations',
    CSRF_TOKENS: 'secure_db_csrf_tokens',
    VERSION: 'secure_db_version'
  };

  private readonly CURRENT_VERSION = '1.0.0';
  private readonly ENCRYPTION_KEY = 'secure_db_key_2024';

  // ============================================================================
  // ENCRYPTION HELPERS
  // ============================================================================

  private encrypt(data: string): string {
    try {
      // Simple XOR encryption for demo purposes
      // In production, use proper encryption libraries
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to plain text
    }
  }

  private decrypt(encryptedData: string): string {
    try {
      // Decrypt the data
      const decoded = atob(encryptedData); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to encrypted data
    }
  }

  // ============================================================================
  // STORAGE OPERATIONS
  // ============================================================================

  saveUsers(users: unknown[]): void {
    if (typeof window === 'undefined') return;
    try {
      const encrypted = this.encrypt(JSON.stringify(users));
      localStorage.setItem(this.STORAGE_KEYS.USERS, encrypted);
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  loadUsers(): unknown[] {
    if (typeof window === 'undefined') return [];
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEYS.USERS);
      if (!encrypted) return [];
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  }

  saveSubscriptions(subscriptions: unknown[]): void {
    if (typeof window === 'undefined') return;
    try {
      const encrypted = this.encrypt(JSON.stringify(subscriptions));
      localStorage.setItem(this.STORAGE_KEYS.SUBSCRIPTIONS, encrypted);
    } catch (error) {
      console.error('Failed to save subscriptions:', error);
    }
  }

  loadSubscriptions(): unknown[] {
    if (typeof window === 'undefined') return [];
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEYS.SUBSCRIPTIONS);
      if (!encrypted) return [];
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      return [];
    }
  }

  saveCancellations(cancellations: unknown[]): void {
    if (typeof window === 'undefined') return;
    try {
      const encrypted = this.encrypt(JSON.stringify(cancellations));
      localStorage.setItem(this.STORAGE_KEYS.CANCELLATIONS, encrypted);
    } catch (error) {
      console.error('Failed to save cancellations:', error);
    }
  }

  loadCancellations(): unknown[] {
    if (typeof window === 'undefined') return [];
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEYS.CANCELLATIONS);
      if (!encrypted) return [];
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to load cancellations:', error);
      return [];
    }
  }

  saveCSRFTokens(tokens: Map<string, unknown>): void {
    if (typeof window === 'undefined') return;
    try {
      const tokensArray = Array.from(tokens.entries());
      const encrypted = this.encrypt(JSON.stringify(tokensArray));
      localStorage.setItem(this.STORAGE_KEYS.CSRF_TOKENS, encrypted);
    } catch (error) {
      console.error('Failed to save CSRF tokens:', error);
    }
  }

  loadCSRFTokens(): Map<string, unknown> {
    if (typeof window === 'undefined') return new Map();
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEYS.CSRF_TOKENS);
      if (!encrypted) return new Map();
      
      const decrypted = this.decrypt(encrypted);
      const tokensArray = JSON.parse(decrypted);
      return new Map(tokensArray);
    } catch (error) {
      console.error('Failed to load CSRF tokens:', error);
      return new Map();
    }
  }

  // ============================================================================
  // VERSION MANAGEMENT
  // ============================================================================

  getVersion(): string {
    if (typeof window === 'undefined') return '0.0.0';
    return localStorage.getItem(this.STORAGE_KEYS.VERSION) || '0.0.0';
  }

  setVersion(version: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.VERSION, version);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  hasData(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(localStorage.getItem(this.STORAGE_KEYS.USERS) || 
              localStorage.getItem(this.STORAGE_KEYS.SUBSCRIPTIONS) ||
              localStorage.getItem(this.STORAGE_KEYS.CANCELLATIONS));
  }

  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('All persistent data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  // ============================================================================
  // MIGRATION & INITIALIZATION
  // ============================================================================

  initializeWithSeedData(seedData: {
    users: unknown[];
    subscriptions: unknown[];
    cancellations: unknown[];
  }): void {
    try {
      this.saveUsers(seedData.users);
      this.saveSubscriptions(seedData.subscriptions);
      this.saveCancellations(seedData.cancellations);
      this.setVersion(this.CURRENT_VERSION);
      console.log('Persistent storage initialized with seed data');
    } catch (error) {
      console.error('Failed to initialize with seed data:', error);
    }
  }

  needsMigration(): boolean {
    const currentVersion = this.getVersion();
    return currentVersion !== this.CURRENT_VERSION;
  }

  migrateData(): void {
    try {
      // For now, just clear and reinitialize
      // In production, you'd implement proper migration logic
      this.clearAll();
      console.log('Data migration completed');
    } catch (error) {
      console.error('Data migration failed:', error);
    }
  }
}
