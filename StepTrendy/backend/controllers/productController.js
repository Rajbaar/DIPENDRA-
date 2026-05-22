const { Product } = require('../models/index');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, sort, search, minPrice, maxPrice, brand, gender, featured, trending } = req.query;
    let query = { status: 'active' };
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (trending === 'true') query.isTrending = true;
    if (minPrice || maxPrice) { query.price = {}; if (minPrice) query.price.$gte = Number(minPrice); if (maxPrice) query.price.$lte = Number(maxPrice); }
    let items = await Product.find(query);
    if (search) items = items.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase())));
    if (sort === 'price-asc') items.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'price-desc') items.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === 'rating') items.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
    if (sort === 'popular') items.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    if (sort === 'newest' || !sort) items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const total = items.length;
    const start = (page - 1) * limit;
    const products = items.slice(start, start + Number(limit));
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.slug);
    if (!product) product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Product._coll.findByIdAndUpdate(product._id, { views: (product.views || 0) + 1 });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, status: 'active' });
    res.json(products.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true, status: 'active' });
    res.json(products.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isOnSale: true, status: 'active' });
    res.json(products.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const products = await Product.find({ _id: { $ne: req.params.id }, status: 'active' });
    const related = products.filter(p => (p.category === product.category || (p.tags || []).some(t => (product.tags || []).includes(t))));
    res.json(related.slice(0, 8));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    let items = await Product.find({});
    if (search) items = items.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()));
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const total = items.length;
    const products = items.slice(0, limit);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.body.price) return res.status(400).json({ message: 'Name and price are required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    const product = await Product.create({ ...req.body, slug, price: Number(req.body.price), stock: Number(req.body.stock || 0) });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('product:created', product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to save product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('product:updated', product);
    res.json(await Product.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const io = req.app?.get('io');
    if (io) io.to('admin-room').emit('product:deleted', { id: req.params.id });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete product' });
  }
};

exports.bulkUpload = async (req, res) => {
  try {
    if (!req.body.products?.length) return res.status(400).json({ message: 'Products array is required' });
    const products = req.body.products.map(p => ({
      ...p, slug: p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36),
    }));
    const created = await Product.insertMany(products);
    res.status(201).json({ message: `${created.length} products created`, products: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.aiSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const products = await Product.find({ status: 'active' });
    const results = products.filter(p =>
      (p.name || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase())) ||
      (p.brand || '').toLowerCase().includes(q.toLowerCase())
    );
    res.json(results.slice(0, 10).map(p => ({ _id: p._id, name: p.name, slug: p.slug, price: p.price, images: p.images, brand: p.brand })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.aiRecommendations = async (req, res) => {
  try {
    const { categories, excludeId } = req.query;
    let items = await Product.find({ status: 'active' });
    if (categories) items = items.filter(p => categories.split(',').includes(p.category));
    if (excludeId) items = items.filter(p => p._id !== excludeId);
    items.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    res.json(items.slice(0, 12));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
