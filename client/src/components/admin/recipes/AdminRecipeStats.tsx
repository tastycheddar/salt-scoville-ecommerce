
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Eye, Heart, Share2, Award, Users } from 'lucide-react';

const AdminRecipeStats = () => {
  // Mock data - in real app this would come from analytics
  const stats = {
    totalViews: 0,
    totalFavorites: 0,
    totalShares: 0,
    topRecipes: [],
    monthlyGrowth: {
      views: 0,
      favorites: 0,
      submissions: 0
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="h-3 w-3" />
              +{stats.monthlyGrowth.views}% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Total Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalFavorites.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="h-3 w-3" />
              +{stats.monthlyGrowth.favorites}% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Total Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalShares}</div>
            <div className="text-white/60 text-sm">Across all platforms</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Users className="h-4 w-4" />
              New Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="h-3 w-3" />
              +{stats.monthlyGrowth.submissions}% this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Recipes */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Top Performing Recipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topRecipes.map((recipe, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-semibold">{recipe.title}</h4>
                  <div className="flex items-center gap-4 text-white/70 text-sm mt-1">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {recipe.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {recipe.favorites} favorites
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white/50">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recipe Categories Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: 'Appetizers', recipes: 8, avgViews: 1250 },
                { category: 'Main Dishes', recipes: 12, avgViews: 2100 },
                { category: 'Sauces & Condiments', recipes: 6, avgViews: 980 },
                { category: 'Snacks', recipes: 4, avgViews: 1680 }
              ].map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{cat.category}</p>
                    <p className="text-white/60 text-sm">{cat.recipes} recipes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{cat.avgViews}</p>
                    <p className="text-white/60 text-sm">avg views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Heat Level Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { level: 'Mild (1-2)', percentage: 25, color: 'bg-yellow-500' },
                { level: 'Medium (3)', percentage: 35, color: 'bg-orange-500' },
                { level: 'Hot (4)', percentage: 28, color: 'bg-red-500' },
                { level: 'Extreme (5)', percentage: 12, color: 'bg-red-600' }
              ].map((heat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{heat.level}</span>
                    <span className="text-white/70 text-sm">{heat.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${heat.color} h-2 rounded-full transition-all`}
                      style={{ width: `${heat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRecipeStats;
