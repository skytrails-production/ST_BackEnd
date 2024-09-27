
const JobApplication= require("../../model/carrersModel/jobApplicationModel")

const uploadDocument= require("../../model/carrersModel/uploadSingleImageModel");

const { sendActionFailedResponse, actionCompleteResponse } = require("../../common/common");
const aws = require("aws-sdk");

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });


exports.applyJob = async (req, res) =>{
    try{

    const data=req.body;
    // const existingRecord = await JobApplication.findOne(data);
    const existingRecord = await JobApplication.findOne({
        userEmail: data.userEmail,
        jobId: data.jobId
    });
    if (existingRecord) {
      // If the data already exists, send details in the response
      actionCompleteResponse(res, existingRecord, "already apply");
    } else {
      // If the data does not exist, create a new recor     
        const response = await JobApplication.create(data);
        actionCompleteResponse(res, response, "success");
    }
      } catch (err) {
        sendActionFailedResponse(res, {}, err.message);
      } 
}


exports.uploadDocuments = async (req, res) =>{

    const file = req?.file;
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `jobdocuments/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    let data1;
    s3.upload(s3Params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        data1 = new uploadDocument({
          document: data.Location,
        });
      }
  
      try {
        const response = await data1.save();
        actionCompleteResponse(res, response, "success");
      } catch (err) {
        sendActionFailedResponse(res, {}, err.message);
      }
    });


  
}



// get all jobs


exports.getAllApplication = async (req, res) =>{

    try {
        const response=await JobApplication.find().populate('jobId');

        actionCompleteResponse(res, response, "success");
    } catch (err) {
        sendActionFailedResponse(res, {err}, err.message);
        
    }

}