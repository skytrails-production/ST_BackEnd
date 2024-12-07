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
  // console.log(reqData,"Data");
  // return;
  const file = req?.file;
  // console.log(req?.file);
  // return;
  let data1;
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
  // console.log(data,files)
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
      return res.status(500).send({status:500,message:"Error for image uploading."});
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
   return res.status(200).send({status:404, message:"Package not found."})
  }
  // console.log(isPackageExist,"packageOld data");

  // return;

  // console.log(isPackageExist?.detailed_ltinerary?.length,"",isPackageExist?.days)

  if(isPackageExist.detailed_ltinerary.length>=isPackageExist.days){
    return res.status(400).send({status:400, message:"You cannot add more itinerary items than the number of days in the package. Please adjust the itinerary."})
  }

  isPackageExist.detailed_ltinerary.push(data);


    await isPackageExist.save();
    actionCompleteResponse(res, data,"Itinerary added successfully.")
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }

}





//getPackageCityAndCountryList

exports.getPackageCityAndCountryList = async (req, res) =>{

  try {
    const keyword=req?.query?.keyword
    if(!keyword){
      return res.status(200).send({status:404,message:"Please Select keyword"})

    }else{
    
       // Create a case-insensitive regex pattern for the search
    const regex = new RegExp(keyword, 'i');

    const cityResponse = await SkyTrailsPackageModel.aggregate([
      { $match: { "destination.addMore": regex ,is_active:1} },
      {
        $group: {
          _id: null,
          addMoreList: { $addToSet: "$destination.addMore" },
        },
      },
    ]);

    // console.log(cityResponse, "cityResponse");

    const countryResponse = await SkyTrailsPackageModel.aggregate([
      { $match: { country: regex,is_active:1 } },
      { $group: { _id: null, countryList: { $addToSet: "$country" } } },
    ]);

    const combinedList = [
      ...(cityResponse.length > 0 ? cityResponse[0].addMoreList : []),
      ...(countryResponse.length > 0 ? countryResponse[0].countryList : []),
    ];

    if (combinedList.length > 0) {
      const uniqueCombinedList = [...new Set(combinedList.flat())];
      const msg =
        "List of Package City and Country values retrieved successfully";
      actionCompleteResponse(res, uniqueCombinedList, msg);
    } else {
      const msg = "No matching Package City values found";
      actionCompleteResponse(res, [], msg);
    }
  }
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message); 
    
  }


}

//getAllPackageByUser


exports.getAllPackageByUser =async (req, res) =>{


  try {
   
      // Assuming the userId is passed in the request params
      const userId = req?.params?.userId;  // Correctly access the route parameter (userId in this case)

      if (!userId) {
        return res.status(200).json({status:400, message: "User ID is required" });
      }
  
      // console.log(userId,"userId");
      // Query packages by userId and sort them
      const packages = await SkyTrailsPackageModel.find({userId})
      .sort({createdAt:-1}).select('_id title days').lean();

     
        actionCompleteResponse(res, packages,"Get Package")
    
  } catch (error) {

    sendActionFailedResponse(res, {}, err.message); 
    
  }


}




//getDomesticorInternationPackages

exports.getDomesticorInternationPackages = async (req, res) => {
  const packageType = req?.params?.packageType;

  const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page is provided
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page if no limit is provided
  const skip = (page - 1) * limit;  // Calculate the number of items to skip

  // console.log(packageType, "packageType");

  try {
    // Correct the $or query syntax
    const packages = await SkyTrailsPackageModel.find({
      $and: [
        { 
          is_active: 1 },
        { packageType: packageType }
      ]
    })
    .skip(skip)  // Skip the appropriate number of items
    .limit(limit)  // Limit the number of items returned
    .sort({ createdAt: -1 })  // Sort by creation date in descending order
    .select('_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist')
    .lean();

    if(packages.length===0){
      return res.status(200).send({status:404, message:"No related package found."})
    }

    // Get the total count of records to calculate pagination info
    const totalCount = await SkyTrailsPackageModel.countDocuments({
      $and: [
        { is_active: 1 },
        { packageType: packageType }
      ]
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return the fetched packages as a response
    res.status(200).send({status:200, message:`fetch ${packageType} package successfully`,pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit
    },
    data:packages
      });
  } catch (err) {
    console.error('Error fetching packages:', err);
    sendActionFailedResponse(res, {}, err.message); 
  }
};




//getAllPackageDestinationOrCountryWise


exports.getAllPackageDestinationOrCountryWise = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(200).json({staus:400, message: 'Keyword is required' });
    }

    const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page is provided
    const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page if no limit is provided
    const skip = (page - 1) * limit;  // Calculate the number of items to skip
  

    // Create a case-insensitive regex pattern for the search
    const regex = new RegExp(keyword, 'i');

    // Perform the query to match either destination or country
    const packages = await SkyTrailsPackageModel.find({
      $or: [
        {
          destination: {
            $elemMatch: {
              addMore: { $regex: regex }, // Correctly using regex with $elemMatch
            },
          },
        },
        {
          country: {
            $elemMatch: { $regex: regex }, // Correctly using regex with $elemMatch
          },
        },
      ],
    })
    .skip(skip)  // Skip the appropriate number of items
    .limit(limit)  // Limit the number of items returned
    .sort({ createdAt: -1 })  // Sort by creation date in descending order
      .select('_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist')
      .exec();

      if(packages.length===0){
        return res.status(200).send({status:404, message:"No related package found."})
      }
  
      // Get the total count of records to calculate pagination info
      const totalCount = await SkyTrailsPackageModel.countDocuments({
        $or: [
          {
            destination: {
              $elemMatch: {
                addMore: { $regex: regex }, // Correctly using regex with $elemMatch
              },
            },
          },
          {
            country: {
              $elemMatch: { $regex: regex }, // Correctly using regex with $elemMatch
            },
          },
        ],
      });


      // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    
    // Send the response back with the found packages
    res.status(200).json({ status: 200, message:`Get Package related to ${keyword}`, pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit
    }, data: packages
      });
  } catch (err) {
    console.error('Error fetching packages:', err);
    sendActionFailedResponse(res, {}, err.message); // Assuming this is a predefined error handler
  }
};





//addOrRemoveUserIdWishlist

exports.addOrRemoveUserIdWishlist = async (req, res) =>{

  try {
    
    const packageId = req?.params?.packageId;  // Correct typo in 'pacakgeId' to 'packageId'
    const userId = req?.userId; // Assuming userId is sent in the request body

    // Check if packageId and userId are provided
    if (!packageId) {
      return res.status(200).json({status:400, message: 'packageId are required' });
    }
    const package = await SkyTrailsPackageModel.findById({_id:packageId});



    // console.log(package,"package")
    // Check if package exists
    if (!package) {
      return res.status(200).json({status:404, message: 'Package not found' });
    }

   // Get the current wishlist
   const wishlist = package.wishlist;

   // Check if the userId is already in the wishlist
   const userIndex = wishlist.indexOf(userId);

   // Add or remove the userId based on whether it is already in the wishlist
   let isModified = false;
   if (userIndex !== -1) {
     // User is already in wishlist, so remove it
     wishlist.splice(userIndex, 1);
     isModified = true;
   } else {
     // User is not in wishlist, so add it
     wishlist.push(userId);
     isModified = true;
   }

   // Only save if there was a modification
   if (isModified) {
     package.wishlist = wishlist;
     await package.save(); // Save the updated package
   }

   // Send appropriate response
   const action = userIndex === -1 ? 'added to' : 'removed from';
  //  return res.status(200).json({status:200, message: `User ${action} wishlist` });
   actionCompleteResponse(res,{},  `User ${action} wishlist`)

  } catch (err) {
    // console.error('Error fetching packages:', err);
    sendActionFailedResponse(res, {}, err.message); 
    
  }
}







//getSingleHolidayPackage

exports.getSingleHolidayPackage = async (req, res) =>{

  try {

    const packageId = req?.params?.packageId;  // Correct typo in 'pacakgeId' to 'packageId'
  

    // Check if packageId provided
    if (!packageId) {
      return res.status(200).json({status:400, message: 'packageId are required' });
    }
    const package = await SkyTrailsPackageModel.findById({_id:packageId});



    // console.log(package,"package")
    // Check if package exists
    if (!package) {
      return res.status(200).json({status:404, message: 'Package not found' });
    }

    actionCompleteResponse(res, package,  `fetch Package Successfully`)
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message); 
    
  }


}