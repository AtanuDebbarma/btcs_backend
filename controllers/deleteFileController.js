// controllers/cloudinaryController.js
const cloudinary = require('../services/cloudinary');
const {logger} = require('../utils/logger');

/**
 * Deletes a Cloudinary asset by public_id.
 */
const deleteFile = async (req, res) => {
  const {public_id} = req.body;

  if (!public_id) {
    logger.error('[deleteFile] Missing public_id');
    return res
      .status(400)
      .json({success: false, message: 'public_id is required'});
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return res.json({success: true, message: 'file deleted successfully'});
    } else {
      logger.error('[deleteFile] Failed to delete file:', result);
      return res
        .status(500)
        .json({success: false, message: 'Failed to delete file', result});
    }
  } catch (error) {
    logger.error('[deleteFile] Server error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Server error:', error});
  }
};

module.exports = {deleteFile};
