const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  transactionId: { type: String, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, enum: ['razorpay', 'stripe', 'paypal', 'cod', 'upi', 'qr', 'bank'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  stripePaymentId: String,
  paypalOrderId: String,
  upiId: String,
  qrCode: String,
  bankReference: String,
  paymentScreenshot: String,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  metadata: mongoose.Schema.Types.Mixed,
  refundId: String,
  refundAmount: Number,
  refundReason: String,
  refundedAt: Date,
}, { timestamps: true });

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
