const express = require('express');
const router = express.Router();
const parser = require('../upload');
const File = require('../models/fileModel');
const milestone=require('../models/milestoneModel');

// Upload file + save data in MongoDB
router.post('/upload', parser.single('file'), async (req, res) => {
  try {
    const { name, description,DocumentType } = req.body;
    const fileUrl = req.file.path; // Cloudinary URL

    const newFile = new File({ name, description, fileUrl,DocumentType });
    await newFile.save();



    res.status(200).json({ message: "File uploaded successfully", file: newFile });
        console.log(".........",DocumentType)
    console.log(".........",description)
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
router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.redirect(file.fileUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Upload file for milestone
// router.post('/milestone/upload', parser.single('file'), async (req, res) => {
//   try {
//     const { type } = req.body; // example: Demand Letter
//     const fileUrl = req.file.path;

//     if (!fileUrl) return res.status(400).json({ message: "File not uploaded" });

//     const newFile = {
//       type,
//       fileUrl
//     };

//     const updatedMilestone = await milestone.findOneAndUpdate(
//       { $push: { files: newFile } },
//       { new: true }
//     );

//     if (!updatedMilestone) return res.status(404).json({ message: "Milestone not found" });

//     res.status(200).json({
//       message: "File added to milestone",
//       milestone: updatedMilestone
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Add Milestone + Upload Multiple Files
router.post('/add-milestone', parser.single('files'), async (req, res) => {
  try {
    const { title, amount, status, dueDate } = req.body;
      console.log(req.files);

    // converting uploaded files into schema format
     const uploadedFiles = req.file ? [{
      type: req.file.mimetype,
      fileUrl: req.file.path
    }] : [];

    const newMilestone = new milestone({
      title,
      amount,
      status,
      dueDate,
      files: uploadedFiles
    });

    await newMilestone.save();

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: newMilestone
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating milestone",
      error
    });
  }
});

router.get('/download/:milestoneId/:fileId', async (req, res) => {
  try {
    const { milestoneId, fileId } = req.params;

    const milestoneData = await milestone.findById(milestoneId);
    if (!milestoneData) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    const fileData = milestoneData.files.id(fileId);
    if (!fileData) {
      return res.status(404).json({ message: "File not found in milestone" });
    }
    return res.redirect(fileData.fileUrl);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error downloading file', error });
  }
});


router.get('/milestones', async (req, res) => {
  try{
    const milestones = await milestone.find();

    res.status(200).json(milestones);
    
  }catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
