const router = require('express').Router();
const { Notification } = require('../models/index');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { $or: [{ user: req.user._id }, { targetAudience: 'all' }] };
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
