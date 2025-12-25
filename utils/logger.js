/**
 * Production-optimized logger utility for BTCS backend
 * Minimal logging in production, full logging in development
 */

const isProduction = process.env.NODE_ENV === 'production';
const enableDebugLogs = process.env.ENABLE_DEBUG_LOGS === 'true';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'error' : 'debug');

const logger = {
  log: (message, ...args) => {
    // Only log in development or when debug is explicitly enabled
    if (!isProduction || enableDebugLogs) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, ...args);
    }
  },

  error: (message, ...args) => {
    // Always log errors (needed for Vercel monitoring)
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, ...args);
  },

  warn: (message, ...args) => {
    // Log warnings only if log level allows
    if (logLevel === 'debug' || logLevel === 'warn' || !isProduction) {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARN: ${message}`, ...args);
    }
  },

  info: (message, ...args) => {
    // Log info only in development or debug mode
    if (!isProduction || enableDebugLogs) {
      const timestamp = new Date().toISOString();
      console.info(`[${timestamp}] INFO: ${message}`, ...args);
    }
  },

  // Production-safe logging (always logs to Vercel, never to browser)
  production: (message, ...args) => {
    if (isProduction) {
      console.log(`[PROD] ${message}`, ...args);
    }
  },
};

module.exports = {logger};
