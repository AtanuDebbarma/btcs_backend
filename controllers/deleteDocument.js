const admin = require('firebase-admin');

const deleteDocument = async (req, res) => {
  const {collectionName, docId} = req.body;

  if (!collectionName || !docId) {
    console.error('[deleteDocument] Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'collectionName and docId are required',
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
      console.error('[deleteDocument] No document found with id:', docId);
      return res.status(404).json({
        success: false,
        message: 'No document found with this id',
      });
    }

    // Delete the first matching document
    const docRef = querySnapshot.docs[0].ref;
    await docRef.delete();

    return res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('[deleteDocument] Server error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Server error', error});
  }
};

module.exports = {deleteDocument};
