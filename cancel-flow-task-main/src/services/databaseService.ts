import { ABBucket, FoundJobPayload } from '../hooks/useCancelFlow';
import { LocalDb } from '../lib/localDb';

// Types for database operations
export interface DatabaseUser {
  id: string;
  email: string;
  created_at: string;
}

export interface DatabaseSubscription {
  id: string;
  user_id: string;
  monthly_price: number;
  status: 'active' | 'pending_cancellation' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DatabaseCancellation {
  id: string;
  user_id: string;
  subscription_id: string;
  downsell_variant: ABBucket;
  reason?: string;
  accepted_downsell: boolean;
  created_at: string;
}

export interface CreateCancellationPayload {
  user_id: string;
  subscription_id: string;
  downsell_variant: ABBucket;
  reason?: string;
  accepted_downsell: boolean;
}

export interface UpdateSubscriptionPayload {
  status: 'pending_cancellation' | 'cancelled';
}

export class DatabaseService {

  // User operations
  static async getUserById(userId: string): Promise<DatabaseUser | null> {
    const db = LocalDb.read();
    return db.users.find(u => u.id === userId) || null;
  }

  static async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const db = LocalDb.read();
    return db.users.find(u => u.email === email) || null;
  }

  // Subscription operations
  static async getSubscriptionByUserId(userId: string): Promise<DatabaseSubscription | null> {
    const db = LocalDb.read();
    return db.subscriptions.find(s => s.user_id === userId && s.status === 'active') || null;
  }

  static async updateSubscriptionStatus(
    subscriptionId: string, 
    payload: UpdateSubscriptionPayload
  ): Promise<boolean> {
    const db = LocalDb.read();
    const subIndex = db.subscriptions.findIndex(s => s.id === subscriptionId);
    if (subIndex === -1) return false;
    db.subscriptions[subIndex].status = payload.status;
    db.subscriptions[subIndex].updated_at = new Date().toISOString();
    LocalDb.write(db);
    return true;
  }

  // Cancellation operations
  static async createCancellation(payload: CreateCancellationPayload): Promise<string | null> {
    const db = LocalDb.read();
    const id = LocalDb.uuid();
    const record: DatabaseCancellation = {
      id,
      user_id: payload.user_id,
      subscription_id: payload.subscription_id,
      downsell_variant: payload.downsell_variant,
      reason: payload.reason,
      accepted_downsell: payload.accepted_downsell,
      created_at: new Date().toISOString()
    };
    db.cancellations.unshift(record);
    LocalDb.write(db);
    return id;
  }

  static async getCancellationByUserId(userId: string): Promise<DatabaseCancellation | null> {
    const db = LocalDb.read();
    return db.cancellations.find(c => c.user_id === userId) || null;
  }

  // A/B Testing operations
  static async getOrCreateABBucket(userId: string): Promise<ABBucket> {
    const db = LocalDb.read();
    const existing = db.cancellations.find(c => c.user_id === userId);
    if (existing) return existing.downsell_variant;
    const bucket: ABBucket = Math.random() < 0.5 ? 'A' : 'B';
    const subscription = db.subscriptions.find(s => s.user_id === userId && s.status === 'active');
    if (!subscription) return bucket;
    await this.createCancellation({
      user_id: userId,
      subscription_id: subscription.id,
      downsell_variant: bucket,
      accepted_downsell: false
    });
    return bucket;
  }

  static async updateCancellationReason(
    cancellationId: string, 
    reason: string
  ): Promise<boolean> {
    const db = LocalDb.read();
    const idx = db.cancellations.findIndex(c => c.id === cancellationId);
    if (idx === -1) return false;
    db.cancellations[idx].reason = reason;
    LocalDb.write(db);
    return true;
  }

  static async updateCancellationDownsell(
    cancellationId: string, 
    accepted: boolean
  ): Promise<boolean> {
    const db = LocalDb.read();
    const idx = db.cancellations.findIndex(c => c.id === cancellationId);
    if (idx === -1) return false;
    db.cancellations[idx].accepted_downsell = accepted;
    LocalDb.write(db);
    return true;
  }

  // Found Job operations
  static async createFoundJobRecord(
    userId: string, 
    payload: FoundJobPayload
  ): Promise<string | null> {
    const subscription = await this.getSubscriptionByUserId(userId);
    if (!subscription) return null;
    const id = await this.createCancellation({
      user_id: userId,
      subscription_id: subscription.id,
      downsell_variant: 'A',
      reason: `FOUND_JOB: ${JSON.stringify(payload)}`,
      accepted_downsell: false
    });
    return id;
  }

  // Admin operations (using service role key)
  static async getAllCancellations(): Promise<DatabaseCancellation[]> {
    const db = LocalDb.read();
    return [...db.cancellations].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  static async getCancellationStats(): Promise<{
    total: number;
    variantA: number;
    variantB: number;
    acceptedDownsell: number;
    declinedDownsell: number;
  }> {
    const cancellations = await this.getAllCancellations();
    const variantA = cancellations.filter(c => c.downsell_variant === 'A').length;
    const variantB = cancellations.filter(c => c.downsell_variant === 'B').length;
    const acceptedDownsell = cancellations.filter(c => c.accepted_downsell).length;
    const declinedDownsell = cancellations.filter(c => !c.accepted_downsell).length;

    return {
      total: cancellations.length,
      variantA,
      variantB,
      acceptedDownsell,
      declinedDownsell
    };
  }
}
