'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import React from 'react';
import { HiChartBar, HiShoppingBag, HiUsers, HiCurrencyDollar, HiTrendingUp, HiViewGrid, HiInbox, HiBell, HiCog, HiShieldCheck, HiCash, HiQrcode, HiPlus, HiPencil, HiTrash, HiRefresh } from 'react-icons/hi';
import ContentManager from '@/components/admin/ContentManager';
import AdManager from '@/components/admin/AdManager';
import SiteSettings from '@/components/admin/SiteSettings';
import { orderAPI, userAPI, productAPI, categoryAPI, paymentAPI, couponAPI, notificationAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

const adminNav = [
  { id: 'dashboard', label: 'Dashboard', icon: HiChartBar },
  { id: 'products', label: 'Products', icon: HiShoppingBag },
  { id: 'orders', label: 'Orders', icon: HiInbox },
  { id: 'users', label: 'Users', icon: HiUsers },
  { id: 'payments', label: 'Payments', icon: HiCash },
  { id: 'upi', label: 'UPI Config', icon: HiQrcode },
  { id: 'coupons', label: 'Coupons', icon: HiTrendingUp },
  { id: 'content', label: 'Content', icon: HiViewGrid },
  { id: 'notifications', label: 'Notifications', icon: HiBell },
  { id: 'security', label: 'Security', icon: HiShieldCheck },
  { id: 'settings', label: 'Settings', icon: HiCog },
];

const initialProductForm = {
  name: '', description: '', shortDescription: '', price: '', comparePrice: '', stock: '10',
  category: '', brand: 'StepTrendy', gender: 'unisex', sku: '', tags: '',
  images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', alt: 'Product', isPrimary: true }],
  sizes: [], colors: [], isFeatured: false, isTrending: false, isOnSale: false,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0, revenueByMonth: [], recentOrders: [], ordersByStatus: [], todayOrders: 0, pendingOrders: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [upiConfigs, setUpiConfigs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState(initialProductForm);

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await orderAPI.getDashboardStats();
      setStats(data);
    } catch { /* backend might not be connected */ }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await productAPI.getAll({ limit: 100 });
      setProducts(data.products || []);
    } catch { setProducts([]); }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data || []);
    } catch { setOrders([]); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await userAPI.getAll({ limit: 50 });
      setUsers(data.users || []);
    } catch { setUsers([]); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data || []);
    } catch { setCategories([]); }
  }, []);

  const fetchPayments = useCallback(async () => {
    try { const { data } = await paymentAPI.getAll({}); setPayments(data || []); }
    catch { setPayments([]); }
  }, []);

  const fetchCoupons = useCallback(async () => {
    try { const { data } = await couponAPI.getAll(); setCoupons(data || []); }
    catch { setCoupons([]); }
  }, []);

  const fetchUpiConfigs = useCallback(async () => {
    try { const { data } = await paymentAPI.getUpiConfigs(); setUpiConfigs(data || []); }
    catch { setUpiConfigs([]); }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try { const { data } = await notificationAPI.getAll(); setNotifications(data || []); }
    catch { setNotifications([]); }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchCategories();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'payments') fetchPayments();
    if (activeTab === 'coupons') fetchCoupons();
    if (activeTab === 'upi') fetchUpiConfigs();
    if (activeTab === 'notifications') fetchNotifications();
  }, [activeTab, fetchDashboard, fetchProducts, fetchOrders, fetchUsers, fetchCategories, fetchPayments, fetchCoupons, fetchUpiConfigs, fetchNotifications]);

  const openAddModal = () => {
    setEditingId(null);
    setProductForm(initialProductForm);
    setModalType('product');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price?.toString() || '',
      comparePrice: product.comparePrice?.toString() || '',
      stock: product.stock?.toString() || '0',
      category: product.category?._id || product.category || '',
      brand: product.brand || 'StepTrendy',
      gender: product.gender || 'unisex',
      sku: product.sku || '',
      tags: (product.tags || []).join(', '),
      images: product.images?.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', alt: 'Product', isPrimary: true }],
      sizes: product.sizes || [],
      colors: product.colors || [],
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
      isOnSale: product.isOnSale || false,
    });
    setModalType('product');
    setModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description || productForm.shortDescription || 'Premium quality product from StepTrendy.',
        shortDescription: productForm.shortDescription,
        price: Number(productForm.price),
        comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : undefined,
        stock: Number(productForm.stock),
        category: productForm.category || undefined,
        brand: productForm.brand,
        gender: productForm.gender,
        sku: productForm.sku || undefined,
        tags: productForm.tags ? productForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: productForm.images,
        sizes: productForm.sizes,
        colors: productForm.colors,
        isFeatured: productForm.isFeatured,
        isTrending: productForm.isTrending,
        isOnSale: productForm.isOnSale,
      };
      if (editingId) {
        await productAPI.update(editingId, payload);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created successfully!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
      fetchDashboard();
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-black flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-luxury-dark border-r border-gray-200 dark:border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold font-display"><span className="text-gradient">STEP</span><span className="text-gray-900 dark:text-white">TRENDY</span></h1>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
          {adminNav.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-blue-600/20 text-blue-400 text-blue-400' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
            ><item.icon size={20} />{item.label}</button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-luxury-dark/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => { if (activeTab === 'products') fetchProducts(); else if (activeTab === 'orders') fetchOrders(); else if (activeTab === 'dashboard') fetchDashboard(); else if (activeTab === 'users') fetchUsers(); }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"><HiRefresh size={18} /></button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">A</div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-green-600 to-emerald-500' },
                  { label: 'Total Orders', value: stats.totalOrders || 0, icon: HiInbox, color: 'from-blue-600 to-cyan-500', sub: `${stats.todayOrders || 0} today` },
                  { label: 'Total Users', value: stats.totalUsers || 0, icon: HiUsers, color: 'from-purple-600 to-pink-500' },
                  { label: 'Total Products', value: stats.totalProducts || 0, icon: HiShoppingBag, color: 'from-yellow-600 to-orange-500' },
                ].map((card, i) => (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-luxury-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}><card.icon className="text-white" size={24} /></div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    {card.sub && <p className="text-xs text-blue-400 mt-1">{card.sub}</p>}
                  </motion.div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-luxury-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold mb-4">Revenue by Month</h3>
                  <div className="h-64 flex items-end gap-2">
                    {stats.revenueByMonth?.length > 0 ? stats.revenueByMonth.map((r, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${Math.max(4, (r.revenue / Math.max(...stats.revenueByMonth.map(x => x.revenue)) * 180))}px` }} />
                        <span className="text-xs text-gray-500">{r._id?.slice(5)}</span>
                      </div>
                    )) : <div className="w-full h-full flex items-center justify-center text-gray-500">No revenue data</div>}
                  </div>
                </div>
                <div className="bg-white dark:bg-luxury-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {stats.recentOrders?.length > 0 ? stats.recentOrders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div><p className="text-sm font-medium">#{order.orderNumber}</p><p className="text-xs text-gray-500">{order.user?.name || 'Guest'}</p></div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">₹{order.total?.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{order.status}</span>
                        </div>
                      </div>
                    )) : <p className="text-center text-gray-500 py-8">No orders yet</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Product Management ({products.length})</h3>
                <button onClick={openAddModal} className="btn-primary text-sm flex items-center gap-2"><HiPlus size={16} /> Add Product</button>
              </div>
              <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr></thead>
                    <tbody>
                      {products.length > 0 ? products.map((p) => (
                        <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                <img src={p.images?.[0]?.url || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div><p className="font-medium truncate max-w-[200px]">{p.name}</p><p className="text-xs text-gray-500">{p.brand}</p></div>
                            </div>
                          </td>
                          <td className="py-3 px-4"><span className="font-medium">₹{p.price?.toLocaleString()}</span>{p.comparePrice && <span className="text-xs text-gray-500 line-through ml-2">₹{p.comparePrice}</span>}</td>
                          <td className="py-3 px-4"><span className={p.stock <= 5 ? 'text-red-400' : 'text-green-400'}>{p.stock}</span></td>
                          <td className="py-3 px-4 text-gray-500">{p.category?.name || '-'}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.status || 'active'}</span></td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEditModal(p)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><HiPencil className="text-blue-400" size={16} /></button>
                              <button onClick={() => handleDeleteProduct(p._id)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><HiTrash className="text-red-400" size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-500">No products yet. Click &ldquo;Add Product&rdquo; to create your first product.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="font-semibold text-lg mb-6">Order Management ({orders.length})</h3>
              <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5">
                      <th className="text-left py-3 px-4">Order #</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Payment</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr></thead>
                    <tbody>
                      {orders.length > 0 ? orders.map((o) => (
                        <tr key={o._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-medium">#{o.orderNumber}</td>
                          <td className="py-3 px-4">{o.user?.name || 'Guest'}</td>
                          <td className="py-3 px-4">₹{o.total?.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none">
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${o.paymentInfo?.status === 'paid' || o.paymentInfo?.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{o.paymentInfo?.status || 'pending'}</span></td>
                          <td className="py-3 px-4 text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <button onClick={() => { if (confirm('Cancel this order?')) handleUpdateOrderStatus(o._id, 'cancelled'); }}
                              className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30">Cancel</button>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={7} className="text-center py-12 text-gray-500">No orders yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div>
              <h3 className="font-semibold text-lg mb-6">User Management ({users.length})</h3>
              <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr></thead>
                    <tbody>
                      {users.length > 0 ? users.map((u) => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-medium">{u.name}</td>
                          <td className="py-3 px-4 text-gray-500">{u.email}</td>
                          <td className="py-3 px-4 capitalize">{u.role}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${u.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{u.isActive !== false ? 'Active' : 'Banned'}</span></td>
                          <td className="py-3 px-4 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <button className="p-2 hover:bg-white/10 rounded-lg"><HiPencil className="text-blue-400" size={16} /></button>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={6} className="text-center py-12 text-gray-500">No users found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div>
              <h3 className="font-semibold text-lg mb-6">Payment Management</h3>
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                {[{ label: 'Total', value: payments.length }, { label: 'Successful', value: payments.filter(p => p.status === 'success').length, color: 'text-green-400' },
                  { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: 'text-yellow-400' },
                  { label: 'Failed', value: payments.filter(p => p.status === 'failed').length, color: 'text-red-400' },
                ].map((s) => (
                  <div key={s.label} className="bg-white dark:bg-luxury-dark rounded-xl p-4 border border-white/10">
                    <p className="text-2xl font-bold ${s.color || ''}">{s.value}</p>
                    <p className="text-sm text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5">
                      <th className="text-left py-3 px-4">Transaction ID</th>
                      <th className="text-left py-3 px-4">Method</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr></thead>
                    <tbody>
                      {payments.length > 0 ? payments.map((p) => (
                        <tr key={p._id} className="border-b border-white/5">
                          <td className="py-3 px-4 font-mono text-xs">{p.transactionId}</td>
                          <td className="py-3 px-4 capitalize">{p.method}</td>
                          <td className="py-3 px-4">₹{p.amount?.toLocaleString()}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'success' ? 'bg-green-500/20 text-green-400' : p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{p.status}</span></td>
                          <td className="py-3 px-4 text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-center py-12 text-gray-500">No transactions yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* UPI */}
          {activeTab === 'upi' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">UPI Configuration</h3>
                <button className="btn-primary text-sm" onClick={async () => {
                  const upiId = prompt('Enter UPI ID (e.g., name@upi):');
                  if (!upiId) return;
                  const name = prompt('Enter account name:');
                  if (!name) return;
                  try {
                    await paymentAPI.createUpiConfig({ upiId, accountName: name, isDefault: true });
                    toast.success('UPI ID added');
                    fetchUpiConfigs();
                  } catch { toast.error('Failed to add UPI ID'); }
                }}><HiPlus size={16} /> Add UPI ID</button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-luxury-dark rounded-2xl p-6 border border-white/10">
                  <h4 className="font-medium mb-4">Active UPI Accounts</h4>
                  {upiConfigs.length > 0 ? upiConfigs.map((u) => (
                    <div key={u._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-2">
                      <div><p className="font-medium text-sm">{u.accountName}</p><p className="text-xs text-gray-400">{u.upiId}</p></div>
                      <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">{u.isDefault ? 'Default' : 'Active'}</span>
                    </div>
                  )) : <p className="text-gray-500 text-sm">No UPI accounts configured</p>}
                </div>
                <div className="bg-white dark:bg-luxury-dark rounded-2xl p-6 border border-white/10">
                  <h4 className="font-medium mb-4">Default QR Code</h4>
                  <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center border">
                    <p className="text-gray-400 text-sm text-center">QR Code<br/>steptrendy@upi</p>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2">Default: steptrendy@upi</p>
                </div>
              </div>
            </div>
          )}

          {/* COUPONS */}
          {activeTab === 'coupons' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Coupon Management</h3>
                <button className="btn-primary text-sm" onClick={async () => {
                  const code = prompt('Enter coupon code:');
                  if (!code) return;
                  const value = prompt('Enter discount value (e.g., 10 for 10% or ₹100):');
                  if (!value) return;
                  const type = prompt('Type: "percentage" or "fixed":') || 'percentage';
                  try {
                    await couponAPI.create({ code: code.toUpperCase(), type, value: Number(value), isActive: true });
                    toast.success('Coupon created');
                    fetchCoupons();
                  } catch { toast.error('Failed to create coupon'); }
                }}><HiPlus size={16} /> Add Coupon</button>
              </div>
              <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5">
                      <th className="text-left py-3 px-4">Code</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Value</th>
                      <th className="text-left py-3 px-4">Uses</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr></thead>
                    <tbody>
                      {coupons.length > 0 ? coupons.map((c) => (
                        <tr key={c._id} className="border-b border-white/5">
                          <td className="py-3 px-4 font-mono font-bold">{c.code}</td>
                          <td className="py-3 px-4 capitalize">{c.type}</td>
                          <td className="py-3 px-4">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                          <td className="py-3 px-4">{c.usedCount || 0}/{c.usageLimit || '∞'}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-center py-12 text-gray-500">No coupons yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT MANAGER */}
          {activeTab === 'content' && <ContentManager />}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div><h3 className="text-xl font-bold">Notifications</h3><p className="text-sm text-gray-500">Manage system notifications</p></div>
                <button onClick={async () => {
                  const title = prompt('Notification title:');
                  if (!title) return;
                  const message = prompt('Notification message:');
                  if (!message) return;
                  try { await notificationAPI.create({ title, message, type: 'info', targetAudience: 'all' }); toast.success('Notification sent'); fetchNotifications(); }
                  catch { toast.error('Failed to send'); }
                }} className="btn-primary text-sm flex items-center gap-2"><HiPlus size={16} /> Send Notification</button>
              </div>
              <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-500 bg-white/5">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Message</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr></thead>
                    <tbody>
                      {notifications.length > 0 ? notifications.map((n) => (
                        <tr key={n._id} className="border-b border-white/5">
                          <td className="py-3 px-4 font-medium">{n.title}</td>
                          <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{n.message}</td>
                          <td className="py-3 px-4 capitalize"><span className={`px-2 py-1 text-xs rounded-full ${n.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : n.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{n.type}</span></td>
                          <td className="py-3 px-4"><span className={`text-xs ${n.isRead ? 'text-gray-500' : 'text-blue-400 font-medium'}`}>{n.isRead ? 'Read' : 'New'}</span></td>
                          <td className="py-3 px-4 text-xs text-gray-500">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '-'}</td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-center py-12 text-gray-500">No notifications</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div><h3 className="text-xl font-bold">Security Center</h3><p className="text-sm text-gray-500">Manage access and security settings</p></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6">
                  <h4 className="font-semibold mb-4">Admin Accounts</h4>
                  <div className="space-y-3">
                    {users.filter(u => u.role === 'admin').map((u, i) => (
                      <div key={u._id || i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div><p className="font-medium">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">{u.role}</span>
                      </div>
                    ))}
                    {users.filter(u => u.role === 'admin').length === 0 && <p className="text-sm text-gray-500">No admin accounts</p>}
                  </div>
                </div>
                <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6">
                  <h4 className="font-semibold mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors">Activity Logs</button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors">Manage Permissions</button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors">API Keys</button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors">Two-Factor Auth</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && <SiteSettings />}
        </div>
      </div>

      {/* Product Modal */}
      <Modal isOpen={modalOpen && modalType === 'product'} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Product' : 'Add New Product'} size="max-w-2xl">
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="input-field" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label>
              <textarea rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Price *</label>
              <input type="number" required min={0} value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Compare Price</label>
              <input type="number" min={0} value={productForm.comparePrice} onChange={e => setProductForm({ ...productForm, comparePrice: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" min={0} value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Brand</label>
              <input type="text" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Category</label>
              <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="input-field">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium mb-1">Gender</label>
              <select value={productForm.gender} onChange={e => setProductForm({ ...productForm, gender: e.target.value })} className="input-field">
                <option value="unisex">Unisex</option><option value="men">Men</option><option value="women">Women</option><option value="kids">Kids</option>
              </select></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="url" value={productForm.images[0]?.url || ''} onChange={e => setProductForm({ ...productForm, images: [{ url: e.target.value, alt: 'Product', isPrimary: true }] })} className="input-field" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input type="text" value={productForm.tags} onChange={e => setProductForm({ ...productForm, tags: e.target.value })} className="input-field" placeholder="e.g., sneakers, nike, trendy" /></div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.isFeatured} onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.isTrending} onChange={e => setProductForm({ ...productForm, isTrending: e.target.checked })} /> Trending</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.isOnSale} onChange={e => setProductForm({ ...productForm, isOnSale: e.target.checked })} /> On Sale</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 border border-white/20 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary text-sm flex items-center gap-2">
              {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
