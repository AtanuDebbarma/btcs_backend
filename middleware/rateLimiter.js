// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      time: new Date().toISOString(),
    });
  },
});

module.exports = {rateLimiter};
