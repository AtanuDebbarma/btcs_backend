const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const protectedRoutes = require('./routes/protected');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const {logErrorToDatabase} = require('./helpers');
const {rateLimiter} = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_LOCAL,
  process.env.FRONTEND_VERCEL,
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('CORS Origin Attempt:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log unauthorized attempts using serverAttempt flag
      logErrorToDatabase({
        controllerName: 'CORS',
        errorContext: 'Unauthorized CORS Attempt',
        errorDetails: {
          message: `Blocked origin: ${origin}`,
          name: 'CORS Violation',
        },
        serverAttempt: true, // This will log to the unauthorsizedAttempt path
      });
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_, res) => res.send('Firebase Auth Backend Running!'));

app.use('/api/protected', rateLimiter, protectedRoutes);
app.use('/api/cloudinary', rateLimiter, cloudinaryRoutes);

// ✅ Export app for Vercel (serverless environment)
module.exports = app;

// ✅ Local development: run server with `node index.js`
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
