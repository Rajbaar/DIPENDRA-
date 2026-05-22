const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String },
  brand: { type: String, default: 'StepTrendy' },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  costPrice: { type: Number },
  sku: { type: String, unique: true },
  barcode: { type: String },
  stock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  isInStock: { type: Boolean, default: true },
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  videoUrl: { type: String },
  colors: [{ name: String, hex: String, image: String }],
  sizes: [{ name: String, stock: { type: Number, default: 0 } }],
  tags: [{ type: String }],
  features: [{ type: String }],
  specifications: [{ key: String, value: String }],
  ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number, title: String, comment: String, images: [String], isVerifiedPurchase: Boolean, createdAt: { type: Date, default: Date.now } }],
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  isOnSale: { type: Boolean, default: false },
  saleEndDate: { type: Date },
  gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'] },
  material: { type: String },
  weight: { type: Number },
  dimensions: { type: String },
  views: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, isTrending: 1 });

module.exports = mongoose.model('Product', productSchema);
