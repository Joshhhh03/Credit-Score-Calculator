import { differenceInYears, parse, isValid, isFuture, isPast } from "date-fns";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export interface PersonalInfoValidation {
  firstName: ValidationResult;
  lastName: ValidationResult;
  email: ValidationResult;
  phone: ValidationResult;
  dateOfBirth: ValidationResult;
  ssn: ValidationResult;
  address: {
    street: ValidationResult;
    city: ValidationResult;
    state: ValidationResult;
    zipCode: ValidationResult;
  };
}

export interface EmploymentValidation {
  employerName: ValidationResult;
  jobTitle: ValidationResult;
  annualSalary: ValidationResult;
  startDate: ValidationResult;
  employmentType: ValidationResult;
}

export interface HousingValidation {
  housingType: ValidationResult;
  landlordName: ValidationResult;
  monthlyRent: ValidationResult;
  leaseStartDate: ValidationResult;
}

export interface BankingValidation {
  bankName: ValidationResult;
  accountType: ValidationResult;
  monthlyIncome: ValidationResult;
  monthlyExpenses: ValidationResult;
}

export class CreditDataValidator {
  
  // Personal Information Validation
  static validatePersonalInfo(data: any): PersonalInfoValidation {
    return {
      firstName: this.validateName(data.firstName, 'First name'),
      lastName: this.validateName(data.lastName, 'Last name'),
      email: this.validateEmail(data.email),
      phone: this.validatePhoneNumber(data.phone),
      dateOfBirth: this.validateDateOfBirth(data.dateOfBirth),
      ssn: this.validateSSN(data.ssn),
      address: {
        street: this.validateStreetAddress(data.address?.street),
        city: this.validateCity(data.address?.city),
        state: this.validateState(data.address?.state),
        zipCode: this.validateZipCode(data.address?.zipCode)
      }
    };
  }

  // Employment Validation
  static validateEmployment(data: any): EmploymentValidation {
    return {
      employerName: this.validateEmployerName(data.employerName),
      jobTitle: this.validateJobTitle(data.jobTitle),
      annualSalary: this.validateAnnualSalary(data.annualSalary),
      startDate: this.validateEmploymentStartDate(data.startDate),
      employmentType: this.validateEmploymentType(data.employmentType)
    };
  }

  // Housing Validation
  static validateHousing(data: any): HousingValidation {
    return {
      housingType: this.validateHousingType(data.housingType),
      landlordName: this.validateLandlordName(data.landlordName, data.housingType),
      monthlyRent: this.validateMonthlyRent(data.monthlyRent, data.housingType),
      leaseStartDate: this.validateLeaseStartDate(data.leaseStartDate, data.housingType)
    };
  }

  // Banking Validation
  static validateBanking(data: any): BankingValidation {
    return {
      bankName: this.validateBankName(data.bankName),
      accountType: this.validateAccountType(data.accountType),
      monthlyIncome: this.validateMonthlyIncome(data.monthlyIncome),
      monthlyExpenses: this.validateMonthlyExpenses(data.monthlyExpenses, data.monthlyIncome)
    };
  }

  // Individual field validators
  static validateName(name: string, fieldName: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters` };
    }

    if (name.trim().length > 50) {
      return { isValid: false, error: `${fieldName} cannot exceed 50 characters` };
    }

    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }

    return { isValid: true };
  }

  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  }

  static validatePhoneNumber(phone: string): ValidationResult {
    if (!phone || phone.trim().length === 0) {
      return { isValid: true }; // Phone is optional
    }

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length !== 10) {
      return { isValid: false, error: 'Phone number must be 10 digits' };
    }

    return { isValid: true };
  }

  static validateDateOfBirth(dateString: string): ValidationResult {
    if (!dateString) {
      return { isValid: false, error: 'Date of birth is required' };
    }

    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    
    if (!isValid(date)) {
      return { isValid: false, error: 'Please enter a valid date' };
    }

    if (isFuture(date)) {
      return { isValid: false, error: 'Date of birth cannot be in the future' };
    }

    const age = differenceInYears(new Date(), date);
    
    if (age < 18) {
      return { isValid: false, error: 'You must be at least 18 years old to apply for credit' };
    }

    if (age > 120) {
      return { isValid: false, error: 'Please enter a valid date of birth' };
    }

    if (age > 65) {
      return { 
        isValid: true, 
        warning: 'Age may affect certain loan eligibility requirements'
      };
    }

    return { isValid: true };
  }

  static validateSSN(ssn: string): ValidationResult {
    if (!ssn || ssn.trim().length === 0) {
      return { isValid: false, error: 'Social Security Number is required' };
    }

    // Remove all non-digit characters
    const digitsOnly = ssn.replace(/\D/g, '');
    
    if (digitsOnly.length !== 9) {
      return { isValid: false, error: 'SSN must be 9 digits' };
    }

    // Check for invalid SSN patterns
    if (digitsOnly === '000000000' || 
        digitsOnly === '123456789' || 
        digitsOnly.startsWith('000') ||
        digitsOnly.startsWith('666') ||
        digitsOnly.startsWith('9')) {
      return { isValid: false, error: 'Please enter a valid SSN' };
    }

    return { isValid: true };
  }

  static validateStreetAddress(address: string): ValidationResult {
    if (!address || address.trim().length === 0) {
      return { isValid: false, error: 'Street address is required' };
    }

    if (address.trim().length < 5) {
      return { isValid: false, error: 'Please enter a complete street address' };
    }

    return { isValid: true };
  }

  static validateCity(city: string): ValidationResult {
    if (!city || city.trim().length === 0) {
      return { isValid: false, error: 'City is required' };
    }

    if (city.trim().length < 2) {
      return { isValid: false, error: 'City name must be at least 2 characters' };
    }

    return { isValid: true };
  }

  static validateState(state: string): ValidationResult {
    if (!state || state.trim().length === 0) {
      return { isValid: false, error: 'State is required' };
    }

    return { isValid: true };
  }

  static validateZipCode(zipCode: string): ValidationResult {
    if (!zipCode || zipCode.trim().length === 0) {
      return { isValid: false, error: 'ZIP code is required' };
    }

    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) {
      return { isValid: false, error: 'Please enter a valid ZIP code (12345 or 12345-6789)' };
    }

    return { isValid: true };
  }

  static validateEmployerName(employerName: string): ValidationResult {
    if (!employerName || employerName.trim().length === 0) {
      return { isValid: false, error: 'Employer name is required' };
    }

    if (employerName.trim().length < 2) {
      return { isValid: false, error: 'Employer name must be at least 2 characters' };
    }

    return { isValid: true };
  }

  static validateJobTitle(jobTitle: string): ValidationResult {
    if (!jobTitle || jobTitle.trim().length === 0) {
      return { isValid: false, error: 'Job title is required' };
    }

    if (jobTitle.trim().length < 2) {
      return { isValid: false, error: 'Job title must be at least 2 characters' };
    }

    return { isValid: true };
  }

  static validateAnnualSalary(salary: string | number): ValidationResult {
    const salaryNum = typeof salary === 'string' ? parseFloat(salary) : salary;
    
    if (!salaryNum || isNaN(salaryNum)) {
      return { isValid: false, error: 'Annual salary is required' };
    }

    if (salaryNum < 0) {
      return { isValid: false, error: 'Salary cannot be negative' };
    }

    if (salaryNum < 1000) {
      return { isValid: false, error: 'Please enter a valid annual salary (minimum $1,000)' };
    }

    if (salaryNum > 10000000) {
      return { isValid: false, error: 'Please enter a realistic salary amount' };
    }

    if (salaryNum < 15000) {
      return { 
        isValid: true, 
        warning: 'Low income may limit loan options' 
      };
    }

    return { isValid: true };
  }

  static validateEmploymentStartDate(dateString: string): ValidationResult {
    if (!dateString) {
      return { isValid: true }; // Optional field
    }

    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    
    if (!isValid(date)) {
      return { isValid: false, error: 'Please enter a valid date' };
    }

    if (isFuture(date)) {
      return { isValid: false, error: 'Employment start date cannot be in the future' };
    }

    const yearsAgo = differenceInYears(new Date(), date);
    
    if (yearsAgo > 50) {
      return { isValid: false, error: 'Please enter a valid employment start date' };
    }

    return { isValid: true };
  }

  static validateEmploymentType(employmentType: string): ValidationResult {
    const validTypes = ['full-time', 'part-time', 'contract', 'self-employed'];
    
    if (!employmentType) {
      return { isValid: true }; // Optional field
    }

    if (!validTypes.includes(employmentType)) {
      return { isValid: false, error: 'Please select a valid employment type' };
    }

    return { isValid: true };
  }

  static validateHousingType(housingType: string): ValidationResult {
    const validTypes = ['rent', 'own', 'family'];
    
    if (!housingType) {
      return { isValid: false, error: 'Housing type is required' };
    }

    if (!validTypes.includes(housingType)) {
      return { isValid: false, error: 'Please select a valid housing type' };
    }

    return { isValid: true };
  }

  static validateLandlordName(landlordName: string, housingType: string): ValidationResult {
    if (housingType === 'rent') {
      if (!landlordName || landlordName.trim().length === 0) {
        return { isValid: false, error: 'Landlord name is required for renters' };
      }

      if (landlordName.trim().length < 2) {
        return { isValid: false, error: 'Landlord name must be at least 2 characters' };
      }
    }

    return { isValid: true };
  }

  static validateMonthlyRent(rent: string | number, housingType: string): ValidationResult {
    if (housingType === 'rent') {
      const rentNum = typeof rent === 'string' ? parseFloat(rent) : rent;
      
      if (!rentNum || isNaN(rentNum)) {
        return { isValid: false, error: 'Monthly rent is required for renters' };
      }

      if (rentNum < 0) {
        return { isValid: false, error: 'Rent cannot be negative' };
      }

      if (rentNum < 100) {
        return { isValid: false, error: 'Please enter a realistic rent amount (minimum $100)' };
      }

      if (rentNum > 50000) {
        return { isValid: false, error: 'Please enter a realistic rent amount' };
      }

      if (rentNum > 10000) {
        return { 
          isValid: true, 
          warning: 'High rent may affect debt-to-income ratio' 
        };
      }
    }

    return { isValid: true };
  }

  static validateLeaseStartDate(dateString: string, housingType: string): ValidationResult {
    if (housingType === 'rent' && !dateString) {
      return { isValid: false, error: 'Lease start date is required for renters' };
    }

    if (dateString) {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      
      if (!isValid(date)) {
        return { isValid: false, error: 'Please enter a valid date' };
      }

      const yearsAgo = differenceInYears(new Date(), date);
      
      if (yearsAgo > 10) {
        return { isValid: false, error: 'Lease start date seems too old' };
      }
    }

    return { isValid: true };
  }

  static validateBankName(bankName: string): ValidationResult {
    if (!bankName || bankName.trim().length === 0) {
      return { isValid: false, error: 'Bank name is required' };
    }

    if (bankName.trim().length < 2) {
      return { isValid: false, error: 'Bank name must be at least 2 characters' };
    }

    return { isValid: true };
  }

  static validateAccountType(accountType: string): ValidationResult {
    const validTypes = ['checking', 'savings', 'both'];
    
    if (!accountType) {
      return { isValid: false, error: 'Account type is required' };
    }

    if (!validTypes.includes(accountType)) {
      return { isValid: false, error: 'Please select a valid account type' };
    }

    return { isValid: true };
  }

  static validateMonthlyIncome(income: string | number): ValidationResult {
    const incomeNum = typeof income === 'string' ? parseFloat(income) : income;
    
    if (!incomeNum || isNaN(incomeNum)) {
      return { isValid: true }; // Optional field
    }

    if (incomeNum < 0) {
      return { isValid: false, error: 'Income cannot be negative' };
    }

    if (incomeNum > 1000000) {
      return { isValid: false, error: 'Please enter a realistic monthly income' };
    }

    return { isValid: true };
  }

  static validateMonthlyExpenses(expenses: string | number, income: string | number): ValidationResult {
    const expensesNum = typeof expenses === 'string' ? parseFloat(expenses) : expenses;
    const incomeNum = typeof income === 'string' ? parseFloat(income) : income;
    
    if (!expensesNum || isNaN(expensesNum)) {
      return { isValid: true }; // Optional field
    }

    if (expensesNum < 0) {
      return { isValid: false, error: 'Expenses cannot be negative' };
    }

    if (expensesNum > 1000000) {
      return { isValid: false, error: 'Please enter a realistic monthly expense amount' };
    }

    if (incomeNum && expensesNum > incomeNum * 1.2) {
      return { 
        isValid: true, 
        warning: 'Expenses exceeding income may affect loan eligibility' 
      };
    }

    return { isValid: true };
  }

  // Comprehensive validation for complete form
  static validateCompleteProfile(data: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    summary: {
      personalInfo: boolean;
      employment: boolean;
      housing: boolean;
      banking: boolean;
    };
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const personalInfo = this.validatePersonalInfo(data.personalInfo || {});
    const employment = this.validateEmployment(data.employment || {});
    const housing = this.validateHousing(data.housing || {});
    const banking = this.validateBanking(data.banking || {});

    // Collect errors and warnings
    const collectIssues = (validation: any, prefix: string) => {
      Object.entries(validation).forEach(([key, result]: [string, any]) => {
        if (typeof result === 'object' && result.isValid !== undefined) {
          if (!result.isValid && result.error) {
            errors.push(`${prefix} ${result.error}`);
          }
          if (result.warning) {
            warnings.push(`${prefix} ${result.warning}`);
          }
        } else if (typeof result === 'object') {
          collectIssues(result, `${prefix} ${key}:`);
        }
      });
    };

    collectIssues(personalInfo, 'Personal Info:');
    collectIssues(employment, 'Employment:');
    collectIssues(housing, 'Housing:');
    collectIssues(banking, 'Banking:');

    const summary = {
      personalInfo: Object.values(personalInfo).every((field: any) => 
        typeof field === 'object' && field.isValid !== undefined ? field.isValid : 
        Object.values(field).every((subField: any) => subField.isValid)
      ),
      employment: Object.values(employment).every((field: any) => field.isValid),
      housing: Object.values(housing).every((field: any) => field.isValid),
      banking: Object.values(banking).every((field: any) => field.isValid)
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary
    };
  }
}
