const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DB_PATH)) fs.mkdirSync(DB_PATH, { recursive: true });

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DB_PATH, `${name}.json`);
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      }
    } catch {}
    return [];
  }

  _save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (e) { console.error(`Save error [${this.name}]:`, e.message); }
  }

  _id() {
    return crypto.randomBytes(12).toString('hex');
  }

  _match(obj, query) {
    for (const key of Object.keys(query)) {
      if (key === '$or') {
        const orMatch = query.$or.some(clause => this._match(obj, clause));
        if (!orMatch) return false;
        continue;
      }
      if (key === '$text') continue;
      const val = query[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (val.$regex) {
          const re = new RegExp(val.$regex, val.$options || '');
          if (!re.test(String(obj[key] || ''))) return false;
        }
        if (val.$in) {
          if (!val.$in.includes(obj[key])) return false;
        }
        if (val.$ne) {
          if (obj[key] === val.$ne || String(obj[key]) === String(val.$ne)) return false;
        }
        if (val.$gte !== undefined && (obj[key] === undefined || obj[key] < val.$gte)) return false;
        if (val.$lte !== undefined && (obj[key] === undefined || obj[key] > val.$lte)) return false;
        if (val.$gt !== undefined && (obj[key] === undefined || obj[key] <= val.$gt)) return false;
        if (val.$lt !== undefined && (obj[key] === undefined || obj[key] >= val.$lt)) return false;
      } else {
        if (String(obj[key] || '') !== String(val || '')) return false;
      }
    }
    return true;
  }

  find(query = {}) {
    const results = this.data.filter(d => this._match(d, query));
    return {
      sort(sortObj) {
        const key = Object.keys(sortObj || { createdAt: -1 })[0];
        const dir = sortObj[key];
        results.sort((a, b) => {
          if (dir === -1) return (b[key] || '') > (a[key] || '') ? 1 : -1;
          return (a[key] || '') > (b[key] || '') ? 1 : -1;
        });
        return this;
      },
      skip(n) { return { ...this, limit: (l) => results.slice(n, n + (l || results.length)) }; },
      limit(l) { return results.slice(0, l); },
      populate() { return results; },
      select() { return results; },
      exec() { return results; },
      toArray() { return results; },
    };
  }

  findById(id) {
    return this.data.find(d => d._id === id) || null;
  }

  findOne(query = {}) {
    return this.data.find(d => this._match(d, query)) || null;
  }

  countDocuments(query = {}) {
    return query && Object.keys(query).length ? this.data.filter(d => this._match(d, query)).length : this.data.length;
  }

  insertOne(doc) {
    const _id = this._id();
    const newDoc = { _id, ...doc, createdAt: doc.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.push(newDoc);
    this._save();
    return { insertedId: _id, ...newDoc };
  }

  insertMany(docs) {
    const inserted = docs.map(d => this.insertOne(d));
    this._save();
    return inserted;
  }

  findByIdAndUpdate(id, update, opts = {}) {
    const idx = this.data.findIndex(d => d._id === id);
    if (idx === -1) return null;
    const updated = { ...this.data[idx], ...update, _id: id, updatedAt: new Date().toISOString() };
    if (opts.$set) Object.assign(updated, opts.$set);
    this.data[idx] = updated;
    this._save();
    return updated;
  }

  findByIdAndDelete(id) {
    const idx = this.data.findIndex(d => d._id === id);
    if (idx === -1) return null;
    const deleted = this.data.splice(idx, 1)[0];
    this._save();
    return deleted;
  }

  deleteOne(query) {
    const idx = this.data.findIndex(d => this._match(d, query));
    if (idx === -1) return { deletedCount: 0 };
    this.data.splice(idx, 1);
    this._save();
    return { deletedCount: 1 };
  }

  aggregate(pipeline) {
    let result = [...this.data];
    for (const stage of pipeline) {
      if (stage.$match) result = result.filter(d => this._match(d, stage.$match));
      if (stage.$group) {
        const groups = {};
        result.forEach(d => {
          const key = stage.$group._id ? this._resolveGroupKey(d, stage.$group._id) : 'all';
          if (!groups[key]) groups[key] = {};
          Object.entries(stage.$group).forEach(([k, v]) => {
            if (k === '_id') return;
            if (v.$sum) groups[key][k] = (groups[key][k] || 0) + (v.$sum === 1 ? 1 : Number(d[v.$sum.replace('$', '')] || 0));
          });
        });
        result = Object.entries(groups).map(([key, val]) => ({ _id: key, ...val }));
      }
      if (stage.$sort) {
        const key = Object.keys(stage.$sort)[0];
        result.sort((a, b) => stage.$sort[key] === -1 ? (b[key]||'') > (a[key]||'') ? 1 : -1 : (a[key]||'') > (b[key]||'') ? 1 : -1);
      }
      if (stage.$limit) result = result.slice(0, stage.$limit);
      if (stage.$skip) result = result.slice(stage.$skip);
    }
    return result;
  }

  _resolveGroupKey(d, expr) {
    if (typeof expr === 'string') return d[expr.replace('$', '')] || 'unknown';
    if (typeof expr === 'object' && expr.$dateToString) {
      const date = new Date(d[expr.$dateToString.date.replace('$', '')] || Date.now());
      const format = expr.$dateToString.format;
      if (format === '%Y-%m') return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
      if (format === '%Y-%m-%d') return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      return date.toISOString().slice(0, 7);
    }
    return 'unknown';
  }

  textSearch(text) {
    const terms = text.toLowerCase().split(' ');
    return this.data.filter(d => {
      const searchable = [d.name, d.description, ...(d.tags || [])].filter(Boolean).join(' ').toLowerCase();
      return terms.some(t => searchable.includes(t));
    });
  }
}

module.exports = MemoryCollection;
