const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// a copy of authenticateJWY
const jwt = require('jsonwebtoken');
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

// create the capsule route
router.post('/create_capsule', authenticateJWT, async (req, res) => {
  let { title, description, unlockDate, members } = req.body;
  if (!title || !description || !unlockDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const db = req.app.locals.db;
  const capsulesCollection = db.collection("capsules");
  const usersCollection = db.collection("users")

  try {
    // Include the creator to the members
    if (!members.includes(req.user.email)) {
      members.push(req.user.email);
    }

    // Check if all emails in the members array exist in the users collection
    const userEmails = await usersCollection.find({ email: { $in: members } }).toArray();
    const existingEmails = userEmails.map(user => user.email);

    // If any member email is not found in the users collection, return an error message
    const invalidMembers = members.filter(email => !existingEmails.includes(email));
    if (invalidMembers.length > 0) {
      alert("Not all members are signed up: ${invalidMembers.join(', ')}")
      return res.status(400).json({ message: `Not all members are signed up: ${invalidMembers.join(', ')}` });
    }

    // Add new capsule
    const result = await capsulesCollection.insertOne({
      title,
      description,
      unlockDate: new Date(unlockDate),
      members,
      createdAt: new Date(),
      isSealed: false
    });

    const capsuleId = result.insertedId;

    // Update the users collection by adding the capsule ObjectId to the capsules field for each user in the members array
    await Promise.all(
      members.map(async (email) => {
        await usersCollection.updateOne(
          { email }, // Find the user by email
          { $push: { capsules: capsuleId } } // Add the capsule ObjectId to the capsules field
        );
      })
    );

    return res.status(201).json({ message: 'Capsule created successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating capsule', error });
  }
});


// get all capsules route
router.get('/get_all_capsules', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const capsulesCollection = db.collection("capsules");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: req.user.id })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const capsuleIds = user.capsules; // Assuming 'capsules' is an array of ObjectId(s)
    if (!capsuleIds || capsuleIds.length === 0) {
      return res.status(404).json({ message: "No capsules found for this user" });
    }
    
    // Query the 'capsules' collection to get detailed information about each capsule
    const userCapsules = await capsulesCollection.find({ _id: { $in: capsuleIds } }).toArray();
    if (!userCapsules || userCapsules.length === 0) {
      return res.status(404).json({ message: "No capsule details found" });
    }
    
    // Send the capsules information as the response
    res.json(userCapsules);

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
