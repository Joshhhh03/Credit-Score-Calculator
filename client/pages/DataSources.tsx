import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Building,
  Zap,
  DollarSign,
  Calendar,
  CheckCircle,
  Plus,
  Upload,
  Shield,
  ArrowRight,
  FileText,
  Landmark,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DataSource {
  id: string;
  name: string;
  type: "bank" | "rent" | "utility" | "employment";
  status: "connected" | "pending" | "disconnected";
  lastUpdated?: string;
  icon: React.ReactNode;
  color: string;
}

export default function DataSources() {
  const [connectedSources, setConnectedSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Chase Checking",
      type: "bank",
      status: "connected",
      lastUpdated: "2 hours ago",
      icon: <Landmark className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "2",
      name: "Rent Payments",
      type: "rent",
      status: "connected",
      lastUpdated: "1 day ago",
      icon: <Building className="h-5 w-5" />,
      color: "bg-green-100 text-green-700",
    },
  ]);

  const [formData, setFormData] = useState({
    bankName: "",
    accountType: "",
    employerName: "",
    jobTitle: "",
    salary: "",
    startDate: "",
    utilityProvider: "",
    utilityType: "",
    monthlyAmount: "",
    landlordName: "",
    rentAmount: "",
    leaseStart: "",
  });

  const availableConnections = [
    {
      name: "Bank Account",
      description:
        "Connect your checking/savings account to verify income and spending patterns",
      icon: <Landmark className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-700",
      scoreImpact: "+25 points",
    },
    {
      name: "Employment",
      description: "Verify your employment history and income stability",
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-700",
      scoreImpact: "+20 points",
    },
    {
      name: "Utility Bills",
      description: "Show consistent utility payment history",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-700",
      scoreImpact: "+15 points",
    },
    {
      name: "Rent Payments",
      description: "Demonstrate responsible housing payment history",
      icon: <Building className="h-6 w-6" />,
      color: "bg-green-100 text-green-700",
      scoreImpact: "+30 points",
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-700">Connected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Your Financial Data
          </h1>
          <p className="text-gray-600">
            Add alternative data sources to build a comprehensive credit profile
          </p>
        </div>

        {/* Connected Sources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Connected Data Sources
            </CardTitle>
            <CardDescription>
              Your currently connected financial data sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedSources.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedSources.map((source) => (
                  <div
                    key={source.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${source.color} mr-3`}>
                        {source.icon}
                      </div>
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-gray-500">
                          Updated {source.lastUpdated}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data sources connected yet
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="quick-connect" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick-connect">Quick Connect</TabsTrigger>
            <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-connect" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {availableConnections.map((connection, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-lg ${connection.color} mr-4`}
                        >
                          {connection.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {connection.name}
                          </CardTitle>
                          <CardDescription>
                            {connection.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        {connection.scoreImpact}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect {connection.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-8">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload bank statements, pay stubs, or lease agreements
                  manually
                </p>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual-entry" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Employment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Employment Information
                  </CardTitle>
                  <CardDescription>
                    Help us verify your employment and income
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      value={formData.employerName}
                      onChange={(e) =>
                        handleInputChange("employerName", e.target.value)
                      }
                      placeholder="Enter your employer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        handleInputChange("jobTitle", e.target.value)
                      }
                      placeholder="Enter your job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">Annual Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) =>
                        handleInputChange("salary", e.target.value)
                      }
                      placeholder="Enter your annual salary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employment Info
                  </Button>
                </CardContent>
              </Card>

              {/* Rent Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Rent Payment History
                  </CardTitle>
                  <CardDescription>
                    Show your responsible housing payment history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="landlordName">
                      Landlord/Property Manager
                    </Label>
                    <Input
                      id="landlordName"
                      value={formData.landlordName}
                      onChange={(e) =>
                        handleInputChange("landlordName", e.target.value)
                      }
                      placeholder="Enter landlord name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rentAmount">Monthly Rent</Label>
                    <Input
                      id="rentAmount"
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) =>
                        handleInputChange("rentAmount", e.target.value)
                      }
                      placeholder="Enter monthly rent amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaseStart">Lease Start Date</Label>
                    <Input
                      id="leaseStart"
                      type="date"
                      value={formData.leaseStart}
                      onChange={(e) =>
                        handleInputChange("leaseStart", e.target.value)
                      }
                    />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rent History
                  </Button>
                </CardContent>
              </Card>

              {/* Utility Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Utility Payments
                  </CardTitle>
                  <CardDescription>
                    Demonstrate consistent utility payment history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="utilityProvider">Utility Provider</Label>
                    <Input
                      id="utilityProvider"
                      value={formData.utilityProvider}
                      onChange={(e) =>
                        handleInputChange("utilityProvider", e.target.value)
                      }
                      placeholder="e.g., ConEd, PG&E"
                    />
                  </div>
                  <div>
                    <Label htmlFor="utilityType">Utility Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("utilityType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select utility type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="gas">Gas</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="internet">Internet</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="monthlyAmount">
                      Average Monthly Amount
                    </Label>
                    <Input
                      id="monthlyAmount"
                      type="number"
                      value={formData.monthlyAmount}
                      onChange={(e) =>
                        handleInputChange("monthlyAmount", e.target.value)
                      }
                      placeholder="Enter average monthly bill"
                    />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Utility History
                  </Button>
                </CardContent>
              </Card>

              {/* Bank Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Landmark className="h-5 w-5 mr-2" />
                    Banking Information
                  </CardTitle>
                  <CardDescription>
                    Connect your bank account for cash flow analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) =>
                        handleInputChange("bankName", e.target.value)
                      }
                      placeholder="Enter your bank name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("accountType", value)
                      }
                    >
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
                  <Button className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure Bank Connect
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-blue-600 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Your Data is Secure
                </h3>
                <p className="text-blue-800 text-sm">
                  We use bank-level encryption and never store your login
                  credentials. Your financial data is protected with the highest
                  security standards and is only used to calculate your credit
                  score.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to see your score?
          </h3>
          <p className="text-gray-600 mb-4">
            Once you've connected your data sources, we'll calculate your
            comprehensive credit score.
          </p>
          <Link to="/dashboard">
            <Button size="lg">
              View My Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
