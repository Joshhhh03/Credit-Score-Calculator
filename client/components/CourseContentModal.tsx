import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, BookOpen, ArrowRight, ArrowLeft, Star, Award } from "lucide-react";

interface CourseContent {
  sections: {
    title: string;
    content: string[];
    keyPoints: string[];
  }[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

interface CourseContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  duration: string;
  difficulty: string;
  onComplete: () => void;
}

const courseContents: Record<string, CourseContent> = {
  "credit-basics": {
    sections: [
      {
        title: "What is a Credit Score?",
        content: [
          "A credit score is a three-digit number that represents your creditworthiness to lenders.",
          "Traditional credit scores range from 300-850, with higher scores indicating lower risk.",
          "Alternative credit scoring uses non-traditional data like rent, utilities, and employment."
        ],
        keyPoints: [
          "Credit scores predict lending risk",
          "Higher scores = better loan terms",
          "Alternative data expands opportunities"
        ]
      },
      {
        title: "Alternative Credit Scoring",
        content: [
          "Alternative credit considers rent payments, utility bills, and employment history.",
          "This approach helps people with 'thin files' who lack traditional credit history.",
          "Over 49 million Americans benefit from alternative credit scoring models."
        ],
        keyPoints: [
          "Uses non-traditional payment data",
          "Helps underserved populations",
          "More inclusive than traditional scoring"
        ]
      }
    ],
    quiz: [
      {
        question: "What data does alternative credit scoring primarily use?",
        options: ["Credit cards only", "Rent, utilities, employment", "Bank deposits", "Investment accounts"],
        correct: 1,
        explanation: "Alternative credit scoring uses rent payments, utility bills, and employment history to assess creditworthiness."
      }
    ]
  },
  "alternative-credit": {
    sections: [
      {
        title: "Rent Payment History",
        content: [
          "Rent payments are often your largest monthly expense and demonstrate financial responsibility.",
          "Consistent, on-time rent payments show lenders you can handle large recurring obligations.",
          "Services like RentReporter and PayYourRent help get your rent payments reported to credit bureaus."
        ],
        keyPoints: [
          "Rent is typically 25-30% of income",
          "On-time payments build positive history",
          "Multiple reporting services available"
        ]
      },
      {
        title: "Utility Payment Tracking",
        content: [
          "Utility payments (electric, gas, water, internet) demonstrate ongoing financial management.",
          "These payments show consistency in meeting essential living expenses.",
          "Some credit models weight utility payments lower than rent but they still matter."
        ],
        keyPoints: [
          "Shows consistent payment behavior",
          "Essential service payments",
          "Lower weight but still valuable"
        ]
      }
    ]
  },
  "improving-score": {
    sections: [
      {
        title: "Quick Win Strategies (30 days)",
        content: [
          "Set up automatic payments for all bills to ensure no missed payments.",
          "Pay down credit card balances to reduce utilization ratios.",
          "Check credit reports for errors and dispute any inaccuracies."
        ],
        keyPoints: [
          "Automate all payments",
          "Reduce credit utilization",
          "Dispute credit report errors"
        ]
      },
      {
        title: "Medium-term Improvements (60-90 days)",
        content: [
          "Add alternative payment history like rent and utilities to your credit file.",
          "Pay off small debts completely to reduce total debt load.",
          "Consider becoming an authorized user on someone else's account."
        ],
        keyPoints: [
          "Add alternative payment data",
          "Pay off small debts completely",
          "Become authorized user if possible"
        ]
      }
    ]
  }
};

export default function CourseContentModal({ isOpen, onClose, courseId, courseTitle, duration, difficulty, onComplete }: CourseContentModalProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  const content = courseContents[courseId];
  if (!content) {
    return null;
  }

  const totalSections = content.sections.length + (content.quiz ? 1 : 0);
  const progress = ((currentSection + (showQuiz ? 1 : 0)) / totalSections) * 100;

  const handleNext = () => {
    if (currentSection < content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (content.quiz && !showQuiz) {
      setShowQuiz(true);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (showQuiz) {
      setShowQuiz(false);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setCurrentSection(0);
      setShowQuiz(false);
      setQuizAnswers([]);
      setShowResults(false);
      setCompleted(false);
    }, 2000);
  };

  const getQuizScore = () => {
    if (!content.quiz) return 0;
    let correct = 0;
    content.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    return Math.round((correct / content.quiz.length) * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{courseTitle}</DialogTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {duration}
            </div>
            <Badge className={`${difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                                difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'}`}>
              {difficulty}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {!showQuiz && !completed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  {content.sections[currentSection].title}
                </CardTitle>
                <CardDescription>
                  Section {currentSection + 1} of {content.sections.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.sections[currentSection].content.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Key Takeaways:</h4>
                    <ul className="space-y-1">
                      {content.sections[currentSection].keyPoints.map((point, index) => (
                        <li key={index} className="flex items-center text-blue-800">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showQuiz && !showResults && content.quiz && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Knowledge Check
                </CardTitle>
                <CardDescription>
                  Answer these questions to test your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {content.quiz.map((question, questionIndex) => (
                    <div key={questionIndex} className="space-y-3">
                      <h4 className="font-medium">{questionIndex + 1}. {question.question}</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optionIndex}
                              checked={quizAnswers[questionIndex] === optionIndex}
                              onChange={() => handleQuizAnswer(questionIndex, optionIndex)}
                              className="text-blue-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={quizAnswers.length < content.quiz.length}
                    className="w-full"
                  >
                    Submit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showResults && content.quiz && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Award className="h-5 w-5 mr-2" />
                  Quiz Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{getQuizScore()}%</div>
                    <p className="text-green-700">Great job completing the quiz!</p>
                  </div>
                  
                  {content.quiz.map((question, index) => (
                    <div key={index} className="bg-white p-4 rounded border">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className={`text-sm ${quizAnswers[index] === question.correct ? 'text-green-600' : 'text-red-600'}`}>
                        Your answer: {question.options[quizAnswers[index]]}
                        {quizAnswers[index] === question.correct ? ' ✓' : ' ✗'}
                      </p>
                      {quizAnswers[index] !== question.correct && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
                    </div>
                  ))}
                  
                  <Button onClick={handleComplete} className="w-full">
                    Complete Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {completed && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Course Completed!</h3>
                  <p className="text-green-700">You've successfully completed {courseTitle}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          {!completed && (
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentSection === 0 && !showQuiz}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {!showQuiz && (
                <Button onClick={handleNext}>
                  {currentSection < content.sections.length - 1 ? 'Next Section' : 
                   content.quiz ? 'Take Quiz' : 'Complete Course'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
