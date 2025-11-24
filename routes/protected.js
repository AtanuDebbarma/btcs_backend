const express = require('express');
const {authenticateFirebaseToken} = require('../middleware/auth');
const {updateText} = require('../controllers/updateText');
const {addDocument} = require('../controllers/addDocument');
const {updateDocument} = require('../controllers/updateDocument');
const {deleteDocument} = require('../controllers/deleteDocument');

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

router.post('/updateText', authenticateFirebaseToken, updateText);
router.post('/addDocument', authenticateFirebaseToken, addDocument);
router.post('/updateDocument', authenticateFirebaseToken, updateDocument);
router.post('/deleteDocument', authenticateFirebaseToken, deleteDocument);

module.exports = router;
