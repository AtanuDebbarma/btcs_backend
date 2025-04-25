const cloudinary = require('../services/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');
const {logErrorToDatabase} = require('../helpers');

// Use memory storage for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({storage}).single('file');

const replacePDF = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      await logErrorToDatabase({
        controllerName: 'replacePDF',
        errorContext: 'multer upload error',
        errorDetails: err,
      });
      return res
        .status(500)
        .json({success: false, message: 'PDF Upload failed', error: err});
    }

    const {public_id, folderName} = req.body;
    const fileBuffer = req.file?.buffer;

    if (!public_id || !fileBuffer || !folderName) {
      await logErrorToDatabase({
        controllerName: 'replacePDF',
        errorContext: 'public_id, foldername and file are required',
      });
      return res.status(400).json({
        success: false,
        message: 'public_id, foldername and file are required',
      });
    }

    try {
      // Try deleting as both image and raw
      let deleted = await cloudinary.uploader.destroy(public_id, {
        resource_type: 'image',
      });

      if (deleted.result !== 'ok') {
        deleted = await cloudinary.uploader.destroy(public_id, {
          resource_type: 'raw',
        });
      }
      if (deleted.result !== 'ok') {
        console.error('Failed to delete PDF or PDF not available:');
        await logErrorToDatabase({
          controllerName: 'replacePDF',
          errorContext: 'Failed to delete PDF or PDF not available:',
        });
        return res
          .status(500)
          .json({success: false, message: 'Failed to delete PDF', deleted});
      }

      // Upload the new PDF without specifying public_id (Cloudinary will assign one)
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Changed to raw
          format: 'pdf',
          folder: folderName,
        },
        (error, result) => {
          if (error) {
            logErrorToDatabase({
              controllerName: 'replacePDF',
              errorContext: 'PDF EDIT error',
              errorDetails: error,
            });
            return res
              .status(500)
              .json({success: false, message: 'PDF EDIT error', error});
          }

          return res.json({
            success: true,
            message: 'PDF replaced with new upload',
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
      console.error('Server Error', error);
      logErrorToDatabase({
        controllerName: 'replacePDF',
        errorContext: 'Server error',
        errorDetails: error,
      });
      return res
        .status(500)
        .json({success: false, message: 'Server error', error});
    }
  });
};

module.exports = {replacePDF};
