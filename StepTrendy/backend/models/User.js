const bcrypt = require('bcryptjs');
const { createModel } = require('../config/db-bridge');

const coll = createModel('User');

const User = {
  find: (q) => coll.find(q),
  findById: (id) => {
    const result = coll.findById(id);
    return result ? Promise.resolve(result) : Promise.resolve(null);
  },
  findOne: (q) => Promise.resolve(coll.findOne(q)),
  findByIdAndUpdate: (id, upd, opts) => Promise.resolve(coll.findByIdAndUpdate(id, upd, opts)),
  countDocuments: (q) => Promise.resolve(coll.countDocuments(q)),
  aggregate: (p) => Promise.resolve(coll.aggregate(p)),

  async create(data) {
    if (data.password) data.password = await bcrypt.hash(data.password, 12);
    return coll.insertOne(data);
  },

  async comparePassword(candidate, hashed) {
    if (!hashed) return false;
    return bcrypt.compare(candidate, hashed);
  },
};

module.exports = User;
