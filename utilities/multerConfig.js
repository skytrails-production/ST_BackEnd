// multerConfig.js

const multer = require('multer');
const path = require('path');

class UploadHandler {
  constructor(fileSize) {
    this.fileSize = fileSize;
    this.max_image_size = 204800;
    this.max_video_size = 2048000;
    this.storage = multer.diskStorage({
      destination(req, file, cb) {
        const root = path.normalize(`${__dirname}/../..`);
        cb(null, `${root}/uploads/`);
      },
      filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, '')}`);
      },
    });

    this.uploadMiddleware = multer({
      storage: this.storage,
      fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname).toLowerCase();
        // console.log("sssssssss", ext);
        // Add your custom file filter logic here if needed
        cb(null, true);
      },
      limits: {
        fileSize: 1000000000 * 90, // Example limit: 90MB
      },
    }).any();

    // Bind methods to the current instance
    this.handleUploadError = this.handleUploadError.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  /**
   * Handle upload errors and call next middleware
   */
  handleUploadError(req, res, next) {
    this.uploadMiddleware(req, res, function (err) {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new Error('File size limit exceeds'));
        }
        return next(new Error('Error in file upload'));
      }
      return next();
    });
  }

  /**
   * Middleware function for handling file uploads
   */
  uploadFile(req, res, next) {
    this.handleUploadError(req, res, next);
  }
}

module.exports = new UploadHandler(10);
