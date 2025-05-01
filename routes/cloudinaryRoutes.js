// routes/cloudinary.js
const express = require('express');
const {authenticateFirebaseToken} = require('../middleware/auth');
const {deleteFile} = require('../controllers/deleteFileController');
const {replaceImage} = require('../controllers/updateImage');
const {addImage} = require('../controllers/addImage');
const {addPDF} = require('../controllers/addPDF');
const {replacePDF} = require('../controllers/replacePDF');

const router = express.Router();

router.use(authenticateFirebaseToken); // applies to all routes

router.post('/deleteFile', deleteFile);
router.post('/replace', replaceImage);
router.post('/add', addImage);
router.post('/addPDF', addPDF);
router.post('/replacePDF', replacePDF);

module.exports = router;
