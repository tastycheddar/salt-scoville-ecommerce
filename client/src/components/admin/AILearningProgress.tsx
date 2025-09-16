import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, MessageSquare, Target, Zap, BarChart3 } from 'lucide-react';

interface AILearningMetrics {
  dataProgress: number;
  modelAccuracy: number;
  intentDiversity: number;
  conversionRate: number;
  efficiency: number;
  metrics: {
    totalSessions: number;
    totalMessages: number;
    avgScore: string;
    avgProcessingTime: number;
    intentTypes: string[];
    recommendationSuccess: string;
    purchaseConversions: number;
  };
}

const AILearningProgress: React.FC = () => {
  const { data: learningData, isLoading, error } = useQuery<AILearningMetrics>({
    queryKey: ['ai-learning-progress'],
    queryFn: async () => {
      const response = await fetch('/api/admin/ai-learning-progress', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch AI learning progress');
      return response.json();
    },
    refetchInterval: 30000, // Update every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-flame-red" />
            AI Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-2 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-flame-red" />
            AI Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error loading AI learning data:</p>
          <p className="text-white/60 text-sm mt-2">{error.message}</p>
          <p className="text-white/40 text-xs mt-2">Check browser console for more details</p>
        </CardContent>
      </Card>
    );
  }

  if (!learningData) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-flame-red" />
            AI Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60">No learning data available yet. Start conversations to begin AI training.</p>
        </CardContent>
      </Card>
    );
  }

  const ProgressBar = ({ 
    label, 
    value, 
    icon: Icon, 
    description 
  }: { 
    label: string; 
    value: number; 
    icon: any; 
    description: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-flame-red" />
          <span className="text-white font-medium">{label}</span>
        </div>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-flame-red to-burnt-orange transition-all duration-500 ease-out"
          style={{ 
            width: `${Math.max(0, Math.min(100, value || 0))}%`
          }}
        />
      </div>
      <p className="text-xs text-white/60">{description}</p>
    </div>
  );

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-flame-red" />
          FlavaDave AI Learning Progress
          <span className="text-xs bg-flame-red/20 text-flame-red px-2 py-1 rounded-full">
            {learningData.metrics.totalSessions} Sessions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bars */}
        <div className="space-y-4">
          <ProgressBar
            label="Data Collection"
            value={learningData.dataProgress}
            icon={BarChart3}
            description={`${learningData.metrics.totalSessions} conversations analyzed • ${learningData.metrics.totalMessages} messages processed`}
          />
          
          <ProgressBar
            label="Model Accuracy"
            value={learningData.modelAccuracy}
            icon={Target}
            description={`Average conversation score: ${learningData.metrics.avgScore}/9 • V3.1: 0-9 Emotional Scale • AGI Target: 8.1/9`}
          />
          
          <ProgressBar
            label="Intent Recognition"
            value={learningData.intentDiversity}
            icon={MessageSquare}
            description={`${learningData.metrics.intentTypes.length} different intent types identified • Improving conversation understanding`}
          />
          
          <ProgressBar
            label="Conversion Rate"
            value={learningData.conversionRate}
            icon={TrendingUp}
            description={`${learningData.metrics.recommendationSuccess} recommendations clicked • ${learningData.metrics.purchaseConversions} purchases from AI suggestions`}
          />
          
          <ProgressBar
            label="Response Efficiency"
            value={learningData.efficiency}
            icon={Zap}
            description={`Average response time: ${learningData.metrics.avgProcessingTime}ms • Optimizing for faster interactions`}
          />
        </div>

        {/* Learning Insights */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-white font-medium mb-2">Learning Insights</h4>
          <div className="text-sm text-white/80 space-y-1">
            <p>• AI is analyzing customer behavior patterns in real-time</p>
            <p>• Intent classification improving with each conversation</p>
            <p>• Product recommendations becoming more targeted</p>
            <p>• Heat tolerance profiling enhancing personalization</p>
          </div>
        </div>

        {/* Next Steps */}
        {learningData.dataProgress < 100 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/70">
              <strong>Next Goal:</strong> Reach 100 conversation sessions for advanced pattern recognition.
              Current progress: {learningData.metrics.totalSessions}/100 sessions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AILearningProgress;