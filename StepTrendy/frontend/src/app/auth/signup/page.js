'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('signup');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.verifyOtp({ email: form.email, otp });
      toast.success('Email verified! Please sign in.');
      router.push('/auth/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-luxury-dark to-gray-900 relative overflow-hidden py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
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
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">Join the fashion revolution</p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-all mb-6">
            <FcGoogle size={22} />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-gray-900 text-gray-500">or</span>
            </div>
          </div>

          {step === 'signup' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Full name" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-12"
                />
              </div>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" placeholder="Email address" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-12"
                />
              </div>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars)" required minLength={6}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-gray-400 text-center">Enter the OTP sent to {form.email}</p>
              <input type="text" placeholder="Enter OTP" required maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value)}
                className="input-field text-center text-2xl tracking-[0.5em]"
              />
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </motion.button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
