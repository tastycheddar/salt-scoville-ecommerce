/**
 * Dynamic Personality Dashboard - Admin Interface
 * Monitors context-aware Dave personality system in real-time
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Eye, 
  Activity, 
  Target,
  ChefHat,
  FlaskConical,
  GraduationCap,
  Crown,
  Heart
} from 'lucide-react';

interface DavePersonality {
  id: string;
  name: string;
  description: string;
  expertiseLevel: string[];
  cookingContexts: string[];
  toneStyle: string;
  knowledgeDepth: string;
  responseStyle: string;
}

interface PersonalityContext {
  userExpertiseLevel: string;
  conversationIntent: string;
  heatTolerance: string;
  cookingContext: string;
  emotionalState: string;
}

interface PersonalityAnalytics {
  totalSessions: number;
  personalityUsageStats: Record<string, number>;
  contextDistribution: Record<string, number>;
  selectionAccuracy: number;
}

const DynamicPersonalityDashboard: React.FC = () => {
  const [testSessionId, setTestSessionId] = useState('');
  const [selectedPersonalityId, setSelectedPersonalityId] = useState<string | null>(null);

  // Fetch all available personalities
  const { data: personalities, isLoading: personalitiesLoading } = useQuery<{
    personalities: DavePersonality[];
    totalCount: number;
  }>({
    queryKey: ['dynamic-personalities-all'],
    queryFn: async () => {
      const response = await fetch('/api/dynamic-personality/all', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch personalities');
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Fetch personality analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery<{
    analytics: PersonalityAnalytics;
  }>({
    queryKey: ['dynamic-personality-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/dynamic-personality/analytics', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Test personality selection for a session
  const { data: testResult, refetch: testPersonality, isLoading: testLoading } = useQuery<{
    selectedPersonality: DavePersonality;
    context: PersonalityContext;
    selectionReason: string;
  }>({
    queryKey: ['dynamic-personality-test', testSessionId],
    queryFn: async () => {
      const response = await fetch(`/api/dynamic-personality/optimal/${testSessionId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to test personality');
      return response.json();
    },
    enabled: false, // Only run when manually triggered
  });

  const getPersonalityIcon = (personalityId: string) => {
    const icons = {
      'chef-dave': ChefHat,
      'scientist-dave': FlaskConical,
      'beginner-dave': GraduationCap,
      'expert-dave': Crown,
      'friendly-dave': Heart
    };
    return icons[personalityId] || Brain;
  };

  const getPersonalityColor = (personalityId: string) => {
    const colors = {
      'chef-dave': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'scientist-dave': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'beginner-dave': 'bg-green-500/20 text-green-400 border-green-500/30',
      'expert-dave': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'friendly-dave': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[personalityId] || 'bg-white/10 text-white border-white/20';
  };

  if (personalitiesLoading || analyticsLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-flame-red animate-pulse" />
            Dynamic Personality System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-white/10 rounded-lg mb-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-flame-red" />
          Dynamic Personality System
          <Badge className="bg-flame-red/20 text-flame-red border-flame-red/30">
            Phase 3 Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personalities" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger value="personalities" className="text-white data-[state=active]:bg-flame-red/20">
              Personalities
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-flame-red/20">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="testing" className="text-white data-[state=active]:bg-flame-red/20">
              Testing
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-white data-[state=active]:bg-flame-red/20">
              Live Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personalities" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-flame-red" />
                Available Dave Personalities ({personalities?.personalities.length || 0})
              </h3>
              
              {personalities?.personalities.map((personality) => {
                const Icon = getPersonalityIcon(personality.id);
                return (
                  <Card 
                    key={personality.id} 
                    className={`${getPersonalityColor(personality.id)} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => setSelectedPersonalityId(
                      selectedPersonalityId === personality.id ? null : personality.id
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-8 w-8 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{personality.name}</h4>
                          <p className="text-sm opacity-90 mb-2">{personality.description}</p>
                          
                          {selectedPersonalityId === personality.id && (
                            <div className="mt-3 space-y-2 text-xs">
                              <div>
                                <span className="font-medium">Expertise Levels: </span>
                                {personality.expertiseLevel.join(', ')}
                              </div>
                              <div>
                                <span className="font-medium">Cooking Contexts: </span>
                                {personality.cookingContexts.join(', ')}
                              </div>
                              <div>
                                <span className="font-medium">Tone Style: </span>
                                {personality.toneStyle.replace(/_/g, ' ')}
                              </div>
                              <div>
                                <span className="font-medium">Knowledge Depth: </span>
                                {personality.knowledgeDepth}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">Total Sessions</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics?.analytics.totalSessions || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-white text-sm font-medium">Selection Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics?.analytics.selectionAccuracy || 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-flame-red" />
                  Context Distribution Analysis
                </h4>
                <div className="text-white/60 text-sm">
                  Personality analytics system ready for implementation.
                  Will track context distribution, selection patterns, and performance metrics.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-4 mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-flame-red" />
                  Test Personality Selection
                </h4>
                
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter session ID to test"
                    value={testSessionId}
                    onChange={(e) => setTestSessionId(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    onClick={() => testPersonality()}
                    disabled={!testSessionId || testLoading}
                    className="bg-flame-red/20 text-flame-red border-flame-red/30 hover:bg-flame-red/30"
                  >
                    {testLoading ? 'Testing...' : 'Test'}
                  </Button>
                </div>

                {testResult && (
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <h5 className="text-white font-medium">Test Result:</h5>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getPersonalityColor(testResult.selectedPersonality.id)}>
                        {testResult.selectedPersonality.name}
                      </Badge>
                      <span className="text-white/70 text-sm">Selected for session {testSessionId}</span>
                    </div>

                    <div className="text-sm text-white/60 space-y-1">
                      <div><span className="font-medium">Context:</span></div>
                      <div>• Expertise: {testResult.context.userExpertiseLevel}</div>
                      <div>• Intent: {testResult.context.conversationIntent}</div>
                      <div>• Heat Tolerance: {testResult.context.heatTolerance}</div>
                      <div>• Cooking Context: {testResult.context.cookingContext}</div>
                      <div>• Emotional State: {testResult.context.emotionalState}</div>
                    </div>

                    <div className="text-xs text-white/50">
                      Selection Reason: {testResult.selectionReason.replace(/_/g, ' ')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4 mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-flame-red" />
                  Live Personality Monitoring
                </h4>
                <div className="text-white/60 text-sm">
                  Real-time personality selection monitoring system ready for implementation.
                  Will show active sessions, personality switches, and context changes in real-time.
                </div>
                
                <div className="mt-4 p-3 bg-flame-red/10 border border-flame-red/20 rounded-lg">
                  <div className="text-flame-red text-sm font-medium">System Status: Active</div>
                  <div className="text-white/70 text-xs mt-1">
                    Dynamic personality engine is operational and selecting personalities based on conversation context.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DynamicPersonalityDashboard;