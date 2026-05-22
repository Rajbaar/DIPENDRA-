const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['order', 'payment', 'promo', 'system', 'alert'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: String,
  image: String,
  targetAudience: { type: String, enum: ['all', 'users', 'admins', 'specific'], default: 'all' },
  scheduledAt: Date,
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
