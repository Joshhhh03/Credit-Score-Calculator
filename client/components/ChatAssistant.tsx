import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  CreditCard,
  TrendingUp,
  DollarSign,
  Building,
  Lightbulb
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your CreditBridge AI assistant. I'm here to help you understand your credit score, improve your financial health, and answer any questions about our platform. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
      suggestions: [
        "How can I improve my credit score?",
        "What affects my CreditBridge score?",
        "Help me understand my dashboard",
        "How do I add more data sources?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("improve") && message.includes("score")) {
      return {
        content: "Great question! Here are the top ways to improve your CreditBridge score:\n\n1. **Pay rent on time consistently** - This has the biggest impact (+30 points)\n2. **Set up autopay for utilities** - Avoid late payments (+15 points)\n3. **Build an emergency fund** - Shows financial stability (+15 points)\n4. **Add more data sources** - More data = better accuracy (+10-20 points)\n5. **Maintain stable employment** - Employment history matters (+20 points)\n\nWould you like me to help you with any specific area?",
        suggestions: [
          "How do I add rent payment history?",
          "Set up autopay for utilities",
          "Help with emergency fund planning",
          "Show me coaching recommendations"
        ]
      };
    }
    
    if (message.includes("dashboard") || message.includes("understand")) {
      return {
        content: "I'd be happy to explain your dashboard! Your CreditBridge dashboard shows:\n\n📊 **Your Score**: Currently 723 (Good range)\n📈 **Score Factors**: Rent payments (85/100), Utilities (78/100), etc.\n💡 **Recommendations**: Personalized tips to improve\n📋 **Benefits**: What your score qualifies you for\n\nYour score is calculated using alternative data like rent payments, utility bills, and employment history - not just traditional credit. This gives you a fair chance even with limited credit history.",
        suggestions: [
          "What does my score mean?",
          "How are factors calculated?",
          "View my recommendations",
          "What loans can I qualify for?"
        ]
      };
    }
    
    if (message.includes("data") || message.includes("connect") || message.includes("add")) {
      return {
        content: "Adding more data sources can significantly boost your score! You can connect:\n\n🏠 **Rent Payments** (+30 pts) - Upload receipts or connect property management\n⚡ **Utility Bills** (+15 pts) - Electric, gas, water, internet\n💼 **Employment** (+20 pts) - Job history and income verification\n🏦 **Bank Account** (+25 pts) - Cash flow and transaction history\n\nAll data is encrypted and secure. Go to the 'Add Data' section to get started!",
        suggestions: [
          "How secure is my data?",
          "Take me to Add Data page",
          "What if I rent informally?",
          "Help with bank connection"
        ]
      };
    }
    
    if (message.includes("coaching") || message.includes("advice")) {
      return {
        content: "Our personalized coaching feature helps you build financial strength! It includes:\n\n🎯 **Goal Setting** - Create custom improvement plans\n📚 **Learning Modules** - Credit basics, budgeting, saving\n🤖 **AI Insights** - Personalized recommendations based on your data\n📊 **Progress Tracking** - See your improvements over time\n\nYour current top recommendations:\n• Build emergency fund (potential +15 pts)\n• Set up utility autopay (+8 pts)\n• Add employment verification (+20 pts)",
        suggestions: [
          "Create an emergency fund goal",
          "View learning modules",
          "See all my recommendations",
          "Track my progress"
        ]
      };
    }
    
    if (message.includes("score") && (message.includes("mean") || message.includes("good") || message.includes("bad"))) {
      return {
        content: "Your score of 723 is in the **Good** range! Here's what this means:\n\n✅ **You qualify for**:\n• Most credit cards with good rates\n• Auto loans with competitive terms\n• Personal loans\n• Some mortgage programs\n\n📈 **Score Ranges**:\n• Excellent: 750-850\n• Good: 700-749 (that's you!)\n• Fair: 650-699\n• Poor: 300-649\n\nWith some improvement, you could reach Excellent range and unlock even better rates and terms!",
        suggestions: [
          "How to reach Excellent range?",
          "View available loan offers",
          "What are the best credit cards for me?",
          "Mortgage qualification help"
        ]
      };
    }

    if (message.includes("loan") || message.includes("qualify") || message.includes("apply")) {
      return {
        content: "With your 723 score, you have great lending options! Based on your profile:\n\n💳 **Credit Cards**: Approved for most cards, including rewards cards\n🚗 **Auto Loans**: Pre-qualified with rates around 4-7%\n🏠 **Mortgages**: May qualify with 10-15% down payment\n💰 **Personal Loans**: Up to $50K with competitive rates\n\nWant to see personalized offers? I can help you explore options or improve your score for even better terms.",
        suggestions: [
          "Show me credit card offers",
          "Auto loan pre-qualification",
          "Mortgage readiness check",
          "Personal loan options"
        ]
      };
    }

    if (message.includes("help") || message.includes("support") || message.includes("problem")) {
      return {
        content: "I'm here to help! I can assist you with:\n\n🎯 **Credit Score Questions** - Understanding factors, improvements\n📊 **Dashboard Help** - Navigating features, reading charts\n💡 **Financial Coaching** - Goal setting, recommendations\n🔗 **Data Connection** - Adding new sources, troubleshooting\n🏦 **Loan Information** - Qualification, offers, applications\n\nJust ask me anything, or choose from the suggestions below!",
        suggestions: [
          "Explain my credit factors",
          "Help improve my score",
          "Technical support",
          "Contact human support"
        ]
      };
    }
    
    // Default response for unrecognized queries
    return {
      content: "I understand you're asking about your credit and financial situation. While I'm still learning to understand every question perfectly, I'm here to help with:\n\n• Credit score explanations and improvements\n• Dashboard navigation and features\n• Financial coaching and goal setting\n• Data connection and security\n• Loan qualification questions\n\nCould you rephrase your question or try one of the suggestions below?",
      suggestions: [
        "How can I improve my credit score?",
        "Explain my dashboard",
        "Help me add data sources",
        "What loans can I qualify for?"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: "assistant",
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-2 -left-2 h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-96 transition-all duration-300 shadow-xl ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">CreditBridge Assistant</CardTitle>
                <div className="text-xs text-blue-100 flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
                  Online • Ready to help
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === "assistant" && (
                          <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          {message.suggestions && (
                            <div className="mt-3 space-y-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.sender === "user" && (
                          <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask about your credit score, financial advice, or platform help..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => handleSuggestionClick("How can I improve my credit score?")}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Improve Score
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => handleSuggestionClick("Help me understand my dashboard")}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  Dashboard Help
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => handleSuggestionClick("How do I add more data sources?")}>
                  <Building className="h-3 w-3 mr-1" />
                  Add Data
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
