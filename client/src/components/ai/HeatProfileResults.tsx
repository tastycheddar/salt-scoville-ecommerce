import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flame, Award, Target, TrendingUp, ChefHat, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

interface ProductRecommendation {
  id: string;
  name: string;
  slug?: string;
  price?: string;
  heatLevel?: number;
  reason?: string;
}

interface RecipeRecommendation {
  id: string;
  title: string;
  slug?: string;
  heatLevel?: number;
  description?: string;
}

interface ProgressionStep {
  id: string;
  name: string;
  slug?: string;
  heatLevel?: number;
}

interface HeatProfile {
  heatTolerance: number;
  preferredHeatLevel: number;
  spiceExperience: 'beginner' | 'intermediate' | 'expert';
  personalityTraits: string[];
  preferredIngredients: string[];
  reasoning: string;
  recommendations: {
    startingProducts: (string | ProductRecommendation)[];
    progressionPath: (string | ProgressionStep)[];
    recipeSuggestions: (string | RecipeRecommendation)[];
  };
}

interface HeatProfileResultsProps {
  profile: HeatProfile;
  onStartOver: () => void;
}

const experienceLevels = {
  beginner: { label: 'Spice Explorer', color: 'bg-green-500', desc: 'Ready to discover amazing flavors' },
  intermediate: { label: 'Heat Seeker', color: 'bg-orange-500', desc: 'Experienced in the art of spice' },
  expert: { label: 'Capsaicin Connoisseur', color: 'bg-red-500', desc: 'Master of extreme heat and complex flavors' }
};

const heatLevelColors = {
  1: 'bg-green-400',
  2: 'bg-yellow-400', 
  3: 'bg-orange-400',
  4: 'bg-red-500',
  5: 'bg-red-700'
};

export function HeatProfileResults({ profile, onStartOver }: HeatProfileResultsProps) {
  const experienceInfo = experienceLevels[profile.spiceExperience];
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Results Card */}
      <Card className="bg-gradient-to-br from-flame-red/10 to-burnt-orange/10 border-2 border-flame-red/30">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Flame className="h-12 w-12 text-flame-red" />
              <div className="absolute -top-1 -right-1 bg-flame-red rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{profile.preferredHeatLevel}</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-char-black dark:text-white mb-2">
            Your Personalized Heat Profile
          </CardTitle>
          <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
            Powered by FlavaDave's AI - Where Science Meets Scoville
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge className={`${experienceInfo.color} text-white px-4 py-2 text-lg`}>
              {experienceInfo.label}
            </Badge>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{experienceInfo.desc}</p>
          </div>
        </CardContent>
      </Card>

      {/* Heat Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-flame-red" />
              Heat Tolerance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Heat Tolerance</span>
                <span className="font-semibold">{profile.heatTolerance}/5</span>
              </div>
              <Progress 
                value={profile.heatTolerance * 20} 
                className={`h-3 ${heatLevelColors[profile.heatTolerance as keyof typeof heatLevelColors]}`}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Preferred Daily Heat</span>
                <span className="font-semibold">{profile.preferredHeatLevel}/5</span>
              </div>
              <Progress 
                value={profile.preferredHeatLevel * 20} 
                className={`h-3 ${heatLevelColors[profile.preferredHeatLevel as keyof typeof heatLevelColors]}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-flame-red" />
              Your Spice Personality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.personalityTraits.map((trait, index) => (
                <Badge key={index} variant="secondary" className="bg-burnt-orange/20 text-char-black dark:text-white">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-flame-red" />
            FlavaDave's AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.reasoning}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-flame-red" />
              Your Starting Products
            </CardTitle>
            <CardDescription>Perfect products to begin your flavor journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.recommendations.startingProducts.map((product, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-flame-red/50 transition-all cursor-pointer"
                   onClick={() => window.open(`/products/${product.slug || product.id}`, '_blank')}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{typeof product === 'string' ? product : product.name}</h4>
                  {typeof product === 'object' && product.heatLevel && (
                    <Badge variant="outline" className="border-flame-red/40 text-flame-red">
                      Heat {product.heatLevel}/5
                    </Badge>
                  )}
                </div>
                {typeof product === 'object' && (
                  <>
                    {product.price && (
                      <p className="font-bold text-flame-red mb-2">${product.price}</p>
                    )}
                    {product.reason && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{product.reason}"</p>
                    )}
                  </>
                )}
              </div>
            ))}
            <Link href="/products">
              <Button className="w-full bg-flame-red hover:bg-flame-red/90 text-white mt-4">
                Shop Your Recommendations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-flame-red" />
              Recipe Suggestions
            </CardTitle>
            <CardDescription>Recipes perfect for your heat level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.recommendations.recipeSuggestions.map((recipe, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-flame-red/50 transition-all cursor-pointer"
                   onClick={() => window.open(`/recipes/${recipe.slug || recipe.id}`, '_blank')}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{typeof recipe === 'string' ? recipe : recipe.title}</h4>
                  {typeof recipe === 'object' && recipe.heatLevel && (
                    <Badge variant="outline" className="border-flame-red/40 text-flame-red">
                      Heat {recipe.heatLevel}/5
                    </Badge>
                  )}
                </div>
                {typeof recipe === 'object' && recipe.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
                )}
              </div>
            ))}
            <Link href="/recipes">
              <Button variant="outline" className="w-full mt-4">
                Explore Recipes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Progression Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-flame-red" />
            Your Heat Journey Progression
          </CardTitle>
          <CardDescription>Your personalized path to spice mastery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.recommendations.progressionPath.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-flame-red/50 transition-all cursor-pointer"
                   onClick={() => window.open(`/products/${step.slug || step.id}`, '_blank')}>
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="border-flame-red text-flame-red">
                    Step {index + 1}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{typeof step === 'string' ? step : step.name}</h4>
                  {typeof step === 'object' && step.heatLevel && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Heat Level: {step.heatLevel}/5</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-flame-red" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Stacked */}
      <div className="flex flex-col gap-3 items-center pt-6 max-w-sm mx-auto">
        <Link href="/products" className="w-full">
          <Button className="bg-flame-red hover:bg-flame-red/90 text-white px-8 w-full">
            Start Shopping My Matches
          </Button>
        </Link>
        <Button 
          onClick={onStartOver}
          variant="outline"
          className="px-8 w-full border-flame-red/30 text-flame-red hover:bg-flame-red/10 hover:border-flame-red"
        >
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}