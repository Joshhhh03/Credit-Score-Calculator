import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const features = [
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Alternative Credit Scoring",
      description:
        "Get scored based on rent, utilities, and employment history",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Safe & Secure",
      description: "Bank-level encryption protects your financial data",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Improve Your Score",
      description: "Real-time coaching to boost your creditworthiness",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Built for Everyone",
      description: "Helping 49M+ Americans with thin credit files",
    },
  ];

  const stats = [
    { label: "Users Helped", value: "49M+" },
    { label: "Avg Score Increase", value: "+127 pts" },
    { label: "Data Sources", value: "15+" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Welcome to CreditBridge
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            The first alternative credit scoring platform that recognizes your
            true financial responsibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-white"
              >
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">
                Why CreditBridge Works
              </span>
            </div>
            <p className="text-sm text-green-700">
              Traditional credit scores ignore rent payments, utility bills, and
              employment history. We factor in all the financial responsibility
              you already demonstrate to give you the credit score you deserve.
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center space-x-4 pt-2">
            <Badge variant="secondary" className="text-xs">
              SOC 2 Certified
            </Badge>
            <Badge variant="secondary" className="text-xs">
              256-bit Encryption
            </Badge>
            <Badge variant="secondary" className="text-xs">
              GDPR Compliant
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
