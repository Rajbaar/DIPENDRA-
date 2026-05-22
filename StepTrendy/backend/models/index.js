const { createModel } = require('../config/db-bridge');
const bcrypt = require('bcryptjs');

// Generic model wrapper with Mongoose-compatible API
function wrapCollection(name, customFns = {}) {
  const coll = createModel(name);

  const base = {
    find: (query = {}) => {
      let results = coll.find(query);
      let chain = {
        _sort: null, _skip: 0, _limit: null, _query: query,
        sort(s) { this._sort = s; return this; },
        skip(n) { this._skip = n; return this; },
        limit(l) { this._limit = l; return this; },
        populate() { return this; },
        select() { return this; },
        exec() {
          let items = coll.find(this._query);
          if (this._sort) items = items.sort(this._sort);
          if (this._skip || this._limit) items = items.skip(this._skip || 0).limit(this._limit || items.length);
          return Promise.resolve(items);
        },
        then(resolve) { return this.exec().then(resolve); },
        catch() { return this; },
      };
      return chain;
    },
    findById: (id) => Promise.resolve(coll.findById(id)),
    findOne: (query) => Promise.resolve(coll.findOne(query)),
    findByIdAndUpdate: (id, update, opts) => Promise.resolve(coll.findByIdAndUpdate(id, update, opts)),
    findByIdAndDelete: (id) => Promise.resolve(coll.findByIdAndDelete(id)),
    countDocuments: (query) => Promise.resolve(coll.countDocuments(query)),
    create: (data) => Promise.resolve(coll.insertOne(data)),
    insertMany: (docs) => Promise.resolve(coll.insertMany(docs)),
    deleteOne: (query) => Promise.resolve(coll.deleteOne(query)),
    aggregate: (pipeline) => Promise.resolve(coll.aggregate(pipeline)),
    deleteMany: (query) => {
      const items = coll.find(query);
      items.forEach(item => coll.findByIdAndDelete(item._id));
      return Promise.resolve({ deletedCount: items.length });
    },
    updateMany: (query, update) => {
      const items = coll.find(query);
      items.forEach(item => coll.findByIdAndUpdate(item._id, { ...item, ...update }));
      return Promise.resolve({ modifiedCount: items.length });
    },
    _coll: coll._coll,
  };

  return { ...base, ...customFns };
}

// User with password hashing
const User = wrapCollection('User', {
  async create(data) {
    if (data.password) data.password = await bcrypt.hash(data.password, 12);
    return this._coll.insertOne(data);
  },
  async comparePassword(candidate, hashed) {
    if (!hashed) return false;
    return bcrypt.compare(candidate, hashed);
  },
  findOneWithPassword(query) {
    return Promise.resolve(this._coll.findOne(query));
  },
});

const Product = wrapCollection('Product');
const Category = wrapCollection('Category');
const Order = wrapCollection('Order');
const Payment = wrapCollection('Payment');
const Coupon = wrapCollection('Coupon');
const Review = wrapCollection('Review');
const Banner = wrapCollection('Banner');
const Notification = wrapCollection('Notification');
const Ticket = wrapCollection('Ticket');
const UpiConfig = wrapCollection('UpiConfig');

module.exports = { User, Product, Category, Order, Payment, Coupon, Review, Banner, Notification, Ticket, UpiConfig };
