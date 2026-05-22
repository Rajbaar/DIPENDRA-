'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { HiAdjustments, HiX, HiHeart, HiStar } from 'react-icons/hi';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

const categories = ['All', 'Sneakers', 'Watches', 'Streetwear', 'Bags', 'Men', 'Women', 'Accessories', 'Sportswear'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: '', maxPrice: '',
    gender: searchParams.get('gender') || '',
    sale: searchParams.get('sale') === 'true',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort: filters.sort };
      if (filters.category) params.category = filters.category;
      if (filters.gender) params.gender = filters.gender;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sale) params.sale = 'true';
      const { data } = await productAPI.getAll(params);
      setProducts(data.products || data);
    } catch {
      // Fallback data shown
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}
          >
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button className="md:hidden p-1" onClick={() => setShowFilters(false)}>
                  <HiX size={20} />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button key={cat}
                      onClick={() => setFilters({ ...filters, category: cat === 'All' ? '' : cat.toLowerCase() })}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors ${filters.category === cat.toLowerCase() || (cat === 'All' && !filters.category) ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Gender</h4>
                <div className="flex gap-2">
                  {['men', 'women', 'unisex'].map((g) => (
                    <button key={g}
                      onClick={() => setFilters({ ...filters, gender: filters.gender === g ? '' : g })}
                      className={`px-4 py-2 text-sm rounded-xl capitalize transition-colors ${filters.gender === g ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold font-display">
                <span className="text-gradient">Premium</span> Collection
              </h1>
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 border border-white/20 rounded-xl" onClick={() => setShowFilters(true)}>
                  <HiAdjustments size={20} />
                </button>
                <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value} className="bg-luxury-dark">{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl skeleton" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <motion.div key={product._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link href={`/products/${product.slug || 'product'}`} className="product-card group block">
                      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-luxury-gray">
                        <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black">
                          <HiHeart className="text-gray-700 dark:text-white" size={18} />
                        </button>
                        {product.isOnSale && (
                          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            SALE
                          </div>
                        )}
                        {product.comparePrice && (
                          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand || 'StepTrendy'}</p>
                        <h3 className="font-medium text-sm truncate">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-gradient">₹{product.price?.toLocaleString()}</span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-500 line-through">₹{product.comparePrice?.toLocaleString()}</span>
                          )}
                        </div>
                        {product.ratings?.count > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <HiStar className="text-yellow-500 text-xs" />
                            <span className="text-xs text-gray-400">{product.ratings.average} ({product.ratings.count})</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
