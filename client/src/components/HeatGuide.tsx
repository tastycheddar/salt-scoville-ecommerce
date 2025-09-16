import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Flame, Thermometer, AlertTriangle, Crown, Sparkles, Zap } from 'lucide-react';
import { HeatAssessmentQuiz } from './HeatAssessmentQuiz';
import { HeatProfileResults } from './HeatProfileResults';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';

const heatLevels = [
  {
    level: 1,
    name: "Mild & Friendly",
    description: "Perfect for beginners and those who enjoy flavor without the fire",
    scoville: "0-2,500 SHU",
    examples: ["Bell Peppers", "Poblano", "Banana Peppers"],
    icon: <Thermometer className="w-5 h-5 text-green-500" />,
    color: "bg-green-50 border-green-200",
    textColor: "text-green-700"
  },
  {
    level: 2,
    name: "Gentle Warmth", 
    description: "A subtle kick that enhances without overwhelming",
    scoville: "2,500-10,000 SHU",
    examples: ["Jalapeño", "Fresno", "Chipotle"],
    icon: <Flame className="w-5 h-5 text-yellow-500" />,
    color: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-700"
  },
  {
    level: 3,
    name: "Nice Heat",
    description: "Noticeable spice that adds excitement to your meal",
    scoville: "10,000-50,000 SHU",
    examples: ["Serrano", "Cayenne", "Tabasco"],
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    color: "bg-orange-50 border-orange-200", 
    textColor: "text-orange-700"
  },
  {
    level: 4,
    name: "Serious Fire",
    description: "For experienced spice lovers seeking a real challenge",
    scoville: "50,000-350,000 SHU",
    examples: ["Habanero", "Scotch Bonnet", "Thai Chili"],
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    color: "bg-red-50 border-red-200",
    textColor: "text-red-700"
  },
  {
    level: 5,
    name: "Volcanic",
    description: "Extreme heat for the bravest souls - proceed with caution!",
    scoville: "350,000+ SHU",
    examples: ["Ghost Pepper", "Carolina Reaper", "Scorpion"],
    icon: <Crown className="w-5 h-5 text-purple-500" />,
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700"
  }
];

export function HeatGuide() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
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
      // Fallback to static guide if AI fails
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
    <div className="w-full max-w-4xl mx-auto p-6">
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

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Understanding Heat Levels</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Discover your perfect spice level with our comprehensive heat guide
        </p>
        
        {/* AI Assessment CTA */}
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
        
        <p className="text-sm text-muted-foreground mt-2">
          Get personalized product and recipe recommendations powered by AI
        </p>
      </div>

      <div className="grid gap-4">
        {heatLevels.map((heat) => (
          <motion.div
            key={heat.level}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 border-2 ${heat.color} ${
                selectedLevel === heat.level ? 'ring-2 ring-flame shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedLevel(selectedLevel === heat.level ? null : heat.level)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {heat.icon}
                    <div>
                      <CardTitle className={`${heat.textColor} text-lg`}>
                        Level {heat.level}: {heat.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {heat.scoville}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Flame
                        key={i}
                        className={`w-4 h-4 ${
                          i < heat.level ? 'text-flame fill-flame' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {selectedLevel === heat.level && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <p className={`${heat.textColor} mb-3`}>
                        {heat.description}
                      </p>
                      <div>
                        <h4 className={`font-semibold ${heat.textColor} mb-2`}>
                          Common Peppers:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {heat.examples.map((example) => (
                            <Badge
                              key={example}
                              variant="outline"
                              className={`${heat.textColor} border-current`}
                            >
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Pro Tip:</h3>
        <p className="text-sm text-muted-foreground">
          Heat tolerance is personal and can be developed over time. Start with lower levels and 
          gradually work your way up. Remember, it's about enhancing flavor, not just surviving the burn!
        </p>
      </div>
    </div>
  );
}