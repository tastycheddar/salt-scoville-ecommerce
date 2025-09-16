import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, Zap, TrendingUp, ChefHat, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatProfileResultsProps {
  profile: {
    heatTolerance: number;
    preferredHeatLevel: number;
    spiceExperience: 'beginner' | 'intermediate' | 'expert';
    personalityTraits: string[];
    preferredIngredients: string[];
    reasoning: string;
    recommendations: {
      startingProducts: string[];
      progressionPath: string[];
      recipeSuggestions: string[];
    };
  };
  onStartShopping: () => void;
  onViewRecipes: () => void;
  onRetakeQuiz?: () => void;
}

const experienceConfig = {
  beginner: {
    icon: '🌱',
    title: 'Spice Explorer',
    description: 'Ready to begin your heat adventure!',
    color: 'text-green-400',
    bgColor: 'bg-green-900/20 border-green-500/30'
  },
  intermediate: {
    icon: '🔥',
    title: 'Heat Enthusiast',
    description: 'You know your way around spicy food!',
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/20 border-orange-500/30'
  },
  expert: {
    icon: '🌋',
    title: 'Spice Master',
    description: 'A true connoisseur of heat!',
    color: 'text-flame-red',
    bgColor: 'bg-red-900/20 border-flame-red/30'
  }
};

const heatLevelNames = ['Mild', 'Gentle', 'Medium', 'Hot', 'Extreme'];

export function HeatProfileResults({ profile, onStartShopping, onViewRecipes, onRetakeQuiz }: HeatProfileResultsProps) {
  const experienceData = experienceConfig[profile.spiceExperience];
  
  // Scroll to top when results are shown
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">{experienceData.icon}</div>
        <h1 className="text-3xl font-bold mb-2 text-white">Your Heat Profile is Ready!</h1>
        <p className="text-lg text-gray-300">
          Personalized recommendations crafted by AI just for you
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Experience Level Card */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={cn("border-2", experienceData.bgColor)}>
            <CardHeader className="text-center">
              <div className={cn("text-2xl font-bold", experienceData.color)}>
                {experienceData.title}
              </div>
              <p className="text-gray-300">{experienceData.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">Heat Tolerance</span>
                  <Badge variant="secondary">{heatLevelNames[profile.heatTolerance - 1]}</Badge>
                </div>
                <Progress value={(profile.heatTolerance / 5) * 100} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">Preferred Heat Level</span>
                  <Badge variant="secondary">{heatLevelNames[profile.preferredHeatLevel - 1]}</Badge>
                </div>
                <Progress value={(profile.preferredHeatLevel / 5) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personality Traits */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-purple-500/30 bg-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                Your Spice Personality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.personalityTraits.map((trait, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <Badge variant="outline" className="border-purple-400 text-purple-300 bg-purple-900/40">
                      {trait}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Reasoning */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Zap className="w-5 h-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 leading-relaxed">{profile.reasoning}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Starting Products */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-2 border-flame/30 bg-flame/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-flame">
                <Star className="w-5 h-5" />
                Perfect Starters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.recommendations.startingProducts.map((product, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-flame/20">
                  <span className="font-medium">{product}</span>
                </div>
              ))}
              <Button 
                onClick={onStartShopping}
                className="w-full bg-flame hover:bg-flame/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progression Path */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <TrendingUp className="w-5 h-5" />
                Heat Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.recommendations.progressionPath.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                  <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recipe Suggestions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <ChefHat className="w-5 h-5" />
                Recipe Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.recommendations.recipeSuggestions.map((recipe, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                  <span className="font-medium">{recipe}</span>
                </div>
              ))}
              <Button 
                onClick={onViewRecipes}
                variant="outline" 
                className="w-full border-green-300 text-green-700 hover:bg-green-100"
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Explore Recipes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-center gap-4 pt-6"
      >
        <Button
          onClick={onStartShopping}
          size="lg"
          className="bg-flame hover:bg-flame/90 px-8"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Start Shopping My Matches
        </Button>
        
        {onRetakeQuiz && (
          <Button
            onClick={onRetakeQuiz}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Retake Assessment
          </Button>
        )}
      </motion.div>
    </div>
  );
}