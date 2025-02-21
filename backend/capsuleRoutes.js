const express = require('express');
const router = express.Router();

// create the capsule route
router.post('/capsules', async (req, res) => {
  const { title, description, unlockDate, members } = req.body;
  if (!title || !description || !unlockDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");

  // Insert into MongoDB
  const result = await capsulesCollection.insertOne({
    title,
    description,
    unlockDate: new Date(unlockDate), // Convert to Date object
    members,
    createdAt: new Date(),
  });


  return res.status(201).json({ message: 'Capsule created successfully!' });
});

module.exports = router;

