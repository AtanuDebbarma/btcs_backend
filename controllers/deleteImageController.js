// controllers/cloudinaryController.js
const cloudinary = require('../services/cloudinary');

/**
 * Deletes a Cloudinary asset by public_id.
 */
const deleteCarouselImage = async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) {
        return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    try {
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            return res.json({ success: true, message: 'Image deleted successfully' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to delete image', result });
        }
    } catch (error) {
        console.error('Cloudinary deletion error:', error);
        return res.status(500).json({ success: false, message: 'Error deleting image', error });
    }
};

module.exports = { deleteCarouselImage };
