const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');

// Configure Multer for file uploads (memory storage example)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a PDF
router.post('/capsules/:id/upload-pdf', upload.single('pdf'), async (req, res) => {
    const db = req.app.locals.db;
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const capsuleId = req.params.id;
        const uploadStream = bucket.openUploadStream(`${capsuleId}.pdf`, {
            metadata: { capsuleId }
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', async () => {
            await db.collection('capsules').updateOne(
                { _id: new ObjectId(capsuleId) },
                { $set: { pdfContent: `${capsuleId}.pdf` } }
            );

            res.status(200).json({ message: 'PDF uploaded successfully.' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error uploading PDF.', error });
    }
});

module.exports = router;
