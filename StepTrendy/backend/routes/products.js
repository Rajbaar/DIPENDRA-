const router = require('express').Router();
const { getProducts, getProduct, getFeaturedProducts, getTrendingProducts, getSaleProducts, getRelatedProducts, getAllProductsAdmin, createProduct, updateProduct, deleteProduct, bulkUpload, aiSearch, aiRecommendations } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/sale', getSaleProducts);
router.get('/ai-search', aiSearch);
router.get('/ai-recommendations', aiRecommendations);
router.get('/admin/all', protect, admin, getAllProductsAdmin);
router.get('/:slug', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, admin, createProduct);
router.post('/bulk-upload', protect, admin, bulkUpload);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
