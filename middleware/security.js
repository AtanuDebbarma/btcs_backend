const {logger} = require('../utils/logger');

/**
 * Geolocation middleware to block non-Indian requests
 * Educational institutions should primarily serve local students
 */
const geoLocationBlock = (req, res, next) => {
  try {
    const vercelCountry = req.headers['x-vercel-ip-country'];
    const cfCountry = req.headers['cf-ipcountry'];
    const xCountry = req.headers['x-country-code'];

    const country = vercelCountry || cfCountry || xCountry;

    // Block non-Indian requests for educational content
    if (country && country.toUpperCase() !== 'IN') {
      logger.production(`GEO-BLOCK: ${country} from ${req.ip}`);
      res.status(403).json({
        success: false,
        error:
          'Service not available in this region. This educational service is only available in India.',
        code: 'GEO_RESTRICTED',
      });
      return;
    }

    // Only log in development
    logger.log(
      `[GEO-CHECK] Request allowed - Country: ${country || 'Unknown'}, IP: ${req.ip}`,
    );
    next();
  } catch (error) {
    logger.error('[GEO-BLOCK] Error in geolocation check:', error);
    next(); // Fail-open for availability
  }
};

/**
 * Request size validation middleware
 */
const validateRequestSize = maxSizeKB => {
  return (req, res, next) => {
    try {
      const contentLength = parseInt(req.headers['content-length'] || '0');
      const maxSizeBytes = maxSizeKB * 1024;

      if (contentLength > maxSizeBytes) {
        logger.production(
          `SIZE-BLOCK: ${contentLength}b > ${maxSizeBytes}b from ${req.ip}`,
        );
        res.status(413).json({
          success: false,
          error: `Request too large. Maximum allowed size is ${maxSizeKB}KB.`,
          code: 'REQUEST_TOO_LARGE',
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('[SIZE-CHECK] Error in request size validation:', error);
      next();
    }
  };
};

/**
 * Enhanced security logging middleware - minimal in production
 */
const securityLogger = (req, res, next) => {
  const startTime = Date.now();

  // Only log in development or for errors
  logger.log(`[SECURITY] ${req.method} ${req.path} - IP: ${req.ip}`);

  // Override res.json to log only errors in production
  const originalJson = res.json;
  res.json = function (body) {
    const duration = Date.now() - startTime;

    // Only log errors and security events
    if (body && (body.success === false || res.statusCode >= 400)) {
      logger.production(
        `${res.statusCode} ${req.method} ${req.path} (${duration}ms) - ${body.error || 'Unknown'}`,
      );
    }

    return originalJson.call(this, body);
  };

  next();
};

module.exports = {
  geoLocationBlock,
  validateRequestSize,
  securityLogger,
};
