const admin = require('firebase-admin');

const addDocument = async (req, res) => {
  const {collectionName, documentData} = req.body;

  if (!collectionName || !documentData) {
    console.error('[addDocument] Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'collectionName and documentData are required',
    });
  }

  try {
    // Get Firestore instance
    const db = admin.firestore();

    // Add document with auto-generated ID
    const docRef = await db.collection(collectionName).add({
      ...documentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Get the created document
    const docSnap = await docRef.get();
    const createdData = {
      id: docRef.id,
      ...docSnap.data(),
    };

    return res.json({
      success: true,
      message: 'Document added successfully',
      data: createdData,
    });
  } catch (error) {
    console.error('[addDocument] Server error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Server error', error});
  }
};

module.exports = {addDocument};
