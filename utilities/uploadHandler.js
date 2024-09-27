const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        this.uploadFile = this.uploadFile.bind(this);
        const root = path.normalize(`${__dirname}/../..`);
    }

    handleUploadError(req, res, next, upload) {
        upload(req, res, function (err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(badRequest(err, 'File size limit exceeds'));
                }
                return next(badRequest(err, 'Error in file upload'));
            }
            return next();
        });
    }

    uploadFile(req, res, next) {
        const upload = multer({
            storage: this.storage,
            fileFilter: function (req, file, cb) {
                var ext = path.extname(file.originalname).toLowerCase();
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.svg') {
                    return cb(Boom.badRequest('Only images are allowed'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 1000000 * 90,
                //fileSize: this.fileSize * 500000,  // 5MB
            },
        }).any();
        this.handleUploadError(req, res, next, upload);
    }
}

module.exports = new UploadHandler(10);
