const cloudinary = require('../services/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');
const {logErrorToDatabase} = require('../helpers');

// Use memory storage for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({storage}).single('file');

const addImage = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      await logErrorToDatabase({
        controllerName: 'addImage',
        errorContext: 'multer upload error',
        errorDetails: err,
      });
      return res
        .status(500)
        .json({success: false, message: 'Upload failed', error: err});
    }
    const {folderName} = req.body;
    const fileBuffer = req.file?.buffer;

    if (!fileBuffer || !folderName) {
      await logErrorToDatabase({
        controllerName: 'addImage',
        errorContext: 'File and folder name is required',
      });
      return res
        .status(400)
        .json({success: false, message: 'File and folder name is required'});
    }

    try {
      // Upload the new image without specifying public_id (Cloudinary will assign one)
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          format: 'jpg',
          folder: folderName,
          transformation: [{quality: 'auto'}],
        },
        (error, result) => {
          if (error) {
            logErrorToDatabase({
              controllerName: 'addImage',
              errorContext: 'Upload error',
              errorDetails: error,
            });
            return res
              .status(500)
              .json({success: false, message: 'Upload error', error});
          }

          return res.json({
            success: true,
            message: 'Image uploaded successfully',
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
      console.error('Server error:', error);
      await logErrorToDatabase({
        controllerName: 'addImage',
        errorContext: 'Server error',
        errorDetails: error,
      });
      return res
        .status(500)
        .json({success: false, message: 'Server error', error});
    }
  });
};

module.exports = {addImage};
