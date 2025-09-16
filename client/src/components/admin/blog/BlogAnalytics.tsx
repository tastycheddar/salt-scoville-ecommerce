import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, TrendingUp, FileText, Users } from 'lucide-react';


const BlogAnalytics: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['blogAnalytics'],
    queryFn: async () => {
      // Get basic blog stats
      const response = await fetch('/api/admin/blog-posts', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const totalPosts = await response.json();

      const published = totalPosts?.filter(post => post.status === 'published').length || 0;
      const drafts = totalPosts?.filter(post => post.status === 'draft').length || 0;
      const thisMonth = totalPosts?.filter(post => {
        const postDate = new Date(post.created_at);
        const now = new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length || 0;

      return {
        total: totalPosts?.length || 0,
        published,
        drafts,
        thisMonth,
        recentPosts: totalPosts?.slice(0, 5) || [],
      };
    },
  });

  const analyticsCards = [
    {
      title: 'Total Posts',
      value: stats?.total || 0,
      icon: FileText,
      description: 'All blog posts',
      color: 'text-blue-400',
    },
    {
      title: 'Published',
      value: stats?.published || 0,
      icon: Eye,
      description: 'Live on website',
      color: 'text-green-400',
    },
    {
      title: 'Drafts',
      value: stats?.drafts || 0,
      icon: TrendingUp,
      description: 'Work in progress',
      color: 'text-yellow-400',
    },
    {
      title: 'This Month',
      value: stats?.thisMonth || 0,
      icon: Users,
      description: 'Posts created',
      color: 'text-purple-400',
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white/70 mt-4">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-white/60 text-xs mt-1">{card.description}</p>
                  </div>
                  <div className={`p-2 bg-white/10 rounded-lg ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Posts Activity */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentPosts && stats.recentPosts.length > 0 ? (
            <div className="space-y-4">
              {stats.recentPosts.map((post: { id: string; title: string; status: string; created_at: string }) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <h4 className="text-white font-medium">{post.title}</h4>
                    <p className="text-white/60 text-sm">
                      Created {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      post.status === 'published'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No recent posts to display</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <h4 className="text-blue-300 font-medium mb-2">📊 Blog Growth</h4>
              <p className="text-white/70 text-sm">
                You've created {stats?.thisMonth || 0} posts this month. 
                {stats?.thisMonth && stats.thisMonth > 0 
                  ? ' Keep up the great work!' 
                  : ' Consider creating more content to engage your audience.'}
              </p>
            </div>
            
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <h4 className="text-green-300 font-medium mb-2">✅ Publishing Status</h4>
              <p className="text-white/70 text-sm">
                {stats?.published || 0} posts are live on your website.
                {stats?.drafts && stats.drafts > 0 
                  ? ` You have ${stats.drafts} draft${stats.drafts !== 1 ? 's' : ''} ready to publish.`
                  : ' All your posts are published!'}
              </p>
            </div>

            <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <h4 className="text-purple-300 font-medium mb-2">🎯 SEO Opportunity</h4>
              <p className="text-white/70 text-sm">
                Ensure all your published posts have SEO titles and meta descriptions to improve search rankings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogAnalytics;