const { Payment, Order, UpiConfig } = require('../models/index');
const QRCode = require('qrcode');

exports.createPayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const transactionId = 'TXN' + Date.now().toString(36).toUpperCase();
    const paymentData = { user: req.user._id, order: orderId, transactionId, amount: order.total, method, status: 'pending' };

    if (method === 'upi') {
      const upiConfig = await UpiConfig.findOne({ isActive: true, isDefault: true });
      const upiId = upiConfig?.upiId || 'steptrendy@upi';
      paymentData.upiId = upiId;
      try { paymentData.qrCode = await QRCode.toDataURL(`upi://pay?pa=${upiId}&pn=StepTrendy&am=${order.total}&tr=${transactionId}`); } catch {}
    }
    if (method === 'qr') {
      try { paymentData.qrCode = await QRCode.toDataURL(`steptrendy://pay?order=${order.orderNumber}&amount=${order.total}`); } catch {}
    }
    if (method === 'cod') {
      paymentData.status = 'pending';
      await Order._coll.findByIdAndUpdate(orderId, { paymentInfo: { method: 'cod', status: 'pending', transactionId }, status: 'confirmed' });
    }

    const payment = await Payment.create(paymentData);
    res.status(201).json({ payment, ...(paymentData.qrCode && { qrCode: paymentData.qrCode }), ...(paymentData.upiId && { upiId: paymentData.upiId }) });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Payment creation failed' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    await Payment._coll.findByIdAndUpdate(paymentId, { status: 'success', verifiedAt: new Date().toISOString() });
    if (payment.order) {
      await Order._coll.findByIdAndUpdate(payment.order, { 'paymentInfo.status': 'success', status: 'confirmed' });
    }
    res.json({ message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { status, method } = req.query;
    let query = {};
    if (status) query.status = status;
    if (method) query.method = method;
    const payments = await Payment.find(query);
    payments.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'success' });
    const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const monthlyMap = {};
    payments.forEach(p => {
      const month = (p.createdAt || '').slice(0, 7) || new Date().toISOString().slice(0, 7);
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });
    const revenue = Object.entries(monthlyMap).map(([k, v]) => ({ _id: k, revenue: payments.filter(p => (p.createdAt || '').startsWith(k)).reduce((s, p) => s + (p.amount || 0), 0), count: v }));
    res.json({ revenue, totalRevenue, totalTransactions: payments.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPI Config
exports.getUpiConfigs = async (req, res) => {
  try {
    const configs = await UpiConfig.find({});
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUpiConfig = async (req, res) => {
  try {
    const { upiId, accountName } = req.body;
    if (!upiId || !accountName) return res.status(400).json({ message: 'UPI ID and account name are required' });
    if (req.body.isDefault) {
      const existing = await UpiConfig.find({ isDefault: true });
      await Promise.all(existing.map(c => UpiConfig._coll.findByIdAndUpdate(c._id, { isDefault: false })));
    }
    const config = await UpiConfig.create({ upiId, accountName, bankName: req.body.bankName || '', isDefault: req.body.isDefault || false, isActive: true });
    res.status(201).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create UPI config' });
  }
};

exports.updateUpiConfig = async (req, res) => {
  try {
    if (req.body.isDefault) {
      const existing = await UpiConfig.find({ isDefault: true });
      await Promise.all(existing.map(c => UpiConfig._coll.findByIdAndUpdate(c._id, { isDefault: false })));
    }
    const config = await UpiConfig.findByIdAndUpdate(req.params.id, req.body);
    if (!config) return res.status(404).json({ message: 'UPI config not found' });
    res.json(await UpiConfig.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUpiConfig = async (req, res) => {
  try {
    const config = await UpiConfig.findByIdAndDelete(req.params.id);
    if (!config) return res.status(404).json({ message: 'UPI config not found' });
    res.json({ message: 'UPI config deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    const screenshotUrl = `/uploads/${req.file.filename}`;
    await Payment._coll.findByIdAndUpdate(id, { screenshot: screenshotUrl, status: 'awaiting_verification' });
    res.json({ message: 'Screenshot uploaded', url: screenshotUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
