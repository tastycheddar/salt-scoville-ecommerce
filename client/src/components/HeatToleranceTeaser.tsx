import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Flame, Sparkles, Zap, Target } from 'lucide-react';
import { HeatAssessmentQuiz } from './HeatAssessmentQuiz';
import { HeatProfileResults } from './HeatProfileResults';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';

export function HeatToleranceTeaser() {
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

  return (
    <>
      {/* AI-Powered Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-charcoal border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Zap className="w-6 h-6 text-flame" />
              AI-Powered Heat Assessment
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Take our fun interactive quiz to discover your perfect spice level and get personalized recommendations
            </DialogDescription>
          </DialogHeader>
          <HeatAssessmentQuiz 
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
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

      {/* Teaser Component */}
      <div className="py-16 bg-gradient-to-br from-charcoal via-char-black to-charcoal">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="text-6xl"
                  >
                    🌶️
                  </motion.div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-white mb-2 font-im-fell">
                      What's Your Heat Tolerance?
                    </h2>
                    <p className="text-flame font-semibold">
                      AI-powered spice profiling
                    </p>
                  </div>
                </div>

                <p className="text-lg text-white/80 mb-6">
                  Discover your perfect spice level with our smart AI quiz. Get personalized product recommendations and recipe matches based on your heat preferences.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setShowQuiz(true)}
                      size="lg"
                      className="bg-gradient-to-r from-flame to-orange-500 hover:from-flame/90 hover:to-orange-500/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Take AI Heat Assessment
                      <Zap className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>

                  <div className="flex items-center gap-1 text-sm text-white/60">
                    <Target className="w-4 h-4" />
                    <span>2 minutes • Personalized results</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-flame">🎯</div>
                    <p className="text-xs text-white/70 mt-1">Smart Matching</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-flame">🤖</div>
                    <p className="text-xs text-white/70 mt-1">AI-Powered</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-flame">⚡</div>
                    <p className="text-xs text-white/70 mt-1">Instant Results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}