'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiShoppingBag, HiEye } from 'react-icons/hi';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data);
    } catch { /* fallback */ }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold font-display mb-8">My <span className="text-gradient">Orders</span></h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <HiShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-lg text-gray-500 mb-4">No orders yet</p>
            <Link href="/products" className="btn-primary inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order #{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{order.items?.length || 0} items</p>
                    <p className="text-lg font-bold text-gradient">₹{order.total?.toLocaleString()}</p>
                  </div>
                  <Link href={`/account/orders/${order.orderNumber}`}>
                    <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white/5 transition-colors">
                      <HiEye size={16} /> View
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
