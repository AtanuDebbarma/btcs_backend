// controllers/cloudinaryController.js
const cloudinary = require('../services/cloudinary');
const {logErrorToDatabase} = require('../helpers');

/**
 * Deletes a Cloudinary asset by public_id.
 */
const deleteFile = async (req, res) => {
  const {public_id} = req.body;

  if (!public_id) {
    await logErrorToDatabase({
      controllerName: 'deleteFile',
      errorContext: 'public_id is required',
    });
    return res
      .status(400)
      .json({success: false, message: 'public_id is required'});
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return res.json({success: true, message: 'file deleted successfully'});
    } else {
      await logErrorToDatabase({
        controllerName: 'deleteFile',
        errorContext: 'Failed to delete file',
      });
      return res
        .status(500)
        .json({success: false, message: 'Failed to delete file', result});
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    await logErrorToDatabase({
      controllerName: 'deleteFile',
      errorContext: 'ServerError',
      errorDetails: error,
    });
    return res
      .status(500)
      .json({success: false, message: 'Server error:', error});
  }
};

module.exports = {deleteFile};
