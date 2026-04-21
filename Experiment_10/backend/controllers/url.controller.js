const Url = require('../models/url.model');
const User = require('../models/user.model');
// const redis = require('../config/redis');
const generateId = require('../utils/snowflake');

// CREATE SHORT URL
exports.createShort = async (req, res) => {
  try {
    const { longUrl, customAlias, expiresAt } = req.body;

    if (!longUrl || typeof longUrl !== 'string' || longUrl.trim() === '') {
      return res.status(400).json({ msg: "Valid longUrl is required" });
    }

    let shortId;
    let isCustom = false;

    // custom URL (premium logic)
    if (customAlias) {
      if (!req.user) {
        return res.status(401).json({ msg: "Authentication required for custom URLs" });
      }
      const user = await User.findByPk(req.user.id);

      if (!user || !user.premium) {
        return res.status(403).json({ msg: "Only premium users can use custom URL" });
      }

      if (!customAlias || typeof customAlias !== 'string' || customAlias.trim() === '') {
        return res.status(400).json({ msg: "Valid custom shortId is required" });
      }

      shortId = customAlias.trim();
      isCustom = true;

      const exists = await Url.findOne({ where: { shortId } });
      if (exists) {
        return res.status(400).json({ msg: "Custom URL already exists" });
      }

    } else {
      // random shortId
      shortId = Math.random().toString(36).substring(2, 8);
    }

    const newUrl = await Url.create({
      shortId,
      longUrl: longUrl.trim(),
      expiry: expiresAt,
      userId: req.user ? req.user.id : null,
      isCustom
    });

    res.json({
      id: newUrl.id,
      shortCode: newUrl.shortId,
      shortUrl: `http://localhost:8000/api/url/${newUrl.shortId}`,
      longUrl: newUrl.longUrl,
      createdAt: newUrl.createdAt,
      expiresAt: newUrl.expiry,
      customAlias: newUrl.isCustom ? newUrl.shortId : undefined
    });

  } catch (err) {
    console.error('URL creation error:', err);
    res.status(500).json({ error: err.message });
  }
};


// GET MY URLS
exports.getMyUrls = async (req, res) => {
  try {
    const urls = await Url.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    const formattedUrls = urls.map(url => ({
      id: url.id,
      shortCode: url.shortId,
      shortUrl: `http://localhost:8000/api/url/${url.shortId}`,
      longUrl: url.longUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiry,
      customAlias: url.isCustom ? url.shortId : undefined
    }));
    
    res.json(formattedUrls);
  } catch (err) {
    console.error('Get my URLs error:', err);
    res.status(500).json({ error: err.message });
  }
};

// REDIRECT
exports.redirect = async (req, res) => {
  try {
    const { shortId } = req.params;

    // // 1. Check Redis first
    // let longUrl = await redis.get(shortId);

    // if (longUrl) {
    //   return res.redirect(302, longUrl);
    // }

    // 2. Check DB
    const url = await Url.findOne({ where: { shortId } });

    if (!url) return res.status(404).send("Not found");

    // 3. Expiry check
    if (url.expiry && new Date() > url.expiry) {
      return res.status(410).send("Link expired");
    }

    // 4. Store in Redis (with TTL)
    // await redis.setEx(shortId, 3600, url.longUrl);

    return res.redirect(302, url.longUrl);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};