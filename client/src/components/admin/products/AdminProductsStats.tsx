
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface AdminProductsStatsProps {
  products: any[];
}

const AdminProductsStats = ({ products }: AdminProductsStatsProps) => {
  const activeProducts = products?.filter(p => p.is_active).length || 0;
  const lowStockProducts = products?.filter(p => (p.stock_quantity || 0) < (p.low_stock_threshold || 10)).length || 0;
  const totalValue = products?.reduce((sum, p) => sum + (Number(p.price) * (p.stock_quantity || 0)), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total Products</p>
              <p className="text-2xl font-bold text-white">{products?.length || 0}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Active Products</p>
              <p className="text-2xl font-bold text-white">{activeProducts}</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Low Stock</p>
              <p className="text-2xl font-bold text-white">{lowStockProducts}</p>
            </div>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total Value</p>
              <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsStats;
