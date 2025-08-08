import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  DollarSign,
  Calendar,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import UserRatingsSection from "@/components/UserRatingsSection";

export default function Index() {
  const [stats, setStats] = useState({
    usersHelped: 49000000,
    avgScoreImprovement: 127,
    approvalRate: 78,
  });

  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Alternative Data Sources",
      description:
        "We analyze rent payments, utility bills, bank transactions, and educational history to build a complete financial picture.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Fair & Transparent",
      description:
        "Our AI explains every decision clearly. See exactly what factors affect your score and how to improve them.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Credit Building Tools",
      description:
        "Get personalized coaching and actionable insights to improve your creditworthiness over time.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Scoring",
      description:
        "Watch your score update in real-time as you add new financial data and improve your habits.",
    },
  ];

  const dataTypes = [
    {
      icon: <Building />,
      name: "Rent Payments",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <Zap />,
      name: "Utility Bills",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <DollarSign />,
      name: "Cash Flow",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: <Calendar />,
      name: "Employment History",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  CreditBridge
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/get-started">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Users className="h-3 w-3 mr-1" />
              Serving 49M+ Americans with thin credit files
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Credit Risk Scoring for&nbsp;
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Traditional credit scores exclude 49 million Americans. We use
              alternative data like rent payments, utility bills, and cash flow
              to give everyone a fair chance at credit approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-started">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Check Your Score
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">49M+</div>
              <div className="text-gray-600">
                Americans with thin credit files
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+127</div>
              <div className="text-gray-600">Average score improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">78%</div>
              <div className="text-gray-600">Credit approval rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Data Sources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              We Look Beyond Traditional Credit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your financial story is more than just traditional credit. We
              analyze multiple data sources to create a complete picture of your
              creditworthiness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`h-12 w-12 rounded-full ${type.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fair, Transparent, and Effective
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <div className="text-blue-600">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How CreditBridge Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Data</h3>
              <p className="text-gray-600">
                Securely link your bank accounts, rent payments, and utility
                bills to build your financial profile.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Score</h3>
              <p className="text-gray-600">
                Our AI analyzes your data and generates a comprehensive credit
                score with full transparency.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve & Apply</h3>
              <p className="text-gray-600">
                Follow personalized coaching to improve your score and apply for
                credit with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Ratings Section */}
      <UserRatingsSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Credit Score?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions of Americans who are building credit with alternative
            data. Get started in just 5 minutes.
          </p>
          <Link to="/get-started">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">CreditBridge</span>
            </div>
            <div className="text-gray-400">
              © 2024 CreditBridge. Empowering financial inclusion through
              alternative credit scoring.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
