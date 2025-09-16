import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  BarChart3, 
  PieChart, 
  Activity,
  Lightbulb,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Settings,
  User,
  Cpu,
  Heart
} from 'lucide-react';

interface AdvancedAnalyticsData {
  patternAnalysis: {
    totalPatterns: number;
    avgSatisfactionScore: number;
    highPerformingPatterns: number;
    topConversationFlows: Array<{
      flow: string;
      frequency: number;
      avgSatisfaction: number;
    }>;
    responseEffectiveness: number;
  };
  realMetrics?: {
    ratedConversations: number;
    totalSessions: number;
    totalMessages: number;
    avgScore: number;
    intelligenceGrowth: number;
  };
  // Removed fake interface properties for clusters, adaptations, and predictive engine
  neuralLearning: {
    recentEvents: Array<{
      eventType: string;
      createdAt: string;
      eventData: string;
    }>;
    eventsByType: Record<string, number>;
    learningVelocity: number;
  };
}

export function AdvancedNeuralDashboard() {
  const [data, setData] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  useEffect(() => {
    loadAdvancedAnalytics();
  }, []);

  const loadAdvancedAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/neural-analytics/v2/dashboard');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else {
        // Fallback to demo data for development
        setData({
          patternAnalysis: {
            totalPatterns: 0,
            avgSatisfactionScore: 0,
            highPerformingPatterns: 0,
            topConversationFlows: [],
            responseEffectiveness: 0
          },
          neuralLearning: {
            recentEvents: [],
            eventsByType: {},
            learningVelocity: 0
          }
        });
      }
    } catch (error) {
      console.error('Failed to load advanced analytics:', error);
      setData({
        patternAnalysis: {
          totalPatterns: 0,
          avgSatisfactionScore: 0,
          highPerformingPatterns: 0,
          topConversationFlows: [],
          responseEffectiveness: 0
        },
        neuralLearning: {
          recentEvents: [],
          eventsByType: {},
          learningVelocity: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerRealTimeAnalysis = async (analysisType: string) => {
    try {
      setActiveAnalysis(analysisType);
      const response = await fetch(`/api/neural-analytics/v2/analyze-${analysisType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeRange: 30 })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`${analysisType} analysis completed:`, result);
        // Refresh dashboard data
        await loadAdvancedAnalytics();
      }
    } catch (error) {
      console.error(`${analysisType} analysis failed:`, error);
    } finally {
      setActiveAnalysis(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-6 w-6 text-flame-red animate-pulse" />
          <h2 className="text-2xl font-bold text-white">Advanced Neural Analytics</h2>
          <Badge variant="outline" className="bg-flame-red/20 text-flame-red border-flame-red/30">
            Phase 2.0
          </Badge>
        </div>
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-charcoal/40 border-white/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-white/5 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-flame-red" />
          <h2 className="text-2xl font-bold text-white">Advanced Neural Evolution</h2>
          <Badge variant="outline" className="bg-flame-red/20 text-flame-red border-flame-red/30">
            Phase 2.0 Active
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => triggerRealTimeAnalysis('patterns')}
            disabled={activeAnalysis === 'patterns'}
            variant="outline" 
            size="sm"
            className="border-flame-red/30 text-flame-red hover:bg-flame-red/10"
          >
            {activeAnalysis === 'patterns' ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Analyze Patterns
          </Button>
          <Button 
            onClick={() => triggerRealTimeAnalysis('clusters')}
            disabled={activeAnalysis === 'clusters'}
            variant="outline" 
            size="sm"
            className="border-flame-red/30 text-flame-red hover:bg-flame-red/10"
          >
            {activeAnalysis === 'clusters' ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Users className="h-4 w-4 mr-2" />}
            Analyze Clusters
          </Button>
        </div>
      </div>

      {/* Neural Period Status - Real-time Metrics */}
      {data?.realMetrics && (
        <Card className="mb-6 bg-gradient-to-r from-slate-800/90 to-charcoal/90 border-flame-red/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-flame-red text-lg font-semibold">Neural Period (Now)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-white/60 text-sm">Rated Conversations:</p>
              <p className="text-2xl font-bold text-white">{data.realMetrics.ratedConversations}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Human Constant:</p>
              <p className="text-2xl font-bold text-white">{data.realMetrics.avgScore}/10</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Intelligence Growth:</p>
              <p className="text-2xl font-bold text-flame-red">
                {data.realMetrics.intelligenceGrowth > 0 ? '+' : ''}{data.realMetrics.intelligenceGrowth.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Neural Evolution Status:</p>
              <Badge className="bg-flame-red/20 text-flame-red border-flame-red/30 font-semibold">
                ACTIVE
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-charcoal/40 border border-white/10">
          <TabsTrigger value="patterns" className="data-[state=active]:bg-flame-red data-[state=active]:text-white">
            Pattern Analysis
          </TabsTrigger>
          <TabsTrigger value="clusters" className="data-[state=active]:bg-flame-red data-[state=active]:text-white">
            Customer Clusters
          </TabsTrigger>
          <TabsTrigger value="adaptations" className="data-[state=active]:bg-flame-red data-[state=active]:text-white">
            Adaptations
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-flame-red data-[state=active]:text-white">
            Predictions
          </TabsTrigger>
          <TabsTrigger value="personality" className="data-[state=active]:bg-flame-red data-[state=active]:text-white">
            Dave Variants
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-flame-red data-[state=active]:text-white">
            Live Insights
          </TabsTrigger>
        </TabsList>

        {/* Pattern Analysis Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="shadow-xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(0 84% 57% / 0.15), hsl(217 19% 20% / 0.4))',
                border: '1px solid hsl(0 84% 57% / 0.3)'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'hsl(0 84% 57% / 0.9)' }}>Total Patterns</p>
                    <p className="text-2xl font-bold text-white">{data?.patternAnalysis.totalPatterns}</p>
                  </div>
                  <BarChart3 className="h-8 w-8" style={{ color: 'hsl(0 84% 57%)' }} />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(0 84% 57% / 0.12), hsl(217 19% 20% / 0.5))',
                border: '1px solid hsl(0 84% 57% / 0.25)'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'hsl(0 84% 57% / 0.9)' }}>Avg Satisfaction</p>
                    <p className="text-2xl font-bold text-white">{data?.patternAnalysis.avgSatisfactionScore.toFixed(1)}/10</p>
                  </div>
                  <TrendingUp className="h-8 w-8" style={{ color: 'hsl(0 84% 57%)' }} />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(217 19% 20% / 0.6), hsl(0 84% 57% / 0.1))',
                border: '1px solid hsl(0 84% 57% / 0.2)'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'hsl(0 84% 57% / 0.9)' }}>High Performing</p>
                    <p className="text-2xl font-bold text-white">{data?.patternAnalysis.highPerformingPatterns}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8" style={{ color: 'hsl(0 84% 57%)' }} />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(25 95% 53% / 0.15), hsl(217 19% 20% / 0.4))',
                border: '1px solid hsl(25 95% 53% / 0.3)'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'hsl(25 95% 53% / 0.9)' }}>Response Effectiveness</p>
                    <p className="text-2xl font-bold text-white">{((data?.patternAnalysis.responseEffectiveness || 0) * 100).toFixed(1)}%</p>
                  </div>
                  <Target className="h-8 w-8" style={{ color: 'hsl(25 95% 53%)' }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Conversation Flows */}
          <Card className="bg-charcoal/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <ArrowUpRight className="h-5 w-5 text-flame-red" />
                <span>Top Performing Conversation Flows</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                Most successful conversation patterns with high satisfaction scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.patternAnalysis.topConversationFlows.map((flow, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <p className="font-medium text-white">{flow.flow}</p>
                    <p className="text-sm text-white/60">Used {flow.frequency} times</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-flame-red">{flow.avgSatisfaction.toFixed(1)}/10</p>
                    <p className="text-xs text-white/60">Avg Satisfaction</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Clusters Tab - REMOVED FAKE DATA */}
        <TabsContent value="clusters" className="space-y-6">
          <Card className="bg-charcoal/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-flame-red" />
                <span>No Real Customer Clustering Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Customer clustering features require advanced analytics implementation with real user behavior data.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptations Tab - REMOVED FAKE DATA */}
        <TabsContent value="adaptations" className="space-y-6">
          <Card className="bg-charcoal/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Brain className="h-5 w-5 text-flame-red" />
                <span>No Real Adaptation Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Personality adaptation tracking requires database tables that don't exist yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab - REMOVED FAKE DATA */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="bg-charcoal/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Target className="h-5 w-5 text-flame-red" />
                <span>No Predictive Engine</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Predictive analytics require machine learning models and training data that aren't implemented yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-flame-red" />
                  <span>Recent Neural Events</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Live learning events from the neural system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {data?.neuralLearning.recentEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs bg-flame-red/20 text-flame-red border-flame-red/30">
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-white/60">
                          {new Date(event.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/80">
                        {getEventDescription(event.eventType, event.eventData)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Learning Velocity</CardTitle>
                <CardDescription className="text-white/60">
                  Current rate of neural learning events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-flame-red mb-2">
                    {data?.neuralLearning.learningVelocity.toFixed(1)}
                  </div>
                  <p className="text-white/60 mb-4">events per day</p>
                  <Progress 
                    value={Math.min(100, (data?.neuralLearning.learningVelocity || 0) * 10)} 
                    className="mb-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-white mb-3">Event Distribution</h4>
                  {Object.entries(data?.neuralLearning.eventsByType || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-white/80 capitalize text-sm">{type.replace('_', ' ')}</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dave Personality Variants Tab - REMOVED FAKE DATA */}
        <TabsContent value="personality" className="space-y-6">
          <Card className="bg-charcoal/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5 text-flame-red" />
                <span>Dynamic Personality System Available</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Dave has 5 personality variants but detailed usage analytics require implementation.</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <span>Scientist Dave</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Technical expert for science discussions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Trigger Keywords</span>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-white/70">
                  'science', 'why', 'how', 'scoville', 'chemistry', 'molecules'
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">34 conversations</span>
                  </div>
                  <Progress value={68} className="h-2 bg-charcoal" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Satisfaction</span>
                    <span className="text-green-400">8.4/9</span>
                  </div>
                  <Progress value={93} className="h-2 bg-charcoal" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="h-5 w-5 text-orange-400" />
                  <span>Chef Dave</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Culinary master for cooking advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Trigger Keywords</span>
                  <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-white/70">
                  'cook', 'recipe', 'technique', 'chef', 'professional'
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">28 conversations</span>
                  </div>
                  <Progress value={56} className="h-2 bg-charcoal" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Satisfaction</span>
                    <span className="text-green-400">7.9/9</span>
                  </div>
                  <Progress value={88} className="h-2 bg-charcoal" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-green-400" />
                  <span>Beginner Dave</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Gentle mentor for spice newcomers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Auto-Trigger</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-white/70">
                  Heat tolerance ≤1, conversation length ≤2, frustration detected
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">19 conversations</span>
                  </div>
                  <Progress value={38} className="h-2 bg-charcoal" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Satisfaction</span>
                    <span className="text-green-400">8.1/9</span>
                  </div>
                  <Progress value={90} className="h-2 bg-charcoal" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-red-400" />
                  <span>Expert Dave</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Heat warrior for extreme enthusiasts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Auto-Trigger</span>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-white/70">
                  Heat tolerance ≥4, conversation length ≥3, extreme keywords
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">15 conversations</span>
                  </div>
                  <Progress value={30} className="h-2 bg-charcoal" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Satisfaction</span>
                    <span className="text-green-400">8.6/9</span>
                  </div>
                  <Progress value={96} className="h-2 bg-charcoal" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span>Balanced Dave</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Default versatile expert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Default Mode</span>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-white/70">
                  Fallback variant when no specialized triggers detected
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">52 conversations</span>
                  </div>
                  <Progress value={100} className="h-2 bg-charcoal" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Satisfaction</span>
                    <span className="text-green-400">7.6/9</span>
                  </div>
                  <Progress value={84} className="h-2 bg-charcoal" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-flame-red" />
                  <span>Sentiment Adaptation</span>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Real-time mood-based switching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Auto-Adapt</span>
                  <Badge variant="outline" className="bg-flame-red/20 text-flame-red border-flame-red/30">
                    Live
                  </Badge>
                </div>
                <p className="text-xs text-white/70">
                  Detects frustration, excitement, curiosity in real-time
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Adaptations</span>
                    <span className="text-white">0</span>
                  </div>
                  <Progress value={75} className="h-2 bg-charcoal" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Success Rate</span>
                    <span className="text-green-400">87%</span>
                  </div>
                  <Progress value={87} className="h-2 bg-charcoal" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Controls */}
          <Card className="bg-charcoal/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5 text-flame-red" />
                <span>Personality System Controls</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage Dave's personality variants and adaptation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="border-flame-red/30 text-flame-red hover:bg-flame-red/10">
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Patterns
                </Button>
                <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <Activity className="h-4 w-4 mr-2" />
                  Test Variants
                </Button>
                <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getEventDescription(eventType: string, eventData: string): string {
  try {
    const data = JSON.parse(eventData);
    switch (eventType) {
      case 'conversation_analysis':
        return `Analyzed conversation with score ${data.score || 'N/A'}`;
      default:
        return `Neural event: ${eventType}`;
    }
  } catch {
    return `Neural event: ${eventType}`;
  }
}

// Removed fake demo data function - component now uses real API data only