const aws = require("aws-sdk");
const multer = require("multer");
const s3Storage = require("multer-sharp-s3");
const { v4: uuidv4 } = require("uuid");
const s3 = new aws.S3({
    region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// ===========================================================
// -------------------IMAGES UPLOADED IN Offer ---------
// ===========================================================
const uploadOffer = multer({
  storage: s3Storage({
    s3,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    Key: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const name = file.originalname.split(".")[0];
      const adminId = req.res.locals.id;
      var path;
      if (ext === "png") path = `admin/${name}-${uuidv4()}.${ext}`;
      else path = `admin/${name}-${uuidv4()}.jpeg`;
      req.originalname = path;
      cb(null, path);
    },
    Bucket: process.env.AWS_BUCKET_NAME,
    ACL: "private",
    resize: { width: 520, height: 390 },
    toFormat: {
      type: "jpeg",
      options: {
        progressive: true,
        quality: 85,
      },
    },
  }),
});
module.exports = {
    uploadOffer,
};
