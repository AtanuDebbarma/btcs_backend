const {adminDb} = require('./services/firebaseAdmin');

function logErrorToDatabase({controllerName, errorContext, errorDetails}) {
  const errorRef = adminDb
    .ref(`logs/errors/${controllerName || 'unknown'}`)
    .push();
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
