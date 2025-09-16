import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, ArrowRight, Thermometer, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeatGuideTeaser() {
  const quickLevels = [
    { level: 1, name: "Gentle", color: "text-green-400", bgColor: "bg-green-500/20", gradient: "from-green-500 to-emerald-400" },
    { level: 2, name: "Building", color: "text-yellow-400", bgColor: "bg-yellow-500/20", gradient: "from-yellow-500 to-amber-400" },
    { level: 3, name: "Serious", color: "text-orange-400", bgColor: "bg-orange-500/20", gradient: "from-orange-500 to-red-400" },
    { level: 4, name: "Intense", color: "text-red-400", bgColor: "bg-red-500/20", gradient: "from-red-500 to-pink-400" },
    { level: 5, name: "Volcanic", color: "text-flame", bgColor: "bg-flame/20", gradient: "from-flame to-burnt-orange" }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-charcoal via-char-black to-charcoal">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
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
                >
                  <Thermometer className="w-12 h-12 text-flame" />
                </motion.div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-white mb-2 font-im-fell">
                    Understanding Heat Levels
                  </h2>
                  <p className="text-flame font-semibold">
                    Find your perfect spice match
                  </p>
                </div>
              </div>

              <p className="text-lg text-white/80 mb-8">
                From gentle warmth to volcanic intensity, discover the science behind spice levels 
                and find products perfectly matched to your heat tolerance.
              </p>

              {/* Full Width Stacked Heat Level Preview */}
              <div className="space-y-4 mb-8">
                {quickLevels.map((heat, index) => (
                  <motion.div
                    key={heat.level}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className={`${heat.bgColor} rounded-lg border border-white/20 overflow-hidden`}
                  >
                    <div className="flex items-center justify-between p-4">
                      {/* Left side - Heat Level Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${heat.bgColor} border-2 border-white/30 flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{heat.level}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">
                            {heat.name}
                          </h4>
                          <div className="text-sm text-white/70">Level {heat.level} Heat</div>
                        </div>
                      </div>

                      {/* Right side - Heat indicators */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Flame
                            key={i}
                            className={`w-4 h-4 ${
                              i < heat.level ? heat.color : 'text-white/30'
                            }`}
                            fill={i < heat.level ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link to="/heat-guide">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-flame to-burnt-orange hover:from-flame/90 hover:to-burnt-orange/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg"
                    >
                      <Thermometer className="w-5 h-5 mr-2" />
                      Explore Full Heat Guide
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </Link>

                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Sparkles className="w-4 h-4 text-flame" />
                  <span>Complete Scoville scale + AI recommendations</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-flame">🌶️</div>
                  <p className="text-xs text-white/70 mt-1">Scoville Scale</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-flame">🧪</div>
                  <p className="text-xs text-white/70 mt-1">Science-Based</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-flame">🎯</div>
                  <p className="text-xs text-white/70 mt-1">Perfect Match</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}