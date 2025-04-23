const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const protectedRoutes = require('./routes/protected');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');

dotenv.config();

const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_, res) => res.send('Firebase Auth Backend Running!'));

app.use('/api/protected', protectedRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
