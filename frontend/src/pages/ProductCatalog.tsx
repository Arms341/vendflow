import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useState } from 'react';

export default function ProductCatalog() {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.get('/products/').then((r) => r.data),
  });

  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load products: {error.message}</div>;
  if (!data) return <div className="p-6 text-gray-600">No products found</div>;

  const filteredProducts = data.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              {product.sku && (
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              )}
              {product.category && (
                <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {product.unit_cost !== null && product.unit_cost !== undefined && product.unit_cost !== '' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Cost: ${product.unit_cost}
                  </span>
                )}
                {product.retail_price !== null && product.retail_price !== undefined && product.retail_price !== '' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Retail: ${product.retail_price}
                  </span>
                )}
                {product.par_level !== null && product.par_level !== undefined && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Par: {product.par_level}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${Boolean(product.is_active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {Boolean(product.is_active) ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products match your search criteria</p>
        </div>
      )}
    </div>
  );
}