
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Search, CheckCircle, AlertCircle } from 'lucide-react';

const SEOSchemaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSetting, setSelectedSetting] = useState<string>('organization_schema');

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/seo-settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      return apiRequest('/api/admin/seo-settings', {
        method: 'POST',
        body: JSON.stringify({
          settingKey: key,
          settingValue: value
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({
        title: "Schema Updated",
        description: "SEO schema has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update schema settings.",
        variant: "destructive",
      });
    },
  });

  const validateJSON = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSchemaUpdate = (key: string, value: string) => {
    if (!validateJSON(value)) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON format.",
        variant: "destructive",
      });
      return;
    }

    updateSettingMutation.mutate({
      key,
      value: JSON.parse(value)
    });
  };

  const SchemaEditor = ({ setting }: { setting: any }) => {
    const [editedValue, setEditedValue] = useState(
      JSON.stringify(setting.setting_value, null, 2)
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{setting.setting_key.replace('_', ' ').toUpperCase()}</h3>
          <Badge variant={validateJSON(editedValue) ? "default" : "destructive"}>
            {validateJSON(editedValue) ? "Valid JSON" : "Invalid JSON"}
          </Badge>
        </div>
        
        {setting.description && (
          <p className="text-sm text-gray-600">{setting.description}</p>
        )}
        
        <Textarea
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
          placeholder="Enter JSON schema..."
        />
        
        <div className="flex gap-2">
          <Button
            onClick={() => handleSchemaUpdate(setting.setting_key, editedValue)}
            disabled={!validateJSON(editedValue) || updateSettingMutation.isPending}
          >
            {updateSettingMutation.isPending ? 'Updating...' : 'Update Schema'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setEditedValue(JSON.stringify(setting.setting_value, null, 2))}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">SEO Schema Management</h2>
        <p className="text-gray-600">Manage structured data and SEO schema markup</p>
      </div>

      <Tabs defaultValue="schemas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schemas">Schema Settings</TabsTrigger>
          <TabsTrigger value="validation">Schema Validation</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="schemas">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Schemas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {siteSettings?.map((setting: any) => (
                    <Button
                      key={setting.id}
                      variant={selectedSetting === setting.setting_key ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedSetting(setting.setting_key)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {setting.setting_key?.replace('_', ' ').toUpperCase() || 'Unknown Setting'}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Editor</CardTitle>
              </CardHeader>
              <CardContent>
                {siteSettings?.find((s: any) => s.setting_key === selectedSetting) && (
                  <SchemaEditor
                    setting={siteSettings.find((s: any) => s.setting_key === selectedSetting)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Schema Validation Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Google Rich Results Test</h4>
                    <p className="text-sm text-gray-600">Test your structured data for rich results</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open('https://search.google.com/test/rich-results', '_blank')}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Open Tool
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Schema.org Validator</h4>
                    <p className="text-sm text-gray-600">Validate schema markup syntax</p>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://validator.schema.org/', '_blank')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Open Tool
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Schema Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteSettings?.map((setting: any) => (
                  <div key={setting.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{setting.setting_key}</h4>
                      <Badge variant="outline">
                        {validateJSON(JSON.stringify(setting.setting_value)) ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                      </Badge>
                    </div>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(setting.setting_value, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOSchemaManager;
