// Shared types for user data and credit scoring

export interface UserPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  ssn: string;
  traditionalCreditScore?: number;
  hasTraditionalCredit: 'yes' | 'no' | 'limited' | 'unsure';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Employment {
  employerName: string;
  jobTitle: string;
  annualSalary: number;
  startDate: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'self-employed';
  workAddress: string;
}

export interface PaymentHistory {
  date: string;
  amount: number;
  status: 'on-time' | 'late' | 'missed';
}

export interface Housing {
  housingType: 'rent' | 'own' | 'family';
  landlordName?: string;
  monthlyRent?: number;
  leaseStartDate?: string;
  mortgageAmount?: number;
  homeValue?: number;
  rentPaymentHistory: PaymentHistory[];
}

export interface Utility {
  provider: string;
  type: 'electric' | 'gas' | 'water' | 'internet' | 'phone';
  accountNumber: string;
  monthlyAmount: number;
  paymentHistory: PaymentHistory[];
}

export interface Banking {
  bankName: string;
  accountType: 'checking' | 'savings' | 'both';
  routingNumber: string;
  averageBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface FinancialData {
  employment: Employment;
  housing: Housing;
  utilities: Utility[];
  banking: Banking;
}

export interface CreditScoreFactors {
  rentPayments: number;
  utilityPayments: number;
  cashFlow: number;
  employmentHistory: number;
  traditionalCredit: number;
}

export interface CreditHistoryEntry {
  date: string;
  score: number;
  factors: CreditScoreFactors;
}

export interface UserData {
  id: string;
  personalInfo: UserPersonalInfo;
  financialData: FinancialData;
  creditHistory: CreditHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreditScoreCalculation {
  score: number;
  factors: CreditScoreFactors;
  breakdown: {
    baseScore: number;
    rentContribution: number;
    utilityContribution: number;
    cashFlowContribution: number;
    employmentContribution: number;
  };
}

// API Response types
export interface SaveUserDataResponse {
  success: boolean;
  message: string;
  user: UserData;
}

export interface GetUserDataResponse {
  user: UserData;
}

export interface UpdateCreditScoreResponse {
  success: boolean;
  message: string;
  newScore: CreditHistoryEntry;
  history: CreditHistoryEntry[];
}

export interface GetCreditHistoryResponse {
  history: CreditHistoryEntry[];
  currentScore: number;
  trend: number;
}

export interface CalculateCreditScoreRequest {
  financialData: Partial<FinancialData>;
}

export interface CalculateCreditScoreResponse extends CreditScoreCalculation {}
