const admin = require('firebase-admin');

const updateText = async (req, res) => {
  const {docId, text, collectionName} = req.body;

  if (!docId || !text || !collectionName) {
    console.error('[updateText] Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'docId, text, and collectionName are required',
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
      console.error('[updateText] No document found with id:', docId);
      return res.status(404).json({
        success: false,
        message: 'No document found with this id',
      });
    }

    // Get the first matching document
    const docRef = querySnapshot.docs[0].ref;

    // Determine field to update based on collection
    // For collegeResources, update 'url' field
    // For others, update 'text' field
    const updateField =
      collectionName === 'collegeResources' ? {url: text} : {text: text};

    // Update the document
    await docRef.update(updateField);

    return res.json({
      success: true,
      message:
        collectionName === 'collegeResources'
          ? 'URL updated successfully'
          : 'Text updated successfully',
    });
  } catch (error) {
    console.error('[updateText] Server error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Server error', error});
  }
};

module.exports = {updateText};
