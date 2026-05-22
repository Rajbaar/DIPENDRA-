'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiUser, HiShoppingBag, HiHeart, HiLocationMarker, HiCreditCard, HiCog, HiLogout } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

const accountLinks = [
  { href: '/account/orders', label: 'My Orders', icon: HiShoppingBag, desc: 'View and track your orders' },
  { href: '/account/wishlist', label: 'Wishlist', icon: HiHeart, desc: 'Your saved items' },
  { href: '/account/addresses', label: 'Addresses', icon: HiLocationMarker, desc: 'Manage shipping addresses' },
  { href: '/account/settings', label: 'Settings', icon: HiCog, desc: 'Profile and preferences' },
];

export default function AccountPage() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.div whileHover={{ scale: 1.02 }} className="glass p-6 rounded-2xl cursor-pointer">
                <link.icon className="text-blue-400 mb-3" size={28} />
                <h3 className="font-semibold">{link.label}</h3>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <button onClick={() => { dispatch(logout()); router.push('/'); }}
          className="flex items-center gap-2 mt-8 text-red-400 hover:text-red-300 transition-colors"
        >
          <HiLogout size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
