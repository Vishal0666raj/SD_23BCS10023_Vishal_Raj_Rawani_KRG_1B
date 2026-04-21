const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/user.model');

// TODO: Add auth routes here
// router.post('/register', ...);
// router.post('/login', ...);

const { signup, login } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    res.json({
      id: user.id,
      email: user.email,
      isPremium: user.premium
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;