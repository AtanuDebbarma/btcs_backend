const cloudinary = require('../services/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');
const {logErrorToDatabase} = require('../helpers');

// Use memory storage for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({storage}).single('file');

const replaceImage = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      await logErrorToDatabase({
        controllerName: 'replaceImage',
        errorContext: 'multer upload error',
        errorDetails: err,
      });
      return res
        .status(500)
        .json({success: false, message: 'Upload failed', error: err});
    }

    const {public_id, folderName} = req.body;
    const fileBuffer = req.file?.buffer;

    if (!public_id || !fileBuffer || !folderName) {
      await logErrorToDatabase({
        controllerName: 'replaceImage',
        errorContext: 'public_id, folder name and file are required',
      });
      return res.status(400).json({
        success: false,
        message: 'public_id, folder name and file are required',
      });
    }

    try {
      // Delete the old image
      const deleteImage = await cloudinary.uploader.destroy(public_id);

      if (deleteImage.result !== 'ok') {
        console.error('Failed to delete image:', deleteImage);
        await logErrorToDatabase({
          controllerName: 'replaceImage',
          errorContext: 'Failed to delete image',
        });
        return res
          .status(500)
          .json({success: false, message: 'Failed to delete image'});
      }

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
              controllerName: 'replaceImage',
              errorContext: 'Upload error',
              errorDetails: error,
            });
            return res
              .status(500)
              .json({success: false, message: 'Upload error', error});
          }

          return res.json({
            success: true,
            message: 'Image replaced with new upload',
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
      console.error('Server error', error);
      await logErrorToDatabase({
        controllerName: 'replaceImage',
        errorContext: 'Server error',
        errorDetails: error,
      });
      return res
        .status(500)
        .json({success: false, message: 'Server error', error});
    }
  });
};

module.exports = {replaceImage};
