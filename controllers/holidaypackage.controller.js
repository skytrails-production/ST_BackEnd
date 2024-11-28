const aws = require("aws-sdk");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const { SkyTrailsPackageModel } = require("../model/holidayPackage.model");
const commonFunctions = require("../utilities/commonFunctions");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});





//create holiday pacakge with initial information

exports.createHolidayPackage = async (req, res) => {
  const reqData = JSON.parse(req?.body?.data);
//   console.log(reqData,"Data");
  const file = req?.file;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `packageImages/coverImages/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      data1 = new SkyTrailsPackageModel({
        ...reqData,
        coverImage: data.Location,
      });
    }

    try {
      const response = await data1.save();
      const msg = "Create Package Successfully";
      actionCompleteResponse(res, response, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  });
};




//Add Images in holiday package 

exports.createPackageAddImages = async (req, res) =>{

  try{
  const data=req?.body?.keyword;
  const packageId=req?.body?.packageId;
  const files = req?.files;
  if(!data || !files || Object.keys(files).length === 0 || !packageId){
    return res.status(401).send({status:401, message:"Please select Images types and More than one Image"})
  }
 
  const isPackageExist= await SkyTrailsPackageModel.findById({_id:packageId});
  // console.log(isPackageExist,data,"package existing")
  if(!isPackageExist){
    return res.status(404).send({status:404,message:"Package Not Found"});
  }
  // console.log(isPackageExist.country[0],"country first index");
  
  // return;
  const country = isPackageExist.country[0];
  const imageUrls = [];
  for (const file of files) {
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `packageImages/${country}/${data}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    try {
      // Upload file to S3
      const data = await s3.upload(s3Params).promise();
      // Store the URL of the uploaded image
      imageUrls.push(data.Location);
    } catch (err) {
      return res.status(500).send({status:400,message:"Error for image uploading."});
    }


  }


    // Update package images based on the keyword
    if (data === 'stays') {
      isPackageExist.images.stays.push(...imageUrls);
    } else if (data === 'destinations') {
      isPackageExist.images.destinations.push(...imageUrls);
    } else if (data === 'activities') {
      isPackageExist.images.activities.push(...imageUrls);
    }
    
    await isPackageExist.save();
    actionCompleteResponse(res, isPackageExist,"images done")
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }

}



//Add Itinerary  in holiday pacakge

exports.createPackageAddItinerary = async (req, res) =>{


try{
  const data=req.body;
  const pacakgeId=data?.packageId;
  // console.log(data?.packageId,"packageId");
  const isPackageExist=await SkyTrailsPackageModel.findById({_id:pacakgeId});

  if(!isPackageExist){
    res.status(404).send({status:404, message:"Package not found."})
  }
  // console.log(isPackageExist,"packageOld data");

  // return;

  isPackageExist.detailed_ltinerary.push(data);


    await isPackageExist.save();
    actionCompleteResponse(res, data,"images done")
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }

}