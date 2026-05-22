const MemoryCollection = require('./memoryDB');

const collections = {};

function getCollection(name) {
  if (!collections[name]) {
    collections[name] = new MemoryCollection(name);
  }
  return collections[name];
}

// Seed data - uses getCollection so seeds populate the shared instances
function seedData() {
  const productsColl = getCollection('products');
  if (productsColl.data.length === 0) {
    const products = [
      { name: 'Nike Air Max 270 Premium', slug: 'nike-air-max-270', description: 'Premium lifestyle sneaker with Air Max cushioning.', price: 14999, comparePrice: 18999, brand: 'Nike', stock: 45, gender: 'men', images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], category: 'Sneakers', isFeatured: true, isTrending: true, isOnSale: true, saleEndDate: new Date(Date.now() + 86400000 * 7).toISOString(), tags: ['sneakers', 'nike', 'trending'], status: 'active', ratings: { average: 4.8, count: 256 }, salesCount: 1200, sizes: [{ name: 'UK 7' }, { name: 'UK 8' }, { name: 'UK 9' }, { name: 'UK 10' }], colors: [{ name: 'Black', hex: '#000' }, { name: 'White', hex: '#fff' }] },
      { name: 'Rolex Submariner Date', slug: 'rolex-submariner-date', description: 'Luxury dive watch with ceramic bezel.', price: 895000, brand: 'Rolex', stock: 5, gender: 'men', images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600', isPrimary: true }], category: 'Watches', isFeatured: true, isTrending: true, tags: ['watches', 'luxury', 'rolex'], status: 'active', ratings: { average: 5.0, count: 89 }, salesCount: 340 },
      { name: 'Gucci GG Marmont Bag', slug: 'gucci-gg-marmont', description: 'Iconic matelassé leather shoulder bag.', price: 185000, comparePrice: 210000, brand: 'Gucci', stock: 12, gender: 'women', images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', isPrimary: true }], category: 'Bags', isFeatured: true, tags: ['bags', 'luxury', 'gucci'], status: 'active', ratings: { average: 4.7, count: 156 }, salesCount: 890 },
      { name: 'Off-White x Nike Dunk Low', slug: 'off-white-dunk-low', description: 'Collaboration sneaker with signature details.', price: 45999, brand: 'Off-White', stock: 3, gender: 'unisex', images: [{ url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', isPrimary: true }], category: 'Sneakers', isFeatured: true, isTrending: true, isOnSale: true, saleEndDate: new Date(Date.now() + 86400000 * 3).toISOString(), tags: ['sneakers', 'off-white', 'limited'], status: 'active', ratings: { average: 4.9, count: 78 }, salesCount: 2100 },
      { name: 'Dior Sauvage Elixir', slug: 'dior-sauvage-elixir', description: 'Intense aromatic fragrance.', price: 12999, brand: 'Dior', stock: 28, gender: 'men', images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600', isPrimary: true }], category: 'Cosmetics', isFeatured: true, tags: ['cosmetics', 'fragrance', 'dior'], status: 'active', ratings: { average: 4.6, count: 432 }, salesCount: 3400 },
      { name: 'Supreme Box Logo Hoodie', slug: 'supreme-box-logo', description: 'Classic streetwear essential.', price: 24999, brand: 'Supreme', stock: 8, gender: 'unisex', images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', isPrimary: true }], category: 'Streetwear', isFeatured: true, isTrending: true, tags: ['streetwear', 'supreme', 'hoodie'], status: 'active', ratings: { average: 4.5, count: 312 }, salesCount: 1800 },
      { name: 'Air Jordan 1 Retro High', slug: 'air-jordan-1-retro', description: 'Legendary basketball sneaker.', price: 18999, comparePrice: 22999, brand: 'Jordan', stock: 22, gender: 'men', images: [{ url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600', isPrimary: true }], category: 'Sneakers', isTrending: true, isOnSale: true, saleEndDate: new Date(Date.now() + 86400000 * 5).toISOString(), tags: ['sneakers', 'jordan', 'basketball'], status: 'active', ratings: { average: 4.8, count: 567 }, salesCount: 4500 },
      { name: 'Louis Vuitton Neverfull GM', slug: 'louis-vuitton-neverfull', description: 'Spacious tote bag in Monogram canvas.', price: 235000, brand: 'Louis Vuitton', stock: 4, gender: 'women', images: [{ url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600', isPrimary: true }], category: 'Bags', isFeatured: true, tags: ['bags', 'luxury', 'lv'], status: 'active', ratings: { average: 4.9, count: 234 }, salesCount: 1200 },
      { name: 'Apple AirPods Max', slug: 'apple-airpods-max', description: 'Over-ear headphones with spatial audio.', price: 59900, brand: 'Apple', stock: 35, gender: 'unisex', images: [{ url: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600', isPrimary: true }], category: 'Electronics', isTrending: true, tags: ['electronics', 'apple', 'headphones'], status: 'active', ratings: { average: 4.4, count: 678 }, salesCount: 5600 },
      { name: 'Balenciaga Triple S Sneakers', slug: 'balenciaga-triple-s', description: 'Chunky dad sneaker with layered sole.', price: 89000, brand: 'Balenciaga', stock: 6, gender: 'unisex', images: [{ url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600', isPrimary: true }], category: 'Sneakers', isFeatured: true, isTrending: true, tags: ['sneakers', 'balenciaga', 'luxury'], status: 'active', ratings: { average: 4.3, count: 189 }, salesCount: 980 },
    ];
    products.forEach(p => productsColl.insertOne(p));
    console.log('Seeded 10 sample products');
  }

  const catsColl = getCollection('categories');
  if (catsColl.data.length === 0) {
    const cats = [
      { name: 'Sneakers', slug: 'sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', description: 'Premium sneakers', isActive: true, order: 1 },
      { name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200', description: 'Luxury timepieces', isActive: true, order: 2 },
      { name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200', description: 'Designer bags', isActive: true, order: 3 },
      { name: 'Streetwear', slug: 'streetwear', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200', description: 'Urban fashion', isActive: true, order: 4 },
      { name: 'Cosmetics', slug: 'cosmetics', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200', description: 'Beauty & fragrance', isActive: true, order: 5 },
      { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=200', description: 'Gadgets & tech', isActive: true, order: 6 },
      { name: 'Men Fashion', slug: 'men-fashion', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200', description: 'Men collection', isActive: true, order: 7 },
      { name: 'Women Fashion', slug: 'women-fashion', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200', description: 'Women collection', isActive: true, order: 8 },
      { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200', description: 'Premium accessories', isActive: true, order: 9 },
    ];
    cats.forEach(c => catsColl.insertOne(c));
    console.log('Seeded 9 categories');
  }

  const upiColl = getCollection('upiconfigs');
  if (upiColl.data.length === 0) {
    upiColl.insertOne({ upiId: 'steptrendy@upi', accountName: 'StepTrendy Pay', bankName: 'HDFC', isDefault: true, isActive: true });
  }

  const coupColl = getCollection('coupons');
  if (coupColl.data.length === 0) {
    coupColl.insertOne({ code: 'STEP10', type: 'percentage', discount: 10, minAmount: 999, maxDiscount: 1500, maxUses: 100, usedCount: 0, isActive: true, validUntil: new Date(Date.now() + 86400000 * 30).toISOString(), description: '10% off on orders above ₹999' });
    coupColl.insertOne({ code: 'WELCOME', type: 'fixed', discount: 500, minAmount: 1499, maxDiscount: 500, maxUses: 50, usedCount: 0, isActive: true, validUntil: new Date(Date.now() + 86400000 * 60).toISOString(), description: '₹500 off on first order above ₹1499' });
    coupColl.insertOne({ code: 'FREESHIP', type: 'fixed', discount: 99, minAmount: 0, maxDiscount: 99, maxUses: 200, usedCount: 0, isActive: true, validUntil: new Date(Date.now() + 86400000 * 15).toISOString(), description: 'Free shipping' });
  }
}

// Seed on first load
seedData();

function createModel(name) {
  let base = name.toLowerCase();
  // Handle common pluralizations
  if (base.endsWith('y') && !'aeiou'.includes(base[base.length - 2])) base = base.slice(0, -1) + 'ie';
  const collName = base + 's';
  const coll = getCollection(collName);

  return {
    find: (query = {}) => {
      const wrapper = {
        _sort: null, _skip: 0, _limit: null, _query: query,
        sort(s) { this._sort = s; return this; },
        skip(n) { this._skip = n; return this; },
        limit(l) { this._limit = l; return this; },
        populate() { return this; },
        select() { return this; },
        async exec() { return this._exec(); },
        then(resolve) { return this._exec().then(resolve); },
        catch() { return this; },
        _exec() {
          let result = coll.find(this._query);
          if (this._sort) result = result.sort(this._sort);
          if (this._skip || this._limit) result = result.skip(this._skip || 0).limit(this._limit || 1000);
          // result might be the wrapper object or an array (if chained with limit)
          if (Array.isArray(result)) return Promise.resolve(result);
          return Promise.resolve(result.exec ? result.exec() : result);
        },
      };
      return wrapper;
    },
    findById: (id) => Promise.resolve(coll.findById(id)),
    findOne: (query = {}) => Promise.resolve(coll.findOne(query)),
    findByIdAndUpdate: (id, update, opts) => Promise.resolve(coll.findByIdAndUpdate(id, update, opts)),
    findByIdAndDelete: (id) => Promise.resolve(coll.findByIdAndDelete(id)),
    countDocuments: (query = {}) => Promise.resolve(coll.countDocuments(query)),
    create: (doc) => Promise.resolve(coll.insertOne(doc)),
    insertMany: (docs) => Promise.resolve(coll.insertMany(docs)),
    deleteOne: (query) => Promise.resolve(coll.deleteOne(query)),
    aggregate: (pipeline) => Promise.resolve(coll.aggregate(pipeline)),
    textSearch: (text) => coll.textSearch(text),
    _coll: coll,
  };
}

module.exports = { createModel, getCollection };
