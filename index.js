const express = require('express');
const cors = require('cors');

const helmet = require('helmet');
const dotenv = require('dotenv');
const protectedRoutes = require('./routes/protected');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const {rateLimiter} = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_LOCAL,
  process.env.FRONTEND_VERCEL,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('[CORS] Unauthorized attempt from:', origin);
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({limit: '10mb'})); // Prevent large payload attacks

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
