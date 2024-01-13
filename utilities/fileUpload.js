// fileUpload.js

const uploadHandler = require('./multerConfig');

function handleFileUpload(req, res, next) {
  uploadHandler.uploadFile(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // File uploaded successfully
    return next();
  });
}

module.exports = handleFileUpload;
