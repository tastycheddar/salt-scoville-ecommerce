
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AlertCircle, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';

const HeroDatabaseDiagnostics = () => {
  const { toast } = useToast();
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Basic connection
      try {
        const response = await fetch('/api/hero-images', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        results.tests.connection = {
          success: response.ok,
          error: response.ok ? null : `HTTP ${response.status}`,
          count: Array.isArray(data) ? data.length : 0
        };
      } catch (err: any) {
        results.tests.connection = {
          success: false,
          error: err.message
        };
      }

      // Test 2: Check if table exists and structure
      try {
        const response = await fetch('/api/hero-images?limit=0', {
          method: 'GET',
          credentials: 'include'
        });
        results.tests.tableStructure = {
          success: response.ok,
          error: response.ok ? null : `HTTP ${response.status}`
        };
      } catch (err: any) {
        results.tests.tableStructure = {
          success: false,
          error: err.message
        };
      }

      // Test 3: Count all records (active and inactive)
      try {
        const response = await fetch('/api/hero-images', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        results.tests.totalRecords = {
          success: response.ok,
          error: response.ok ? null : `HTTP ${response.status}`,
          count: Array.isArray(data) ? data.length : 0
        };
      } catch (err: any) {
        results.tests.totalRecords = {
          success: false,
          error: err.message
        };
      }

      // Test 4: Count active records
      try {
        const response = await fetch('/api/hero-images?active=true', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        results.tests.activeRecords = {
          success: response.ok,
          error: response.ok ? null : `HTTP ${response.status}`,
          count: Array.isArray(data) ? data.length : 0
        };
      } catch (err: any) {
        results.tests.activeRecords = {
          success: false,
          error: err.message
        };
      }

      // Test 5: Try to fetch one record
      try {
        const response = await fetch('/api/hero-images?limit=1', {
          credentials: 'include'
        });
        const data = response.ok ? [await response.json()].flat() : null;
        const error = response.ok ? null : { message: `HTTP ${response.status}` };
        results.tests.sampleRecord = {
          success: !error,
          error: error?.message,
          data: data?.[0]
        };
      } catch (err: any) {
        results.tests.sampleRecord = {
          success: false,
          error: err.message
        };
      }

      // Test 6: Check RLS policies
      try {
        const response = await fetch('/api/hero-images?active=true', {
          credentials: 'include'
        });
        const data = response.ok ? await response.json() : null;
        const error = response.ok ? null : { message: `HTTP ${response.status}` };
        results.tests.rlsPolicies = {
          success: !error,
          error: error?.message,
          recordCount: data?.length || 0
        };
      } catch (err: any) {
        results.tests.rlsPolicies = {
          success: false,
          error: err.message
        };
      }

    } catch (globalErr: any) {
      results.globalError = globalErr.message;
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const insertSampleData = async () => {
    try {
      const sampleImages = [
        {
          image_url: '/lovable-uploads/8b47aa19-10fa-4198-8283-48b16894553a.png',
          alt_text: 'Salt & Scoville Premium Hot Sauce Collection',
          title: 'Premium Hot Sauce Hero Image 1',
          sort_order: 1,
          is_active: true
        },
        {
          image_url: '/lovable-uploads/9b059090-67b5-4c09-9a00-c2545a7c9ba9.png',
          alt_text: 'Artisanal Spicy Salt Blends',
          title: 'Spicy Salt Blends Hero Image 2',
          sort_order: 2,
          is_active: true
        },
        {
          image_url: '/lovable-uploads/9f2f210b-2130-444d-9aa7-1e81f7da5cb8.png',
          alt_text: 'Gourmet Heat Experience',
          title: 'Gourmet Heat Hero Image 3',
          sort_order: 3,
          is_active: true
        }
      ];

      const { data, error } = await supabase
        .from('hero_images')
        .insert(sampleImages)
        .select();

      if (error) {
        logger.error('Failed to insert sample data:', error);
        toast({
          title: "Error",
          description: `Failed to insert sample data: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Sample data inserted successfully!",
        });
        runDiagnostics(); // Re-run diagnostics
      }
    } catch (err: any) {
      logger.error('Error inserting sample data:', err);
      toast({
        title: "Error",
        description: `Error inserting sample data: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              'Run Diagnostics'
            )}
          </Button>
          
          <Button
            onClick={insertSampleData}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Insert Sample Data
          </Button>
        </div>

        {diagnostics && (
          <div className="space-y-3">
            <div className="text-white/70 text-sm">
              Last run: {new Date(diagnostics.timestamp).toLocaleString()}
            </div>
            
            {Object.entries(diagnostics.tests).map(([testName, result]: [string, any]) => (
              <div key={testName} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <div className="flex-1">
                  <div className="text-white font-medium capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  {result.error && (
                    <div className="text-red-300 text-sm">{result.error}</div>
                  )}
                  {result.count !== undefined && (
                    <div className="text-white/70 text-sm">Count: {result.count}</div>
                  )}
                  {result.recordCount !== undefined && (
                    <div className="text-white/70 text-sm">Records: {result.recordCount}</div>
                  )}
                </div>
              </div>
            ))}
            
            {diagnostics.globalError && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="text-red-300 font-medium">Global Error:</div>
                <div className="text-red-200 text-sm">{diagnostics.globalError}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeroDatabaseDiagnostics;
