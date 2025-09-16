import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Flame, ChefHat, Sparkles, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatProfile {
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
}

interface QuizResponses {
  age?: string;
  spiceExperience?: string;
  favoriteSpices?: string[];
  heatPreference?: string;
  personalityAnswers?: string[];
  cuisinePreferences?: string[];
}

const spiceOptions = [
  'Garlic', 'Black Pepper', 'Paprika', 'Cumin', 'Chili Powder',
  'Cayenne', 'Jalapeño', 'Habanero', 'Ghost Pepper', 'Carolina Reaper'
];

const cuisineOptions = [
  'Mexican', 'Thai', 'Indian', 'Caribbean', 'Cajun',
  'Korean', 'Mediterranean', 'BBQ', 'Fusion', 'American'
];

const personalityOptions = [
  'I love trying new things', 'I prefer familiar flavors', 'I enjoy challenging myself',
  'I like to share food experiences', 'I research before trying', 'I trust my instincts'
];

export function HeatProfileQuiz({ onComplete }: { onComplete: (profile: HeatProfile) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<QuizResponses>({});
  
  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const generateProfileMutation = useMutation({
    mutationFn: async (responses: QuizResponses) => {
      return apiRequest('/api/ai/analyze-heat-profile', {
        method: 'POST',
        body: JSON.stringify(responses)
      });
    },
    onSuccess: (profile: HeatProfile) => {
      onComplete(profile);
    }
  });

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateProfileMutation.mutate(responses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateResponse = (key: keyof QuizResponses, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const steps = [
    // Step 1: Age Range
    {
      title: "Let's Start Your Flavor Journey!",
      description: "FlavaDave's AI will create your personalized heat profile",
      icon: <Flame className="h-6 w-6 text-flame-red" />,
      content: (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-white">What's your age range?</Label>
          <RadioGroup 
            value={responses.age} 
            onValueChange={(value: string) => updateResponse('age', value)}
            className="space-y-3"
          >
            {['Under 25', '25-35', '36-45', '46-55', 'Over 55'].map((age) => (
              <div key={age} className="flex items-center space-x-2">
                <RadioGroupItem value={age} id={age} />
                <Label htmlFor={age} className="cursor-pointer text-white">{age}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    },
    
    // Step 2: Spice Experience
    {
      title: "Your Spice Adventure Level",
      description: "How experienced are you with heat?",
      icon: <ChefHat className="h-6 w-6 text-flame-red" />,
      content: (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-white">Your spice experience level?</Label>
          <RadioGroup 
            value={responses.spiceExperience} 
            onValueChange={(value: string) => updateResponse('spiceExperience', value)}
            className="space-y-3"
          >
            {[
              { value: 'beginner', label: 'Spice Explorer', desc: 'I enjoy mild heat and want to discover more' },
              { value: 'intermediate', label: 'Heat Seeker', desc: 'I regularly eat spicy food and love variety' },
              { value: 'expert', label: 'Capsaicin Connoisseur', desc: 'I crave extreme heat and complex flavors' }
            ].map((exp) => (
              <div key={exp.value} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:bg-gray-800/50">
                <RadioGroupItem value={exp.value} id={exp.value} />
                <div>
                  <Label htmlFor={exp.value} className="cursor-pointer font-medium text-white">{exp.label}</Label>
                  <p className="text-sm text-gray-400">{exp.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    },

    // Step 3: Favorite Spices
    {
      title: "Your Flavor Preferences",
      description: "Which spices do you currently enjoy?",
      icon: <Sparkles className="h-6 w-6 text-flame-red" />,
      content: (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-white">Select your favorite spices (choose as many as you like):</Label>
          <div className="grid grid-cols-2 gap-3">
            {spiceOptions.map((spice) => (
              <div key={spice} className="flex items-center space-x-2">
                <Checkbox
                  id={spice}
                  checked={responses.favoriteSpices?.includes(spice) || false}
                  onCheckedChange={(checked) => {
                    const current = responses.favoriteSpices || [];
                    if (checked) {
                      updateResponse('favoriteSpices', [...current, spice]);
                    } else {
                      updateResponse('favoriteSpices', current.filter(s => s !== spice));
                    }
                  }}
                />
                <Label htmlFor={spice} className="cursor-pointer text-white">{spice}</Label>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Step 4: Heat Preference
    {
      title: "Your Heat Sweet Spot",
      description: "What's your ideal heat level for daily cooking?",
      icon: <Target className="h-6 w-6 text-flame-red" />,
      content: (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-white">What heat level do you prefer?</Label>
          <RadioGroup 
            value={responses.heatPreference} 
            onValueChange={(value: string) => updateResponse('heatPreference', value)}
            className="space-y-3"
          >
            {[
              { value: 'mild', label: 'Gentle Warmth (1-2)', desc: 'Subtle heat that enhances flavor' },
              { value: 'medium', label: 'Balanced Fire (3)', desc: 'Noticeable heat with great taste' },
              { value: 'hot', label: 'Serious Heat (4)', desc: 'Strong heat that challenges and excites' },
              { value: 'extreme', label: 'Maximum Intensity (5)', desc: 'Extreme heat for the ultimate experience' }
            ].map((heat) => (
              <div key={heat.value} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:bg-gray-800/50">
                <RadioGroupItem value={heat.value} id={heat.value} />
                <div>
                  <Label htmlFor={heat.value} className="cursor-pointer font-medium text-white">{heat.label}</Label>
                  <p className="text-sm text-gray-400">{heat.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    },

    // Step 5: Personality
    {
      title: "Your Culinary Personality",
      description: "What describes your approach to food?",
      icon: <TrendingUp className="h-6 w-6 text-flame-red" />,
      content: (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-white">Choose statements that describe you:</Label>
          <div className="space-y-3">
            {personalityOptions.map((trait) => (
              <div key={trait} className="flex items-center space-x-2">
                <Checkbox
                  id={trait}
                  checked={responses.personalityAnswers?.includes(trait) || false}
                  onCheckedChange={(checked) => {
                    const current = responses.personalityAnswers || [];
                    if (checked) {
                      updateResponse('personalityAnswers', [...current, trait]);
                    } else {
                      updateResponse('personalityAnswers', current.filter(t => t !== trait));
                    }
                  }}
                />
                <Label htmlFor={trait} className="cursor-pointer text-white">{trait}</Label>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Step 6: Cuisine Preferences
    {
      title: "Your Cuisine Adventures",
      description: "Which cuisines do you love exploring?",
      icon: <ChefHat className="h-6 w-6 text-flame-red" />,
      content: (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-white">Select your favorite cuisines:</Label>
          <div className="grid grid-cols-2 gap-3">
            {cuisineOptions.map((cuisine) => (
              <div key={cuisine} className="flex items-center space-x-2">
                <Checkbox
                  id={cuisine}
                  checked={responses.cuisinePreferences?.includes(cuisine) || false}
                  onCheckedChange={(checked) => {
                    const current = responses.cuisinePreferences || [];
                    if (checked) {
                      updateResponse('cuisinePreferences', [...current, cuisine]);
                    } else {
                      updateResponse('cuisinePreferences', current.filter(c => c !== cuisine));
                    }
                  }}
                />
                <Label htmlFor={cuisine} className="cursor-pointer text-white">{cuisine}</Label>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/90 border-2 border-flame-red/30">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          {currentStepData.icon}
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          {currentStepData.title}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {currentStepData.description}
        </CardDescription>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-sm text-gray-500">Step {currentStep + 1} of {totalSteps}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentStepData.content}
        
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 border-flame-red/30 text-flame-red hover:bg-flame-red/10 hover:border-flame-red hover:text-white transition-all duration-300"
          >
            Previous
          </Button>
          
          <Button
            type="button"
            onClick={handleNext}
            disabled={generateProfileMutation.isPending}
            className={cn(
              "px-6 bg-flame-red hover:bg-flame-red/90 text-white",
              generateProfileMutation.isPending && "opacity-50 cursor-not-allowed"
            )}
          >
            {generateProfileMutation.isPending ? (
              <>Analyzing Your Heat Profile...</>
            ) : currentStep === totalSteps - 1 ? (
              <>Generate My Profile</>
            ) : (
              <>Next</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}