const {adminAuth} = require('../services/firebaseAdmin');

async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Missing or invalid token'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({message: 'Token verification failed', error});
  }
}

module.exports = {authenticateFirebaseToken};
