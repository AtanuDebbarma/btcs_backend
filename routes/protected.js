const express = require('express');
const {authenticateFirebaseToken} = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateFirebaseToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.name || req.user.uid}, you're authenticated!`,
    user: req.user,
  });
});

// 🆕 POST route for receiving public_id
router.post('/', authenticateFirebaseToken, (req, res) => {
  const {public_id} = req.body;

  if (!public_id) {
    return res.status(400).json({message: 'public_id is required'});
  }

  res.json({
    message: `Received public_id: ${public_id}`,
    user: req.user.uid,
  });
});

module.exports = router;
