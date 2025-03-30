// routes/submitProject.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|zip/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type.'));
  }
};

const upload = multer({ storage, fileFilter });

router.post('/submit-project', upload.array('projectFiles', 10), async (req, res) => {
  try {

    const projectName = req.body.projectName;
    const projectDescription = req.body.projectDescription;
    const elevatorPitch = req.body.elevatorPitch;

    const technologies = JSON.parse(req.body.technologies || '[]');

    const files = req.files;
    
    console.log('Project Name:', projectName);
    console.log('Description:', projectDescription);
    console.log('Elevator Pitch:', elevatorPitch);
    console.log('Technologies:', technologies);
    console.log('Uploaded Files:', files);


    res.status(200).json({
      success: true,
      message: 'Project submitted successfully!',
      project: {
        projectName,
        projectDescription,
        elevatorPitch,
        technologies,
        files: files.map(file => ({
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype
        }))
      }
    });
  } catch (error) {
    console.error('Error processing project submission:', error);
    res.status(500).json({ error: 'Server error while submitting project' });
  }
});

module.exports = router;
