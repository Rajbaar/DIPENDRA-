'use client';
import { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { store } from '@/store/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchModal from '@/components/layout/SearchModal';
import CartDrawer from '@/components/layout/CartDrawer';
import { Toaster } from 'react-hot-toast';
import { setDarkMode } from '@/store/uiSlice';

function ThemeProvider({ children }) {
  const darkMode = useSelector(s => s.ui.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      dispatch(setDarkMode(saved === 'dark'));
    } else {
      dispatch(setDarkMode(true));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return <>{children}</>;
}

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <SearchModal />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LayoutContent>{children}</LayoutContent>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', borderRadius: '16px' },
          duration: 3000,
        }} />
      </ThemeProvider>
    </Provider>
  );
}
