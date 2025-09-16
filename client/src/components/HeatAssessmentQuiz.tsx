import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, Zap, Target, ChefHat, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'personality';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
  icon?: React.ReactNode;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: "What's your spice journey so far?",
    type: 'single',
    icon: <ChefHat className="w-6 h-6" />,
    options: [
      "🌶️ New to spicy foods - I'm here to explore!",
      "🔥 I enjoy some heat - bring on the medium stuff",
      "🌋 Spice veteran - I live for the burn",
      "👑 Heat champion - ghost peppers are my breakfast"
    ]
  },
  {
    id: 'tolerance',
    question: "Rate your current heat tolerance",
    type: 'scale',
    icon: <Flame className="w-6 h-6" />,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Mild & Friendly", "Gentle Warmth", "Nice Heat", "Serious Fire", "Volcanic"]
  },
  {
    id: 'favorite_spices',
    question: "Which spices make your taste buds dance?",
    type: 'multiple',
    icon: <Star className="w-6 h-6" />,
    options: [
      "🧄 Garlic - the foundation of flavor",
      "🌶️ Jalapeño - classic and reliable", 
      "🔥 Chipotle - smoky and sophisticated",
      "👻 Ghost pepper - for the brave souls",
      "🌋 Carolina Reaper - ultimate challenge",
      "🍯 Sweet heat combinations",
      "🌿 Herb-forward blends",
      "🌮 Caribbean jerk spices"
    ]
  },
  {
    id: 'personality',
    question: "What describes your personality when it comes to new experiences?",
    type: 'personality',
    icon: <Zap className="w-6 h-6" />,
    options: [
      "🎯 Strategic - I research everything first",
      "🚀 Adventurous - I dive right in",
      "⚖️ Balanced - I like measured exploration", 
      "🎪 Social - I love sharing experiences",
      "🧪 Curious - I experiment constantly"
    ]
  },
  {
    id: 'goals',
    question: "What's your spicy food goal?",
    type: 'single',
    icon: <Target className="w-6 h-6" />,
    options: [
      "🍽️ Enhance my everyday meals",
      "📈 Gradually build my heat tolerance",
      "🎉 Impress friends with my heat skills",
      "🧑‍🍳 Master spicy cooking techniques",
      "🌶️ Become a hot sauce connoisseur"
    ]
  },
  {
    id: 'cuisine',
    question: "Which cuisines call to your spicy soul?",
    type: 'multiple',
    icon: <Globe className="w-6 h-6" />,
    options: [
      "🌮 Mexican - authentic and vibrant",
      "🏝️ Caribbean - tropical heat paradise",
      "🍛 Indian - complex spice symphonies",
      "🌶️ Thai - perfect balance of heat and sweet",
      "🔥 Korean - fermented fire goodness",
      "🌯 Middle Eastern - warm and aromatic",
      "🇺🇸 American BBQ - smoky heat perfection"
    ]
  }
];

interface HeatAssessmentQuizProps {
  onComplete: (responses: Record<string, any>) => void;
  onClose?: () => void;
}

export function HeatAssessmentQuiz({ onComplete, onClose }: HeatAssessmentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (value: any) => {
    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setIsComplete(true);
      setTimeout(() => onComplete(newResponses), 500);
    }
  };

  const handleMultipleSelect = (option: string) => {
    const currentSelections = responses[question.id] || [];
    const newSelections = currentSelections.includes(option)
      ? currentSelections.filter((item: string) => item !== option)
      : [...currentSelections, option];
    
    setResponses({ ...responses, [question.id]: newSelections });
  };

  const handleScaleSelect = (value: number) => {
    handleAnswer(value);
  };

  const canProceed = () => {
    const answer = responses[question.id];
    if (question.type === 'multiple') {
      return answer && answer.length > 0;
    }
    return answer !== undefined;
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-6xl mb-4"
        >
          🌶️
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 text-white">Analyzing Your Heat Profile...</h3>
        <p className="text-white/80 mb-4">
          Our AI is crafting your personalized spice journey!
        </p>
        <div className="w-full max-w-xs">
          <Progress value={100} className="h-2" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6" data-testid="heat-assessment-quiz">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span className="text-sm text-white/70">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-lg">
            <CardContent className="p-8">
              {/* Question Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-flame-red/20 rounded-full text-flame-red">
                  {question.icon}
                </div>
                <h2 className="text-xl font-bold leading-tight text-white">{question.question}</h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {question.type === 'single' && question.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 bg-white/5 text-white",
                      "hover:border-flame-red/50 hover:bg-flame-red/10 border-white/20",
                      "focus:outline-none focus:ring-2 focus:ring-flame-red/50",
                      responses[question.id] === option && "border-flame-red bg-flame-red/20 text-white"
                    )}
                  >
                    <span className="font-medium">{option}</span>
                  </motion.button>
                ))}

                {question.type === 'multiple' && question.options?.map((option, index) => {
                  const isSelected = responses[question.id]?.includes(option);
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultipleSelect(option)}
                      className={cn(
                        "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 bg-white/5 text-white",
                        "hover:border-flame-red/50 hover:bg-flame-red/10 border-white/20",
                        "focus:outline-none focus:ring-2 focus:ring-flame-red/50",
                        isSelected && "border-flame-red bg-flame-red/20 text-white"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {isSelected && (
                          <Badge variant="secondary" className="bg-flame-red text-white">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </motion.button>
                  );
                })}

                {question.type === 'scale' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleScaleSelect(value)}
                          className={cn(
                            "aspect-square rounded-full border-2 font-bold text-lg transition-all duration-200 bg-white/5 text-white border-white/20",
                            "hover:border-flame-red hover:bg-flame-red/20",
                            responses[question.id] === value && "border-flame-red bg-flame-red text-white"
                          )}
                        >
                          {value}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-white/60 px-2">
                      <span>{question.scaleLabels?.[0]}</span>
                      <span>{question.scaleLabels?.[4]}</span>
                    </div>
                  </div>
                )}

                {question.type === 'personality' && question.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 bg-white/5 text-white",
                      "hover:border-flame-red/50 hover:bg-flame-red/10 border-white/20",
                      "focus:outline-none focus:ring-2 focus:ring-flame-red/50",
                      responses[question.id] === option && "border-flame-red bg-flame-red/20 text-white"
                    )}
                  >
                    <span className="font-medium">{option}</span>
                  </motion.button>
                ))}
              </div>

              {/* Multiple Choice Continue Button */}
              {question.type === 'multiple' && (
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-white/70">
                    {responses[question.id]?.length || 0} selected
                  </p>
                  <Button
                    onClick={() => {
                      if (currentQuestion < quizQuestions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1);
                      } else {
                        setIsComplete(true);
                        setTimeout(() => onComplete(responses), 500);
                      }
                    }}
                    disabled={!canProceed()}
                    className="bg-flame-red hover:bg-flame-red/90"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-center mt-6">
          <Button variant="ghost" onClick={onClose} className="text-flame-red/70 hover:text-flame-red hover:bg-flame-red/10 transition-all duration-300">
            Skip Heat Assessment
          </Button>
        </div>
      )}
    </div>
  );
}