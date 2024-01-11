const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
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

// Initialize multer for single file upload
const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 100000000000 } // Set file size limit (optional)
}).single('images');

// Initialize multer for multiple file upload
const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 100000000000 } // Set file size limit (optional)
}).array('images', 5); // Change '5' to the maximum number of files allowed

// Middleware to handle single file upload
const handleSingleFileUpload = (req, res, next) => {
  try {
    uploadSingle(req, res, async (err) => {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      if (err) {
        return res.status(400).json({ success: false, message: "There is an error uploading the file" });
      }

      // Move the file to the desired location or perform additional operations
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      // Example: Copy the file to another directory
      const destinationPath = path.join(__dirname, 'another-directory', req.file.filename);
      fs.copyFileSync(filePath, destinationPath);

      req.filePath = destinationPath; // You can use this path in your route handler
      return next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error!", error });
  }
};

// Middleware to handle multiple file upload
const handleMultipleFileUpload = (req, res, next) => {
  try {
    uploadMultiple(req, res, async (err) => {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      if (err) {
        return res.status(400).json({ success: false, message: "There is an error uploading the files" });
      }

      // Move each file to the desired location or perform additional operations
      const filePaths = req.files.map(file => {
        const filePath = path.join(__dirname, 'uploads', file.filename);
        // Example: Copy the file to another directory
        const destinationPath = path.join(__dirname, 'another-directory', file.filename);
        fs.copyFileSync(filePath, destinationPath);
        return destinationPath;
      });

      req.filePaths = filePaths; // You can use these paths in your route handler
      return next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error!", error });
  }
};

module.exports = { handleSingleFileUpload, handleMultipleFileUpload };
