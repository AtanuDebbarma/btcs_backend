const cloudinary = require('../services/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Use memory storage for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

const replaceCarouselImage = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Upload failed', error: err });
    }

    const { public_id } = req.body;
    const fileBuffer = req.file?.buffer;

    if (!public_id || !fileBuffer) {
      return res.status(400).json({ success: false, message: 'public_id and file are required' });
    }

    try {
      // Delete the old image
      await cloudinary.uploader.destroy(public_id);

      // Upload the new image without specifying public_id (Cloudinary will assign one)
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({ success: false, message: 'Upload error', error });
          }

          return res.json({
            success: true,
            message: 'Image replaced with new upload',
            asset: {
              public_id: result.public_id,
              url: result.secure_url,
            },
          });
        }
      );

      // Pipe the file buffer into the upload stream
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    } catch (error) {
      console.error('Error replacing image:', error);
      return res.status(500).json({ success: false, message: 'Server error', error });
    }
  });
};

module.exports = { replaceCarouselImage };
