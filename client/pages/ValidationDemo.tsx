import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DateInput from "@/components/DateInput";
import { CreditDataValidator } from "@/utils/validation";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calendar,
  List,
  Keyboard,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ValidationDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    dateOfBirth: "",
    employmentStart: "",
    leaseStart: "",
    annualSalary: "",
    ssn: "",
  });

  const [validationResults, setValidationResults] = useState<{
    [key: string]: any;
  }>({});
  const [showValidation, setShowValidation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (showValidation) {
      validateField(field, value);
    }
  };

  const validateField = (field: string, value: string) => {
    let result = { isValid: true, error: "", warning: "" };

    switch (field) {
      case "firstName":
        result = CreditDataValidator.validateName(value, "First name");
        break;
      case "email":
        result = CreditDataValidator.validateEmail(value);
        break;
      case "dateOfBirth":
        result = CreditDataValidator.validateDateOfBirth(value);
        break;
      case "employmentStart":
        result = CreditDataValidator.validateEmploymentStartDate(value);
        break;
      case "annualSalary":
        result = CreditDataValidator.validateAnnualSalary(value);
        break;
      case "ssn":
        result = CreditDataValidator.validateSSN(value);
        break;
    }

    setValidationResults((prev) => ({
      ...prev,
      [field]: result,
    }));
  };

  const validateAll = () => {
    setShowValidation(true);
    Object.entries(formData).forEach(([field, value]) => {
      validateField(field, value);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                CreditBridge
              </span>
            </Link>
            <Link to="/get-started">
              <Button variant="ghost">Back to Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Date Input & Validation Demo
          </h1>
          <p className="text-xl text-gray-600">
            Try the new date input methods and see real-time validation in
            action
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Date Input Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Enhanced Date Input
              </CardTitle>
              <CardDescription>
                Multiple input methods with smart validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendar
                  </div>
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-1" />
                    Dropdowns
                  </div>
                  <div className="flex items-center">
                    <Keyboard className="h-4 w-4 mr-1" />
                    Text Input
                  </div>
                </div>
              </div>

              <DateInput
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(value) => handleInputChange("dateOfBirth", value)}
                required={true}
                constraints={{
                  minAge: 18,
                  maxAge: 120,
                  futureAllowed: false,
                  pastRequired: true,
                }}
                maxDate={new Date()}
              />

              <DateInput
                label="Employment Start Date"
                value={formData.employmentStart}
                onChange={(value) =>
                  handleInputChange("employmentStart", value)
                }
                constraints={{
                  futureAllowed: false,
                  pastRequired: true,
                }}
                maxDate={new Date()}
                placeholder="When did you start your current job?"
              />

              <DateInput
                label="Lease Start Date"
                value={formData.leaseStart}
                onChange={(value) => handleInputChange("leaseStart", value)}
                placeholder="When did your lease begin?"
              />
            </CardContent>
          </Card>

          {/* Input Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Smart Validation
              </CardTitle>
              <CardDescription>
                Real-time validation with business logic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className={
                    showValidation && !validationResults.firstName?.isValid
                      ? "border-red-500"
                      : ""
                  }
                />
                {showValidation && validationResults.firstName?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationResults.firstName.error}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={
                    showValidation && !validationResults.email?.isValid
                      ? "border-red-500"
                      : ""
                  }
                />
                {showValidation && validationResults.email?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationResults.email.error}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="annualSalary">Annual Salary</Label>
                <Input
                  id="annualSalary"
                  type="number"
                  value={formData.annualSalary}
                  onChange={(e) =>
                    handleInputChange("annualSalary", e.target.value)
                  }
                  placeholder="Enter your annual salary"
                  className={
                    showValidation && !validationResults.annualSalary?.isValid
                      ? "border-red-500"
                      : ""
                  }
                />
                {showValidation && validationResults.annualSalary?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationResults.annualSalary.error}
                  </p>
                )}
                {showValidation && validationResults.annualSalary?.warning && (
                  <p className="text-sm text-yellow-600 mt-1">
                    {validationResults.annualSalary.warning}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ssn">Social Security Number</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange("ssn", e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className={
                    showValidation && !validationResults.ssn?.isValid
                      ? "border-red-500"
                      : ""
                  }
                />
                {showValidation && validationResults.ssn?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationResults.ssn.error}
                  </p>
                )}
              </div>

              <Button onClick={validateAll} className="w-full">
                <AlertCircle className="h-4 w-4 mr-2" />
                Validate All Fields
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Enhanced Features</CardTitle>
            <CardDescription>
              New date input and validation capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Date Input Improvements</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Three input methods: Calendar, Dropdowns, Text
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Multiple date format support (MM/DD/YYYY, DD/MM/YYYY, etc.)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Age-based validation for credit eligibility
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Future/past date constraints
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Validation Enhancements</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Real-time validation with instant feedback
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Business logic constraints (minimum age 18, realistic
                    salaries)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Format validation for SSN, email, phone
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Warning messages for edge cases
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Alert className="border-blue-200 bg-blue-50 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              All validations ensure data quality for accurate credit score
              calculations. The system now prevents invalid data from affecting
              your credit assessment.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
