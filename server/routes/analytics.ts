import { RequestHandler } from "express";
import { FileStorage, UserProfile, LoanOffer } from "../utils/fileStorage";

// Generate comprehensive analytics for a user
export const generateAnalytics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await FileStorage.loadUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Calculate current score and factors
    const currentScore = calculateCreditScore(user);
    
    // Generate historical data for line graph (past 12 months)
    const historicalData = generateHistoricalData(user, currentScore);
    
    // Analyze strengths and weaknesses
    const analysis = analyzeUserProfile(user, currentScore);
    
    // Generate loan offers
    const loanOffers = generateLoanOffers(user, currentScore);
    
    // Save analytics
    const analytics = {
      currentScore,
      historicalData,
      analysis,
      loanOffers,
      generatedAt: new Date().toISOString()
    };

    await FileStorage.saveAnalytics(userId, analytics);
    await FileStorage.saveLoanOffers(userId, loanOffers);

    // Update user's credit history
    user.creditHistory.push({
      date: new Date().toISOString().split('T')[0],
      score: currentScore.score,
      factors: currentScore.factors
    });

    // Update user's analytics summary
    user.analytics = {
      strengths: analysis.strengths.map(s => s.title),
      weaknesses: analysis.weaknesses.map(w => w.title),
      recommendations: analysis.recommendations,
      riskProfile: analysis.riskProfile,
      loanEligibility: analysis.loanEligibility
    };

    await FileStorage.saveUserProfile(user);

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error("Generate analytics error:", error);
    res.status(500).json({
      error: "Failed to generate analytics"
    });
  }
};

// Get existing analytics
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const analytics = await FileStorage.loadAnalytics(userId);
    if (!analytics) {
      return res.status(404).json({
        error: "Analytics not found. Please generate analytics first."
      });
    }

    res.json({
      success: true,
      analytics: analytics.analytics
    });

  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      error: "Failed to get analytics"
    });
  }
};

// Get loan offers
export const getLoanOffers: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const offers = await FileStorage.loadLoanOffers(userId);
    if (!offers) {
      return res.status(404).json({
        error: "No current loan offers. Please generate analytics first."
      });
    }

    res.json({
      success: true,
      offers
    });

  } catch (error) {
    console.error("Get loan offers error:", error);
    res.status(500).json({
      error: "Failed to get loan offers"
    });
  }
};

// Calculate credit score based on user data
function calculateCreditScore(user: UserProfile) {
  let hybridScore = 0;
  let traditionalWeight = 0;
  let alternativeWeight = 1;

  // Determine weighting based on traditional credit
  if (user.traditionalCredit.hasCredit === 'yes' && user.traditionalCredit.score) {
    traditionalWeight = 0.4;
    alternativeWeight = 0.6;
  } else if (user.traditionalCredit.hasCredit === 'limited' && user.traditionalCredit.score) {
    traditionalWeight = 0.25;
    alternativeWeight = 0.75;
  }

  const factors = {
    rentPayments: calculateRentScore(user.financialData.housing),
    utilityPayments: calculateUtilityScore(user.financialData.utilities),
    cashFlow: calculateCashFlowScore(user.financialData.banking),
    employmentHistory: calculateEmploymentScore(user.financialData.employment),
    traditionalCredit: user.traditionalCredit.score || 0
  };

  // Calculate alternative score
  let alternativeScore = 500;
  if (factors.rentPayments > 0) alternativeScore += (factors.rentPayments / 100) * 80;
  if (factors.utilityPayments > 0) alternativeScore += (factors.utilityPayments / 100) * 60;
  if (factors.cashFlow > 0) alternativeScore += (factors.cashFlow / 100) * 70;
  if (factors.employmentHistory > 0) alternativeScore += (factors.employmentHistory / 100) * 50;

  alternativeScore = Math.min(850, Math.max(300, alternativeScore));

  // Calculate hybrid score
  if (traditionalWeight > 0 && user.traditionalCredit.score) {
    hybridScore = (user.traditionalCredit.score * traditionalWeight) + (alternativeScore * alternativeWeight);
  } else {
    hybridScore = alternativeScore;
  }

  // Apply bonus for strong alternative data
  const alternativeDataStrength = (factors.rentPayments + factors.utilityPayments + factors.cashFlow + factors.employmentHistory) / 4;
  if (user.traditionalCredit.hasCredit === 'no' || user.traditionalCredit.hasCredit === 'limited') {
    if (alternativeDataStrength > 80) {
      hybridScore += 20;
    } else if (alternativeDataStrength > 70) {
      hybridScore += 15;
    } else if (alternativeDataStrength > 60) {
      hybridScore += 10;
    }
  }

  const finalScore = Math.round(Math.min(850, Math.max(300, hybridScore)));

  return {
    score: finalScore,
    factors,
    weights: { traditional: traditionalWeight, alternative: alternativeWeight },
    alternativeScore: Math.round(alternativeScore),
    alternativeDataStrength: Math.round(alternativeDataStrength)
  };
}

// Generate historical data for line graph
function generateHistoricalData(user: UserProfile, currentScore: any) {
  const months = 12;
  const data = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Generate realistic progression towards current score
    const progressFactor = (months - i) / months;
    const baseScore = 580;
    const targetScore = currentScore.score;
    const monthScore = Math.round(baseScore + (targetScore - baseScore) * progressFactor + (Math.random() - 0.5) * 20);
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.min(850, Math.max(300, monthScore)),
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }

  return data;
}

// Analyze user profile for strengths and weaknesses
function analyzeUserProfile(user: UserProfile, scoreData: any) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Calculate derived metrics
  const income = user.financialData.banking.monthlyIncome || 0;
  const expenses = user.financialData.banking.monthlyExpenses || 0;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const debtToIncome = expenses > 0 ? (expenses / income) * 100 : 0;
  const salary = user.financialData.employment.annualSalary || 0;

  // RENT PAYMENT ANALYSIS
  if (scoreData.factors.rentPayments >= 80) {
    strengths.push({
      title: "Excellent Rent Payment History",
      description: "You have consistently paid rent on time, showing strong housing responsibility",
      score: scoreData.factors.rentPayments,
      impact: "high"
    });
  } else if (scoreData.factors.rentPayments < 60) {
    weaknesses.push({
      title: "Inconsistent Rent Payments",
      description: "Improving rent payment consistency could significantly boost your score",
      score: scoreData.factors.rentPayments,
      impact: "high"
    });
    recommendations.push("Set up automatic rent payments to ensure consistency");
  }

  // UTILITY PAYMENT ANALYSIS
  if (scoreData.factors.utilityPayments >= 75) {
    strengths.push({
      title: "Reliable Utility Payments",
      description: "Your utility payment history demonstrates financial responsibility",
      score: scoreData.factors.utilityPayments,
      impact: "medium"
    });
  } else if (scoreData.factors.utilityPayments < 65) {
    weaknesses.push({
      title: "Utility Payment Issues",
      description: "Late utility payments are affecting your credit profile",
      score: scoreData.factors.utilityPayments,
      impact: "medium"
    });
    recommendations.push("Set up autopay for all utilities to avoid late payments");
  }

  // EMPLOYMENT STABILITY ANALYSIS
  if (scoreData.factors.employmentHistory >= 80) {
    strengths.push({
      title: "Stable Employment History",
      description: "Your employment stability shows reliable income potential",
      score: scoreData.factors.employmentHistory,
      impact: "medium"
    });
  } else if (scoreData.factors.employmentHistory < 60) {
    weaknesses.push({
      title: "Employment Instability",
      description: "Frequent job changes may be impacting your creditworthiness",
      score: scoreData.factors.employmentHistory,
      impact: "medium"
    });
    recommendations.push("Focus on job stability and building tenure with current employer");
  }

  // CASH FLOW ANALYSIS
  if (scoreData.factors.cashFlow >= 70) {
    strengths.push({
      title: "Strong Cash Flow Management",
      description: "You manage your finances well with positive cash flow patterns",
      score: scoreData.factors.cashFlow,
      impact: "high"
    });
  } else if (scoreData.factors.cashFlow < 50) {
    weaknesses.push({
      title: "Cash Flow Challenges",
      description: "Improving your savings rate and reducing expenses could help",
      score: scoreData.factors.cashFlow,
      impact: "high"
    });
    recommendations.push("Build an emergency fund and reduce monthly expenses");
  }

  // INCOME LEVEL ANALYSIS
  if (salary >= 75000) {
    strengths.push({
      title: "Strong Income Level",
      description: `Your annual salary of $${salary.toLocaleString()} provides good financial foundation`,
      score: Math.min(100, (salary / 100000) * 100),
      impact: "high"
    });
  } else if (salary < 35000 && salary > 0) {
    weaknesses.push({
      title: "Lower Income Level",
      description: "Increasing income through skills development or career advancement could improve your profile",
      score: (salary / 35000) * 100,
      impact: "medium"
    });
    recommendations.push("Consider skills training or career advancement opportunities to increase income");
  }

  // SAVINGS RATE ANALYSIS
  if (savingsRate >= 20) {
    strengths.push({
      title: "Excellent Savings Discipline",
      description: `You save ${savingsRate.toFixed(1)}% of your income, showing strong financial planning`,
      score: Math.min(100, savingsRate * 5),
      impact: "high"
    });
  } else if (savingsRate < 5 && income > 0) {
    weaknesses.push({
      title: "Low Savings Rate",
      description: "Building emergency savings is crucial for financial stability and credit health",
      score: savingsRate * 20,
      impact: "high"
    });
    recommendations.push("Aim to save at least 10-20% of your income for financial security");
  }

  // DEBT-TO-INCOME ANALYSIS
  if (debtToIncome <= 30 && income > 0) {
    strengths.push({
      title: "Healthy Debt-to-Income Ratio",
      description: `Your DTI of ${debtToIncome.toFixed(1)}% shows responsible debt management`,
      score: 100 - debtToIncome,
      impact: "medium"
    });
  } else if (debtToIncome > 50 && income > 0) {
    weaknesses.push({
      title: "High Debt-to-Income Ratio",
      description: "High debt levels relative to income may limit credit opportunities",
      score: Math.max(0, 100 - debtToIncome),
      impact: "high"
    });
    recommendations.push("Focus on reducing monthly expenses or increasing income to improve DTI ratio");
  }

  // BANKING RELATIONSHIP ANALYSIS
  if (user.financialData.banking.bankName) {
    strengths.push({
      title: "Established Banking Relationship",
      description: `Banking with ${user.financialData.banking.bankName} shows financial stability`,
      score: 85,
      impact: "low"
    });
  } else {
    weaknesses.push({
      title: "Limited Banking History",
      description: "Establishing primary banking relationships helps build credit foundation",
      score: 30,
      impact: "medium"
    });
    recommendations.push("Open checking and savings accounts with a major bank to build financial history");
  }

  // EMPLOYMENT TYPE ANALYSIS
  if (user.financialData.employment.employmentType === 'full-time') {
    strengths.push({
      title: "Full-time Employment Status",
      description: "Full-time employment provides stable income verification for lenders",
      score: 90,
      impact: "medium"
    });
  } else if (user.financialData.employment.employmentType === 'self-employed') {
    weaknesses.push({
      title: "Self-employment Income Variability",
      description: "Self-employed income may require additional documentation for loan approval",
      score: 65,
      impact: "medium"
    });
    recommendations.push("Maintain detailed financial records and consider business banking accounts");
  }

  // HOUSING SITUATION ANALYSIS
  if (user.financialData.housing.housingType === 'own') {
    strengths.push({
      title: "Homeownership",
      description: "Property ownership demonstrates financial stability and investment capacity",
      score: 95,
      impact: "high"
    });
  } else if (user.financialData.housing.housingType === 'family') {
    weaknesses.push({
      title: "Limited Housing Payment History",
      description: "Living with family may limit verifiable housing payment history",
      score: 40,
      impact: "medium"
    });
    recommendations.push("Consider documenting any financial contributions to household expenses");
  }

  // TRADITIONAL CREDIT ANALYSIS
  if (user.traditionalCredit.hasCredit === 'yes') {
    strengths.push({
      title: "Existing Credit History",
      description: "Having traditional credit products provides additional credit verification",
      score: 85,
      impact: "medium"
    });
  } else if (user.traditionalCredit.hasCredit === 'no') {
    weaknesses.push({
      title: "No Traditional Credit History",
      description: "Limited traditional credit may restrict loan options and interest rates",
      score: 20,
      impact: "high"
    });
    recommendations.push("Consider secured credit cards or credit-building loans to establish traditional credit");
  }

  // Ensure we have at least 5 of each by adding generic ones if needed
  while (strengths.length < 5) {
    if (scoreData.score >= 700) {
      strengths.push({
        title: "Good Overall Credit Score",
        description: `Your CreditBridge score of ${scoreData.score} opens many lending opportunities`,
        score: scoreData.score / 8.5,
        impact: "medium"
      });
    } else {
      strengths.push({
        title: "Credit Building Progress",
        description: "You're actively working to build your credit profile through alternative data",
        score: 75,
        impact: "low"
      });
    }
  }

  while (weaknesses.length < 5) {
    if (scoreData.score < 650) {
      weaknesses.push({
        title: "Credit Score Below Prime",
        description: "Improving your score above 650 will unlock better interest rates",
        score: scoreData.score / 8.5,
        impact: "high"
      });
    } else {
      weaknesses.push({
        title: "Credit Profile Depth",
        description: "Adding more data sources could provide a more comprehensive credit picture",
        score: 60,
        impact: "low"
      });
    }

    if (weaknesses.length < 5) {
      weaknesses.push({
        title: "Credit Mix Diversification",
        description: "Consider diversifying your financial relationships and payment history types",
        score: 55,
        impact: "low"
      });
    }
  }

  // Determine risk profile
  const averageScore = (scoreData.factors.rentPayments + scoreData.factors.utilityPayments + 
                       scoreData.factors.cashFlow + scoreData.factors.employmentHistory) / 4;
  
  let riskProfile: 'low' | 'medium' | 'high';
  if (averageScore >= 75) riskProfile = 'low';
  else if (averageScore >= 60) riskProfile = 'medium';
  else riskProfile = 'high';

  // Determine loan eligibility
  const loanEligibility = {
    creditCards: scoreData.score >= 600,
    personalLoans: scoreData.score >= 620,
    autoLoans: scoreData.score >= 650,
    mortgages: scoreData.score >= 680
  };

  if (recommendations.length === 0) {
    recommendations.push("Continue your excellent financial habits to maintain your strong credit profile");
  }

  return {
    strengths,
    weaknesses,
    recommendations,
    riskProfile,
    loanEligibility,
    overallStrength: averageScore
  };
}

// Generate synthetic loan offers
function generateLoanOffers(user: UserProfile, scoreData: any): LoanOffer[] {
  const offers: LoanOffer[] = [];
  const score = scoreData.score;

  // Synthetic bank data
  const banks = [
    { id: 'chase', name: 'Chase Bank', tier: 'premium' },
    { id: 'bofa', name: 'Bank of America', tier: 'premium' },
    { id: 'wells', name: 'Wells Fargo', tier: 'traditional' },
    { id: 'citi', name: 'Citibank', tier: 'premium' },
    { id: 'discover', name: 'Discover Bank', tier: 'alternative' },
    { id: 'capital-one', name: 'Capital One', tier: 'alternative' },
    { id: 'ally', name: 'Ally Bank', tier: 'online' },
    { id: 'marcus', name: 'Marcus by Goldman Sachs', tier: 'premium' }
  ];

  // Credit Cards
  if (score >= 600) {
    banks.forEach(bank => {
      if (score >= 720 || bank.tier === 'alternative') {
        offers.push({
          bankId: bank.id,
          bankName: bank.name,
          loanType: 'credit-card',
          productName: score >= 750 ? 'Premium Rewards Card' : score >= 700 ? 'Rewards Card' : 'Standard Card',
          interestRate: score >= 750 ? 14.99 : score >= 700 ? 18.99 : 22.99,
          maxAmount: score >= 750 ? 25000 : score >= 700 ? 15000 : 5000,
          terms: '0% APR for 12 months, then variable APR',
          requirements: score >= 750 ? ['Excellent Credit', '$50K+ Income'] : ['Good Credit', '$25K+ Income'],
          approvalLikelihood: score >= 750 ? 95 : score >= 700 ? 85 : 70,
          features: score >= 750 ? ['2% Cash Back', 'No Annual Fee', 'Travel Insurance'] : 
                   score >= 700 ? ['1.5% Cash Back', 'No Annual Fee'] : ['1% Cash Back']
        });
      }
    });
  }

  // Personal Loans
  if (score >= 620) {
    const personalLoanBanks = banks.filter(b => b.tier !== 'premium' || score >= 700);
    personalLoanBanks.slice(0, 4).forEach(bank => {
      offers.push({
        bankId: bank.id,
        bankName: bank.name,
        loanType: 'personal',
        productName: 'Personal Loan',
        interestRate: score >= 750 ? 5.99 : score >= 700 ? 8.99 : 12.99,
        maxAmount: score >= 750 ? 50000 : score >= 700 ? 35000 : 20000,
        terms: '3-7 year terms available',
        requirements: ['Steady Income', 'Debt-to-Income < 40%'],
        approvalLikelihood: score >= 750 ? 90 : score >= 700 ? 80 : 65,
        features: ['Fixed Rate', 'No Prepayment Penalty', 'Quick Approval']
      });
    });
  }

  // Auto Loans
  if (score >= 650) {
    const autoLoanBanks = banks.slice(0, 5);
    autoLoanBanks.forEach(bank => {
      offers.push({
        bankId: bank.id,
        bankName: bank.name,
        loanType: 'auto',
        productName: 'Auto Loan',
        interestRate: score >= 750 ? 3.49 : score >= 700 ? 4.99 : 6.99,
        maxAmount: score >= 750 ? 80000 : score >= 700 ? 60000 : 40000,
        terms: '2-7 year terms available',
        requirements: ['Vehicle as Collateral', 'Insurance Required'],
        approvalLikelihood: score >= 750 ? 95 : score >= 700 ? 85 : 75,
        features: ['Competitive Rates', 'Pre-approval Available', 'Online Application']
      });
    });
  }

  // Mortgages
  if (score >= 680) {
    const mortgageBanks = banks.filter(b => b.tier === 'premium' || b.tier === 'traditional').slice(0, 3);
    mortgageBanks.forEach(bank => {
      offers.push({
        bankId: bank.id,
        bankName: bank.name,
        loanType: 'mortgage',
        productName: score >= 740 ? 'Conventional Mortgage' : 'FHA Mortgage',
        interestRate: score >= 750 ? 6.25 : score >= 720 ? 6.75 : 7.25,
        maxAmount: score >= 750 ? 750000 : score >= 720 ? 500000 : 350000,
        terms: '15-30 year fixed rate options',
        requirements: score >= 740 ? ['20% Down Payment', 'Stable Income'] : ['3.5% Down Payment', 'Stable Income'],
        approvalLikelihood: score >= 750 ? 85 : score >= 720 ? 75 : 65,
        features: score >= 740 ? ['Best Rates', 'No PMI with 20% Down', 'Rate Lock'] : 
                 ['Low Down Payment', 'FHA Approved', 'First-time Buyer Programs']
      });
    });
  }

  return offers.sort((a, b) => b.approvalLikelihood - a.approvalLikelihood);
}

// Helper functions for score calculation
function calculateRentScore(housing: any): number {
  if (!housing.rentPaymentHistory || housing.rentPaymentHistory.length === 0) {
    return housing.housingType === 'rent' ? 50 : 0;
  }
  
  const onTimePayments = housing.rentPaymentHistory.filter((p: any) => p.status === 'on-time').length;
  return Math.round((onTimePayments / housing.rentPaymentHistory.length) * 100);
}

function calculateUtilityScore(utilities: any[]): number {
  if (!utilities || utilities.length === 0) return 0;
  
  let totalOnTime = 0;
  let totalPayments = 0;
  
  utilities.forEach(utility => {
    if (utility.paymentHistory) {
      totalPayments += utility.paymentHistory.length;
      totalOnTime += utility.paymentHistory.filter((p: any) => p.status === 'on-time').length;
    }
  });
  
  return totalPayments > 0 ? Math.round((totalOnTime / totalPayments) * 100) : 0;
}

function calculateCashFlowScore(banking: any): number {
  if (!banking || !banking.monthlyIncome || !banking.monthlyExpenses) return 0;
  
  const savingsRate = (banking.monthlyIncome - banking.monthlyExpenses) / banking.monthlyIncome;
  const balanceRatio = (banking.averageBalance || 0) / banking.monthlyIncome;
  
  return Math.round((savingsRate * 0.6 + balanceRatio * 0.4) * 100);
}

function calculateEmploymentScore(employment: any): number {
  if (!employment || !employment.startDate) return 0;
  
  const startYear = new Date(employment.startDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsEmployed = Math.max(0, currentYear - startYear);
  
  const stabilityScore = Math.min(yearsEmployed * 20, 80);
  const salaryScore = Math.min((employment.annualSalary || 0) / 1000, 20);
  
  return Math.round(stabilityScore + salaryScore);
}
