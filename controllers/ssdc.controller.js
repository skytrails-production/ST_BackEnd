const aws = require("aws-sdk");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const { SsdcJob, SsdcModel } = require("../model/ssdcModel");
const commonFunctions = require("../utilities/commonFunctions");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.ssdcRegistration = async (req, res) => {
  try {
    const data = req.body;
    // Check if the data already exists
    const existingRecord = await SsdcModel.findOne(data);
    // console.log(existingRecord,"data")
    if (existingRecord) {
      // If the data already exists, send details in the response
      actionCompleteResponse(res, existingRecord, "Data already registered");
      await commonFunctions.ssdcConfirmationMail(existingRecord);
    } else {
      // If the data does not exist, create a new record
      const response = await SsdcModel.create(data);
      await commonFunctions.ssdcConfirmationMail(response);
      msg = "Registration Successfully Submit!";
      actionCompleteResponse(res, response, msg);
    }
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};




exports.ssdcLeads = async (req, res) => {
  try {
    const response = await SsdcModel.find().select(
      "-createdAt -updatedAt -_id -__v"
    );
    const msg = "Data Search Successfully";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.ssdcJobsCreate = async (req, res) => {
  const reqData = JSON.parse(req.body.data);
  const file = req?.file;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      data1 = new SsdcJob({
        ...reqData,
        image: data.Location,
      });
    }

    try {
      const response = await data1.save();
      const msg = "Jobs Create Successfully";
      actionCompleteResponse(res, response, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  });
};

exports.ssdcJobs = async (req, res) => {
  const country = req.params.country;

  try {
    const response = await SsdcJob.findOne({ country });
    if (!response) {
      
      const msg = "No jobs found for the specified country.";
      sendActionFailedResponse(res, {}, msg, 404);
      return;
    }
    const msg = "Jobs Search Successfully";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};
