import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Flame, ArrowRight, Zap, Target, Sparkles, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { HeatAssessmentQuiz } from './HeatAssessmentQuiz';
import { HeatProfileResults } from './HeatProfileResults';

export function CompactHeatSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [heatProfile, setHeatProfile] = useState<any>(null);
  const [, setLocation] = useLocation();

  // AI Heat Profile Analysis Mutation
  const analyzeHeatProfile = useMutation({
    mutationFn: async (responses: Record<string, any>) => {
      const response = await fetch('/api/ai/analyze-heat-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze heat profile');
      }
      
      return response.json();
    },
    onSuccess: (profile) => {
      setHeatProfile(profile);
      setShowQuiz(false);
      setShowResults(true);
    },
    onError: (error) => {
      console.error('Heat profile analysis failed:', error);
      setShowQuiz(false);
    }
  });

  const handleQuizComplete = (responses: Record<string, any>) => {
    analyzeHeatProfile.mutate(responses);
  };

  const handleStartShopping = () => {
    setShowResults(false);
    setLocation('/products');
  };

  const handleViewRecipes = () => {
    setShowResults(false);
    setLocation('/recipes');
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setHeatProfile(null);
    setShowQuiz(true);
  };

  const quickLevels = [
    { level: 1, name: "Gentle", color: "text-green-400" },
    { level: 2, name: "Building", color: "text-yellow-400" },
    { level: 3, name: "Serious", color: "text-orange-400" },
    { level: 4, name: "Intense", color: "text-red-400" },
    { level: 5, name: "Volcanic", color: "text-flame" }
  ];

  return (
    <>
      {/* AI-Powered Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Zap className="w-6 h-6 text-flame-red" />
              AI-Powered Heat Assessment
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Take our fun interactive quiz to discover your perfect spice level and get personalized recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-900">
            <HeatAssessmentQuiz 
              onComplete={handleQuizComplete}
              onClose={() => setShowQuiz(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Heat Profile Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-flame" />
              Your Personalized Heat Profile
            </DialogTitle>
            <DialogDescription>
              AI-powered recommendations based on your spice preferences
            </DialogDescription>
          </DialogHeader>
          {heatProfile && (
            <HeatProfileResults
              profile={heatProfile}
              onStartShopping={handleStartShopping}
              onViewRecipes={handleViewRecipes}  
              onRetakeQuiz={handleRetakeQuiz}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Compact Heat Section */}
      <div className="py-12 pb-24 bg-gradient-to-br from-charcoal via-char-black to-charcoal">
        <div className="w-full px-4">
          <Card className="w-full bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
            <CardContent className="p-6">
              
              {/* Header Section - Compact */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center gap-2 mb-4"
                >
                  <span className="text-2xl">🌶️</span>
                  <h2 className="text-2xl font-bold text-white font-im-fell">
                    Discover Your Perfect Heat Level
                  </h2>
                </motion.div>
                <p className="text-white/70 text-sm max-w-2xl mx-auto">
                  AI-powered spice profiling and complete heat level guide
                </p>
              </div>

              {/* Split Layout - Left: Quiz CTA, Right: Heat Levels */}
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Left: AI Quiz Section */}
                <div className="space-y-4">
                  <div className="text-center lg:text-left">
                    <h3 className="text-lg font-semibold text-white mb-2">Take AI Heat Assessment</h3>
                    <p className="text-white/60 text-sm mb-4">
                      Get personalized product recommendations and recipe matches
                    </p>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      onClick={() => setShowQuiz(true)}
                      className="w-full bg-gradient-to-r from-flame to-orange-500 hover:from-flame/90 hover:to-orange-500/90 text-white font-semibold py-3 rounded-lg shadow-lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Start Quiz
                      <Target className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <div className="flex items-center justify-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI-Powered
                    </span>
                    <span>•</span>
                    <span>2 minutes</span>
                    <span>•</span>
                    <span>Instant Results</span>
                  </div>
                </div>

                {/* Right: Heat Levels Preview */}
                <div className="space-y-3">
                  <div className="text-center lg:text-left mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Heat Level Guide</h3>
                  </div>
                  
                  {/* Compact Heat Level Stack */}
                  <div className="space-y-2">
                    {quickLevels.map((heat, index) => (
                      <motion.div
                        key={heat.level}
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{heat.level}</span>
                          </div>
                          <span className="text-white font-medium">{heat.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Flame
                              key={i}
                              className={`w-3 h-3 ${
                                i < heat.level ? heat.color : 'text-white/20'
                              }`}
                              fill={i < heat.level ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Link to="/heat-guide" className="block w-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0 animate-pulse hover:animate-none"
                        style={{
                          background: 'linear-gradient(45deg, #7c3aed, #ec4899, #f97316, #eab308)',
                          backgroundSize: '300% 300%',
                          animation: 'gradient-shift 3s ease infinite'
                        }}
                      >
                        <Thermometer className="w-4 h-4 mr-2" />
                        Full Heat Guide
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}