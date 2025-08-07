import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  ArrowRight, 
  CheckCircle,
  Building,
  Zap,
  DollarSign,
  Calendar,
  Shield,
  User,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hasRentHistory: false,
    hasUtilities: false,
    hasBankAccount: false,
    hasEmployment: false
  });

  const steps = [
    {
      title: "Personal Information",
      description: "Basic information to get started"
    },
    {
      title: "Data Sources",
      description: "What financial data can you share?"
    },
    {
      title: "Get Your Score",
      description: "Calculate your initial credit score"
    }
  ];

  const dataSources = [
    {
      id: "rent",
      title: "Rent Payments",
      description: "12+ months of on-time rent payments",
      icon: <Building className="h-6 w-6" />,
      impact: "+30 points",
      color: "bg-green-100 text-green-700"
    },
    {
      id: "utilities",
      title: "Utility Bills",
      description: "Electric, gas, water, internet payments",
      icon: <Zap className="h-6 w-6" />,
      impact: "+15 points",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      id: "banking",
      title: "Bank Account",
      description: "Cash flow and transaction history",
      icon: <DollarSign className="h-6 w-6" />,
      impact: "+25 points",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "employment",
      title: "Employment",
      description: "Job history and income verification",
      icon: <Calendar className="h-6 w-6" />,
      impact: "+20 points",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getEstimatedScore = () => {
    let baseScore = 600;
    if (formData.hasRentHistory) baseScore += 30;
    if (formData.hasUtilities) baseScore += 15;
    if (formData.hasBankAccount) baseScore += 25;
    if (formData.hasEmployment) baseScore += 20;
    return Math.min(baseScore, 850);
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
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  index + 1 === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : index + 1 < currentStep 
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1 < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-24 mx-4 ${
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
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Which of these financial data sources can you provide?
                  </h3>
                  <p className="text-gray-600">
                    Select all that apply. Don't worry - you can add more data sources later.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <Card 
                      key={source.id}
                      className={`cursor-pointer transition-all ${
                        formData[`has${source.id.charAt(0).toUpperCase() + source.id.slice(1)}` as keyof typeof formData]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        const field = `has${source.id.charAt(0).toUpperCase() + source.id.slice(1)}` as keyof typeof formData;
                        handleInputChange(field, !formData[field]);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${source.color} mr-4`}>
                              {source.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{source.title}</h4>
                              <p className="text-sm text-gray-600">{source.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-green-600 border-green-200 mr-2">
                              {source.impact}
                            </Badge>
                            {formData[`has${source.id.charAt(0).toUpperCase() + source.id.slice(1)}` as keyof typeof formData] && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Estimated CreditBridge Score
                  </h3>
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {getEstimatedScore()}
                  </div>
                  <Badge className="text-lg px-4 py-2 bg-green-100 text-green-700">
                    Good Credit Range
                  </Badge>
                </div>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-900 mb-4">What this score means:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
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

                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    This is just an estimate. Connect your real data to get your official CreditBridge score and unlock personalized coaching.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/data-sources">
                      <Button size="lg">
                        Connect My Data
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button size="lg" variant="outline">
                        View Demo Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
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
              disabled={currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email)}
            >
              Next
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
                  We use bank-level encryption and never store your login credentials. 
                  Your information is protected and only used to calculate your credit score.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
