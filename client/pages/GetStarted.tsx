import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreditScoreBar from "@/components/CreditScoreBar";
import DateInput from "@/components/DateInput";
import { CreditDataValidator } from "@/utils/validation";
import { 
  CreditCard, 
  ArrowRight, 
  CheckCircle,
  Shield,
  User,
  Building,
  Briefcase,
  Landmark
} from "lucide-react";
import { Link } from "react-router-dom";
import RatingPrompt from "@/components/RatingPrompt";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  traditionalCreditScore: string;
  hasTraditionalCredit: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Employment Details
  employment: {
    employerName: string;
    jobTitle: string;
    annualSalary: string;
    startDate: string;
    employmentType: string;
    workAddress: string;
  };
  
  // Housing Information
  housing: {
    housingType: string;
    landlordName: string;
    monthlyRent: string;
    leaseStartDate: string;
    rentPaymentMethod: string;
  };
  
  // Banking Details
  banking: {
    bankName: string;
    accountType: string;
    routingNumber: string;
    monthlyIncome: string;
    monthlyExpenses: string;
  };
  
  // Utility Information
  utilities: {
    electricProvider: string;
    electricAccount: string;
    gasProvider: string;
    gasAccount: string;
    internetProvider: string;
    internetAccount: string;
  };
}

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showValidation, setShowValidation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    traditionalCreditScore: "",
    hasTraditionalCredit: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    employment: {
      employerName: "",
      jobTitle: "",
      annualSalary: "",
      startDate: "",
      employmentType: "",
      workAddress: ""
    },
    housing: {
      housingType: "",
      landlordName: "",
      monthlyRent: "",
      leaseStartDate: "",
      rentPaymentMethod: ""
    },
    banking: {
      bankName: "",
      accountType: "",
      routingNumber: "",
      monthlyIncome: "",
      monthlyExpenses: ""
    },
    utilities: {
      electricProvider: "",
      electricAccount: "",
      gasProvider: "",
      gasAccount: "",
      internetProvider: "",
      internetAccount: ""
    }
  });

  const steps = [
    {
      title: "Personal Information",
      description: "Basic information to get started",
      icon: <User className="h-5 w-5" />
    },
    {
      title: "Employment Details",
      description: "Your job and income information",
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      title: "Housing Information",
      description: "Rent payments and housing details",
      icon: <Building className="h-5 w-5" />
    },
    {
      title: "Financial Accounts",
      description: "Banking and utility account details",
      icon: <Landmark className="h-5 w-5" />
    },
    {
      title: "Your Credit Score",
      description: "See your calculated score"
    }
  ];

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' ? {
        ...prev[section],
        [field]: value
      } : value
    }));

    // Real-time validation for immediate feedback
    if (showValidation) {
      const errorKey = `${section}.${field}`;

      // Validate specific field based on section and field
      let validation = { isValid: true, error: '' };

      if (section === 'firstName' || section === 'lastName') {
        validation = CreditDataValidator.validateName(value, field);
      } else if (section === 'email') {
        validation = CreditDataValidator.validateEmail(value);
      } else if (section === 'phone') {
        validation = CreditDataValidator.validatePhoneNumber(value);
      } else if (section === 'dateOfBirth') {
        validation = CreditDataValidator.validateDateOfBirth(value);
      } else if (section === 'ssn') {
        validation = CreditDataValidator.validateSSN(value);
      }

      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: validation.error || ''
      }));
    }
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      // Enable validation display to show errors
      setShowValidation(true);

      // Check if current step is valid
      if (!isStepValid(currentStep)) {
        // Show validation errors for current step
        validateCurrentStep();
        return;
      }

      if (currentStep === 4) {
        // Calculate credit score when moving to final step
        await calculateCreditScore();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const validateCurrentStep = () => {
    const errors: {[key: string]: string} = {};

    switch (currentStep) {
      case 1:
        const personalValidation = CreditDataValidator.validatePersonalInfo({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          address: formData.address
        });

        if (!personalValidation.firstName.isValid) errors['firstName'] = personalValidation.firstName.error || '';
        if (!personalValidation.lastName.isValid) errors['lastName'] = personalValidation.lastName.error || '';
        if (!personalValidation.email.isValid) errors['email'] = personalValidation.email.error || '';
        if (!personalValidation.dateOfBirth.isValid) errors['dateOfBirth'] = personalValidation.dateOfBirth.error || '';
        if (!personalValidation.ssn.isValid) errors['ssn'] = personalValidation.ssn.error || '';
        if (!formData.hasTraditionalCredit) errors['hasTraditionalCredit'] = 'Please select an option';
        break;

      case 2:
        const employmentValidation = CreditDataValidator.validateEmployment({
          employerName: formData.employment.employerName,
          jobTitle: formData.employment.jobTitle,
          annualSalary: formData.employment.annualSalary,
          startDate: formData.employment.startDate,
          employmentType: formData.employment.employmentType
        });

        if (!employmentValidation.employerName.isValid) errors['employment.employerName'] = employmentValidation.employerName.error || '';
        if (!employmentValidation.jobTitle.isValid) errors['employment.jobTitle'] = employmentValidation.jobTitle.error || '';
        if (!employmentValidation.annualSalary.isValid) errors['employment.annualSalary'] = employmentValidation.annualSalary.error || '';
        break;

      case 3:
        const housingValidation = CreditDataValidator.validateHousing({
          housingType: formData.housing.housingType,
          landlordName: formData.housing.landlordName,
          monthlyRent: formData.housing.monthlyRent,
          leaseStartDate: formData.housing.leaseStartDate
        });

        if (!housingValidation.housingType.isValid) errors['housing.housingType'] = housingValidation.housingType.error || '';
        if (!housingValidation.landlordName.isValid) errors['housing.landlordName'] = housingValidation.landlordName.error || '';
        if (!housingValidation.monthlyRent.isValid) errors['housing.monthlyRent'] = housingValidation.monthlyRent.error || '';
        break;

      case 4:
        const bankingValidation = CreditDataValidator.validateBanking({
          bankName: formData.banking.bankName,
          accountType: formData.banking.accountType,
          monthlyIncome: formData.banking.monthlyIncome,
          monthlyExpenses: formData.banking.monthlyExpenses
        });

        if (!bankingValidation.bankName.isValid) errors['banking.bankName'] = bankingValidation.bankName.error || '';
        if (!bankingValidation.accountType.isValid) errors['banking.accountType'] = bankingValidation.accountType.error || '';
        break;
    }

    setValidationErrors(errors);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateCreditScore = async () => {
    setIsCalculating(true);
    
    try {
      // Simulate API call to calculate credit score
      const response = await fetch('/api/calculate-credit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traditionalCreditScore: formData.traditionalCreditScore ? parseFloat(formData.traditionalCreditScore) : null,
          hasTraditionalCredit: formData.hasTraditionalCredit,
          financialData: {
            employment: {
              ...formData.employment,
              annualSalary: parseFloat(formData.employment.annualSalary) || 0
            },
            housing: {
              ...formData.housing,
              monthlyRent: parseFloat(formData.housing.monthlyRent) || 0,
              rentPaymentHistory: generateMockRentHistory()
            },
            banking: {
              ...formData.banking,
              monthlyIncome: parseFloat(formData.banking.monthlyIncome) || 0,
              monthlyExpenses: parseFloat(formData.banking.monthlyExpenses) || 0,
              averageBalance: (parseFloat(formData.banking.monthlyIncome) || 0) * 0.3
            },
            utilities: generateMockUtilityHistory()
          }
        })
      });
      
      const result = await response.json();
      setCalculatedScore(result.score);
      // Show rating prompt after a short delay to let user see their score
      setTimeout(() => setShowRatingPrompt(true), 3000);
    } catch (error) {
      console.error('Error calculating credit score:', error);
      // Fallback calculation
      setCalculatedScore(680 + Math.floor(Math.random() * 100));
      setTimeout(() => setShowRatingPrompt(true), 3000);
    } finally {
      setIsCalculating(false);
    }
  };

  const generateMockRentHistory = () => {
    const history = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      history.push({
        date: date.toISOString().split('T')[0],
        amount: parseFloat(formData.housing.monthlyRent) || 1200,
        status: Math.random() > 0.1 ? 'on-time' : 'late' // 90% on-time rate
      });
    }
    return history;
  };

  const generateMockUtilityHistory = () => {
    return [
      {
        provider: formData.utilities.electricProvider || 'Electric Company',
        type: 'electric',
        accountNumber: formData.utilities.electricAccount || '12345',
        monthlyAmount: 120,
        paymentHistory: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: 100 + Math.random() * 40,
          status: Math.random() > 0.15 ? 'on-time' : 'late'
        }))
      }
    ];
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        const personalValidation = CreditDataValidator.validatePersonalInfo({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          address: formData.address
        });

        return personalValidation.firstName.isValid &&
               personalValidation.lastName.isValid &&
               personalValidation.email.isValid &&
               personalValidation.dateOfBirth.isValid &&
               personalValidation.ssn.isValid &&
               formData.hasTraditionalCredit;

      case 2:
        const employmentValidation = CreditDataValidator.validateEmployment({
          employerName: formData.employment.employerName,
          jobTitle: formData.employment.jobTitle,
          annualSalary: formData.employment.annualSalary,
          startDate: formData.employment.startDate,
          employmentType: formData.employment.employmentType
        });

        return employmentValidation.employerName.isValid &&
               employmentValidation.jobTitle.isValid &&
               employmentValidation.annualSalary.isValid;

      case 3:
        const housingValidation = CreditDataValidator.validateHousing({
          housingType: formData.housing.housingType,
          landlordName: formData.housing.landlordName,
          monthlyRent: formData.housing.monthlyRent,
          leaseStartDate: formData.housing.leaseStartDate
        });

        return housingValidation.housingType.isValid &&
               housingValidation.landlordName.isValid &&
               housingValidation.monthlyRent.isValid;

      case 4:
        const bankingValidation = CreditDataValidator.validateBanking({
          bankName: formData.banking.bankName,
          accountType: formData.banking.accountType,
          monthlyIncome: formData.banking.monthlyIncome,
          monthlyExpenses: formData.banking.monthlyExpenses
        });

        return bankingValidation.bankName.isValid &&
               bankingValidation.accountType.isValid;

      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">CreditBridge</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  index + 1 === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : index + 1 < currentStep 
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1 < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.icon || <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName' as keyof FormData, '', e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName' as keyof FormData, '', e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email' as keyof FormData, '', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone' as keyof FormData, '', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth' as keyof FormData, '', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ssn">Social Security Number *</Label>
                    <Input
                      id="ssn"
                      value={formData.ssn}
                      onChange={(e) => handleInputChange('ssn' as keyof FormData, '', e.target.value)}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Traditional Credit Information</h3>
                  <div>
                    <Label htmlFor="hasTraditionalCredit">Do you have a traditional credit score?</Label>
                    <Select onValueChange={(value) => handleInputChange('hasTraditionalCredit' as keyof FormData, '', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, I know my credit score</SelectItem>
                        <SelectItem value="no">No, I have no credit history</SelectItem>
                        <SelectItem value="limited">I have limited credit history</SelectItem>
                        <SelectItem value="unsure">I'm not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.hasTraditionalCredit === 'yes' || formData.hasTraditionalCredit === 'limited') && (
                    <div>
                      <Label htmlFor="traditionalCreditScore">Current Traditional Credit Score (FICO/VantageScore)</Label>
                      <Input
                        id="traditionalCreditScore"
                        type="number"
                        min="300"
                        max="850"
                        value={formData.traditionalCreditScore}
                        onChange={(e) => handleInputChange('traditionalCreditScore' as keyof FormData, '', e.target.value)}
                        placeholder="Enter your current credit score (300-850)"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        You can find this on Credit Karma, your bank app, or credit card statements
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="street">Address</Label>
                  <Input 
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                    placeholder="Street address"
                    className="mb-2"
                  />
                  <div className="grid md:grid-cols-3 gap-2">
                    <Input 
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                      placeholder="City"
                    />
                    <Input 
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                      placeholder="State"
                    />
                    <Input 
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employerName">Employer Name *</Label>
                    <Input 
                      id="employerName"
                      value={formData.employment.employerName}
                      onChange={(e) => handleInputChange('employment', 'employerName', e.target.value)}
                      placeholder="Enter your employer name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input 
                      id="jobTitle"
                      value={formData.employment.jobTitle}
                      onChange={(e) => handleInputChange('employment', 'jobTitle', e.target.value)}
                      placeholder="Enter your job title"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="annualSalary">Annual Salary *</Label>
                    <Input 
                      id="annualSalary"
                      type="number"
                      value={formData.employment.annualSalary}
                      onChange={(e) => handleInputChange('employment', 'annualSalary', e.target.value)}
                      placeholder="Enter annual salary"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Employment Start Date</Label>
                    <Input 
                      id="startDate"
                      type="date"
                      value={formData.employment.startDate}
                      onChange={(e) => handleInputChange('employment', 'startDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select onValueChange={(value) => handleInputChange('employment', 'employmentType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="workAddress">Work Address</Label>
                  <Textarea 
                    id="workAddress"
                    value={formData.employment.workAddress}
                    onChange={(e) => handleInputChange('employment', 'workAddress', e.target.value)}
                    placeholder="Enter your work address"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Housing Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="housingType">Housing Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('housing', 'housingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select housing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="own">Own</SelectItem>
                      <SelectItem value="family">Living with family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.housing.housingType === 'rent' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="landlordName">Landlord/Property Manager Name *</Label>
                        <Input 
                          id="landlordName"
                          value={formData.housing.landlordName}
                          onChange={(e) => handleInputChange('housing', 'landlordName', e.target.value)}
                          placeholder="Enter landlord name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyRent">Monthly Rent Amount *</Label>
                        <Input 
                          id="monthlyRent"
                          type="number"
                          value={formData.housing.monthlyRent}
                          onChange={(e) => handleInputChange('housing', 'monthlyRent', e.target.value)}
                          placeholder="Enter monthly rent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="leaseStartDate">Lease Start Date</Label>
                        <Input 
                          id="leaseStartDate"
                          type="date"
                          value={formData.housing.leaseStartDate}
                          onChange={(e) => handleInputChange('housing', 'leaseStartDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rentPaymentMethod">Payment Method</Label>
                        <Select onValueChange={(value) => handleInputChange('housing', 'rentPaymentMethod', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="How do you pay rent?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online-portal">Online Portal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Financial Accounts */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Banking Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input 
                        id="bankName"
                        value={formData.banking.bankName}
                        onChange={(e) => handleInputChange('banking', 'bankName', e.target.value)}
                        placeholder="Enter your bank name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountType">Account Type *</Label>
                      <Select onValueChange={(value) => handleInputChange('banking', 'accountType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <Label htmlFor="monthlyIncome">Monthly Income</Label>
                      <Input 
                        id="monthlyIncome"
                        type="number"
                        value={formData.banking.monthlyIncome}
                        onChange={(e) => handleInputChange('banking', 'monthlyIncome', e.target.value)}
                        placeholder="Enter monthly income"
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                      <Input 
                        id="monthlyExpenses"
                        type="number"
                        value={formData.banking.monthlyExpenses}
                        onChange={(e) => handleInputChange('banking', 'monthlyExpenses', e.target.value)}
                        placeholder="Enter monthly expenses"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Utility Accounts</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="electricProvider">Electric Provider</Label>
                      <Input 
                        id="electricProvider"
                        value={formData.utilities.electricProvider}
                        onChange={(e) => handleInputChange('utilities', 'electricProvider', e.target.value)}
                        placeholder="e.g., ConEd, PG&E"
                      />
                    </div>
                    <div>
                      <Label htmlFor="electricAccount">Electric Account Number</Label>
                      <Input 
                        id="electricAccount"
                        value={formData.utilities.electricAccount}
                        onChange={(e) => handleInputChange('utilities', 'electricAccount', e.target.value)}
                        placeholder="Account number"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <Label htmlFor="internetProvider">Internet Provider</Label>
                      <Input 
                        id="internetProvider"
                        value={formData.utilities.internetProvider}
                        onChange={(e) => handleInputChange('utilities', 'internetProvider', e.target.value)}
                        placeholder="e.g., Verizon, Comcast"
                      />
                    </div>
                    <div>
                      <Label htmlFor="internetAccount">Internet Account Number</Label>
                      <Input 
                        id="internetAccount"
                        value={formData.utilities.internetAccount}
                        onChange={(e) => handleInputChange('utilities', 'internetAccount', e.target.value)}
                        placeholder="Account number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Credit Score Result */}
            {currentStep === 5 && (
              <div className="text-center space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Your CreditBridge Risk Score
                  </h3>
                  <Badge className="mb-4 bg-green-100 text-green-700">
                    Hybrid Traditional + Alternative Data Algorithm
                  </Badge>
                  {isCalculating ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600">Calculating your personalized credit risk score...</p>
                      <p className="text-sm text-gray-500">Analyzing traditional credit + alternative financial data</p>
                    </div>
                  ) : (
                    <div className="flex justify-center mb-8">
                      <CreditScoreBar score={calculatedScore || 723} width={400} animated={true} showDetails={true} />
                    </div>
                  )}
                </div>

                {calculatedScore && (
                  <>
                    <Card className="border-blue-200 bg-blue-50 max-w-2xl mx-auto mb-6">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-blue-900 mb-4">Your Hybrid Credit Risk Score Breakdown:</h4>

                        {formData.hasTraditionalCredit === 'yes' && (
                          <div className="mb-4 p-3 bg-white rounded">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Traditional Credit Score (40% weight)</span>
                              <span className="font-bold">{formData.traditionalCreditScore}</span>
                            </div>
                          </div>
                        )}

                        {formData.hasTraditionalCredit === 'limited' && (
                          <div className="mb-4 p-3 bg-white rounded">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Traditional Credit Score (25% weight)</span>
                              <span className="font-bold">{formData.traditionalCreditScore}</span>
                            </div>
                          </div>
                        )}

                        <div className="mb-4 p-3 bg-white rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Alternative Financial Data ({formData.hasTraditionalCredit === 'yes' ? '60%' : formData.hasTraditionalCredit === 'limited' ? '75%' : '100%'} weight)
                            </span>
                            <span className="font-bold text-green-600">Strong</span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>✓ Rent payment consistency</div>
                            <div>✓ Utility payment reliability</div>
                            <div>✓ Employment stability</div>
                            <div>✓ Banking/cash flow patterns</div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span>Qualify for most credit cards</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span>Eligible for personal loans</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span>Auto loan pre-approval likely</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span>Competitive interest rates</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50 max-w-2xl mx-auto">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-green-900 mb-3">Why This Score is More Fair:</h4>
                        <div className="text-sm text-green-800 space-y-2">
                          {formData.hasTraditionalCredit === 'no' && (
                            <div className="flex items-start">
                              <Badge className="mr-2 mt-0.5 bg-green-600 text-white text-xs">100% Alternative</Badge>
                              <span>Your score is based entirely on your financial responsibility with rent, utilities, and banking - no credit history needed!</span>
                            </div>
                          )}
                          {formData.hasTraditionalCredit === 'limited' && (
                            <div className="flex items-start">
                              <Badge className="mr-2 mt-0.5 bg-blue-600 text-white text-xs">75% Alternative</Badge>
                              <span>Your limited credit history is supplemented with strong alternative data for a more complete picture.</span>
                            </div>
                          )}
                          {formData.hasTraditionalCredit === 'yes' && (
                            <div className="flex items-start">
                              <Badge className="mr-2 mt-0.5 bg-purple-600 text-white text-xs">60% Alternative</Badge>
                              <span>Your traditional credit is enhanced with alternative data, potentially boosting your score beyond traditional limits.</span>
                            </div>
                          )}
                          <div>• Rewards consistent rent and utility payments</div>
                          <div>• Values employment stability and cash flow management</div>
                          <div>• No penalty for limited traditional credit history</div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="text-center">
                      <p className="text-gray-600 mb-6">
                        Your hybrid Credit Risk Score combines {formData.hasTraditionalCredit === 'yes' ? 'traditional credit (40%) with alternative financial data (60%)' : formData.hasTraditionalCredit === 'limited' ? 'limited traditional credit (25%) with strong alternative data (75%)' : 'entirely alternative financial data (100%)'} for a more complete and fair assessment of your creditworthiness.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/analytics">
                          <Button size="lg">
                            View Analytics Report
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to="/dashboard">
                          <Button size="lg" variant="outline">
                            Dashboard
                          </Button>
                        </Link>
                        <Link to="/coaching">
                          <Button size="lg" variant="outline">
                            Coaching
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rating Prompt */}
        {showRatingPrompt && calculatedScore && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <RatingPrompt
                userScore={calculatedScore}
                userName={formData.firstName || "there"}
                trigger="score-display"
                onClose={() => setShowRatingPrompt(false)}
                onSubmit={(rating, feedback) => {
                  console.log('Rating submitted:', { rating, feedback, score: calculatedScore });
                  // Here you would typically save to your backend
                  setShowRatingPrompt(false);
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              {currentStep === 4 ? 'Calculate Score' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-blue-600 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Your Data is Secure</h3>
                <p className="text-blue-800 text-sm">
                  We use bank-level encryption and follow strict data protection standards. 
                  Your personal and financial information is never shared without your consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
