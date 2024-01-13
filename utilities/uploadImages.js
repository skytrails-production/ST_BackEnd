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

// Initialize multer for both single and multiple file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000000 } // Set file size limit (optional)
}).any('images');


const copyFiles = (files) => {
  return files.map(file => {
    const filePath = path.join(__dirname, 'uploads', file.filename);
    const destinationPath = path.join(__dirname, 'another-directory', file.filename);

    if (!fs.existsSync(filePath)) {
      console.error(`Source file does not exist: ${filePath}`);
      return null;
    }

    // console.log("filePath========", filePath, "destinationPath===>>>>>", destinationPath);
    try {
      // Create the destination directory if it doesn't exist
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

      // Copy the file to the destination
      fs.copyFileSync(filePath, destinationPath);

      // console.log("File copied successfully:", destinationPath);
      return destinationPath;
    } catch (error) {
      console.error(`Error copying file: ${error.message}`);
      return null;
    }
  });
};
const handleFileUpload = (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      if (err) {
        return res.status(400).json({ success: false, message: "There is an error uploading the files" });
      }

      // Move the file handling logic to a separate function
      const filePaths = copyFiles(req.files);
// console.log("filePaths=========",filePaths);
      // Filter out null values (files that failed to copy) and assign to req.filePaths
      req.filePaths = filePaths.filter(filePath => filePath !== null);
      req.file = req.files[0];

      // Move to the next middleware or route handler
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error!", error });
  }
};

module.exports = { handleFileUpload };


// // Middleware to handle file uploads
// const handleFileUpload = (req, res, next) => {
//   try {
//     upload(req, res, async (err) => {
//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ success: false, message: "No files uploaded" });
//       }

//       if (err) {
//         return res.status(400).json({ success: false, message: "There is an error uploading the files" });
//       }

//       // Move each file to the desired location or perform additional operations
//       const filePaths = req.files.map(file => {
//         const filePath = path.join(__dirname, 'uploads', file.filename);
//         const destinationPath = path.join(__dirname, 'another-directory', file.filename);
        
//     if (!fs.existsSync(filePath)) {
//       console.error(`Source file does not exist: ${filePath}`);
//       return null;
//     }
//         console.log("filePath========",filePath,"destinationPath===>>>>>",destinationPath);
//         try {
//            // Create the destination directory if it doesn't exist
//            fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

//            // Copy the file to the destination
//            fs.copyFileSync(filePath, destinationPath);
 
//            console.log("File copied successfully:", destinationPath);
//            return destinationPath;
//           // console.log("filePath========",filePath,"destinationPath===>>>>>",destinationPath);
//           // console.log(" fs.copyFileSync(filePath, destinationPath);", fs.mkdirSync(filePath, destinationPath));
//           // fs.mkdirSync(filePath, destinationPath);
//           // console.log("filePath========",filePath)
//           // return filePath;
//         } catch (error) {
//           console.error(`Error copying file: ${error.message}`);
//           return null; // or handle the error in an appropriate way
//         }
//       });

//       // Filter out null values (files that failed to copy) and assign to req.filePaths
//       // req.filePaths = filePaths.filter(filePath => filePath !== null);
//       req.file = req.files[0];
// console.log("req.file=======",req.file);
//       // Move to the next middleware or route handler
//       return req.file;
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Internal server error!", error });
//   }
// };

// module.exports = { handleFileUpload };
