// routes/cloudinary.js
const express = require('express');
const {authenticateFirebaseToken} = require('../middleware/auth');
const {deleteImage} = require('../controllers/deleteImageController');
const {replaceImage} = require('../controllers/updateImage');
const {addImage} = require('../controllers/addImage');
const {replacePDF} = require('../controllers/replacePDF');

const router = express.Router();

router.use(authenticateFirebaseToken); // applies to all routes

router.post('/delete', deleteImage);
router.post('/replace', replaceImage);
router.post('/add', addImage);
router.post('/replacePDF', replacePDF);

module.exports = router;
