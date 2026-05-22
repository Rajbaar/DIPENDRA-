const router = require('express').Router();
const { getUsers, getUser, updateUser, deleteUser, addAddress, updateAddress, deleteAddress, addToWishlist, removeFromWishlist, getUserStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getUserStats);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);
router.post('/address', protect, addAddress);
router.put('/address/:addrId', protect, updateAddress);
router.delete('/address/:addrId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;
