const express = require('express');
const router = express.Router();

// create the capsule route
router.post('/create_capsule', async (req, res) => {
  const { title, description, unlockDate, members } = req.body;
  if (!title || !description || !unlockDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");

  const result = await capsulesCollection.insertOne({
    title,
    description,
    unlockDate: new Date(unlockDate), // Convert to Date object
    members,
    createdAt: new Date(),
    isSealed: false
  });

  return res.status(201).json({ message: 'Capsule created successfully!' });
});


// get all capsules route
router.get('/get_all_capsules', async (req, res) => {
  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");

  try {
    const capsules = await capsulesCollection.find({}).toArray();
    return res.status(200).json(capsules);

  } catch (error) {
    console.error("Error retrieving capsules:", error);
    return res.status(500).json({ message: 'Failed to retrieve capsules.' });
  }
});


// seal capsule
router.post('/seal_capsule', async (req, res) => {
  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");
  
  const { capsuleId} = req.body;
  if (!capsuleId) {
    return res.status(400).json({ message: 'capsuleId is required.' });
  }

  try {
    const objectId = new ObjectId(capsuleId.toString());
    const result = await capsulesCollection.updateOne(
      { _id: objectId },
      { $set: { isSealed: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Capsule not found or already sealed.' });
    }

    return res.status(200).json({ message: 'Capsule sealed status updated successfully!' });

  } catch (error) {
    console.error("Error updating isSealed:", error);
    return res.status(500).json({ message: 'Failed to seal capsule.' });
  }
});

module.exports = router;
