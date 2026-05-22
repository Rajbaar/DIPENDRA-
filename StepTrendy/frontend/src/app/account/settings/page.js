'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '@/store/authSlice';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.updateProfile(form);
      dispatch(updateUser(data));
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold font-display mb-8">Account <span className="text-gradient">Settings</span></h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl"
        >
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={user?.email || ''} disabled
                className="input-field opacity-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              Save Changes
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
