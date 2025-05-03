const express = require('express');
const {authenticateFirebaseToken} = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateFirebaseToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: 'Unauthorized'});
  }
  res.json({
    message: `Hello ${req.user.name}, you're authenticated!`,
    success: true,
  });
});

module.exports = router;
