
import AdvancedCreateProductDialog from './AdvancedCreateProductDialog';

interface AdminProductsHeaderProps {
  categories: Array<{ id: string; name: string }>;
}

const AdminProductsHeader = ({ categories }: AdminProductsHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-gray-200">Comprehensive product management with enhanced SEO features</p>
        </div>
        <div className="flex space-x-2">
          <AdvancedCreateProductDialog categories={categories || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminProductsHeader;
