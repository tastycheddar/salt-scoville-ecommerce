import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Flame, Settings, Brain, Utensils, MessageSquare, TrendingUp, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalitySettings {
  heatLevel: 'mild_dave' | 'medium_dave' | 'hot_dave' | 'volcanic_dave';
  dietaryMode: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'none';
  chattiness: number; // 1-5 scale
  salesAggression: number; // 1-5 scale
  scientificDetail: number; // 1-5 scale
  autoAdapt: boolean;
}

interface PersonalityStats {
  currentSettings: PersonalitySettings;
  adaptationCount: number;
  lastUpdated: string;
  recentAdaptations: Array<{
    timestamp: string;
    trigger: string;
    reason: string;
  }>;
}

interface PersonalityControlsProps {
  sessionId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export function PersonalityControls({ sessionId, isVisible, onClose }: PersonalityControlsProps) {
  const [settings, setSettings] = useState<PersonalitySettings>({
    heatLevel: 'medium_dave',
    dietaryMode: 'omnivore',
    chattiness: 3,
    salesAggression: 4,
    scientificDetail: 3,
    autoAdapt: true
  });
  
  const [stats, setStats] = useState<PersonalityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible) {
      checkAdminAccess();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && sessionId && isAdmin) {
      loadPersonalityStats();
    }
  }, [isVisible, sessionId, isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        const hasAdminAccess = user.role === 'admin' || user.role === 'superadmin';
        setIsAdmin(hasAdminAccess);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const loadPersonalityStats = async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`/api/flava-dave/v4/personality/stats/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setSettings(data.currentSettings);
      }
    } catch (error) {
      console.error('Failed to load personality stats:', error);
    }
  };

  const updatePersonality = async (newSettings: Partial<PersonalitySettings>) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/flava-dave/v4/personality/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        
        toast({
          title: "Personality Updated! 🧠",
          description: "Dave's personality has been adjusted to your preferences.",
          duration: 3000
        });
        
        // Reload stats to show changes
        await loadPersonalityStats();
      } else if (response.status === 403) {
        toast({
          title: "Access Denied",
          description: "Admin access required to modify personality settings.",
          variant: "destructive"
        });
      } else {
        throw new Error('Failed to update personality');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update Dave's personality. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHeatLevelIcon = (level: string) => {
    const iconCount = {
      'mild_dave': 1,
      'medium_dave': 2,
      'hot_dave': 3,
      'volcanic_dave': 4
    }[level] || 2;
    
    return Array(iconCount).fill(0).map((_, i) => (
      <Flame key={i} className="h-4 w-4 text-flame-red" />
    ));
  };

  const getSliderColor = (value: number) => {
    if (value <= 2) return 'text-green-500';
    if (value <= 3) return 'text-yellow-500';
    return 'text-flame-red';
  };

  if (!isVisible) return null;

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-96 bg-white dark:bg-charcoal">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-flame-red border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Checking access permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-charcoal border-flame-red/20">
          <CardHeader className="text-center space-y-2">
            <Shield className="h-12 w-12 text-flame-red mx-auto" />
            <CardTitle className="text-xl font-bold">Admin Access Required</CardTitle>
            <CardDescription>
              Personality controls are restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <Button onClick={onClose} className="bg-flame-red hover:bg-flame-red/80">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-charcoal border-flame-red/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-flame-red" />
              <CardTitle className="text-2xl font-bold">Dave's Personality Controls</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              ✕
            </Button>
          </div>
          <CardDescription>
            Customize how Dave interacts with you. Changes take effect immediately!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Heat Level Personality */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center space-x-2">
              <Flame className="h-5 w-5 text-flame-red" />
              <span>Heat Level Personality</span>
            </Label>
            <Select 
              value={settings.heatLevel} 
              onValueChange={(value: any) => updatePersonality({ heatLevel: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild_dave">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-green-500" />
                    <span>Mild Dave - Gentle & Patient</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium_dave">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Flame className="h-4 w-4 text-yellow-500" />
                      <Flame className="h-4 w-4 text-yellow-500" />
                    </div>
                    <span>Medium Dave - Balanced Energy</span>
                  </div>
                </SelectItem>
                <SelectItem value="hot_dave">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <Flame className="h-4 w-4 text-orange-500" />
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                    <span>Hot Dave - Passionate & Direct</span>
                  </div>
                </SelectItem>
                <SelectItem value="volcanic_dave">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Flame className="h-4 w-4 text-flame-red" />
                      <Flame className="h-4 w-4 text-flame-red" />
                      <Flame className="h-4 w-4 text-flame-red" />
                      <Flame className="h-4 w-4 text-flame-red" />
                    </div>
                    <span>Volcanic Dave - Maximum Intensity!</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-flame-red" />
              <span>Dietary Preferences</span>
            </Label>
            <Select 
              value={settings.dietaryMode} 
              onValueChange={(value: any) => updatePersonality({ dietaryMode: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore - All Foods</SelectItem>
                <SelectItem value="vegetarian">Vegetarian - No Meat</SelectItem>
                <SelectItem value="vegan">Vegan - Plant-Based Only</SelectItem>
                <SelectItem value="keto">Keto - Low Carb Focus</SelectItem>
                <SelectItem value="none">No Restrictions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Personality Sliders */}
          <div className="space-y-6">
            <h4 className="font-semibold flex items-center space-x-2">
              <Settings className="h-5 w-5 text-flame-red" />
              <span>Conversation Style</span>
            </h4>

            {/* Chattiness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chattiness Level</span>
                </Label>
                <Badge variant="outline" className={getSliderColor(settings.chattiness)}>
                  {settings.chattiness}/5
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={settings.chattiness}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSettings(prev => ({ ...prev, chattiness: value }));
                    updatePersonality({ chattiness: value });
                  }}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.chattiness <= 2 ? 'Concise & Direct' : 
                 settings.chattiness <= 3 ? 'Balanced Chat' : 
                 'Very Talkative'}
              </div>
            </div>

            {/* Sales Aggression */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Sales Enthusiasm</span>
                </Label>
                <Badge variant="outline" className={getSliderColor(settings.salesAggression)}>
                  {settings.salesAggression}/5
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={settings.salesAggression}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSettings(prev => ({ ...prev, salesAggression: value }));
                    updatePersonality({ salesAggression: value });
                  }}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.salesAggression <= 2 ? 'Subtle Suggestions' : 
                 settings.salesAggression <= 3 ? 'Natural Recommendations' : 
                 'Enthusiastic Sales Mode'}
              </div>
            </div>

            {/* Scientific Detail */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Scientific Detail</span>
                </Label>
                <Badge variant="outline" className={getSliderColor(settings.scientificDetail)}>
                  {settings.scientificDetail}/5
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={settings.scientificDetail}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSettings(prev => ({ ...prev, scientificDetail: value }));
                    updatePersonality({ scientificDetail: value });
                  }}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.scientificDetail <= 2 ? 'Simple Explanations' : 
                 settings.scientificDetail <= 3 ? 'Moderate Science' : 
                 'PhD-Level Detail'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Auto-Adapt Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Auto-Adapt</Label>
              <p className="text-sm text-muted-foreground">
                Let Dave automatically adjust based on your star ratings
              </p>
            </div>
            <Switch
              checked={settings.autoAdapt}
              onCheckedChange={(checked) => updatePersonality({ autoAdapt: checked })}
              disabled={isLoading}
            />
          </div>

          {/* Stats Section */}
          {stats && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Adaptation History</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Adaptations:</span> {stats.adaptationCount}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(stats.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
                
                {stats.recentAdaptations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Recent Changes:</h5>
                    {stats.recentAdaptations.map((adaptation, index) => (
                      <div key={index} className="bg-muted/50 p-2 rounded text-xs">
                        <div className="font-medium">{adaptation.trigger}</div>
                        <div className="text-muted-foreground">{adaptation.reason}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}