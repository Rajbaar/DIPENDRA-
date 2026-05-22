// Unified model loader - uses Mongoose if available, falls back to in-memory DB
const { createModel } = require('../config/db-bridge');

let mongoose;
try { mongoose = require('mongoose'); } catch {}

const models = {};

function defineModel(name, schemaDef, options = {}) {
  if (mongoose && mongoose.connection.readyState === 1) {
    const schema = new mongoose.Schema(schemaDef, options);
    // Add indexes
    const model = mongoose.model(name, schema);
    models[name] = model;
    return model;
  }
  // In-memory fallback
  const model = createModel(name, schemaDef);
  models[name] = model;
  return model;
}

module.exports = { defineModel, models };
