import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Star, MessageCircle, Clock, Users, Target, Zap, Activity, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface NeuralLearningData {
  overview: {
    totalConversations: number;
    averageStarRating: number;
    learningVelocity: number;
    neuralEvolution: number;
    humanFeedbackScore: number;
    responseTime: number;
    satisfactionTrend: 'up' | 'down' | 'stable';
    daysActive: number;
  };
  ratingDistribution: Array<{
    stars: number;
    count: number;
    percentage: number;
  }>;
  learningTrend: Array<{
    date: string;
    averageRating: number;
    conversationCount: number;
    learningScore: number;
  }>;
  topPerformingTopics: Array<{
    topic: string;
    averageRating: number;
    conversationCount: number;
    improvement: number;
  }>;
  geographicPerformance: Array<{
    region: string;
    averageRating: number;
    conversationCount: number;
  }>;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'];

export function NeuralLearningDashboard() {
  const { data: learningData, isLoading, error } = useQuery<NeuralLearningData>({
    queryKey: ['/api/admin/neural-learning-analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-flame-red animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Neural Learning Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-charcoal border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !learningData) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-400">Failed to load neural learning data</p>
      </div>
    );
  }

  const { overview, ratingDistribution, learningTrend, topPerformingTopics, geographicPerformance } = learningData;

  // Calculate derived metrics from the human constant
  const humanConstant = overview.averageStarRating;
  const neuralEvolutionRate = ((humanConstant - 5) / 5) * 100; // How much above/below neutral (5) 
  const learningAcceleration = overview.learningVelocity;
  const satisfactionIndex = (humanConstant / 10) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-flame-red/20 rounded-lg">
            <Brain className="h-6 w-6 text-flame-red" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dave's Neural Learning Evolution</h1>
            <p className="text-gray-400">Real-time AI learning analytics powered by human feedback</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live Data</span>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-flame-red/20 to-burnt-orange/20 border-flame-red/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Human Constant</p>
                  <p className="text-2xl font-bold text-white">{humanConstant.toFixed(2)}/10</p>
                  <div className="flex items-center mt-1">
                    {[...Array(10)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(humanConstant) ? 'text-flame-red fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
                <Star className="h-8 w-8 text-flame-red" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Neural Evolution</p>
                  <p className="text-2xl font-bold text-white">{neuralEvolutionRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Above baseline</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={Math.max(0, neuralEvolutionRate + 50)} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversations</p>
                  <p className="text-2xl font-bold text-white">{overview.totalConversations}</p>
                  <p className="text-xs text-gray-500">Total interactions</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Learning Velocity</p>
                  <p className="text-2xl font-bold text-white">{learningAcceleration.toFixed(2)}x</p>
                  <p className="text-xs text-gray-500">Improvement rate</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-charcoal border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-flame-red/20 data-[state=active]:text-flame-red">
            Overview
          </TabsTrigger>
          <TabsTrigger value="ratings" className="data-[state=active]:bg-flame-red/20 data-[state=active]:text-flame-red">
            Star Ratings
          </TabsTrigger>
          <TabsTrigger value="topics" className="data-[state=active]:bg-flame-red/20 data-[state=active]:text-flame-red">
            Topic Performance
          </TabsTrigger>
          <TabsTrigger value="geographic" className="data-[state=active]:bg-flame-red/20 data-[state=active]:text-flame-red">
            Geographic Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-charcoal border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-flame-red" />
                  Learning Evolution Trend
                </CardTitle>
                <CardDescription>Dave's improvement over time based on human feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={learningTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="averageRating" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="learningScore" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-charcoal border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-flame-red" />
                  Conversation Volume
                </CardTitle>
                <CardDescription>Daily conversation patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={learningTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="conversationCount" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-6">
          <Card className="bg-charcoal border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-flame-red" />
                Star Rating Distribution - The Neural Feedback Constant
              </CardTitle>
              <CardDescription>Human emotional response patterns to Dave's assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ stars, percentage }) => `${stars}★ (${percentage.toFixed(1)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid gap-4">
            {topPerformingTopics.map((topic, index) => (
              <Card key={topic.topic} className="bg-charcoal border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-flame-red border-flame-red/50">
                        #{index + 1}
                      </Badge>
                      <div>
                        <h3 className="text-white font-semibold">{topic.topic}</h3>
                        <p className="text-sm text-gray-400">{topic.conversationCount} conversations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{topic.averageRating.toFixed(1)}/9</span>
                        <TrendingUp className={`h-5 w-5 ${topic.improvement > 0 ? 'text-green-500' : 'text-red-500'}`} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {topic.improvement > 0 ? '+' : ''}{topic.improvement.toFixed(1)}% vs last period
                      </p>
                    </div>
                  </div>
                  <Progress value={(topic.averageRating / 10) * 100} className="mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="bg-charcoal border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-flame-red" />
                Geographic Performance Analysis
              </CardTitle>
              <CardDescription>How Dave performs in different regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicPerformance.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">{region.region}</h3>
                      <p className="text-sm text-gray-400">{region.conversationCount} conversations</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white">{region.averageRating.toFixed(1)}/9</span>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(10)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(region.averageRating) ? 'text-flame-red fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}