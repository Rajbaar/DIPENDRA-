const { User } = require('../models/index');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email: email.toLowerCase(), password, isVerified: true });
    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || 'user' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (user.googleId && !user.password) return res.status(401).json({ message: 'This account uses Google login.' });
    const isValid = await User.comparePassword(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid email or password' });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.json({
      token, refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || 'user', avatar: user.avatar, phone: user.phone || '' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await User._coll.findByIdAndUpdate(user._id, { otp, otpExpire: Date.now() + 10 * 60 * 1000 });
    res.json({ message: 'OTP resent successfully', otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), otp });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
    const token = generateToken(user._id);
    res.json({ message: 'Email verified', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await User._coll.findByIdAndUpdate(user._id, { resetPasswordToken: user.resetPasswordToken, resetPasswordExpire: user.resetPasswordExpire });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;
    res.json({ message: 'Reset link sent to your email. In demo mode, use this link:', resetUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
    const bcrypt = require('bcryptjs');
    const newPassword = await bcrypt.hash(password, 12);
    await User._coll.findByIdAndUpdate(user._id, { password: newPassword, resetPasswordToken: undefined, resetPasswordExpire: undefined });
    res.json({ message: 'Password reset successfully. Please login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    let user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { googleId }] });
    if (!user) user = await User.create({ name, email: email.toLowerCase(), googleId, avatar, isVerified: true });
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, otp, otpExpire, refreshToken, ...safe } = user;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar) updates.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user._id, updates);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...safe } = { ...user, ...updates };
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
    const newToken = generateToken(user._id);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
