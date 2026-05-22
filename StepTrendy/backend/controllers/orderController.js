const { Order, Product, User } = require('../models/index');
const genOrderNum = () => 'ST' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: 'Product not found' });
      if (!product.isInStock && product.stock < item.quantity) return res.status(400).json({ message: `${product.name} is out of stock` });
      const price = product.isOnSale && product.saleEndDate > new Date() ? (product.comparePrice || product.price) : product.price;
      subtotal += price * item.quantity;
      orderItems.push({
        product: product._id, name: product.name,
        image: product.images?.[0]?.url || '', price, quantity: item.quantity,
        size: item.size || '', color: item.color || '',
      });
      await Product._coll.findByIdAndUpdate(product._id, { stock: Math.max(0, product.stock - item.quantity), salesCount: (product.salesCount || 0) + item.quantity });
    }
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;
    const order = await Order.create({
      user: req.user._id, orderNumber: genOrderNum(), items: orderItems,
      shippingAddress, subtotal, shipping, tax: 0, discount: 0, total,
      paymentInfo: { method: paymentMethod || 'cod', status: 'pending' },
      status: 'confirmed',
    });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('order:created', order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      orders = await Order.find({});
    } else {
      orders = await Order.find({ user: req.user._id });
    }
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    // Attach user info
    orders = await Promise.all(orders.map(async (o) => {
      const user = o.user ? await User.findById(o.user).catch(() => null) : null;
      return { ...o, user: user ? { name: user.name, email: user.email } : { name: 'Guest' } };
    }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    let order;
    if (req.params.orderNumber.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.orderNumber);
    } else {
      order = await Order.findOne({ orderNumber: req.params.orderNumber });
    }
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'];
    if (status && !valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(req.params.id, { ...(status && { status }) });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('order:updated', { ...order, status });
    res.json(await Order.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Return reason required' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await Order._coll.findByIdAndUpdate(req.params.id, { returnRequest: { isRequested: true, reason, status: 'pending', requestedAt: new Date().toISOString() } });
    res.json({ message: 'Return requested' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const allOrders = await Order.find({});
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.filter(o => !['cancelled', 'returned', 'refunded'].includes(o.status)).reduce((s, o) => s + (o.total || 0), 0);
    const totalUsers = await User.countDocuments({ role: 'user' }) || 0;
    const totalProducts = await Product.countDocuments({ status: 'active' }) || 0;
    const recentOrders = allOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
    const ordersByStatus = {};
    allOrders.forEach(o => { ordersByStatus[o.status || 'pending'] = (ordersByStatus[o.status || 'pending'] || 0) + 1; });
    const todayOrders = allOrders.filter(o => new Date(o.createdAt || 0).toDateString() === new Date().toDateString()).length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    // Revenue by month from orders
    const revenueByMonth = [];
    const monthlyMap = {};
    allOrders.filter(o => !['cancelled', 'returned', 'refunded'].includes(o.status)).forEach(o => {
      const month = (o.createdAt || '').slice(0, 7) || new Date().toISOString().slice(0, 7);
      monthlyMap[month] = (monthlyMap[month] || 0) + (o.total || 0);
    });
    Object.entries(monthlyMap).sort().forEach(([k, v]) => revenueByMonth.push({ _id: k, revenue: v, count: 0 }));

    res.json({ totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, revenueByMonth, ordersByStatus, todayOrders, pendingOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
