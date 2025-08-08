import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseContentModal from "@/components/CourseContentModal";
import {
  CreditCard,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Lightbulb,
  DollarSign,
  Calendar,
  Building,
  Zap,
  BookOpen,
  Award,
  AlertTriangle,
  PlayCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface CoachingGoal {
  id: string;
  title: string;
  description: string;
  currentScore: number;
  targetScore: number;
  timeframe: string;
  difficulty: "easy" | "medium" | "hard";
  impact: number;
  steps: string[];
  category: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  completed: boolean;
  category: string;
  icon: React.ReactNode;
}

export default function Coaching() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set(['credit-basics']));
  
  const coachingGoals: CoachingGoal[] = [
    {
      id: "emergency-fund",
      title: "Build Emergency Fund",
      description: "Establish a 3-month emergency fund to improve financial stability",
      currentScore: 65,
      targetScore: 80,
      timeframe: "6 months",
      difficulty: "medium",
      impact: 15,
      category: "Savings",
      steps: [
        "Set up automatic savings transfer of $200/month",
        "Open a high-yield savings account",
        "Track progress monthly and adjust as needed",
        "Celebrate when you reach your first $1,000"
      ]
    },
    {
      id: "rent-reporting",
      title: "Optimize Rent Reporting",
      description: "Maximize credit benefits from your rent payment history",
      currentScore: 78,
      targetScore: 85,
      timeframe: "2 months",
      difficulty: "easy",
      impact: 7,
      category: "Housing",
      steps: [
        "Gather 24 months of rent payment receipts",
        "Contact landlord for payment verification letter",
        "Set up automatic rent payments if not already",
        "Monitor rent payment reporting monthly"
      ]
    },
    {
      id: "income-stability",
      title: "Increase Income Stability",
      description: "Diversify income sources and increase earning potential",
      currentScore: 82,
      targetScore: 90,
      timeframe: "12 months",
      difficulty: "hard",
      impact: 8,
      category: "Employment",
      steps: [
        "Update resume and LinkedIn profile",
        "Research salary benchmarks for your role",
        "Develop additional skills in your field",
        "Consider part-time or freelance work"
      ]
    }
  ];

  const learningModules: LearningModule[] = [
    {
      id: "credit-basics",
      title: "Credit Score Fundamentals",
      description: "Learn how alternative credit scoring works and what factors matter most",
      duration: "15 min",
      difficulty: "Beginner",
      completed: true,
      category: "Credit Education",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: "alternative-credit",
      title: "Alternative Credit Data Sources",
      description: "Understand how rent, utilities, and employment history impact your score",
      duration: "20 min",
      difficulty: "Beginner",
      completed: false,
      category: "Credit Education",
      icon: <Building className="h-5 w-5" />
    },
    {
      id: "traditional-vs-alternative",
      title: "Traditional vs Alternative Credit",
      description: "Compare traditional FICO scoring with alternative credit models",
      duration: "18 min",
      difficulty: "Intermediate",
      completed: false,
      category: "Credit Education",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: "credit-factors",
      title: "Key Credit Score Factors",
      description: "Deep dive into payment history, utilization, and credit mix",
      duration: "25 min",
      difficulty: "Intermediate",
      completed: false,
      category: "Credit Education",
      icon: <Target className="h-5 w-5" />
    },
    {
      id: "improving-score",
      title: "Credit Score Improvement Strategies",
      description: "Proven tactics to boost your credit score in 30-90 days",
      duration: "35 min",
      difficulty: "Intermediate",
      completed: false,
      category: "Credit Building",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: "budgeting",
      title: "Smart Budgeting for Credit Health",
      description: "Create budgets that support strong credit profiles and financial stability",
      duration: "30 min",
      difficulty: "Beginner",
      completed: false,
      category: "Financial Planning",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: "emergency-fund",
      title: "Building Your Emergency Fund",
      description: "Step-by-step guide to building financial resilience and credit backup",
      duration: "25 min",
      difficulty: "Intermediate",
      completed: false,
      category: "Savings",
      icon: <Target className="h-5 w-5" />
    },
    {
      id: "debt-management",
      title: "Debt Management Mastery",
      description: "Strategies for paying down debt while maintaining good credit",
      duration: "40 min",
      difficulty: "Intermediate",
      completed: false,
      category: "Debt Management",
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      id: "loan-preparation",
      title: "Preparing for Loan Applications",
      description: "How to present your best credit profile to lenders",
      duration: "22 min",
      difficulty: "Advanced",
      completed: false,
      category: "Lending",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: "credit-monitoring",
      title: "Credit Monitoring & Protection",
      description: "Learn to monitor your credit and protect against identity theft",
      duration: "28 min",
      difficulty: "Beginner",
      completed: false,
      category: "Credit Protection",
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "rent-reporting",
      title: "Maximizing Rent Reporting Benefits",
      description: "How to leverage rent payments for maximum credit impact",
      duration: "20 min",
      difficulty: "Beginner",
      completed: false,
      category: "Alternative Credit",
      icon: <Building className="h-5 w-5" />
    },
    {
      id: "financial-goals",
      title: "Setting Financial Goals",
      description: "Create SMART financial goals that improve your credit over time",
      duration: "30 min",
      difficulty: "Beginner",
      completed: false,
      category: "Financial Planning",
      icon: <Award className="h-5 w-5" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCourseComplete = (courseId: string) => {
    setCompletedCourses(prev => new Set(prev).add(courseId));
  };

  const handleStartGoal = (goalId: string) => {
    setSelectedGoal(selectedGoal === goalId ? null : goalId);
    // In a real app, this would save the goal to user's profile
  };

  const handleStartCourse = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Financial Coaching</h1>
          <p className="text-gray-600">Get personalized recommendations to improve your credit score and financial health</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 mr-2 text-blue-600" />
              Your Coaching Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1</div>
                <div className="text-sm text-gray-600">Completed Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">+23</div>
                <div className="text-sm text-gray-600">Potential Score Increase</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">Personalized Goals</TabsTrigger>
            <TabsTrigger value="learning">Learning Center</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {coachingGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge className={getDifficultyColor(goal.difficulty)}>
                        {goal.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.currentScore}/100</span>
                      </div>
                      <Progress value={goal.currentScore} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Target Score</div>
                          <div className="font-medium text-green-600">+{goal.impact} points</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Timeframe</div>
                          <div className="font-medium">{goal.timeframe}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Next Steps:</div>
                        <div className="text-sm text-gray-600">
                          {goal.steps[0]}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => setSelectedGoal(goal.id)}>
                        <Target className="h-4 w-4 mr-2" />
                        Start Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Goal View */}
            {selectedGoal && (
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Action Plan: {coachingGoals.find(g => g.id === selectedGoal)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coachingGoals.find(g => g.id === selectedGoal)?.steps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{step}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button onClick={() => setSelectedGoal(null)}>
                      Start This Goal
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedGoal(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {learningModules.map((module) => (
                <Card key={module.id} className={`hover:shadow-lg transition-shadow ${module.completed ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${module.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {module.completed ? <CheckCircle className="h-5 w-5" /> : module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{module.duration}</span>
                      </div>
                      <Badge className={getDifficultyBadgeColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <Button className="w-full" variant={module.completed ? "outline" : "default"}>
                      {module.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review Module
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unlock More Modules</h3>
                <p className="text-gray-600 mb-4">
                  Complete your current modules to unlock advanced financial education content
                </p>
                <Button variant="outline">
                  View Learning Path
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Positive Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm text-green-800">Your rent payment consistency has improved 15% this month</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm text-green-800">Cash flow stability is in the top 25% of users</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm text-green-800">Employment tenure is strengthening your profile</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Areas to Watch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-3" />
                      <span className="text-sm text-yellow-800">Utility payment timing could be more consistent</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-3" />
                      <span className="text-sm text-yellow-800">Consider increasing your emergency fund ratio</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-3" />
                      <span className="text-sm text-yellow-800">Adding more data sources could boost your score</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized insights based on your financial profile and behavior patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Score Optimization Opportunity</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Based on your payment patterns, setting up autopay for your utilities could increase your score by 8-12 points within 60 days.
                    </p>
                    <Button size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Create Autopay Goal
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Income Stability Enhancement</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Your employment history is strong. Consider adding a second income stream or side hustle to further improve your financial profile.
                    </p>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
