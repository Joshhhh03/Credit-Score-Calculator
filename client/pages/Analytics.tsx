import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreditScoreBar from "@/components/CreditScoreBar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  DollarSign,
  Building,
  Zap,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface AnalyticsData {
  currentScore: any;
  historicalData: any[];
  analysis: any;
  loanOffers: any[];
  generatedAt: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    loadAnalytics();
  }, [user, navigate]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/analytics/${user.userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      } else {
        // Analytics not found, need to generate
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalytics = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    setError("");
    
    try {
      const response = await fetch(`/api/analytics/${user.userId}/generate`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || "Failed to generate analytics");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Generate Your Analytics Report
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get detailed insights into your credit profile, see your score trends, 
              and discover personalized loan offers from top banks.
            </p>

            {error && (
              <Alert className="border-red-200 bg-red-50 mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              size="lg" 
              onClick={generateAnalytics}
              disabled={isGenerating}
              className="mb-8"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Analytics...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Analytics Report
                </>
              )}
            </Button>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Score Trends</h3>
                  <p className="text-sm text-gray-600">12-month historical analysis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Strengths & Weaknesses</h3>
                  <p className="text-sm text-gray-600">Detailed factor analysis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Loan Offers</h3>
                  <p className="text-sm text-gray-600">Personalized bank offers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { currentScore, historicalData, analysis, loanOffers } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive analysis of your credit profile and loan opportunities
          </p>
        </div>

        {/* Current Score */}
        <Card className="mb-8 border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 mr-2 text-blue-600" />
              Your Current Credit Risk Score
            </CardTitle>
            <CardDescription>
              Based on hybrid traditional + alternative data analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditScoreBar score={currentScore.score} width={600} animated={true} showDetails={true} />
          </CardContent>
        </Card>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Score Trends</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="loans">Loan Offers</TabsTrigger>
            <TabsTrigger value="factors">Factor Breakdown</TabsTrigger>
          </TabsList>

          {/* Score Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  12-Month Score History
                </CardTitle>
                <CardDescription>
                  Track your credit score improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Simple line chart using SVG */}
                <div className="h-80 bg-gray-50 rounded-lg p-6">
                  <svg className="w-full h-full" viewBox="0 0 800 300">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <line
                        key={i}
                        x1="50"
                        y1={50 + i * 40}
                        x2="750"
                        y2={50 + i * 40}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Y-axis labels */}
                    {[850, 750, 650, 550, 450, 350].map((score, i) => (
                      <text
                        key={score}
                        x="30"
                        y={50 + i * 40 + 5}
                        fontSize="12"
                        fill="#6b7280"
                        textAnchor="end"
                      >
                        {score}
                      </text>
                    ))}
                    
                    {/* Score line */}
                    {historicalData.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={historicalData.map((point, index) => {
                          const x = 50 + (index / (historicalData.length - 1)) * 700;
                          const y = 250 - ((point.score - 300) / 550) * 200;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    )}
                    
                    {/* Data points */}
                    {historicalData.map((point, index) => {
                      const x = 50 + (index / (historicalData.length - 1)) * 700;
                      const y = 250 - ((point.score - 300) / 550) * 200;
                      
                      return (
                        <g key={index}>
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#3b82f6"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })}
                    
                    {/* X-axis labels */}
                    {historicalData.map((point, index) => {
                      if (index % 2 === 0) { // Show every other month
                        const x = 50 + (index / (historicalData.length - 1)) * 700;
                        return (
                          <text
                            key={index}
                            x={x}
                            y="280"
                            fontSize="12"
                            fill="#6b7280"
                            textAnchor="middle"
                          >
                            {point.month}
                          </text>
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {historicalData[historicalData.length - 1]?.score || 0}
                    </div>
                    <div className="text-sm text-gray-500">Current Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{Math.max(...historicalData.map(d => d.score)) - Math.min(...historicalData.map(d => d.score))}
                    </div>
                    <div className="text-sm text-gray-500">12-Month Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...historicalData.map(d => d.score))}
                    </div>
                    <div className="text-sm text-gray-500">Peak Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.strengths.map((strength: any, index: number) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-green-900">{strength.title}</h4>
                          <Badge className="bg-green-100 text-green-700">
                            {strength.score}/100
                          </Badge>
                        </div>
                        <p className="text-sm text-green-700">{strength.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.weaknesses.length > 0 ? (
                      analysis.weaknesses.map((weakness: any, index: number) => (
                        <div key={index} className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-red-900">{weakness.title}</h4>
                            <Badge className="bg-red-100 text-red-700">
                              {weakness.score}/100
                            </Badge>
                          </div>
                          <p className="text-sm text-red-700">{weakness.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-green-700 font-medium">Excellent Profile!</p>
                        <p className="text-sm text-green-600">No major weaknesses identified</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Offers Tab */}
          <TabsContent value="loans" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(
                loanOffers.reduce((acc: any, offer: any) => {
                  if (!acc[offer.loanType]) acc[offer.loanType] = [];
                  acc[offer.loanType].push(offer);
                  return acc;
                }, {})
              ).map(([loanType, offers]: [string, any]) => (
                <Card key={loanType}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {loanType.replace('-', ' ')} Options
                    </CardTitle>
                    <CardDescription>
                      Based on your credit profile, you qualify for these offers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {offers.slice(0, 4).map((offer: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{offer.bankName}</h4>
                              <p className="text-sm text-gray-600">{offer.productName}</p>
                            </div>
                            <Badge className={`${
                              offer.approvalLikelihood >= 85 ? 'bg-green-100 text-green-700' :
                              offer.approvalLikelihood >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {offer.approvalLikelihood}% approval
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Interest Rate:</span>
                              <span className="font-medium">{offer.interestRate}% APR</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Max Amount:</span>
                              <span className="font-medium">${offer.maxAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-xs text-gray-600 mb-2">Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {offer.features.slice(0, 2).map((feature: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Button size="sm" className="w-full">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {offers.length > 4 && (
                      <div className="text-center mt-4">
                        <Button variant="outline">
                          View All {offers.length} {loanType.replace('-', ' ')} Offers
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Factor Breakdown Tab */}
          <TabsContent value="factors" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(currentScore.factors).map(([factor, score]: [string, any]) => {
                if (factor === 'traditionalCredit') return null;
                
                const getIcon = (factor: string) => {
                  switch (factor) {
                    case 'rentPayments': return <Building className="h-5 w-5" />;
                    case 'utilityPayments': return <Zap className="h-5 w-5" />;
                    case 'cashFlow': return <DollarSign className="h-5 w-5" />;
                    case 'employmentHistory': return <Calendar className="h-5 w-5" />;
                    default: return <BarChart3 className="h-5 w-5" />;
                  }
                };
                
                const getColor = (score: number) => {
                  if (score >= 80) return 'text-green-600';
                  if (score >= 60) return 'text-yellow-600';
                  return 'text-red-600';
                };

                return (
                  <Card key={factor}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded mr-3">
                            {getIcon(factor)}
                          </div>
                          <CardTitle className="text-lg capitalize">
                            {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </CardTitle>
                        </div>
                        <div className={`text-2xl font-bold ${getColor(score)}`}>
                          {score}/100
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={score} className="mb-4" />
                      <p className="text-sm text-gray-600">
                        {score >= 80 && "Excellent performance in this area"}
                        {score >= 60 && score < 80 && "Good performance with room for improvement"}
                        {score < 60 && "Focus area for credit improvement"}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
