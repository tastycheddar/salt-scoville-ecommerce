
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeroImages } from '@/hooks/useHeroImages';
import { useHeroContent } from '@/hooks/useHeroContent';
import HeroImagesList from './HeroImagesList';
import HeroContentEditor from './HeroContentEditor';
import HeroImageUpload from './HeroImageUpload';
import HeroPreview from './HeroPreview';
import HeroDatabaseDiagnostics from './HeroDatabaseDiagnostics';
import { Image, Type, Eye, Upload, Settings } from 'lucide-react';

const HeroImageManager = () => {
  const { data: images, isLoading: imagesLoading } = useHeroImages();
  const { data: content, isLoading: contentLoading } = useHeroContent();
  const [activeTab, setActiveTab] = useState('images');

  if (imagesLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images ({images?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Diagnostics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Image className="h-5 w-5" />
                Hero Images Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeroImagesList images={images || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Type className="h-5 w-5" />
                Hero Content Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeroContentEditor content={content} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Hero Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeroImageUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeroPreview images={images || []} content={content} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <HeroDatabaseDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeroImageManager;
