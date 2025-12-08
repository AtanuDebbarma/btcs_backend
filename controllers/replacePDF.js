const cloudinary = require('../services/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Use memory storage for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({storage}).single('file');

const replacePDF = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('[replacePDF] Multer error:', err);
      return res
        .status(500)
        .json({success: false, message: 'PDF Upload failed', error: err});
    }

    const {public_id, folderName} = req.body;
    const fileBuffer = req.file?.buffer;

    if (!public_id || !fileBuffer || !folderName) {
      console.error('[replacePDF] Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'public_id, foldername and file are required',
      });
    }

    try {
      // Try deleting old PDF with timeout
      try {
        await Promise.race([
          cloudinary.uploader.destroy(public_id, {resource_type: 'image'}),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Delete timeout')), 10000),
          ),
        ]);
      } catch {
        // Try as raw if image fails
        try {
          await Promise.race([
            cloudinary.uploader.destroy(public_id, {resource_type: 'raw'}),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Delete timeout')), 10000),
            ),
          ]);
        } catch {
          // Continue with upload even if delete fails
        }
      }

      // Upload the new PDF
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          format: 'pdf',
          folder: folderName,
          transformation: [{quality: 90}],
        },
        (error, result) => {
          if (error) {
            console.error('[replacePDF] Cloudinary upload error:', error);
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
      console.error('[replacePDF] Server error:', error);
      return res
        .status(500)
        .json({success: false, message: 'Server error', error});
    }
  });
};

module.exports = {replacePDF};
