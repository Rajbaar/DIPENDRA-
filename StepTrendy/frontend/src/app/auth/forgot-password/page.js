'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-luxury-dark to-gray-900 relative overflow-hidden py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass p-8 md:p-10 rounded-3xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold font-display">
                <span className="text-gradient">STEP</span>
                <span className="text-white">TRENDY</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
            <p className="text-gray-400 text-sm mt-2">We&apos;ll send you a reset link</p>
          </div>
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <HiMail className="text-green-400" size={32} />
              </div>
              <p className="text-gray-300 mb-4">Check your email for the reset link</p>
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" placeholder="Email address" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
              <p className="text-center text-sm text-gray-400">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
