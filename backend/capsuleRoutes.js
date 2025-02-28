const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

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
    unlockDate: new Date(unlockDate),
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

// get a capsule by ID
router.get('/get_capsule/:capsuleId', async (req, res) => {
  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");

  const {capsuleId} = req.params;
  if (!ObjectId.isValid(capsuleId)) {
    return res.status(400).json({ message: 'Invalid capsule ID' });
  }

  try {
    const objectId = new ObjectId(capsuleId.toString());
    const capsule = await capsulesCollection.findOne({ _id: objectId });

    if (!capsule) {
        return res.status(404).json({ message: 'Capsule not found.' });
    }
    // Return the capsule
    return res.status(200).json(capsule);

  } catch (error) {
      console.error("Error retrieving capsule:", error);
      return res.status(500).json({ message: 'Failed to retrieve capsule.' });
  }
});


router.get("/capsule/:capsuleId", async (req, res) => {
  try {
      const capsuleId = req.params.capsuleId;
      const capsule = await db.collection("capsules").findOne({ _id: new ObjectId(capsuleId) });

      if (!capsule) {
          return res.status(404).json({ message: "Capsule not found" });
      }

      res.json(capsule);
  } catch (error) {
      console.error("Error fetching capsule details:", error);
      res.status(500).json({ message: "Error fetching capsule details" });
  }
});


// seal capsule
router.post('/seal_capsule', async (req, res) => {
  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");
  
  const {capsuleId} = req.body;
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
