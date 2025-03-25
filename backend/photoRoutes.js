// photoRoutes.js
const express = require("express");
const multer = require("multer");
const { ObjectId, GridFSBucket } = require("mongodb");

const router = express.Router();

// Use memory storage so req.file.buffer is available
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    if (!['jpg', 'jpeg'].includes(ext)) {
      return res.status(400).send("Only .jpg or .jpeg files are allowed.");
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
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

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

module.exports = router;
