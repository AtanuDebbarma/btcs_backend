const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../services/cloudinary');
const {logger} = require('../utils/logger');

// Use memory storage for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({storage}).single('file');

const addPDF = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      logger.error('[addPDF] Multer upload error:', err);
      return res
        .status(500)
        .json({success: false, message: 'Upload failed', error: err});
    }
    const {folderName} = req.body;
    const fileBuffer = req.file?.buffer;

    if (!fileBuffer || !folderName) {
      logger.error('[addPDF] Missing required fields');
      return res
        .status(400)
        .json({success: false, message: 'File and folder name is required'});
    }

    try {
      // Upload the new image without specifying public_id (Cloudinary will assign one)
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          format: 'pdf',
          folder: folderName,
          transformation: [{quality: 90}],
        },
        (error, result) => {
          if (error) {
            logger.error('[addPDF] Upload error:', error);
            return res
              .status(500)
              .json({success: false, message: 'Upload error', error});
          }

          return res.json({
            success: true,
            message: 'PDF uploaded successfully',
            asset: {
              public_id: result.public_id,
              url: result.secure_url,
            },
          });
        },
      );

      // Pipe the file buffer into the upload stream
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    } catch (error) {
      logger.error('[addPDF] Server error:', error);
      return res
        .status(500)
        .json({success: false, message: 'Server error', error});
    }
  });
};

module.exports = {addPDF};
