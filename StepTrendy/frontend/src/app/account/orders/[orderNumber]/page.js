'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiLocationMarker, HiShoppingBag, HiClock } from 'react-icons/hi';
import Link from 'next/link';
import { orderAPI } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const { data } = await orderAPI.getByNumber(orderNumber);
      setOrder(data);
    } catch { /* fallback */ }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen pt-24 px-4"><div className="max-w-3xl mx-auto h-64 skeleton rounded-2xl" /></div>;

  if (!order) return (
    <div className="min-h-screen pt-24 px-4 text-center">
      <p className="text-gray-500">Order not found</p>
      <Link href="/account/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
          <HiArrowLeft /> Back to Orders
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 capitalize">{order.status}</span>
          </div>

          <div className="space-y-4 mb-8">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity)?.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Shipping</span><span className="text-green-400">{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
            <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4"><span>Total</span><span className="text-gradient">₹{order.total?.toLocaleString()}</span></div>
          </div>

          {order.shippingAddress && (
            <div className="mt-8 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2"><HiLocationMarker className="text-blue-400" /><span className="text-sm font-medium">Shipping Address</span></div>
              <p className="text-sm text-gray-400">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-400">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
              <p className="text-sm text-gray-400">{order.shippingAddress.state} - {order.shippingAddress.zip}</p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button className="flex-1 py-3 border border-white/20 rounded-full text-sm hover:bg-white/5">Download Invoice</button>
            <button className="flex-1 py-3 border border-white/20 rounded-full text-sm hover:bg-white/5">Request Return</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
