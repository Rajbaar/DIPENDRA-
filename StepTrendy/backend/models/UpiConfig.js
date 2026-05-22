const mongoose = require('mongoose');

const upiConfigSchema = new mongoose.Schema({
  upiId: { type: String, required: true },
  accountName: { type: String, required: true },
  bankName: String,
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  qrCodeUrl: { type: String },
  customQrImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UpiConfig', upiConfigSchema);
