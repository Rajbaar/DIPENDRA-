'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import Link from 'next/link';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zip: '', isDefault: false });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await userAPI.addAddress(form);
      setAddresses(data);
      setShowForm(false);
      setForm({ fullName: '', phone: '', street: '', city: '', state: '', zip: '', isDefault: false });
      toast.success('Address added');
    } catch {
      toast.error('Failed to add address');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display">My <span className="text-gradient">Addresses</span></h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm rounded-full"
          ><HiPlus /> Add New</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl mb-6">
            <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="input-field" required />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" required />
              <input type="text" placeholder="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="input-field sm:col-span-2" required />
              <input type="text" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-field" required />
              <input type="text" placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="input-field" required />
              <input type="text" placeholder="ZIP Code" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} className="input-field" required />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} /> Set as default</label>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary text-sm">Save Address</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-white/20 rounded-full text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="text-center py-20">
            <HiLocationMarker size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 mb-4">No saved addresses</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Add Address</button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr, i) => (
              <div key={i} className="glass p-6 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="text-sm text-gray-400">{addr.street}</p>
                    <p className="text-sm text-gray-400">{addr.city}, {addr.state} - {addr.zip}</p>
                    <p className="text-sm text-gray-400">{addr.phone}</p>
                    {addr.isDefault && <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">Default</span>}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg"><HiPencil className="text-gray-400" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><HiTrash className="text-red-400" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
