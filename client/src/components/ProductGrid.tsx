
import { useProducts } from '@/hooks/useProducts';
import ProductGridHeader from '@/components/product-grid/ProductGridHeader';
import ProductGridLoading from '@/components/product-grid/ProductGridLoading';
import ProductGridEmpty from '@/components/product-grid/ProductGridEmpty';
import ProductGridList from '@/components/product-grid/ProductGridList';
import ProductGridActions from '@/components/product-grid/ProductGridActions';
import TrustBadges from '@/components/trust/TrustBadges';
import FlavaDaveSection from '@/components/FlavaDaveSection';

const ProductGrid = () => {
  const { data: products, isLoading, error } = useProducts(4, true); // Limit to 4 for homepage, sorted by popularity

  if (isLoading) {
    return (
      <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <ProductGridHeader />
          <ProductGridLoading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-im-fell font-bold text-char-black mb-6">
            Our Products
          </h2>
          <ProductGridEmpty error={true} />
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <ProductGridHeader />
          <ProductGridEmpty />
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <ProductGridHeader />
        <FlavaDaveSection />
        <TrustBadges />
        <ProductGridList products={products} />
        <ProductGridActions />
      </div>
    </section>
  );
};

export default ProductGrid;
