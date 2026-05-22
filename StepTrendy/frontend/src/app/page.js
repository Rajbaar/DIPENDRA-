'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiFire, HiClock, HiTrendingUp, HiStar, HiShieldCheck, HiTruck, HiRefresh, HiSupport } from 'react-icons/hi';
import Link from 'next/link';
import { productAPI } from '@/lib/api';

const brands = ['Nike', 'Adidas', 'Gucci', 'Prada', 'Louis Vuitton', 'Balenciaga', 'Versace', 'Bape'];

const testimonials = [
  { name: 'Priya S.', text: 'Absolutely love the quality! The AI recommendations were spot on.', rating: 5, role: 'Fashion Blogger' },
  { name: 'Rahul M.', text: 'Fast delivery and premium packaging. Feels like unboxing luxury!', rating: 5, role: 'Verified Buyer' },
  { name: 'Ananya K.', text: 'The best online fashion store in India. StepTrendy is a game changer!', rating: 5, role: 'Style Influencer' },
];

const features = [
  { icon: HiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: HiShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: HiRefresh, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: HiSupport, title: '24/7 Support', desc: 'Premium support' },
];

const categories = [
  { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', count: '2,500+' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314', count: '1,200+' },
  { name: 'Streetwear', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0', count: '3,000+' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', count: '800+' },
];

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const [feat, trend] = await Promise.all([
        productAPI.getFeatured().catch(() => ({ data: [] })),
        productAPI.getTrending().catch(() => ({ data: [] })),
      ]);
      setFeaturedProducts(feat.data || []);
      setTrendingProducts(trend.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
    setLoading(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-luxury-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6"
              >
                <HiSparkles className="text-yellow-400" />
                <span className="text-sm text-gray-300">AI-Powered Fashion Recommendations</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-tight mb-6">
                <span className="text-white">Step Into </span>
                <span className="text-gradient">Luxury</span>
                <br />
                <span className="text-white">Fashion</span>
              </h1>

              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                Discover premium fashion curated by AI. From luxury streetwear to designer sneakers — your style journey starts here.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg flex items-center gap-2"
                  >
                    Shop Now <HiArrowRight />
                  </motion.button>
                </Link>
                <Link href="/products?category=sneakers">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn-outline text-lg"
                  >
                    Explore Collection
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-12">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-500/30 rounded-full blur-3xl" />
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-80 h-80 mx-auto mt-16 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                >
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" alt="Sneaker" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-10 right-10 w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                >
                  <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300" alt="Watch" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute bottom-20 left-5 w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                >
                  <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200" alt="Bag" className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-gray-500 text-sm">
            Scroll to explore
          </motion.div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-white dark:bg-luxury-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 uppercase tracking-widest mb-8">Featured Brands</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {brands.map((brand, i) => (
              <motion.span key={brand} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white dark:bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Shop by <span className="text-gradient">Category</span></h2>
            <p className="text-gray-500">Explore our curated collections</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  <p className="text-sm text-gray-300">{cat.count} items</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-luxury-dark to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full mb-6">
              <HiFire className="text-red-500" />
              <span className="text-sm text-red-400 font-semibold">Flash Sale</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Limited Time <span className="text-gradient">Offers</span>
            </h2>
            <p className="text-gray-400 mb-8">Hurry up! Deals end soon</p>

            <div className="flex justify-center gap-4 md:gap-8 mb-10">
              {[
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-bold text-gradient">{String(unit.value).padStart(2, '0')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">{unit.label}</p>
                </div>
              ))}
            </div>

            <Link href="/products?sale=true">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn-gold text-lg"
              >
                Shop Sale Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                  <feat.icon className="text-2xl text-blue-400" />
                </div>
                <h4 className="font-semibold mb-1">{feat.title}</h4>
                <p className="text-sm text-gray-500">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-luxury-black relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">What Our <span className="text-gradient">Customers</span> Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <HiStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">Stay in Style</h2>
            <p className="text-blue-100 mb-8">Subscribe for exclusive drops, early access, and 10% off your first order</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
              <button className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-full hover:shadow-xl transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
