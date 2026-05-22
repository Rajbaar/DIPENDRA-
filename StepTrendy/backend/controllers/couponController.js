const { Coupon } = require('../models/index');

exports.getCoupons = async (req, res) => {
  try {
    const now = new Date().toISOString();
    let coupons;
    if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
      coupons = await Coupon.find({});
    } else {
      coupons = await Coupon.find({ isActive: true, validUntil: { $gte: now } });
    }
    coupons.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    if (!coupon.isActive) return res.status(400).json({ message: 'Coupon is inactive' });
    if (new Date(coupon.validUntil) < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, type, minAmount, validUntil, maxUses } = req.body;
    if (!code || !discount || !validUntil) return res.status(400).json({ message: 'Code, discount, and expiry are required' });
    if (type === 'percentage' && (discount < 1 || discount > 99)) return res.status(400).json({ message: 'Percentage must be 1-99' });
    const coupon = await Coupon.create({
      code: code.toUpperCase(), type, discount: Number(discount),
      minAmount: minAmount ? Number(minAmount) : 0, validUntil, maxUses: maxUses ? Number(maxUses) : 100,
    });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('coupon:created', coupon);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create coupon' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('coupon:updated', { ...coupon, ...req.body });
    res.json(await Coupon.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('coupon:deleted', { id: req.params.id });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'Coupon is inactive' });
    if (new Date(coupon.validUntil) < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (cartTotal < coupon.minAmount) return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minAmount}` });
    let discount = coupon.type === 'percentage' ? (cartTotal * coupon.discount / 100) : coupon.discount;
    const maxDiscount = coupon.maxDiscount || discount;
    discount = Math.min(discount, maxDiscount, cartTotal);
    await Coupon._coll.findByIdAndUpdate(coupon._id, { usedCount: (coupon.usedCount || 0) + 1 });
    res.json({ success: true, discount, code: coupon.code, type: coupon.type, discountValue: coupon.discount, message: `Coupon applied! You saved ₹${discount}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.validateCoupon = exports.applyCoupon;
