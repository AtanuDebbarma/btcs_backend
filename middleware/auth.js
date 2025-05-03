const {adminAuth} = require('../services/firebaseAdmin');
const {logErrorToDatabase} = require('../helpers');

async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Missing or invalid token'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (decodedToken.email !== adminEmail) {
      console.log('Access denied: not admin');
      logErrorToDatabase({
        controllerName: 'admin',
        errorContext: 'Unauthorized Admin Attempt',
        errorDetails: {
          message: `Unauthorized Admin Attempt`,
          name: 'Admin Violation',
        },
        adminFail: true,
      });
      return res.status(403).json({message: 'Access denied: not admin'});
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log('Token verification failed', error);
    logErrorToDatabase({
      controllerName: 'admin',
      errorContext: 'Unauthorized Admin Attempt',
      errorDetails: {
        message: `Unauthorized Admin Attempt ${error}`,
        name: 'Admin Violation',
      },
      adminFail: true,
    });
    res.status(403).json({message: 'Token verification failed', error});
  }
}

module.exports = {authenticateFirebaseToken};
