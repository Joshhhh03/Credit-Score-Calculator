import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditScoreBar from "@/components/CreditScoreBar";
import ScoreHistoryChart from "@/components/ScoreHistoryChart";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Building,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Target,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

interface ScoreFactor {
  category: string;
  impact: "positive" | "negative" | "neutral";
  score: number;
  description: string;
  icon: React.ReactNode;
  recommendations: string[];
}

export default function Dashboard() {
  const [creditScore, setCreditScore] = useState(723);
  const [scoreChange, setScoreChange] = useState("+12");
  const [lastUpdated, setLastUpdated] = useState("2 hours ago");

  const scoreFactors: ScoreFactor[] = [
    {
      category: "Rent Payments",
      impact: "positive",
      score: 85,
      description: "24 months of on-time rent payments",
      icon: <Building className="h-5 w-5" />,
      recommendations: ["Continue making on-time payments", "Consider asking landlord for reference letter"]
    },
    {
      category: "Utility Payments",
      impact: "positive", 
      score: 78,
      description: "Consistent utility payment history",
      icon: <Zap className="h-5 w-5" />,
      recommendations: ["Set up autopay for all utilities", "Consider consolidating utility accounts"]
    },
    {
      category: "Cash Flow",
      impact: "neutral",
      score: 65,
      description: "Moderate income stability",
      icon: <DollarSign className="h-5 w-5" />,
      recommendations: ["Increase savings rate", "Consider additional income sources", "Build emergency fund"]
    },
    {
      category: "Employment History",
      impact: "positive",
      score: 82,
      description: "3+ years at current employer",
      icon: <Calendar className="h-5 w-5" />,
      recommendations: ["Maintain stable employment", "Update income information when promoted"]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-600";
    if (score >= 600) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good"; 
    if (score >= 650) return "Fair";
    return "Poor";
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "border-green-200 bg-green-50";
      case "negative":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
              <Link to="/data-sources">
                <Button variant="ghost">Add Data</Button>
              </Link>
              <Link to="/coaching">
                <Button variant="ghost">Coaching</Button>
              </Link>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Score
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Credit Dashboard</h1>
          <p className="text-gray-600">Track your alternative credit score and see what's affecting it</p>
        </div>

        {/* Credit Score Card */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Your CreditBridge Score</CardTitle>
                  <CardDescription>Updated {lastUpdated}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {scoreChange} this month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <CreditScoreGauge score={creditScore} size={280} animated={true} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Score Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm">Approved for most credit cards</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm">Qualify for auto loans</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-sm">May qualify for mortgages</span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Loan Offers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="factors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="factors">Score Factors</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="factors" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {scoreFactors.map((factor, index) => (
                <Card key={index} className={`border-2 ${getImpactColor(factor.impact)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-white rounded-lg mr-3">
                          {factor.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{factor.category}</CardTitle>
                          <CardDescription>{factor.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getImpactIcon(factor.impact)}
                        <span className="font-bold text-lg">{factor.score}/100</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Progress value={factor.score} className="mb-4" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recommendations:</h4>
                      {factor.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start">
                          <Target className="h-3 w-3 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add More Data Sources</CardTitle>
                <CardDescription>
                  Connect additional financial data to improve your score accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Link to="/data-sources">
                    <Button variant="outline">
                      <Building className="h-4 w-4 mr-2" />
                      Add Bank Account
                    </Button>
                  </Link>
                  <Link to="/data-sources">
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Connect Credit Cards
                    </Button>
                  </Link>
                  <Link to="/data-sources">
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Employment Verification
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <ScoreHistoryChart userId="demo-user" />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    What's Helping Your Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">Consistent rent payments</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">Stable employment history</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">Regular utility payments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Build emergency savings</span>
                      <span className="text-xs text-blue-600">+15 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Increase income stability</span>
                      <span className="text-xs text-blue-600">+10 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Add more data sources</span>
                      <span className="text-xs text-blue-600">+8 pts</span>
                    </div>
                    <Link to="/coaching">
                      <Button className="w-full mt-4">
                        Get Personalized Coaching
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
