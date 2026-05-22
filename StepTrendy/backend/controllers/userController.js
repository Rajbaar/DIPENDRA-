const { User, Product } = require('../models/index');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const safe = users.map(({ password, otp, otpExpire, refreshToken, resetPasswordToken, resetPasswordExpire, ...rest }) => rest);
    res.json({ users: safe, total: safe.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, otp, otpExpire, refreshToken, resetPasswordToken, resetPasswordExpire, ...safe } = user;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { ...(role && { role }) });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(await User.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, city, state, zipCode, isDefault } = req.body;
    if (!fullName || !phone || !street || !city || !state || !zipCode) return res.status(400).json({ message: 'All address fields required' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addresses = user.addresses || [];
    const newAddr = { _id: require('crypto').randomBytes(8).toString('hex'), fullName, phone, street, city, state, zipCode, isDefault: isDefault || addresses.length === 0 };
    if (newAddr.isDefault) addresses.forEach(a => a.isDefault = false);
    addresses.push(newAddr);
    await User._coll.findByIdAndUpdate(req.user._id, { addresses });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addresses = (user.addresses || []).map(a => {
      if (a._id === req.params.addrId) { const updated = { ...a, ...req.body, _id: a._id }; if (req.body.isDefault) updated.isDefault = true; return updated; }
      if (req.body.isDefault) a.isDefault = false;
      return a;
    });
    await User._coll.findByIdAndUpdate(req.user._id, { addresses });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addresses = (user.addresses || []).filter(a => a._id !== req.params.addrId);
    await User._coll.findByIdAndUpdate(req.user._id, { addresses });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const wishlist = user.wishlist || [];
    if (!wishlist.includes(productId)) wishlist.push(productId);
    await User._coll.findByIdAndUpdate(req.user._id, { wishlist });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const wishlist = (user.wishlist || []).filter(id => id !== req.params.productId);
    await User._coll.findByIdAndUpdate(req.user._id, { wishlist });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const users = await User.find({});
    const now = new Date();
    const thisMonth = users.filter(u => u.createdAt && u.createdAt.slice(0, 7) === now.toISOString().slice(0, 7));
    const admins = users.filter(u => u.role === 'admin').length;
    res.json({ total: users.length, newThisMonth: thisMonth.length, admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
