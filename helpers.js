const {adminDb} = require('./services/firebaseAdmin');

function logErrorToDatabase({
  controllerName,
  errorContext,
  errorDetails,
  serverAttempt = undefined,
  adminFail = undefined,
}) {
  const errorRef = adminDb
    .ref(`logs/errors/${controllerName || 'unknown'}`)
    .push();

  const serverRef = adminDb
    .ref(`logs/unauthorsizedAttempt/${controllerName || 'unknown'}`)
    .push();
  const adminRef = adminDb
    .ref(`logs/adminFail/${controllerName || 'unknown'}`)
    .push();

  if (serverAttempt) {
    return serverRef.set({
      timestamp: Date.now(),
      controllerName: controllerName || 'unknown',
      context: errorContext || 'unknown',
      error: {
        message: errorDetails?.message || 'Unknown error',
        name: errorDetails?.name || null,
        stack: errorDetails?.stack || null,
      },
    });
  }

  if (adminFail) {
    return adminRef.set({
      timestamp: Date.now(),
      controllerName: controllerName || 'unknown',
      context: errorContext || 'unknown',
      error: {
        message: errorDetails?.message || 'Unknown error',
        name: errorDetails?.name || null,
        stack: errorDetails?.stack || null,
      },
    });
  }

  return errorRef.set({
    timestamp: Date.now(),
    controllerName: controllerName || 'unknown',
    context: errorContext || 'unknown',
    error: {
      message: errorDetails?.message || 'Unknown error',
      name: errorDetails?.name || null,
      stack: errorDetails?.stack || null,
    },
  });
}

module.exports = {logErrorToDatabase};
