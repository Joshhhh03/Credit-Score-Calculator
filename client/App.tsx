import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources";
import Coaching from "./pages/Coaching";
import GetStarted from "./pages/GetStarted";
import Auth from "./pages/Auth";
import Analytics from "./pages/Analytics";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import ChatAssistant from "./components/ChatAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/get-started" element={<GetStarted />} />

          {/* Placeholder routes */}
          <Route
            path="/loan-offers"
            element={
              <PlaceholderPage
                title="Loan Offers"
                description="View personalized loan offers based on your CreditBridge score. Connect your data to unlock exclusive rates and terms from our lending partners."
                suggestedActions={[
                  { label: "Connect Data", href: "/data-sources" },
                  { label: "Dashboard", href: "/dashboard" }
                ]}
              />
            }
          />
          <Route
            path="/credit-monitoring"
            element={
              <PlaceholderPage
                title="Credit Monitoring"
                description="Monitor your credit score changes in real-time and get alerts when your score improves or factors change."
                suggestedActions={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Coaching", href: "/coaching" }
                ]}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <PlaceholderPage
                title="Credit Reports"
                description="Generate detailed credit reports showing all factors affecting your score with clear explanations and improvement recommendations."
                suggestedActions={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "View Score", href: "/get-started" }
                ]}
              />
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
