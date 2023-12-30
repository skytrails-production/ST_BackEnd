const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const File = require('../model/user.model');
const { badRequest } = require('./responceCode'); 

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Customize the file name to include a timestamp and remove spaces
    cb(null, `uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, '')}`);
  }
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000000 } // Set file size limit (optional)
}).single('images');

// Middleware to handle file uploads
const handleFileUpload = (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      if (err) {
        return res.status(400).json({ success: false, message: "There is an error uploading the file" });
      }

      // Save data into the database
      const fileData = new File({
        fileName: req.file.filename,
        uuid: uuidv4(),
        path: req.file.path,
        size: req.file.size
      });
// console.log("--------=-------",fileData)
      const result = await fileData.save();
      req.fileData = result; 
      return next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error!", error });
  }
};

module.exports = { handleFileUpload };
