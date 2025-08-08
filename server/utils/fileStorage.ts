import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

// Storage directories
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_DIR = path.join(DATA_DIR, 'users');
const ANALYTICS_DIR = path.join(DATA_DIR, 'analytics');
const LOANS_DIR = path.join(DATA_DIR, 'loans');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await mkdir(USERS_DIR, { recursive: true });
    await mkdir(ANALYTICS_DIR, { recursive: true });
    await mkdir(LOANS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Initialize storage
ensureDirectories();

export interface UserProfile {
  userId: string;
  email: string;
  password: string; // In production, this should be hashed
  createdAt: string;
  lastLogin?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth: string;
    ssn: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  traditionalCredit: {
    hasCredit: 'yes' | 'no' | 'limited' | 'unsure';
    score?: number;
  };
  financialData: {
    employment: {
      employerName: string;
      jobTitle: string;
      annualSalary: number;
      startDate: string;
      employmentType: string;
      workAddress: string;
    };
    housing: {
      housingType: string;
      landlordName?: string;
      monthlyRent?: number;
      leaseStartDate?: string;
      rentPaymentHistory: Array<{
        date: string;
        amount: number;
        status: 'on-time' | 'late' | 'missed';
      }>;
    };
    banking: {
      bankName: string;
      accountType: string;
      routingNumber: string;
      monthlyIncome: number;
      monthlyExpenses: number;
      averageBalance: number;
    };
    utilities: Array<{
      provider: string;
      type: string;
      accountNumber: string;
      monthlyAmount: number;
      paymentHistory: Array<{
        date: string;
        amount: number;
        status: 'on-time' | 'late' | 'missed';
      }>;
    }>;
  };
  creditHistory: Array<{
    date: string;
    score: number;
    factors: {
      rentPayments: number;
      utilityPayments: number;
      cashFlow: number;
      employmentHistory: number;
      traditionalCredit: number;
    };
  }>;
  analytics: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    riskProfile: 'low' | 'medium' | 'high';
    loanEligibility: {
      creditCards: boolean;
      personalLoans: boolean;
      autoLoans: boolean;
      mortgages: boolean;
    };
  };
}

export interface LoanOffer {
  bankId: string;
  bankName: string;
  loanType: 'credit-card' | 'personal' | 'auto' | 'mortgage';
  productName: string;
  interestRate: number;
  maxAmount: number;
  terms: string;
  requirements: string[];
  approvalLikelihood: number;
  features: string[];
}

// File storage utilities
export class FileStorage {
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    const filePath = path.join(USERS_DIR, `${profile.userId}.json`);
    const data = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    // Also save to all users index
    await this.updateUsersIndex(profile.userId, profile.email);
  }

  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const filePath = path.join(USERS_DIR, `${userId}.json`);
      const data = await readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  static async findUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const indexPath = path.join(USERS_DIR, 'index.json');
      const indexData = await readFile(indexPath, 'utf8');
      const index = JSON.parse(indexData);
      
      const userId = index[email];
      if (userId) {
        return await this.loadUserProfile(userId);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static async updateUsersIndex(userId: string, email: string): Promise<void> {
    const indexPath = path.join(USERS_DIR, 'index.json');
    let index = {};
    
    try {
      const existingData = await readFile(indexPath, 'utf8');
      index = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist, start with empty index
    }
    
    index[email] = userId;
    await writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
  }

  static async saveAnalytics(userId: string, analytics: any): Promise<void> {
    const filePath = path.join(ANALYTICS_DIR, `${userId}.json`);
    const data = {
      userId,
      analytics,
      generatedAt: new Date().toISOString()
    };
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  static async loadAnalytics(userId: string): Promise<any | null> {
    try {
      const filePath = path.join(ANALYTICS_DIR, `${userId}.json`);
      const data = await readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  static async saveLoanOffers(userId: string, offers: LoanOffer[]): Promise<void> {
    const filePath = path.join(LOANS_DIR, `${userId}.json`);
    const data = {
      userId,
      offers,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  static async loadLoanOffers(userId: string): Promise<LoanOffer[] | null> {
    try {
      const filePath = path.join(LOANS_DIR, `${userId}.json`);
      const data = await readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      // Check if offers have expired
      if (new Date(parsed.expiresAt) < new Date()) {
        return null;
      }
      
      return parsed.offers;
    } catch (error) {
      return null;
    }
  }

  static async getAllUsers(): Promise<string[]> {
    try {
      const files = await promisify(fs.readdir)(USERS_DIR);
      return files
        .filter(file => file.endsWith('.json') && file !== 'index.json')
        .map(file => file.replace('.json', ''));
    } catch (error) {
      return [];
    }
  }

  static async getSystemStats(): Promise<any> {
    const userIds = await this.getAllUsers();
    const totalUsers = userIds.length;
    
    let totalScores = 0;
    let totalRatings = 0;
    
    for (const userId of userIds) {
      const profile = await this.loadUserProfile(userId);
      if (profile && profile.creditHistory.length > 0) {
        const latestScore = profile.creditHistory[profile.creditHistory.length - 1].score;
        totalScores += latestScore;
      }
    }
    
    return {
      totalUsers,
      averageScore: totalUsers > 0 ? Math.round(totalScores / totalUsers) : 0,
      activeUsers: userIds.length,
      dataPoints: userIds.length * 4 // Approximate data points per user
    };
  }
}
