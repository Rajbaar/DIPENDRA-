const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: { type: String, required: true },
  mobileImage: String,
  link: String,
  buttonText: String,
  type: { type: String, enum: ['hero', 'promo', 'category', 'side'], default: 'hero' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
