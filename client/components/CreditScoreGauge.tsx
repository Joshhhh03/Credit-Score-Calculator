import { useEffect, useState } from "react";

interface CreditScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export default function CreditScoreGauge({ 
  score, 
  size = 200, 
  strokeWidth = 12,
  animated = true 
}: CreditScoreGaugeProps) {
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

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate the angle for the score (from -135° to +135° = 270° total)
  const startAngle = -135; // Starting angle in degrees
  const endAngle = 135;   // Ending angle in degrees
  const totalAngle = endAngle - startAngle; // 270 degrees
  
  // Convert score (300-850) to percentage (0-100)
  const minScore = 300;
  const maxScore = 850;
  const scorePercentage = Math.min(Math.max((animatedScore - minScore) / (maxScore - minScore) * 100, 0), 100);
  
  // Calculate the stroke dash offset for the progress arc
  const progressCircumference = (totalAngle / 360) * circumference;
  const progressOffset = progressCircumference - (scorePercentage / 100) * progressCircumference;
  
  // Calculate pointer position
  const pointerAngle = startAngle + (scorePercentage / 100) * totalAngle;
  const pointerAngleRad = (pointerAngle * Math.PI) / 180;
  const pointerRadius = radius - strokeWidth / 2;
  const pointerX = center + pointerRadius * Math.cos(pointerAngleRad);
  const pointerY = center + pointerRadius * Math.sin(pointerAngleRad);
  
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

  const scoreColor = getScoreColor(animatedScore);
  const scoreLevel = getScoreLevel(animatedScore);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background arc */}
          <path
            d={`M ${center + radius * Math.cos(startAngle * Math.PI / 180)} ${center + radius * Math.sin(startAngle * Math.PI / 180)} A ${radius} ${radius} 0 1 1 ${center + radius * Math.cos(endAngle * Math.PI / 180)} ${center + radius * Math.sin(endAngle * Math.PI / 180)}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d={`M ${center + radius * Math.cos(startAngle * Math.PI / 180)} ${center + radius * Math.sin(startAngle * Math.PI / 180)} A ${radius} ${radius} 0 ${scorePercentage > 50 ? 1 : 0} 1 ${center + radius * Math.cos(pointerAngleRad)} ${center + radius * Math.sin(pointerAngleRad)}`}
            fill="none"
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: animated ? "stroke-dasharray 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
            }}
          />
          
          {/* Score markers */}
          {[300, 400, 500, 600, 700, 800, 850].map((markScore) => {
            const markPercentage = (markScore - minScore) / (maxScore - minScore) * 100;
            const markAngle = startAngle + (markPercentage / 100) * totalAngle;
            const markAngleRad = (markAngle * Math.PI) / 180;
            const markStartRadius = radius - strokeWidth / 2 - 5;
            const markEndRadius = radius - strokeWidth / 2 + 5;
            const markStartX = center + markStartRadius * Math.cos(markAngleRad);
            const markStartY = center + markStartRadius * Math.sin(markAngleRad);
            const markEndX = center + markEndRadius * Math.cos(markAngleRad);
            const markEndY = center + markEndRadius * Math.sin(markAngleRad);
            
            return (
              <line
                key={markScore}
                x1={markStartX}
                y1={markStartY}
                x2={markEndX}
                y2={markEndY}
                stroke="#6b7280"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Pointer */}
        <div
          className="absolute w-3 h-3 bg-gray-700 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={{
            transition: animated ? 'left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
          }}
          style={{
            left: pointerX,
            top: pointerY,
          }}
        />
        
        {/* Center circle with score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-4xl font-bold"
            style={{
              color: scoreColor,
              transition: animated ? 'color 0.5s ease-out' : 'none'
            }}
          >
            {Math.round(animatedScore)}
          </div>
          <div className="text-sm font-medium text-gray-600 mt-1">
            {scoreLevel}
          </div>
        </div>
      </div>
      
      {/* Score labels */}
      <div className="flex justify-between w-full mt-4 text-xs text-gray-500">
        <span>Poor<br/>300-649</span>
        <span>Fair<br/>650-699</span>
        <span>Good<br/>700-749</span>
        <span>Excellent<br/>750-850</span>
      </div>
    </div>
  );
}
