import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import WelcomeModal from "./WelcomeModal";
import UserProfile from "./UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreditCard, RefreshCw } from "lucide-react";

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show welcome modal on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("creditbridge-welcome-seen");
    const isHomePage = location.pathname === "/";

    if (!hasSeenWelcome && isHomePage && !isLoading) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 1000); // Show after 1 second on homepage

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLoading]);

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("creditbridge-welcome-seen", "true");
  };

  // Pages that should show navigation
  const showNavigation = [
    "/dashboard",
    "/data-sources",
    "/coaching",
    "/analytics",
    "/get-started",
  ].includes(location.pathname);

  return (
    <>
      {/* Global Navigation */}
      {showNavigation && (
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    CreditBridge
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link to="/data-sources">
                      <Button variant="ghost">Add Data</Button>
                    </Link>
                    <Link to="/coaching">
                      <Button variant="ghost">Coaching</Button>
                    </Link>
                    <Link to="/analytics">
                      <Button variant="ghost">Analytics</Button>
                    </Link>
                    {location.pathname === "/analytics" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    )}
                    <UserProfile />
                  </>
                ) : (
                  <>
                    <Link to="/get-started">
                      <Button variant="ghost">Get Started</Button>
                    </Link>
                    <Link to="/auth">
                      <Button>Sign In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      {children}

      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleWelcomeClose} />
    </>
  );
}
