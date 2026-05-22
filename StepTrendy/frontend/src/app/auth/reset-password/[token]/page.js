'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password });
      toast.success('Password reset successfully!');
      router.push('/auth/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-luxury-dark to-gray-900 relative overflow-hidden py-20">
      <div className="absolute inset-0 opacity-10"><div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md mx-4">
        <div className="glass p-8 md:p-10 rounded-3xl">
          <div className="text-center mb-8">
            <Link href="/"><span className="text-3xl font-bold font-display"><span className="text-gradient">STEP</span><span className="text-white">TRENDY</span></span></Link>
            <h1 className="text-2xl font-bold text-white mt-6">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-2">Enter your new password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type={showPassword ? 'text' : 'password'} placeholder="New password" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-12 pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Confirm password" required minLength={6}
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field pl-12" />
            </div>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
