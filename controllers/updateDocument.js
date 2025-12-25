const admin = require('firebase-admin');
const {logger} = require('../utils/logger');

const updateDocument = async (req, res) => {
  const {collectionName, docId, documentData} = req.body;

  if (!collectionName || !docId || !documentData) {
    logger.error('[updateDocument] Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'collectionName, docId, and documentData are required',
    });
  }

  try {
    // Get Firestore instance
    const db = admin.firestore();

    // Query to find the document with matching 'id' field
    const querySnapshot = await db
      .collection(collectionName)
      .where('id', '==', docId)
      .get();

    if (querySnapshot.empty) {
      logger.error('[updateDocument] No document found with id:', docId);
      return res.status(404).json({
        success: false,
        message: 'No document found with this id',
      });
    }

    // Get the first matching document
    const docRef = querySnapshot.docs[0].ref;

    // Update the document
    await docRef.update({
      ...documentData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      success: true,
      message: 'Document updated successfully',
    });
  } catch (error) {
    logger.error('[updateDocument] Server error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Server error', error});
  }
};

module.exports = {updateDocument};
