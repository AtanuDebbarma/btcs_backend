// routes/cloudinary.js
const express = require('express');
const {authenticateFirebaseToken} = require('../middleware/auth');
const {deleteCarouselImage} = require('../controllers/deleteImageController');
const {replaceCarouselImage} = require('../controllers/updateCarouselImage');
const {addCarouselImage} = require('../controllers/addCarouselImage');

const router = express.Router();

router.use(authenticateFirebaseToken); // applies to all routes

router.post('/delete', deleteCarouselImage);
router.post('/replace', replaceCarouselImage);
router.post('/add', addCarouselImage);

// future:
// router.post('/upload', uploadImage);
// router.post('/rename', renameAsset);

module.exports = router;
