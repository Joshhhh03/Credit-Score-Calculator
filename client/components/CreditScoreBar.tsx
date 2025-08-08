import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CreditScoreBarProps {
  score: number;
  width?: number;
  height?: number;
  animated?: boolean;
  showDetails?: boolean;
}

export default function CreditScoreBar({ 
  score, 
  width = 400, 
  height = 120,
  animated = true,
  showDetails = true
}: CreditScoreBarProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const startScore = animatedScore;
      const targetScore = score;
      const duration = 2000; // 2 seconds for smooth animation
      const startTime = Date.now();
      
      const animateScore = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic function for smooth deceleration
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        
        const currentScore = startScore + (targetScore - startScore) * easedProgress;
        setAnimatedScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };
      
      // Start animation after a short delay
      const timer = setTimeout(() => {
        requestAnimationFrame(animateScore);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);

  // Score ranges and colors
  const minScore = 300;
  const maxScore = 850;
  const scorePercentage = Math.min(Math.max((animatedScore - minScore) / (maxScore - minScore) * 100, 0), 100);
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 750) return "#10b981"; // green-500
    if (score >= 700) return "#3b82f6"; // blue-500
    if (score >= 650) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getScoreLevel = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  const getScoreLevelColor = (score: number) => {
    if (score >= 750) return "bg-green-100 text-green-700";
    if (score >= 700) return "bg-blue-100 text-blue-700";
    if (score >= 650) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const scoreColor = getScoreColor(animatedScore);
  const scoreLevel = getScoreLevel(animatedScore);
  const scoreLevelColor = getScoreLevelColor(animatedScore);

  // Score range markers
  const ranges = [
    { min: 300, max: 579, label: "Poor", color: "#ef4444" },
    { min: 580, max: 649, label: "Fair", color: "#f59e0b" },
    { min: 650, max: 699, label: "Good", color: "#3b82f6" },
    { min: 700, max: 850, label: "Excellent", color: "#10b981" }
  ];

  return (
    <div className="flex flex-col items-center space-y-6" style={{ width: Math.max(width, 300) }}>
      {/* Score Display */}
      <div className="text-center">
        <div 
          className="text-5xl font-bold transition-colors duration-500"
          style={{ color: scoreColor }}
        >
          {Math.round(animatedScore)}
        </div>
        <Badge className={`mt-2 ${scoreLevelColor}`}>
          {scoreLevel}
        </Badge>
      </div>

      {/* Horizontal Progress Bar */}
      <div className="w-full" style={{ maxWidth: width }}>
        {/* Score range indicators */}
        {showDetails && (
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Poor<br/>300-579</span>
            <span>Fair<br/>580-649</span>
            <span>Good<br/>650-699</span>
            <span>Excellent<br/>700-850</span>
          </div>
        )}
        
        {/* Main progress bar container */}
        <div className="relative">
          {/* Background bar with range colors */}
          <div className="w-full h-8 rounded-full overflow-hidden bg-gray-200 relative">
            {ranges.map((range, index) => {
              const rangeStart = ((range.min - minScore) / (maxScore - minScore)) * 100;
              const rangeEnd = ((range.max - minScore) / (maxScore - minScore)) * 100;
              const rangeWidth = rangeEnd - rangeStart;
              
              return (
                <div
                  key={index}
                  className="absolute top-0 h-full opacity-20"
                  style={{
                    left: `${rangeStart}%`,
                    width: `${rangeWidth}%`,
                    backgroundColor: range.color,
                  }}
                />
              );
            })}
          </div>
          
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-8 rounded-full transition-all ease-out"
            style={{
              transitionDuration: '2s',
              width: `${scorePercentage}%`,
              backgroundColor: scoreColor,
              boxShadow: `0 0 20px ${scoreColor}40`
            }}
          />
          
          {/* Score marker/pointer */}
          <div
            className="absolute top-0 w-1 h-8 bg-gray-800 transition-all ease-out"
            style={{
              transitionDuration: '2s',
              left: `${scorePercentage}%`,
              transform: 'translateX(-50%)',
              boxShadow: '0 0 8px rgba(0,0,0,0.3)'
            }}
          />
        </div>
        
        {/* Score range labels */}
        {showDetails && (
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>300</span>
            <span>580</span>
            <span>650</span>
            <span>700</span>
            <span>850</span>
          </div>
        )}
      </div>

      {/* Score improvement indicator */}
      {showDetails && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {animatedScore < 650 && "Focus on consistent payments to improve your score"}
            {animatedScore >= 650 && animatedScore < 700 && "You're in good territory! Keep building your credit history"}
            {animatedScore >= 700 && animatedScore < 750 && "Excellent work! You qualify for premium rates"}
            {animatedScore >= 750 && "Outstanding credit! You have access to the best rates and terms"}
          </p>
        </div>
      )}
    </div>
  );
}
