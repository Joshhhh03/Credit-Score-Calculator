import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Briefcase,
  Home,
  DollarSign,
  Calendar,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PostSignInDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Personal Info
  dateOfBirth: string;
  phone: string;

  // Employment
  employerName: string;
  jobTitle: string;
  annualSalary: string;
  employmentType: string;

  // Housing
  housingType: string;
  monthlyRent: string;

  // Banking
  bankName: string;
  monthlyIncome: string;
  monthlyExpenses: string;

  // Traditional Credit
  hasTraditionalCredit: string;
}

export default function PostSignInDataModal({
  isOpen,
  onClose,
}: PostSignInDataModalProps) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    dateOfBirth: "",
    phone: "",
    employerName: "",
    jobTitle: "",
    annualSalary: "",
    employmentType: "",
    housingType: "",
    monthlyRent: "",
    bankName: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    hasTraditionalCredit: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save data to user profile via API
      const response = await fetch(`/api/auth/profile/${user?.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalInfo: {
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
          },
          financialData: {
            employment: {
              employerName: formData.employerName,
              jobTitle: formData.jobTitle,
              annualSalary: parseInt(formData.annualSalary) || 0,
              employmentType: formData.employmentType,
            },
            housing: {
              housingType: formData.housingType,
              monthlyRent: parseInt(formData.monthlyRent) || 0,
            },
            banking: {
              bankName: formData.bankName,
              monthlyIncome: parseInt(formData.monthlyIncome) || 0,
              monthlyExpenses: parseInt(formData.monthlyExpenses) || 0,
            },
          },
          traditionalCredit: {
            hasCredit: formData.hasTraditionalCredit,
          },
        }),
      });

      if (response.ok) {
        // Update local user state
        updateUser({ hasCompletedProfile: true });
        onClose();
        // Navigate to dashboard or analytics
        navigate("/analytics");
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.dateOfBirth && formData.phone;
      case 2:
        return (
          formData.employerName &&
          formData.jobTitle &&
          formData.annualSalary &&
          formData.employmentType
        );
      case 3:
        return formData.housingType && formData.monthlyRent;
      case 4:
        return (
          formData.bankName &&
          formData.monthlyIncome &&
          formData.monthlyExpenses &&
          formData.hasTraditionalCredit
        );
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Let's Build Your Credit Profile
          </DialogTitle>
          <DialogDescription>
            We need some basic information to calculate your personalized credit
            score using alternative data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2"
            />
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>
                  Basic information for identity verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      updateFormData("dateOfBirth", e.target.value)
                    }
                    max={
                      new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Employment Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <CardTitle>Employment Information</CardTitle>
                </div>
                <CardDescription>
                  Your work history helps build your credit profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input
                    id="employerName"
                    placeholder="Company Inc."
                    value={formData.employerName}
                    onChange={(e) =>
                      updateFormData("employerName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => updateFormData("jobTitle", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="annualSalary">Annual Salary</Label>
                  <Input
                    id="annualSalary"
                    type="number"
                    placeholder="75000"
                    value={formData.annualSalary}
                    onChange={(e) =>
                      updateFormData("annualSalary", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    onValueChange={(value) =>
                      updateFormData("employmentType", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="self-employed">
                        Self-employed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Housing Information */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <CardTitle>Housing Information</CardTitle>
                </div>
                <CardDescription>
                  Rent payments are a key factor in alternative credit scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="housingType">Housing Type</Label>
                  <Select
                    onValueChange={(value) =>
                      updateFormData("housingType", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select housing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="own">Own</SelectItem>
                      <SelectItem value="family">Live with Family</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyRent">Monthly Housing Payment</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="1200"
                    value={formData.monthlyRent}
                    onChange={(e) =>
                      updateFormData("monthlyRent", e.target.value)
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Banking and Credit Information */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <CardTitle>Financial Information</CardTitle>
                </div>
                <CardDescription>
                  Banking history and income details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Primary Bank</Label>
                  <Input
                    id="bankName"
                    placeholder="Chase Bank"
                    value={formData.bankName}
                    onChange={(e) => updateFormData("bankName", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="5000"
                      value={formData.monthlyIncome}
                      onChange={(e) =>
                        updateFormData("monthlyIncome", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      placeholder="3500"
                      value={formData.monthlyExpenses}
                      onChange={(e) =>
                        updateFormData("monthlyExpenses", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hasTraditionalCredit">
                    Do you have traditional credit history?
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateFormData("hasTraditionalCredit", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">
                        Yes, I have credit cards/loans
                      </SelectItem>
                      <SelectItem value="limited">
                        Limited credit history
                      </SelectItem>
                      <SelectItem value="no">No traditional credit</SelectItem>
                      <SelectItem value="unsure">Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Benefits info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Why we need this information:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Employment history shows income stability</li>
              <li>• Rent payments demonstrate financial responsibility</li>
              <li>• Banking data reveals spending patterns</li>
              <li>• All data is encrypted and securely stored</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
