import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  X,
  Send,
  Heart,
  Sparkles,
} from "lucide-react";

interface RatingPromptProps {
  userScore?: number;
  userName?: string;
  onClose?: () => void;
  onSubmit?: (rating: number, feedback: string) => void;
  trigger?: "score-display" | "dashboard-visit" | "manual";
}

export default function RatingPrompt({
  userScore = 723,
  userName = "there",
  onClose,
  onSubmit,
  trigger = "score-display",
}: RatingPromptProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState<
    "rating" | "feedback" | "thanks"
  >("rating");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    if (rating >= 4) {
      // High rating, go straight to feedback
      setTimeout(() => setCurrentStep("feedback"), 500);
    } else {
      // Lower rating, ask for feedback immediately
      setCurrentStep("feedback");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submit rating to backend API
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: selectedRating,
          feedback: feedbackText,
          userScore: userScore,
          trigger: trigger,
          userName: userName,
          userId: `user_${Date.now()}`, // In a real app, this would come from auth
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit rating");
      }

      console.log("Rating submitted successfully:", result);
      onSubmit?.(selectedRating, feedbackText);
      setCurrentStep("thanks");
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Still show thanks screen even if API fails
      onSubmit?.(selectedRating, feedbackText);
      setCurrentStep("thanks");
    } finally {
      setIsSubmitting(false);

      // Auto-close after showing thanks
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Great";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 1:
        return "😞";
      case 2:
        return "😐";
      case 3:
        return "🙂";
      case 4:
        return "😊";
      case 5:
        return "🤩";
      default:
        return "";
    }
  };

  const getScoreMessage = () => {
    if (userScore >= 750) return "Amazing score! 🎉";
    if (userScore >= 700) return "Great score! 👏";
    if (userScore >= 650) return "Good progress! 📈";
    return "You're on your way! 💪";
  };

  if (!isVisible) return null;

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {currentStep === "rating" &&
                  `Hey ${userName}! ${getScoreMessage()}`}
                {currentStep === "feedback" && "Tell us more!"}
                {currentStep === "thanks" && "Thank you! 🙏"}
              </CardTitle>
              <CardDescription>
                {currentStep === "rating" &&
                  "How was your CreditBridge experience?"}
                {currentStep === "feedback" && "Your feedback helps us improve"}
                {currentStep === "thanks" && "Your feedback has been submitted"}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Rating Step */}
        {currentStep === "rating" && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Rate your experience with our credit scoring platform
            </p>

            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="group relative"
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingSelect(rating)}
                >
                  <Star
                    className={`h-8 w-8 transition-all duration-200 ${
                      rating <= (hoverRating || selectedRating)
                        ? "text-yellow-400 fill-current scale-110"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                  {(hoverRating === rating || selectedRating === rating) && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {getRatingEmoji(rating)} {getRatingText(rating)}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="h-8"> {/* Spacer for rating text */}</div>

            {selectedRating > 0 && (
              <div className="text-center">
                <Badge className="bg-yellow-100 text-yellow-800">
                  {selectedRating} star{selectedRating !== 1 ? "s" : ""} -{" "}
                  {getRatingText(selectedRating)}!
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Feedback Step */}
        {currentStep === "feedback" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${
                      rating <= selectedRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {selectedRating >= 4
                  ? "We're thrilled you had a great experience! Any specific feedback?"
                  : "We'd love to know how we can improve your experience."}
              </p>
            </div>

            <Textarea
              placeholder={
                selectedRating >= 4
                  ? "What did you like most about CreditBridge? (optional)"
                  : "What can we do better? Your feedback helps us improve."
              }
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              className="resize-none"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("rating")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </div>
                )}
              </Button>
            </div>

            {selectedRating >= 4 && (
              <Button
                variant="ghost"
                onClick={handleSubmit}
                className="w-full text-sm text-gray-500"
              >
                Skip feedback
              </Button>
            )}
          </div>
        )}

        {/* Thanks Step */}
        {currentStep === "thanks" && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-gray-600">
                {selectedRating >= 4
                  ? "Your positive review means the world to us! We'll continue working hard to provide you with the best credit scoring experience."
                  : "We appreciate your honest feedback. Our team will review your comments and work on improvements."}
              </p>
            </div>

            {selectedRating >= 4 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Love CreditBridge? Help others discover fair credit scoring!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share with Friends
                  </Button>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
