'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiHeart, HiShoppingBag, HiMinus, HiPlus, HiShieldCheck, HiTruck, HiRefresh } from 'react-icons/hi';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { productAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Black', hex: '#000' },
  { name: 'White', hex: '#fff' },
  { name: 'Red', hex: '#ff0000' },
  { name: 'Blue', hex: '#0066ff' },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data } = await productAPI.getBySlug(slug);
      setProduct(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="h-[500px] rounded-3xl skeleton" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 skeleton rounded" />
              <div className="h-6 w-1/3 skeleton rounded" />
              <div className="h-24 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Product not found</p></div>;
  }

  const images = product.images?.length > 0 ? product.images : [
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
    { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600' },
    { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600' },
  ];

  const handleAddToCart = () => {
    dispatch(addItem({ product, quantity, size: selectedSize, color: selectedColor }));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    dispatch(addItem({ product, quantity, size: selectedSize, color: selectedColor }));
    // Navigate to checkout
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-luxury-gray mb-4 group">
              <AnimatePresence mode="wait">
                <motion.img key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  src={images[selectedImage]?.url} alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <button className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-black/50 rounded-full hover:bg-white dark:hover:bg-black transition-colors">
                <HiHeart size={22} className="text-gray-700 dark:text-white" />
              </button>
            </div>
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-sm text-blue-400 uppercase tracking-wider mb-2">{product.brand || 'StepTrendy'}</p>
            <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`${i < Math.round(product.ratings?.average || 4.5) ? 'text-yellow-500' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-400">({product.ratings?.count || 128} reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-bold text-gradient">₹{product.price?.toLocaleString()}</span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.comparePrice?.toLocaleString()}</span>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full">
                    -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-8">{product.description || product.shortDescription || 'Premium quality fashion product crafted for style and comfort.'}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Color: <span className="text-gray-400">{selectedColor || 'Select'}</span></h4>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h4 className="text-sm font-medium mb-3">Size: <span className="text-gray-400">{selectedSize || 'Select'}</span></h4>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-14 h-14 rounded-xl border text-sm font-medium transition-all ${selectedSize === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/20 hover:border-blue-500/50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium">Qty:</span>
              <div className="flex items-center border border-white/20 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white/10 rounded-l-full transition-colors"
                ><HiMinus size={16} /></button>
                <span className="px-6 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-white/10 rounded-r-full transition-colors"
                ><HiPlus size={16} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 border-2 border-blue-500 text-blue-400 font-semibold rounded-full hover:bg-blue-500/10 transition-all"
              >
                <HiShoppingBag size={22} />
                Add to Cart
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 rounded-2xl">
              {[
                { icon: HiTruck, label: 'Free Shipping', desc: 'On orders ₹999+' },
                { icon: HiShieldCheck, label: 'Secure', desc: '100% Protected' },
                { icon: HiRefresh, label: 'Returns', desc: '30-day policy' },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon className="mx-auto text-blue-400 mb-2" size={22} />
                  <p className="text-xs font-medium">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
