const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const protectedRoutes = require('./routes/protected');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const {
  adminRateLimiter,
  uploadRateLimiter,
} = require('./middleware/rateLimiter');
const {
  geoLocationBlock,
  validateRequestSize,
  securityLogger,
} = require('./middleware/security');
const {logger} = require('./utils/logger');

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// In production, exclude localhost to prevent bypass attempts
const allowedOrigins = [
  !isProduction ? process.env.FRONTEND_LOCAL : null, // Only allow localhost in development
  process.env.FRONTEND_VERCEL,
  process.env.FRONTEND_DNS,
  process.env.FRONTEND_ROOT,
].filter(Boolean); // Remove undefined/null values

// Log allowed origins for security audit
logger.info(
  `[CORS] Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`,
);
logger.info(`[CORS] Allowed origins:`, allowedOrigins);

// Custom CORS middleware for better security
const customCors = (req, res, next) => {
  const origin = req.headers.origin;

  // Reject all requests without origin (no exceptions)
  if (!origin) {
    logger.error('[CORS] Rejecting request with no origin:', req.url);
    res.status(403).json({error: 'CORS Not Allowed - No Origin'});
    return;
  }

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  } else {
    logger.error('[CORS] Unauthorized attempt from:', origin);
    res.status(403).json({error: 'CORS Not Allowed'});
  }
};

// Configure Express to trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for API-only backend
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);
app.use(customCors);
app.use(securityLogger);
app.use(geoLocationBlock);

// Health check endpoints
app.get('/', (_, res) => {
  try {
    res.send('BTCS Firebase Auth Backend Running!');
  } catch (error) {
    logger.error('Root endpoint error:', error);
    res.status(500).json({error: 'Root endpoint failed'});
  }
});

app.get('/health', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Apply route-specific security and rate limiting
app.use(
  '/api/protected',
  validateRequestSize(500), // 500KB max for admin operations
  express.json({limit: '500kb'}),
  adminRateLimiter,
  protectedRoutes,
);

app.use(
  '/api/cloudinary',
  validateRequestSize(5120), // 5MB max for file uploads
  express.json({limit: '5mb'}),
  uploadRateLimiter,
  cloudinaryRoutes,
);

// ✅ Export app for Vercel (serverless environment)
module.exports = app;

// ✅ Local development: run server with `node index.js`
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => logger.log(`BTCS Backend running on port ${PORT}`));
}
