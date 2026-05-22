const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, image: String, price: Number,
    quantity: { type: Number, default: 1 },
    size: String, color: String,
    sku: String,
  }],
  shippingAddress: {
    fullName: String, phone: String, street: String,
    city: String, state: String, zip: String, country: String,
  },
  paymentInfo: {
    method: { type: String, enum: ['razorpay', 'stripe', 'paypal', 'cod', 'upi', 'qr'] },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    razorpayOrderId: String,
    stripePaymentId: String,
    paypalOrderId: String,
    upiId: String,
    qrCode: String,
    paymentScreenshot: String,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending',
  },
  tracking: {
    provider: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    timeline: [{ status: String, location: String, date: Date, description: String }],
  },
  notes: { type: String },
  invoiceUrl: { type: String },
  returnRequest: {
    isRequested: { type: Boolean, default: false },
    reason: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    requestedAt: Date,
    approvedAt: Date,
  },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
