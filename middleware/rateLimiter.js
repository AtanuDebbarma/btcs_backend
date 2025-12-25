// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General rate limiter for educational content
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Reasonable for educational site
  message: 'Too many requests from this IP, please try again later.',
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

// Strict rate limiter for admin operations
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Strict limit for admin operations
  message: 'Too many admin requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      success: false,
      error: 'Admin rate limit exceeded. Please try again later.',
      time: new Date().toISOString(),
    });
  },
});

// Upload rate limiter for file operations
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Moderate limit for uploads
  message: 'Too many upload requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalRateLimiter,
  adminRateLimiter,
  uploadRateLimiter,
  rateLimiter: generalRateLimiter, // Backward compatibility
};
