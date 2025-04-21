const express = require('express');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');
const pdfParse = require('pdf-parse');
// If you still want to protect these routes, uncomment and use your JWT middleware
const jwt = require('jsonwebtoken');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Example of JWT middleware if you want to protect the route
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

/**
 * Upload PDF Route
 * - Stores PDF in GridFS under "pdfs" bucket
 * - Only requires `title` and `file`
 */
router.post(
  '/upload-pdf',
  authenticateJWT, // <- Uncomment if you want to require auth
  upload.single('file'),
  async (req, res) => {
    console.log("BODY:", req.body);
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

    try {
      const { title, capsuleId, envelopeColor, flapColor } = req.body;
      const userName = req.user.name;
      const userId = req.user.id;

      const capsuleObjectId = new ObjectId(capsuleId);

      console.log("username " + userName);
      if (!req.file || !title) {
        return res.status(400).json({ message: 'File and title are required.' });
      }

      // Create a new upload stream in GridFS
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: {
          title,
          userId,
          userName,
          envelopeColor,
          flapColor,
          capsuleId: capsuleObjectId
        }
      });

      // Write the file buffer to GridFS
      uploadStream.end(req.file.buffer);

      // Listen for the "finish" event to signal upload completion
      uploadStream.on('finish', () => {
        return res
          .status(200)
          .json({ message: 'PDF uploaded successfully.', fileId: uploadStream.id });
      });

      uploadStream.on('error', (err) => {
        console.error('GridFS Error:', err);
        return res.status(500).json({ message: 'Error uploading file to GridFS', err });
      });

    } catch (error) {
      console.error("Error uploading PDF:", error);
      return res.status(500).json({ message: 'Error uploading PDF.', error });
    }
  }
);

/**
 * Get All PDFs Route
 * - Retrieves all PDFs' metadata from "pdfs.files"
 */
router.get('/get-all-pdfs', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const files = await db.collection('pdfs.files').find({}).toArray();
    return res.status(200).json(files);
  } catch (error) {
    console.error("Error retrieving PDFs:", error);
    return res.status(500).json({ message: 'Failed to retrieve PDFs.', error });
  }
});

router.get('/download-pdf/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

    const fileId = new ObjectId(req.params.id);

    // Optional: Set headers for file download
    res.set('Content-Type', 'application/pdf');
    // If you want the browser to force download:
    // res.set('Content-Disposition', 'attachment; filename="letter.pdf"');

    // Pipe the file to the response
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('error', (err) => {
      console.error('Download Stream Error:', err);
      return res.status(404).json({ message: 'File not found.' });
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('Error retrieving PDF:', error);
    return res.status(500).json({ message: 'Error retrieving PDF.', error });
  }
});


router.get("/get-user-pdfs", authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

    const userId = req.user.id; // Extract user ID from token
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find all PDFs uploaded by this user
    const cursor = bucket.find({ "metadata.userId": userId });
    const pdfs = await cursor.toArray();

    res.json(pdfs); // Return all PDFs metadata for this user
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Error fetching PDFs", error });
  }
});

router.get('/get-pdfs-by-capsule/:capsuleId', async (req, res) => {
  try {
    const db = req.app.locals.db; // Get the database instance
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

    const capsuleId = req.params.capsuleId;

    // Validate if capsuleId is a valid ObjectId
    if (!ObjectId.isValid(capsuleId)) {
      return res.status(400).json({ message: "Invalid capsule ID" });
    }

    // Query PDFs where metadata.capsuleId matches the given capsuleId
    const files = await db.collection('pdfs.files')
      .find({ "metadata.capsuleId": new ObjectId(capsuleId) })
      .toArray();

    if (!files.length) {
      return res.status(404).json({ message: "No PDFs found for this capsule" });
    }

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching PDFs by capsule ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/pdf/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });
    const objectId = new ObjectId(req.params.id);

    const downloadStream = bucket.openDownloadStream(objectId);

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'inline'); // 'attachment' for download
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(404).send('PDF not found.');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving PDF.');
  }
});

// Express route to stream PDF by its ObjectId
router.get('/pdf/:id/preview', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });
    const objectId = new ObjectId(req.params.id);

    // Open a download stream
    const downloadStream = bucket.openDownloadStream(objectId);

    // Accumulate the PDF chunks
    const chunks = [];
    downloadStream.on('data', chunk => {
      chunks.push(chunk);
    });

    downloadStream.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const parsedData = await pdfParse(pdfBuffer);

        // Extract first 3 lines of text
        const previewText = parsedData.text
          .split('\n')
          .filter(line => line.trim() !== '')
          .slice(1, 3)
          .join('\n');

        res.json({ previewText });
      } catch (err) {
        console.error('PDF parse error:', err);
        res.status(500).send('Failed to parse PDF');
      }
    });

    downloadStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(404).send('PDF not found.');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving PDF.');
  }
});

router.delete('/delete-pdf/:id', async (req, res) => {
  const db = req.app.locals.db;
  const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

  try {
    const fileId = new ObjectId(req.params.id);

    // Check if the file exists
    const file = await db.collection('pdfs.files').findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    // Delete file and associated chunks
    await bucket.delete(fileId);

    res.status(200).json({ message: "PDF deleted successfully." });
  } catch (err) {
    console.error("Error deleting PDF:", err);
    res.status(500).json({ message: "Failed to delete PDF.", error: err.message });
  }
});


module.exports = router;
