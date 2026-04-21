const express = require('express');
const router = express.Router();

const { createShort, redirect, getMyUrls } = require('../controllers/url.controller');
const auth = require('../middleware/auth.middleware');

// 🔥 protected route
router.post('/create', auth, createShort);
router.get('/my-urls', auth, getMyUrls);

router.get('/:shortId', redirect);

module.exports = router;