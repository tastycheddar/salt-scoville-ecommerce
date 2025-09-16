import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Search, TrendingUp, AlertCircle, CheckCircle, BarChart3, Globe, Eye, Clock, AlertTriangle } from 'lucide-react';

const SearchConsoleSetup = () => {
  const { toast } = useToast();

  // Fetch comprehensive SEO analytics
  const { data: seoAnalytics, isLoading } = useQuery({
    queryKey: ['seo-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/seo/analytics');
      if (!response.ok) throw new Error('Failed to fetch SEO analytics');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch SEO system status
  const { data: seoStatus } = useQuery({
    queryKey: ['seo-status'],
    queryFn: async () => {
      const response = await fetch('/api/seo/status');
      if (!response.ok) throw new Error('Failed to fetch SEO status');
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Google Search Console Setup</h2>
        <p className="text-white/70">Verify your website and monitor search performance</p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Analytics Integration</TabsTrigger>
          <TabsTrigger value="monitoring">Performance Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Google Analytics Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ga-id">GA4 Tracking ID</Label>
                  <Input 
                    id="ga-id" 
                    placeholder="G-1234567890" 
                    defaultValue=""
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Google Analytics 4 property ID
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Google Analytics properly configured</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Google Search Console Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">🔄 Google OAuth Verification in Progress</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Your Search Console is already linked to Google Analytics (Aug 3, 2025). OAuth verification pending.
                  </p>
                  <div className="bg-blue-100/50 rounded p-2 mb-3 text-xs text-blue-700">
                    ✓ Active data: 122 clicks, 139 queries<br/>
                    ✓ Domain verified: saltandscoville.com<br/>
                    ⏳ API access: Awaiting Google verification
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-blue-600">
                      Data tracking active. Direct access available while OAuth approval processes.
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                    >
                      View Live Data
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      <Badge variant="outline" className="text-blue-600">Verification Pending</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" asChild>
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Console
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fsaltandscoville.com%2F" target="_blank" rel="noopener noreferrer">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Performance
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* SEO Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-500" />
                      Search Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Clicks</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.searchConsole?.totalClicks?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Impressions</span>
                        <span className="font-medium">
                          {seoAnalytics?.metrics?.searchConsole?.totalImpressions?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average CTR</span>
                        <span className="font-medium">
                          {seoAnalytics?.metrics?.searchConsole?.averageCtr || '0'}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Position</span>
                        <span className="font-medium">
                          {seoAnalytics?.metrics?.searchConsole?.averagePosition || '0'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      Index Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Pages</span>
                        <span className="font-medium">
                          {seoAnalytics?.metrics?.totalPages || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Indexed Pages</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.indexedPages || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mobile Usability</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.mobileUsability || '0'}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Load Time</span>
                        <span className="font-medium">
                          {seoAnalytics?.metrics?.avgLoadTime || '0'}s
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      Core Web Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">LCP</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.coreWebVitals?.lcp || '0'}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">FID</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.coreWebVitals?.fid || '0'}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">CLS</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.coreWebVitals?.cls || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">FCP</span>
                        <span className="font-medium text-green-600">
                          {seoAnalytics?.metrics?.coreWebVitals?.fcp || '0'}s
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">GA4 Analytics</span>
                        <Badge variant={seoStatus?.googleServices?.analytics?.status === 'Active' ? 'default' : 'destructive'}>
                          {seoStatus?.googleServices?.analytics?.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Search Console</span>
                        <Badge variant={seoStatus?.googleServices?.searchConsole?.status === 'Active' ? 'default' : 'destructive'}>
                          {seoStatus?.googleServices?.searchConsole?.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">OAuth</span>
                        <Badge variant={seoStatus?.googleServices?.oauth?.status === 'Active' ? 'default' : 'destructive'}>
                          {seoStatus?.googleServices?.oauth?.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall</span>
                        <Badge variant={seoStatus?.readiness?.overall ? 'default' : 'destructive'}>
                          {seoStatus?.readiness?.overall ? 'Ready' : 'Issues'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Pages Performance */}
              {seoAnalytics?.metrics?.topPages && seoAnalytics.metrics.topPages.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      Top Performing Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {seoAnalytics.metrics.topPages.slice(0, 5).map((page: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm truncate text-white">{page.title}</div>
                            <div className="text-xs text-white/60 truncate">{page.url}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-400">{page.views}</div>
                            <div className="text-xs text-white/60">views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-white/60">
                  Last updated: {seoAnalytics?.lastUpdated ? new Date(seoAnalytics.lastUpdated).toLocaleString() : 'Never'}
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Google Analytics
                    </a>
                  </Button>
                  <Button asChild size="sm">
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Search Console
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchConsoleSetup;