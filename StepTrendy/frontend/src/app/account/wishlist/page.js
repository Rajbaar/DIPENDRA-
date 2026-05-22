'use client';
import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold font-display mb-8">My <span className="text-gradient">Wishlist</span></h1>
        <div className="text-center py-20">
          <HiHeart size={64} className="mx-auto text-gray-600 mb-4" />
          <p className="text-lg text-gray-500 mb-4">Your wishlist is empty</p>
          <Link href="/products" className="btn-primary inline-block">Explore Products</Link>
        </div>
      </div>
    </div>
  );
}
