const { Category } = require('../models/index');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    categories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, image, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const exists = await Category.findOne({ slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({
      name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: image || 'https://via.placeholder.com/200', description: description || '',
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(await Category.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
