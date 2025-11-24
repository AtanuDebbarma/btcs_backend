const {adminAuth} = require('../services/firebaseAdmin');

async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Missing or invalid token'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    const adminEmails = [process.env.ADMIN_EMAIL1, process.env.ADMIN_EMAIL2];

    const email = decodedToken.email;

    if (!adminEmails.includes(email)) {
      console.error('[AUTH] Unauthorized admin attempt:', email);
      return res.status(403).json({message: 'Access denied: not admin'});
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    res.status(403).json({message: 'Token verification failed', error});
  }
}

module.exports = {authenticateFirebaseToken};
