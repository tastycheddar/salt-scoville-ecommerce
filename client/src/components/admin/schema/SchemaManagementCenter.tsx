/**
 * Schema Management Center - Central hub for managing all structured data
 * Part of the Schema 2.0 system with AI/LLM optimization
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Brain, 
  Mic, 
  Globe, 
  Star,
  Eye,
  Code,
  Zap,
  TrendingUp,
  MapPin,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface SchemaItem {
  id: string;
  entityType: string;
  schemaType: string;
  title: string;
  status: 'valid' | 'invalid' | 'pending';
  aiOptimized: boolean;
  voiceSearchReady: boolean;
  richResultsEligible: boolean;
  lastValidated: string;
}

const SchemaManagementCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real implementation, this would come from API
  const schemaStats = {
    totalSchemas: 142,
    validSchemas: 128,
    aiOptimized: 89,
    voiceReady: 76,
    richResultsEligible: 94
  };

  const recentSchemas: SchemaItem[] = [
    {
      id: '1',
      entityType: 'product',
      schemaType: 'Product',
      title: 'Ghost Pepper Death Sauce',
      status: 'valid',
      aiOptimized: true,
      voiceSearchReady: true,
      richResultsEligible: true,
      lastValidated: '2025-08-09T00:00:00Z'
    },
    {
      id: '2',
      entityType: 'recipe',
      schemaType: 'Recipe',
      title: 'Spicy Honey Glazed Wings',
      status: 'valid',
      aiOptimized: true,
      voiceSearchReady: false,
      richResultsEligible: true,
      lastValidated: '2025-08-08T12:00:00Z'
    },
    {
      id: '3',
      entityType: 'faq',
      schemaType: 'FAQPage',
      title: 'Heat Level Guide',
      status: 'pending',
      aiOptimized: false,
      voiceSearchReady: false,
      richResultsEligible: false,
      lastValidated: '2025-08-07T08:00:00Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Schema Management Center</h1>
          <p className="text-white/70 mt-1">
            Manage structured data for enhanced search visibility and AI optimization
          </p>
        </div>
        <Button className="bg-flame-red hover:bg-flame-red/90">
          <Code className="h-4 w-4 mr-2" />
          Generate Schema
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-charcoal/50 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Schemas</p>
                <p className="text-2xl font-bold text-white">{schemaStats.totalSchemas}</p>
              </div>
              <Globe className="h-8 w-8 text-flame-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-charcoal/50 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Valid</p>
                <p className="text-2xl font-bold text-green-400">{schemaStats.validSchemas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-charcoal/50 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">AI Optimized</p>
                <p className="text-2xl font-bold text-purple-400">{schemaStats.aiOptimized}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-charcoal/50 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Voice Ready</p>
                <p className="text-2xl font-bold text-blue-400">{schemaStats.voiceReady}</p>
              </div>
              <Mic className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-charcoal/50 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Rich Results</p>
                <p className="text-2xl font-bold text-amber-400">{schemaStats.richResultsEligible}</p>
              </div>
              <Star className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-charcoal/50 border border-white/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="faq">FAQ Pages</TabsTrigger>
          <TabsTrigger value="local">Local Business</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="bg-charcoal/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Schema Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSchemas.map((schema) => (
                  <div key={schema.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(schema.status)}
                        <span className="text-white font-medium">{schema.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {schema.schemaType}
                        </Badge>
                        {schema.aiOptimized && (
                          <Badge className="text-xs bg-purple-600">AI</Badge>
                        )}
                        {schema.voiceSearchReady && (
                          <Badge className="text-xs bg-blue-600">Voice</Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-charcoal/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Generate Product Schemas
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Recipe Schema
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Build FAQ Page
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Business Location
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Optimize All Schemas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-charcoal/30 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Product Schemas</CardTitle>
                <Button size="sm" className="bg-flame-red hover:bg-flame-red/90">
                  Auto-Generate All
                </Button>
              </div>
              <CardDescription className="text-white/60">
                Manage structured data for all products with AI and voice optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-white/60">AI Optimize</Label>
                  <Switch />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-white/60">Voice Ready</Label>
                  <Switch />
                </div>
              </div>

              <div className="text-center py-8 text-white/60">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Product schemas will be displayed here</p>
                <p className="text-sm">Integrate with your product database to see all schemas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <Card className="bg-charcoal/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recipe Schemas</CardTitle>
              <CardDescription className="text-white/60">
                Structured data for recipes and cooking guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-white/60">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Recipe schemas will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card className="bg-charcoal/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">FAQ Page Schemas</CardTitle>
              <CardDescription className="text-white/60">
                Optimize FAQ content for search engines and AI assistants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-white/60">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>FAQ schemas will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <Card className="bg-charcoal/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Local Business Schemas</CardTitle>
              <CardDescription className="text-white/60">
                Manage store locations and local SEO data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-white/60">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Local business schemas will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-charcoal/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Schema Performance Analytics</CardTitle>
              <CardDescription className="text-white/60">
                Track rich results appearance and click-through rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-white/60">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Schema analytics will be displayed here</p>
                <p className="text-sm">Connect to Google Search Console for performance data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaManagementCenter;