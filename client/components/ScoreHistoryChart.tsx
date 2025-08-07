import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface ScoreHistoryData {
  date: string;
  score: number;
  factors: {
    rentPayments: number;
    utilityPayments: number;
    cashFlow: number;
    employmentHistory: number;
  };
}

interface ScoreHistoryChartProps {
  userId?: string;
  data?: ScoreHistoryData[];
}

export default function ScoreHistoryChart({ userId = "demo-user", data }: ScoreHistoryChartProps) {
  const [historyData, setHistoryData] = useState<ScoreHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('12m');

  // Mock data for demonstration
  const mockData: ScoreHistoryData[] = [
    {
      date: "2024-01-01",
      score: 680,
      factors: { rentPayments: 75, utilityPayments: 70, cashFlow: 60, employmentHistory: 80 }
    },
    {
      date: "2024-02-01", 
      score: 685,
      factors: { rentPayments: 78, utilityPayments: 72, cashFlow: 62, employmentHistory: 80 }
    },
    {
      date: "2024-03-01",
      score: 692,
      factors: { rentPayments: 80, utilityPayments: 74, cashFlow: 65, employmentHistory: 82 }
    },
    {
      date: "2024-04-01",
      score: 698,
      factors: { rentPayments: 82, utilityPayments: 76, cashFlow: 63, employmentHistory: 82 }
    },
    {
      date: "2024-05-01",
      score: 705,
      factors: { rentPayments: 84, utilityPayments: 78, cashFlow: 68, employmentHistory: 84 }
    },
    {
      date: "2024-06-01",
      score: 710,
      factors: { rentPayments: 85, utilityPayments: 78, cashFlow: 70, employmentHistory: 84 }
    },
    {
      date: "2024-07-01",
      score: 715,
      factors: { rentPayments: 86, utilityPayments: 80, cashFlow: 72, employmentHistory: 85 }
    },
    {
      date: "2024-08-01",
      score: 718,
      factors: { rentPayments: 86, utilityPayments: 80, cashFlow: 70, employmentHistory: 85 }
    },
    {
      date: "2024-09-01",
      score: 721,
      factors: { rentPayments: 87, utilityPayments: 82, cashFlow: 68, employmentHistory: 85 }
    },
    {
      date: "2024-10-01",
      score: 720,
      factors: { rentPayments: 85, utilityPayments: 80, cashFlow: 66, employmentHistory: 85 }
    },
    {
      date: "2024-11-01",
      score: 723,
      factors: { rentPayments: 85, utilityPayments: 78, cashFlow: 65, employmentHistory: 85 }
    },
    {
      date: "2024-12-01",
      score: 725,
      factors: { rentPayments: 87, utilityPayments: 80, cashFlow: 67, employmentHistory: 86 }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (data) {
          setHistoryData(data);
        } else {
          // In a real app, this would fetch from the API
          // const response = await fetch(`/api/users/${userId}/credit-history?months=${timeRange === '6m' ? 6 : 12}`);
          // const result = await response.json();
          // setHistoryData(result.history);
          
          // For now, use mock data
          const filteredData = timeRange === '6m' ? mockData.slice(-6) : mockData;
          setHistoryData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching credit history:', error);
        setHistoryData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, timeRange, data]);

  const getScoreTrend = () => {
    if (historyData.length < 2) return { trend: 0, percentage: 0 };
    
    const currentScore = historyData[historyData.length - 1].score;
    const previousScore = historyData[historyData.length - 2].score;
    const trend = currentScore - previousScore;
    const percentage = Math.abs((trend / previousScore) * 100);
    
    return { trend, percentage };
  };

  const getHighestLowest = () => {
    if (historyData.length === 0) return { highest: 0, lowest: 0 };
    
    const scores = historyData.map(d => d.score);
    return {
      highest: Math.max(...scores),
      lowest: Math.min(...scores)
    };
  };

  const { trend, percentage } = getScoreTrend();
  const { highest, lowest } = getHighestLowest();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Score History
            </CardTitle>
            <CardDescription>
              Track your credit score improvements over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '6m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('6m')}
            >
              6M
            </Button>
            <Button
              variant={timeRange === '12m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('12m')}
            >
              12M
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Score trend summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{historyData[historyData.length - 1]?.score || 0}</div>
            <div className="text-sm text-gray-500">Current Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{highest}</div>
            <div className="text-sm text-gray-500">12-Month High</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center justify-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
              {trend >= 0 ? '+' : ''}{trend}
            </div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
        </div>

        {/* Simple line chart visualization */}
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Score line */}
            {historyData.length > 1 && (
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={historyData.map((point, index) => {
                  const x = (index / (historyData.length - 1)) * 380 + 10;
                  const scoreRange = highest - lowest || 50;
                  const y = 180 - ((point.score - (lowest - 10)) / (scoreRange + 20)) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
            
            {/* Data points */}
            {historyData.map((point, index) => {
              const x = (index / (historyData.length - 1)) * 380 + 10;
              const scoreRange = highest - lowest || 50;
              const y = 180 - ((point.score - (lowest - 10)) / (scoreRange + 20)) * 160;
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Tooltip on hover */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="transparent"
                    className="hover:fill-blue-100 cursor-pointer"
                    opacity="0.5"
                  >
                    <title>
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}: {point.score}
                    </title>
                  </circle>
                </g>
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{new Date(historyData[0]?.date || '').toLocaleDateString('en-US', { month: 'short' })}</span>
            <span>{new Date(historyData[Math.floor(historyData.length / 2)]?.date || '').toLocaleDateString('en-US', { month: 'short' })}</span>
            <span>{new Date(historyData[historyData.length - 1]?.date || '').toLocaleDateString('en-US', { month: 'short' })}</span>
          </div>
        </div>

        {/* Monthly improvements */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Recent Monthly Changes</h4>
          <div className="space-y-2">
            {historyData.slice(-3).reverse().map((point, index) => {
              const prevPoint = historyData[historyData.length - 2 - index];
              const change = prevPoint ? point.score - prevPoint.score : 0;
              
              return (
                <div key={point.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="text-sm font-medium">
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{point.score}</span>
                    {change !== 0 && (
                      <Badge variant={change > 0 ? "default" : "destructive"} className="text-xs">
                        {change > 0 ? '+' : ''}{change}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
