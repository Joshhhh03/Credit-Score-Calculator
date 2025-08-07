import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  ArrowLeft,
  Construction,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestedActions?: Array<{
    label: string;
    href: string;
  }>;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  suggestedActions = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Get Started", href: "/get-started" }
  ]
}: PlaceholderPageProps) {
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
              <Link to="/get-started">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="py-16">
              <Construction className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                {suggestedActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Button>
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <Card className="border-blue-200 bg-blue-50 mt-8 max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageCircle className="h-6 w-6 text-blue-600 mr-4" />
                    <div className="text-left">
                      <h3 className="font-semibold text-blue-900 mb-1">Need this page?</h3>
                      <p className="text-blue-800 text-sm">
                        Continue prompting to have us build out this section of your app.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
