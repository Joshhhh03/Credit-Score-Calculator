import { RequestHandler } from "express";

// Mock database - in production, this would be a real database
interface UserData {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
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
      mortgageAmount?: number;
      homeValue?: number;
      rentPaymentHistory: Array<{
        date: string;
        amount: number;
        status: 'on-time' | 'late' | 'missed';
      }>;
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
    banking: {
      bankName: string;
      accountType: string;
      routingNumber: string;
      averageBalance: number;
      monthlyIncome: number;
      monthlyExpenses: number;
    };
  };
  creditHistory: Array<{
    date: string;
    score: number;
    factors: {
      rentPayments: number;
      utilityPayments: number;
      cashFlow: number;
      employmentHistory: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

// Mock data store
const users: Map<string, UserData> = new Map();

// Generate mock historical data for demo purposes
const generateMockHistory = (currentScore: number): UserData['creditHistory'] => {
  const history: UserData['creditHistory'] = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Generate realistic score progression
    const baseScore = Math.max(300, currentScore - (i * 5) + Math.random() * 20 - 10);
    
    history.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(Math.min(850, Math.max(300, baseScore))),
      factors: {
        rentPayments: Math.round(Math.random() * 20 + 70),
        utilityPayments: Math.round(Math.random() * 15 + 70),
        cashFlow: Math.round(Math.random() * 25 + 60),
        employmentHistory: Math.round(Math.random() * 10 + 80),
      }
    });
  }
  
  return history;
};

// Create or update user data
export const saveUserData: RequestHandler = (req, res) => {
  try {
    const { userId, ...userData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const existingUser = users.get(userId);
    const currentScore = userData.currentScore || 723;
    
    const updatedUser: UserData = {
      id: userId,
      ...userData,
      creditHistory: existingUser?.creditHistory || generateMockHistory(currentScore),
      updatedAt: new Date().toISOString(),
      createdAt: existingUser?.createdAt || new Date().toISOString(),
    };

    users.set(userId, updatedUser);

    res.json({ 
      success: true, 
      message: "User data saved successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
};

// Get user data by ID
export const getUserData: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

// Update credit score and add to history
export const updateCreditScore: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { score, factors } = req.body;
    
    if (!userId || !score) {
      return res.status(400).json({ error: "User ID and score are required" });
    }

    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add new score to history
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      score: Math.round(score),
      factors: factors || {
        rentPayments: 80,
        utilityPayments: 75,
        cashFlow: 65,
        employmentHistory: 85,
      }
    };

    user.creditHistory.push(newEntry);
    user.updatedAt = new Date().toISOString();
    
    users.set(userId, user);

    res.json({ 
      success: true, 
      message: "Credit score updated successfully",
      newScore: newEntry,
      history: user.creditHistory.slice(-12) // Return last 12 months
    });
  } catch (error) {
    console.error("Error updating credit score:", error);
    res.status(500).json({ error: "Failed to update credit score" });
  }
};

// Get credit score history
export const getCreditHistory: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { months = 12 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const history = user.creditHistory.slice(-Number(months));
    
    res.json({ 
      history,
      currentScore: history[history.length - 1]?.score || 0,
      trend: history.length > 1 ? 
        history[history.length - 1].score - history[history.length - 2].score : 0
    });
  } catch (error) {
    console.error("Error fetching credit history:", error);
    res.status(500).json({ error: "Failed to fetch credit history" });
  }
};

// Calculate new credit score based on financial data
export const calculateCreditScore: RequestHandler = (req, res) => {
  try {
    const { financialData, traditionalCreditScore, hasTraditionalCredit } = req.body;

    if (!financialData) {
      return res.status(400).json({ error: "Financial data is required" });
    }

    // Hybrid scoring algorithm that combines traditional and alternative data
    let hybridScore = 0;
    let traditionalWeight = 0;
    let alternativeWeight = 1;

    // Determine weighting based on traditional credit availability
    if (hasTraditionalCredit === 'yes' && traditionalCreditScore) {
      traditionalWeight = 0.4; // 40% traditional credit
      alternativeWeight = 0.6; // 60% alternative data
    } else if (hasTraditionalCredit === 'limited' && traditionalCreditScore) {
      traditionalWeight = 0.25; // 25% traditional credit
      alternativeWeight = 0.75; // 75% alternative data
    } else {
      traditionalWeight = 0; // 0% traditional credit
      alternativeWeight = 1; // 100% alternative data
    }

    const factors = {
      rentPayments: 0,
      utilityPayments: 0,
      cashFlow: 0,
      employmentHistory: 0,
      traditionalCredit: traditionalCreditScore || 0,
    };

    // Calculate rent payment factor
    if (financialData.housing?.rentPaymentHistory) {
      const rentHistory = financialData.housing.rentPaymentHistory;
      const onTimePayments = rentHistory.filter((p: any) => p.status === 'on-time').length;
      const onTimeRate = onTimePayments / rentHistory.length;
      factors.rentPayments = Math.round(onTimeRate * 100);
    }

    // Calculate utility payment factor
    if (financialData.utilities?.length > 0) {
      let totalOnTime = 0;
      let totalPayments = 0;

      financialData.utilities.forEach((utility: any) => {
        if (utility.paymentHistory) {
          totalPayments += utility.paymentHistory.length;
          totalOnTime += utility.paymentHistory.filter((p: any) => p.status === 'on-time').length;
        }
      });

      if (totalPayments > 0) {
        const onTimeRate = totalOnTime / totalPayments;
        factors.utilityPayments = Math.round(onTimeRate * 100);
      }
    }

    // Calculate cash flow factor
    if (financialData.banking) {
      const { monthlyIncome, monthlyExpenses, averageBalance } = financialData.banking;
      if (monthlyIncome && monthlyExpenses) {
        const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
        const balanceRatio = averageBalance / (monthlyIncome || 1);
        factors.cashFlow = Math.round((savingsRate * 0.6 + balanceRatio * 0.4) * 100);
      }
    }

    // Calculate employment factor
    if (financialData.employment) {
      const { startDate, annualSalary } = financialData.employment;
      const startYear = new Date(startDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const yearsEmployed = currentYear - startYear;

      const stabilityScore = Math.min(yearsEmployed * 20, 80);
      const salaryScore = Math.min((annualSalary || 0) / 1000, 20);
      factors.employmentHistory = Math.round(stabilityScore + salaryScore);
    }

    // Calculate alternative data score (300-850 range)
    let alternativeScore = 500; // Base score for alternative data

    // Alternative data contributes to score improvement
    if (factors.rentPayments > 0) alternativeScore += (factors.rentPayments / 100) * 80;
    if (factors.utilityPayments > 0) alternativeScore += (factors.utilityPayments / 100) * 60;
    if (factors.cashFlow > 0) alternativeScore += (factors.cashFlow / 100) * 70;
    if (factors.employmentHistory > 0) alternativeScore += (factors.employmentHistory / 100) * 50;

    alternativeScore = Math.min(850, Math.max(300, alternativeScore));

    // Calculate hybrid score
    if (traditionalWeight > 0) {
      hybridScore = (traditionalCreditScore * traditionalWeight) + (alternativeScore * alternativeWeight);
    } else {
      hybridScore = alternativeScore;
    }

    // Apply risk adjustment based on alternative data strength
    const alternativeDataStrength = (factors.rentPayments + factors.utilityPayments + factors.cashFlow + factors.employmentHistory) / 4;

    // Boost score for users with strong alternative data but weak/no traditional credit
    if (hasTraditionalCredit === 'no' || hasTraditionalCredit === 'limited') {
      if (alternativeDataStrength > 80) {
        hybridScore += 20; // Excellent alternative data bonus
      } else if (alternativeDataStrength > 70) {
        hybridScore += 15; // Good alternative data bonus
      } else if (alternativeDataStrength > 60) {
        hybridScore += 10; // Fair alternative data bonus
      }
    }

    const finalScore = Math.round(Math.min(850, Math.max(300, hybridScore)));

    res.json({
      score: finalScore,
      scoreType: "Credit Risk Score",
      algorithm: "Hybrid Traditional + Alternative Data",
      factors,
      weights: {
        traditional: traditionalWeight,
        alternative: alternativeWeight
      },
      breakdown: {
        traditionalScore: traditionalCreditScore || 0,
        alternativeScore: Math.round(alternativeScore),
        hybridScore: Math.round(hybridScore),
        rentContribution: Math.round((factors.rentPayments / 100) * 80 * alternativeWeight),
        utilityContribution: Math.round((factors.utilityPayments / 100) * 60 * alternativeWeight),
        cashFlowContribution: Math.round((factors.cashFlow / 100) * 70 * alternativeWeight),
        employmentContribution: Math.round((factors.employmentHistory / 100) * 50 * alternativeWeight),
        alternativeDataBonus: hasTraditionalCredit === 'no' && alternativeDataStrength > 60 ?
          (alternativeDataStrength > 80 ? 20 : alternativeDataStrength > 70 ? 15 : 10) : 0
      }
    });
  } catch (error) {
    console.error("Error calculating credit score:", error);
    res.status(500).json({ error: "Failed to calculate credit score" });
  }
};
