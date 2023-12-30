const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const File = require('../model/user.model');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

// Set storage engine
const storage = multer.memoryStorage(); // Use memory storage for Cloudinary

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000000 } // Set file size limit (optional)
}).single('image'); // Assuming the field name for the image is 'image'

// Middleware to handle file uploads
const handleFileUpload = async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
          if (!req.file) {
            console.log("No file uploaded.");
            return res.status(400).json({ success: false, message: "No file uploaded" });
          }
  
          if (err) {
            console.log("Error uploading file:", err);
            return res.status(400).json({ success: false, message: "There is an error uploading the file" });
          }
  
          console.log("File uploaded successfully:", req.file);
  
          // Rest of the code...
  
          resolve(); // Resolve the Promise once the asynchronous operations are complete
        });
      });
    } catch (error) {
      console.log("Error in handleFileUpload:", error);
      return res.status(500).json({ success: false, message: "Internal server error!", error });
    }
  
    return next();
  };
  

module.exports = { handleFileUpload };
