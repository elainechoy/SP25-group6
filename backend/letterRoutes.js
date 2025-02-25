const express = require('express');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');
// If you still want to protect these routes, uncomment and use your JWT middleware
// const jwt = require('jsonwebtoken'); 

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Example of JWT middleware if you want to protect the route
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Forbidden" });
//     req.user = user;
//     next();
//   });
// };

/**
 * Upload PDF Route
 * - Stores PDF in GridFS under "pdfs" bucket
 * - Only requires `title` and `file`
 */
router.post(
  '/upload-pdf',
  // authenticateJWT, // <- Uncomment if you want to require auth
  upload.single('file'),
  async (req, res) => {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

    try {
      const { title } = req.body;
      if (!req.file || !title) {
        return res.status(400).json({ message: 'File and title are required.' });
      }

      // Create a new upload stream in GridFS
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: { title }
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

module.exports = router;
