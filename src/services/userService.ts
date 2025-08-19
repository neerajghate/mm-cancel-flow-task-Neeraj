// User Service - Handles user data and business logic
import type { 
  UserData, 
  SubscriptionData, 
  UserSettings, 
  PaymentMethod, 
  Invoice,
  FoundJobPayload
} from '../hooks/useCancelFlow';

// Mock data - In production, this would come from your backend API
const mockUser: UserData = {
  email: 'user@example.com',
  id: '1'
};

const mockSubscriptionData: SubscriptionData = {
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

export class UserService {
  static async getUserData(): Promise<UserData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUser;
  }

  static async getSubscriptionData(): Promise<SubscriptionData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockSubscriptionData;
  }

  static async signOut(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In production, this would call your backend to invalidate the session
    console.log('User signed out');
  }

  static async updateSettings(settings: UserSettings): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // In production, this would call your backend to update user settings
    console.log('Settings updated:', settings);
  }

  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In production, this would call your backend to get payment methods
    return [
      { id: '1', type: 'card', last4: '4242', brand: 'visa', expiryMonth: 12, expiryYear: 2025 }
    ];
  }

  static async getInvoiceHistory(): Promise<Invoice[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In production, this would call your backend to get invoice history
    return [
      { id: '1', amount: 25, status: 'paid', date: '2024-01-01' },
      { id: '2', amount: 25, status: 'paid', date: '2023-12-01' }
    ];
  }
}

export class SubscriptionService {
  static async cancelSubscription(reason: string, feedback?: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In production, this would call your backend to cancel the subscription
    console.log('Subscription cancelled:', { reason, feedback });
  }

  static async acceptDownsellOffer(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In production, this would call your backend to accept the downsell offer
    console.log('Downsell offer accepted');
  }

  static async getSuggestedRoles(): Promise<Array<{ id: string; title: string; company: string; location: string }>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    // In production, this would call your backend to get suggested roles
    return [
      { id: '1', title: 'Software Engineer', company: 'Tech Corp', location: 'Remote' },
      { id: '2', title: 'Product Manager', company: 'Startup Inc', location: 'San Francisco' },
      { id: '3', title: 'Data Scientist', company: 'AI Labs', location: 'New York' }
    ];
  }

  static async submitFoundJobData(data: FoundJobPayload): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // In production, this would call your backend to submit found job data
    console.log('Found job data submitted:', data);
  }
}

export class AnalyticsService {
  static async trackABTest(bucket: 'A' | 'B'): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    // In production, this would call your analytics service
    console.log('AB test tracked:', bucket);
  }

  static async trackAction(action: string, data?: Record<string, unknown>): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    // In production, this would call your analytics service
    console.log('Action tracked:', action, data);
  }

  static async trackFormCompletion(formType: string, data: Record<string, unknown>): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    // In production, this would call your analytics service
    console.log('Form completion tracked:', formType, data);
  }
}
