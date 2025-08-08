import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Download, FileText, Share, Calendar, Building, DollarSign, CreditCard } from "lucide-react";

interface UserData {
  userId: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
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
      monthlyRent?: number;
      rentPaymentHistory: any[];
    };
    banking: {
      bankName: string;
      accountType: string;
      routingNumber: string;
      monthlyIncome: number;
      monthlyExpenses: number;
      averageBalance: number;
    };
    utilities: any[];
  };
  traditionalCredit: {
    hasCredit: string;
  };
  creditHistory: any[];
  analytics: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    riskProfile: string;
    loanEligibility: {
      creditCards: boolean;
      personalLoans: boolean;
      autoLoans: boolean;
      mortgages: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export default function UserDataExport() {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/auth/profile/${user.userId}`);
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const generateTextReport = (data: UserData): string => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'Not provided';
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    return `
CREDITBRIDGE USER DATA REPORT
============================================

PERSONAL INFORMATION
--------------------------------------------
Name: ${data.personalInfo.firstName} ${data.personalInfo.lastName}
Email: ${data.email}
Phone: ${data.personalInfo.phone || 'Not provided'}
Date of Birth: ${formatDate(data.personalInfo.dateOfBirth)}
Address: ${data.personalInfo.address.street || 'Not provided'}
         ${data.personalInfo.address.city || ''} ${data.personalInfo.address.state || ''} ${data.personalInfo.address.zipCode || ''}

EMPLOYMENT INFORMATION
--------------------------------------------
Employer: ${data.financialData.employment.employerName || 'Not provided'}
Job Title: ${data.financialData.employment.jobTitle || 'Not provided'}
Employment Type: ${data.financialData.employment.employmentType || 'Not provided'}
Annual Salary: ${data.financialData.employment.annualSalary ? formatCurrency(data.financialData.employment.annualSalary) : 'Not provided'}
Start Date: ${formatDate(data.financialData.employment.startDate)}
Work Address: ${data.financialData.employment.workAddress || 'Not provided'}

HOUSING INFORMATION
--------------------------------------------
Housing Type: ${data.financialData.housing.housingType || 'Not provided'}
Monthly Housing Payment: ${data.financialData.housing.monthlyRent ? formatCurrency(data.financialData.housing.monthlyRent) : 'Not provided'}
Rent Payment History: ${data.financialData.housing.rentPaymentHistory.length} records

BANKING INFORMATION
--------------------------------------------
Primary Bank: ${data.financialData.banking.bankName || 'Not provided'}
Account Type: ${data.financialData.banking.accountType || 'Not provided'}
Monthly Income: ${data.financialData.banking.monthlyIncome ? formatCurrency(data.financialData.banking.monthlyIncome) : 'Not provided'}
Monthly Expenses: ${data.financialData.banking.monthlyExpenses ? formatCurrency(data.financialData.banking.monthlyExpenses) : 'Not provided'}
Average Balance: ${data.financialData.banking.averageBalance ? formatCurrency(data.financialData.banking.averageBalance) : 'Not provided'}

CREDIT INFORMATION
--------------------------------------------
Traditional Credit: ${data.traditionalCredit.hasCredit || 'Not specified'}
Credit History Records: ${data.creditHistory.length} entries
Risk Profile: ${data.analytics.riskProfile || 'Not assessed'}

LOAN ELIGIBILITY
--------------------------------------------
Credit Cards: ${data.analytics.loanEligibility.creditCards ? 'Eligible' : 'Not Eligible'}
Personal Loans: ${data.analytics.loanEligibility.personalLoans ? 'Eligible' : 'Not Eligible'}
Auto Loans: ${data.analytics.loanEligibility.autoLoans ? 'Eligible' : 'Not Eligible'}
Mortgages: ${data.analytics.loanEligibility.mortgages ? 'Eligible' : 'Not Eligible'}

FINANCIAL STRENGTHS
--------------------------------------------
${data.analytics.strengths.length > 0 ? data.analytics.strengths.map((strength, index) => `${index + 1}. ${strength}`).join('\n') : 'No strengths recorded'}

AREAS FOR IMPROVEMENT
--------------------------------------------
${data.analytics.weaknesses.length > 0 ? data.analytics.weaknesses.map((weakness, index) => `${index + 1}. ${weakness}`).join('\n') : 'No areas identified'}

RECOMMENDATIONS
--------------------------------------------
${data.analytics.recommendations.length > 0 ? data.analytics.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n') : 'No recommendations available'}

ACCOUNT INFORMATION
--------------------------------------------
Account Created: ${formatDate(data.createdAt)}
Last Updated: ${formatDate(data.updatedAt)}
Last Login: ${formatDate(data.lastLogin)}

============================================
Report generated on: ${new Date().toLocaleString()}
User ID: ${data.userId}

This report contains sensitive financial information.
Please keep it secure and do not share with unauthorized parties.
`;
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportData = async (format: 'txt' | 'json') => {
    setIsExporting(true);
    
    try {
      await fetchUserData();
      
      if (!userData && user) {
        // If userData is not loaded yet, fetch it
        const response = await fetch(`/api/auth/profile/${user.userId}`);
        const data = await response.json();
        if (data.success) {
          const currentUserData = data.user;
          
          if (format === 'txt') {
            const textReport = generateTextReport(currentUserData);
            downloadTextFile(textReport, `creditbridge-report-${user.firstName}-${user.lastName}-${new Date().toISOString().split('T')[0]}.txt`);
          } else if (format === 'json') {
            const jsonData = JSON.stringify(currentUserData, null, 2);
            downloadTextFile(jsonData, `creditbridge-data-${user.firstName}-${user.lastName}-${new Date().toISOString().split('T')[0]}.json`);
          }
        }
      } else if (userData) {
        if (format === 'txt') {
          const textReport = generateTextReport(userData);
          downloadTextFile(textReport, `creditbridge-report-${user?.firstName}-${user?.lastName}-${new Date().toISOString().split('T')[0]}.txt`);
        } else if (format === 'json') {
          const jsonData = JSON.stringify(userData, null, 2);
          downloadTextFile(jsonData, `creditbridge-data-${user?.firstName}-${user?.lastName}-${new Date().toISOString().split('T')[0]}.json`);
        }
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={fetchUserData}>
          <Download className="h-4 w-4 mr-2" />
          Export My Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Your CreditBridge Data</DialogTitle>
          <DialogDescription>
            Download your financial profile and credit data in a secure, readable format
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleExportData('txt')}>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <CardTitle className="text-lg">Text Report</CardTitle>
                    <CardDescription>Human-readable format</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Complete profile summary with all your financial data, recommendations, and analytics in an easy-to-read format.
                </p>
                <Badge variant="secondary">Recommended</Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleExportData('json')}>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Share className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <CardTitle className="text-lg">JSON Data</CardTitle>
                    <CardDescription>Raw data format</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Complete structured data export for technical users or data portability.
                </p>
                <Badge variant="outline">Technical</Badge>
              </CardContent>
            </Card>
          </div>

          {userData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Data Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Employment: {userData.financialData.employment.employerName || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                    <span>Bank: {userData.financialData.banking.bankName || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Last Updated: {new Date(userData.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-orange-600" />
                    <span>Credit Records: {userData.creditHistory.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Privacy Notice</h4>
            <p className="text-sm text-yellow-700">
              Your exported data contains sensitive financial information. Please store it securely 
              and do not share it with unauthorized parties. CreditBridge takes your privacy seriously.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => handleExportData('txt')} 
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? 'Generating...' : 'Download Text Report'}
            </Button>
            <Button 
              onClick={() => handleExportData('json')} 
              disabled={isExporting}
              variant="outline"
              className="flex-1"
            >
              {isExporting ? 'Generating...' : 'Download JSON Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
