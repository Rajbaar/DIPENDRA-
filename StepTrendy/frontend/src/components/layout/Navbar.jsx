'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { HiMenu, HiX, HiSearch, HiShoppingBag, HiHeart, HiUser, HiSun, HiMoon } from 'react-icons/hi';
import { toggleDarkMode, toggleSearch, setMobileMenu } from '@/store/uiSlice';
import { toggleCart } from '@/store/cartSlice';
import { selectCartCount } from '@/store/cartSlice';
import { logout } from '@/store/authSlice';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Men', href: '/products?gender=men' },
  { name: 'Women', href: '/products?gender=women' },
  { name: 'Sneakers', href: '/products?category=sneakers' },
  { name: 'Sale', href: '/products?sale=true' },
  { name: 'New', href: '/products?sort=newest' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const darkMode = useSelector(s => s.ui.darkMode);
  const mobileMenu = useSelector(s => s.ui.mobileMenu);
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(s => s.auth.user);
  const isAuth = useSelector(s => s.auth.isAuthenticated);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`floating-nav ${scrolled ? 'scrolled' : ''} ${scrolled ? '' : 'bg-black/30 dark:bg-black/30 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.button
              className="lg:hidden p-2 text-white"
              onClick={() => dispatch(setMobileMenu(!mobileMenu))}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
            </motion.button>

            <Link href="/" className="flex items-center gap-2">
              <motion.span
                className="text-2xl lg:text-3xl font-bold font-display bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                STEP
              </motion.span>
              <motion.span
                className="text-2xl lg:text-3xl font-bold font-display text-white"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                TRENDY
              </motion.span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    className={`text-sm font-medium transition-colors relative ${pathname === link.href ? 'text-blue-400' : 'text-gray-200 hover:text-blue-400'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.name}
                    {pathname === link.href && (
                      <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" layoutId="navIndicator" />
                    )}
                  </motion.span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleSearch())}
                className="p-2 text-gray-200 hover:text-blue-400 transition-colors"
              >
                <HiSearch size={22} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 text-gray-200 hover:text-yellow-400 transition-colors"
              >
                {darkMode ? <HiSun size={22} /> : <HiMoon size={22} />}
              </motion.button>

              {isAuth ? (
                <Link href="/account/wishlist">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="hidden sm:block p-2 text-gray-200 hover:text-red-400 transition-colors"
                  >
                    <HiHeart size={22} />
                  </motion.button>
                </Link>
              ) : null}

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-200 hover:text-blue-400 transition-colors"
              >
                <HiShoppingBag size={22} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {isAuth ? (
                <div className="relative">
                  <motion.button whileHover={{ scale: 1.05 }}
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/20 hover:border-blue-500/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </motion.button>
                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-luxury-gray border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/10">
                          <p className="font-semibold text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          {[{ label: 'My Account', href: '/account' }, { label: 'Orders', href: '/account/orders' }, { label: 'Wishlist', href: '/account/wishlist' }, { label: 'Settings', href: '/account/settings' }].map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setUserMenu(false)}>
                              <p className="px-4 py-2 text-sm hover:bg-white/5 rounded-xl transition-colors">{item.label}</p>
                            </Link>
                          ))}
                        </div>
                        {user?.role === 'admin' && (
                          <div className="px-2 pb-2">
                            <Link href="/admin" onClick={() => setUserMenu(false)}>
                              <p className="px-4 py-2 text-sm text-blue-400 hover:bg-white/5 rounded-xl transition-colors">Admin Dashboard</p>
                            </Link>
                          </div>
                        )}
                        <div className="p-2 border-t border-white/10">
                          <button onClick={() => { dispatch(logout()); setUserMenu(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                          >Sign Out</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/login">
                  <motion.button whileHover={{ scale: 1.05 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    <HiUser size={16} />
                    Sign In
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-luxury-dark border-r border-white/10 z-40 lg:hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => dispatch(setMobileMenu(false))}>
                  <p className={`text-lg font-medium py-2 ${pathname === link.href ? 'text-blue-400' : 'text-gray-300'}`}>{link.name}</p>
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                {isAuth ? (
                  <>
                    <Link href="/account" onClick={() => dispatch(setMobileMenu(false))} className="block text-lg font-medium py-2 text-gray-300">My Account</Link>
                    <Link href="/account/orders" onClick={() => dispatch(setMobileMenu(false))} className="block text-lg font-medium py-2 text-gray-300">Orders</Link>
                    <button onClick={() => { dispatch(logout()); dispatch(setMobileMenu(false)); }} className="text-lg font-medium py-2 text-red-400">Sign Out</button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => dispatch(setMobileMenu(false))}>
                    <span className="btn-primary block text-center">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
