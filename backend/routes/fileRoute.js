const express = require('express');
const router = express.Router();
const parser = require('../upload');
const File = require('../models/fileModel');

// Upload file + save data in MongoDB
router.post('/upload', parser.single('file'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const fileUrl = req.file.path; // Cloudinary URL

    const newFile = new File({ name, description, fileUrl });
    await newFile.save();

    res.status(200).json({ message: "File uploaded successfully", file: newFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all files
router.get('/', async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download file (redirect to Cloudinary URL)
// router.get('/download/:id', async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     if (!file) return res.status(404).json({ message: "File not found" });

//     res.redirect(file.fileUrl);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
