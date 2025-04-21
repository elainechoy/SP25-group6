// photoRoutes.js
const express = require("express");
const multer = require("multer");
const { ObjectId, GridFSBucket } = require("mongodb");

const router = express.Router();

// Use memory storage so req.file.buffer is available
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

router.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'photoUploads' });

    // Extract fields from req.body
    const { title, capsuleId } = req.body;

    // Validate
    if (!req.file) {
      return res.status(400).send("No file was uploaded.");
    }
    // Optional: check extension if you want to allow only .jpg/.jpeg
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      return res.status(400).send("Only .jpg or .jpeg or .png files are allowed.");
    }

    // If you want capsuleId as an ObjectId
    let capsuleObjectId;
    try {
      capsuleObjectId = new ObjectId(capsuleId);
    } catch (err) {
      return res.status(400).send("Invalid capsuleId");
    }

    // 1) Open an upload stream to GridFS
    //    The filename is purely internal; you can pick any string
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        title,
        capsuleId: capsuleObjectId
      }
    });

    // 2) Write the file buffer to GridFS
    uploadStream.end(req.file.buffer);

    // 3) When upload finishes, insert metadata into your 'photos' collection
    uploadStream.on('finish', async () => {
      const newPhotoMeta = {
        title,
        capsuleId: capsuleObjectId,
        filename: uploadStream.filename,  // or any name you prefer
        fileId: uploadStream.id,         // the ObjectId of the file in GridFS
        createdAt: new Date()
      };

      // Insert doc into 'photos' collection
      const photosMeta = db.collection("photos");
      await photosMeta.insertOne(newPhotoMeta);

      console.log("File uploaded to GridFS:", uploadStream.id);
      res.status(200).json({
        message: "Photo uploaded successfully!",
        file: uploadStream.filename,
        fileId: uploadStream.id
      });
    });

    // If something goes wrong during the upload
    uploadStream.on('error', (err) => {
      console.error("GridFS upload error:", err);
      res.status(500).send("Error uploading file to GridFS");
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Something went wrong.");
  }
});


// GET /api/photo/:filename → Stream a photo file from GridFS
router.get('/photo/:filename', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'photoUploads' });
    //const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

    // get the most recent file with this filename:
    const downloadStream = bucket.openDownloadStreamByName(
      req.params.filename,
      { revision: -1 }
    );
    res.set('Content-Type', 'image/jpeg');
    downloadStream.on('error', () => {
      res.status(404).send("Image not found");
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving image");
  }
});


// GET /api/get-photos-by-capsule/:capsuleId → Fetch photo metadata by capsule
router.get('/get-photos-by-capsule/:capsuleId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    // Convert capsuleId string to ObjectId
    const capsuleObjectId = new ObjectId(req.params.capsuleId);
    const photos = await db.collection('photos')
      .find({ capsuleId: capsuleObjectId })
      .toArray();
    res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).send("Failed to fetch photos");
  }
});

router.delete("/delete-photo/:id", async (req, res) => {
  const db = req.app.locals.db;
  const bucket = new GridFSBucket(db, { bucketName: "photoUploads" });

  try {
    // Convert route param to ObjectId
    const photoId = new ObjectId(req.params.id);

    // 1) Find the photo metadata in 'photos' collection
    const photoDoc = await db.collection("photos").findOne({ _id: photoId });
    if (!photoDoc) {
      return res.status(404).json({ message: "Photo not found." });
    }

    // 2) Delete the file from GridFS
    //    The stored file's ObjectId is in photoDoc.fileId
    await bucket.delete(photoDoc.fileId);

    // 3) Remove the metadata document from 'photos' collection
    await db.collection("photos").deleteOne({ _id: photoId });

    return res.status(200).json({ message: "Photo deleted successfully." });
  } catch (err) {
    console.error("Error deleting photo:", err);
    return res.status(500).json({ message: "Failed to delete photo.", error: err.message });
  }
});

//profile photo stuff

router.post('/upload-profile-image', authenticateJWT, upload.single('profileImage'), async (req, res) => {
  const db = req.app.locals.db;
  const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

  try {
    const userId = req.user.id; // from JWT

    const existingFile = await db.collection('profileImages.files').findOne({
      filename: req.file.originalname,
      'metadata.userId': userId
    });
    
    if (existingFile) {
      try {
        await db.collection('users').updateOne(
          { _id: userId },
          { $set: { profileImageId: existingFile._id } } // dynamically adds or updates this field
        );
        return res.status(200).json({
          message: 'Image already exists.',
          fileId: existingFile._id
        });
      } catch (error) {
        console.error("Error updating user with profileImageId:", error);
        res.status(500).json({ message: 'image exists already but Failed to link image to user.' });
      }
    }

    const stream = bucket.openUploadStream(req.file.originalname, {
      metadata: { userId }
    });

    stream.end(req.file.buffer);

    stream.on('finish', async () => {
      try {
        // Safely update the user's document by pushing the new image ID
        await db.collection('users').updateOne(
          { _id: userId },
          { $set: { profileImageId: stream.id } } // dynamically adds or updates this field
        );

        res.status(200).json({ message: 'Profile image uploaded.', fileId: stream.id });
      } catch (error) {
        console.error("Error updating user with profileImageId:", error);
        res.status(500).json({ message: 'Failed to link image to user.' });
      }
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Upload failed.');
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error.');
  }
});

router.get('/profile-image/:id', async (req, res) => {
  const db = req.app.locals.db;
  const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

  try {
    const fileId = req.params.id;

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    res.set('Content-Type', 'image/jpeg'); // or image/png depending on what you accept
    downloadStream.pipe(res);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Image not found' });
    });

  } catch (err) {
    console.error("Error serving image:", err);
    res.status(500).json({ message: 'Server error while fetching image' });
  }
});


module.exports = router;
