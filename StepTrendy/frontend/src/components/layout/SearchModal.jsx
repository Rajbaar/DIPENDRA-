'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiX, HiTrendingUp } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchOpen } from '@/store/uiSlice';
import { productAPI } from '@/lib/api';
import Link from 'next/link';

export default function SearchModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(s => s.ui.searchOpen);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState(['Sneakers', 'Smart Watches', 'Streetwear', 'Designer Bags', 'Perfumes']);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const { data } = await productAPI.aiSearch(query);
          setResults(data);
        } catch { setResults([]); }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => dispatch(setSearchOpen(false))}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white dark:bg-luxury-dark border-b border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto px-4 py-8">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-14 pr-12 py-4 bg-white/5 border border-white/20 rounded-2xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <button onClick={() => dispatch(setSearchOpen(false))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <HiX size={24} />
                </button>
              </div>

              <div className="mt-6">
                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((p) => (
                      <Link key={p._id} href={`/products/${p.slug}`} onClick={() => dispatch(setSearchOpen(false))}>
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                          <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">₹{p.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query.length === 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <HiTrendingUp className="text-blue-400" />
                      <span className="text-sm text-gray-400">Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((t) => (
                        <button key={t} onClick={() => setQuery(t)}
                          className="px-4 py-2 text-sm bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 text-sm">No results found</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
