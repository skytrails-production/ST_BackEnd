const aws = require("aws-sdk");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const statusCode = require("../utilities/responceCode");
const User = require("../model/user.model");
const Role = require("../model/role.model");
// const client=require("../utilities/client");

const { SkyTrailsPackageModel } = require("../model/holidayPackage.model");

const PackageCategoryModel = require("../model/packageCategoryModel");
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
      reqData.destination = reqData?.destination?.map((item) => {
        if (item.addMore) {
          item.addMore = item.addMore.toLowerCase().trim(); // Convert to lowercase and trim whitespace
        }
        return item;
      });
      reqData.country = reqData?.country?.map((item) => {
        if (item) {
          item = item.toLowerCase().trim();
        }
        return item;
      });

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

exports.createPackageAddImages = async (req, res) => {
  try {
    const data = req?.body?.keyword;
    const packageId = req?.body?.packageId;
    const files = req?.files;
    // console.log(data,files)
    if (!data || !files || Object.keys(files).length === 0 || !packageId) {
      return res
        .status(401)
        .send({
          status: 401,
          message: "Please select Images types and More than one Image",
        });
    }

    const isPackageExist = await SkyTrailsPackageModel.findById({
      _id: packageId,
    });
    // console.log(isPackageExist,data,"package existing")
    if (!isPackageExist) {
      return res
        .status(404)
        .send({ status: 404, message: "Package Not Found" });
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
        return res
          .status(500)
          .send({ status: 500, message: "Error for image uploading." });
      }
    }

    // Update package images based on the keyword
    if (data === "stays") {
      const hotelType = req?.body?.hotelType;
      const hotelName = req?.body?.hotelName;
      let days = Number(req?.body?.day);
      const description = req?.body?.description;
      const hotelStar = Number(req?.body?.hotelStar);
      const checkIn = req?.body?.checkIn;
      const checkOut = req?.body?.checkOut;
      const numberOfNights = Number(req?.body?.numberOfNights);
      const mealsIncluded = req?.body?.mealsIncluded;

      for(let i=0; i<numberOfNights; i++){
      // console.log(hotelType,hotelName)
      // return;

      isPackageExist.images.stays.push({
        Images: imageUrls,
        mealsIncluded: mealsIncluded,
        numberOfNights: numberOfNights,
        hotelStar: hotelStar,
        checkOut: checkOut,
        checkIn: checkIn,
        description: description,
        itineraryDay: days,
        hotelType: hotelType,
        hotelName: hotelName,
      });
      days++;
    }
    } else if (data === "destinations") {
      isPackageExist.images.destinations.push(...imageUrls);
    } else if (data === "activities") {
      const days = Number(req?.body?.day);
      const title = req?.body?.title;
      isPackageExist.images.activities.push({
        Images: imageUrls,
        title: title,
        itineraryDay: days,
      });
    }

    await isPackageExist.save();
    actionCompleteResponse(res, isPackageExist, "images done");
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//Add Itinerary  in holiday pacakge

exports.createPackageAddItinerary = async (req, res) => {
  try {
    const data = req.body;
    const day  = Number(req.body.dayNumber);
    const packageId = data?.packageId;
    // console.log(data?.packageId,"packageId");
    const isPackageExist = await SkyTrailsPackageModel.findById({
      _id: packageId,
    });

    if (!isPackageExist) {
      return res
        .status(200)
        .send({ status: 404, message: "Package not found." });
    }
    // console.log(isPackageExist,"packageOld data");

    // return;

    // console.log(isPackageExist?.detailed_ltinerary?.length,"",isPackageExist?.days)

   
     // Check if the detailed itinerary for this package already contains the day
     const existingItinerary = isPackageExist.detailed_ltinerary.find(
      (itinerary) => itinerary.dayNumber === day
    );

    if (existingItinerary) {
      return res.status(400).send({
        status: 400,
        message: "This day itinerary is already added."
      });
    }

    

    if (isPackageExist.detailed_ltinerary.length >= isPackageExist.days || day > isPackageExist.days ) {
      return res
        .status(400)
        .send({
          status: 400,
          message:
            "You cannot add more itinerary items than the number of days in the package. Please adjust the itinerary.",
        });
    }

    

    isPackageExist.detailed_ltinerary.push(data);

    await isPackageExist.save();
    actionCompleteResponse(res, data, "Itinerary added successfully.");
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//add itinerary images in daywise

exports.createPackageAddItineraryImages = async (req, res) => {
  try {
    const { itineraryDay, packageId } = req.body;
    const files = req?.files;
    // console.log(itineraryDay, packageId)

    // Validate inputs
    if (
      !itineraryDay ||
      !files ||
      Object.keys(files).length === 0 ||
      !packageId
    ) {
      return res
        .status(400)
        .send({
          status: 400,
          message: "Please select Itinerary Day and upload at least one image.",
        });
    }

    const numberDays = Number(itineraryDay);
    if (isNaN(numberDays)) {
      return res
        .status(400)
        .send({
          status: 400,
          message: "Itinerary Day must be a valid number.",
        });
    }

    const isPackageExist = await SkyTrailsPackageModel.findById({
      _id: packageId,
    });

    if (!isPackageExist) {
      return res
        .status(200)
        .send({ status: 404, message: "Package not found." });
    }

    if (isPackageExist.detailed_ltinerary.length === 0) {
      return res
        .status(400)
        .send({ status: 400, message: "Please add itinerary details first." });
    }

    if (numberDays > isPackageExist.detailed_ltinerary.length) {
      return res
        .status(400)
        .send({
          status: 400,
          message:
            "You cannot add more itinerary items than the number of days in the package. Please adjust the itinerary.",
        });
    }

    // return;

    const country = isPackageExist?.country[0];
    const imageUrls = [];
    for (const file of files) {
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `packageImages/${country}/itineraryimages/${file.originalname}`,
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
        return res
          .status(500)
          .send({ status: 500, message: "Error for image uploading." });
      }
    }

    isPackageExist?.detailed_ltinerary[numberDays - 1]?.itineraryImages.push(
      ...imageUrls
    );

    await isPackageExist.save();
    actionCompleteResponse(res, imageUrls, "images added successfully");
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//getPackageCityAndCountryList

exports.getPackageCityAndCountryList = async (req, res) => {
  try {
    const keyword = req?.query?.keyword;
    if (!keyword) {
      return res
        .status(200)
        .send({ status: 404, message: "Please Select keyword" });
    } else {
      // Create a case-insensitive regex pattern for the search
      const regex = new RegExp(keyword, "i");

      const cityResponse = await SkyTrailsPackageModel.aggregate([
        { $match: { "destination.addMore": regex, is_active: 1 } },
        {
          $group: {
            _id: null,
            addMoreList: { $addToSet: "$destination.addMore" },
          },
        },
      ]);

      // console.log(cityResponse, "cityResponse");

      const countryResponse = await SkyTrailsPackageModel.aggregate([
        { $match: { country: regex, is_active: 1 } },
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
};

//getAllPackageByUser

exports.getAllPackageByUser = async (req, res) => {
  try {
    // Assuming the userId is passed in the request params
    const userId = req?.params?.userId; // Correctly access the route parameter (userId in this case)

    if (!userId) {
      return res
        .status(200)
        .json({ status: 400, message: "User ID is required" });
    }

    // console.log(userId,"userId");
    // Query packages by userId and sort them
    const packages = await SkyTrailsPackageModel.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id title days")
      .lean();

    actionCompleteResponse(res, packages, "Get Package");
  } catch (error) {
    sendActionFailedResponse(res, {}, err.message);
  }
};




//getAllHolidayPacagkeByAdmin

exports.getAllHolidayPacagkeByAdmin =async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
    const limit = parseInt(req.query.limit) || 100; // Default to 10 items per page if no limit is provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    const packages = await SkyTrailsPackageModel.find()
      .sort({ createdAt: -1 })
      .skip(skip) // Skip the appropriate number of items
      .limit(limit) // Limit the number of items returned
      .select("_id title days is_active packageAmount createdAt")
      .lean();

      if (packages.length === 0) {
        return res
          .status(200)
          .send({ status: 404, message: "No related package found." });
      }

      const totalCount = await SkyTrailsPackageModel.countDocuments();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
      res.status(200).send({
        status: 200,
        message: `Get All package successfully`,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalCount: totalCount,
          limit: limit,
        },
        data: packages,
      });

  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};


//getDomesticorInternationPackages

exports.getDomesticorInternationPackages = async (req, res) => {
  const packageType = req?.params?.packageType;
  // const cacheKey = JSON.stringify(packageType);
  // const isExistIntoCache = await client.get(cacheKey);

  // if (isExistIntoCache) {

  //   return res.status(statusCode.OK).json({ status: 200, message:`Get Package related to ${keyword}`,
  //     result: JSON.parse(isExistIntoCache),
  //   });

  // }
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
  const limit = parseInt(req.query.limit) || 100; // Default to 10 items per page if no limit is provided
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  // console.log(packageType, "packageType");

  try {
    // Correct the $or query syntax
    const packages = await SkyTrailsPackageModel.find({
      $and: [
        {
          is_active: 1,
        },
        { packageType: packageType },
      ],
    })
      .skip(skip) // Skip the appropriate number of items
      .limit(limit) // Limit the number of items returned
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select(
        "_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist"
      )
      .lean();

    if (packages.length === 0) {
      return res
        .status(200)
        .send({ status: 404, message: "No related package found." });
    }

    // Get the total count of records to calculate pagination info
    const totalCount = await SkyTrailsPackageModel.countDocuments({
      $and: [{ is_active: 1 }, { packageType: packageType }],
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return the fetched packages as a response
    res.status(200).send({
      status: 200,
      message: `fetch ${packageType} package successfully`,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      },
      data: packages,
    });
    const finalRes = {
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      },
      data: packages,
    };
    // const data1= await client.set(cacheKey, JSON.stringify(finalRes),{ EX: 3600 });
    // console.log("redis overwrite",data1);
  } catch (err) {
    console.error("Error fetching packages:", err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//getAllPackageDestinationOrCountryWise

exports.getAllPackageDestinationOrCountryWise = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res
        .status(200)
        .json({ staus: 400, message: "Keyword is required" });
    }
    // const cacheKey = JSON.stringify(keyword);
    // const isExistIntoCache = await client.get(cacheKey);

    // if (isExistIntoCache) {

    //   return res.status(statusCode.OK).json({ status: 200, message:`Get Package related to ${keyword}`,
    //     result: JSON.parse(isExistIntoCache),
    //   });

    // }
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
    const limit = parseInt(req.query.limit) || 100; // Default to 10 items per page if no limit is provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Create a case-insensitive regex pattern for the search
    const regex = new RegExp(keyword, "i");

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
      .skip(skip) // Skip the appropriate number of items
      .limit(limit) // Limit the number of items returned
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select(
        "_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist"
      )
      .exec();

    if (packages.length === 0) {
      return res
        .status(200)
        .send({ status: 404, message: "No related package found." });
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
    res.status(200).json({
      status: 200,
      message: `Get Package related to ${keyword}`,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      },
      data: packages,
    });
    // const result={ pagination: {
    //   currentPage: page,
    //   totalPages: totalPages,
    //   totalCount: totalCount,
    //   limit: limit
    // }, data: packages}
    // const data1= await client.set(cacheKey, JSON.stringify(result),{ EX: 60 });
  } catch (err) {
    console.error("Error fetching packages:", err);
    sendActionFailedResponse(res, {}, err.message); // Assuming this is a predefined error handler
  }
};

//addOrRemoveUserIdWishlist

exports.addOrRemoveUserIdWishlist = async (req, res) => {
  try {
    const packageId = req?.params?.packageId; // Correct typo in 'pacakgeId' to 'packageId'
    const userId = req?.userId; // Assuming userId is sent in the request body

    // Check if packageId and userId are provided
    if (!packageId) {
      return res
        .status(200)
        .json({ status: 400, message: "packageId are required" });
    }
    const package = await SkyTrailsPackageModel.findById({ _id: packageId });

    // console.log(package,"package")
    // Check if package exists
    if (!package) {
      return res
        .status(200)
        .json({ status: 404, message: "Package not found" });
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
    const action = userIndex === -1 ? "added to" : "removed from";
    //  return res.status(200).json({status:200, message: `User ${action} wishlist` });
    actionCompleteResponse(res, {}, `User ${action} wishlist`);
  } catch (err) {
    // console.error('Error fetching packages:', err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//getSingleHolidayPackage

exports.getSingleHolidayPackage = async (req, res) => {
  try {
    const packageId = req?.params?.packageId; // Correct typo in 'pacakgeId' to 'packageId'

    // Check if packageId provided
    if (!packageId) {
      return res
        .status(200)
        .json({ status: 400, message: "packageId are required" });
    }
    const package = await SkyTrailsPackageModel.findById(packageId);

    // console.log(package,"package")
    // Check if package exists
    if (!package) {
      return res
        .status(200)
        .json({ status: 404, message: "Package not found" });
    }

    actionCompleteResponse(res, package, `fetch Package Successfully`);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//holidayPackageSetActive only for Admin

exports.holidayPackageSetActive = async (req, res) => {
  const { packageId, isAdmin, activeStatus } = req.body;
  console.log(req.body)
  try {
    const user = await User.findById(isAdmin);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === "admin") {
      const response = await SkyTrailsPackageModel.findById({ _id: packageId });
      let size = Object.keys(response).length;
      if (size > 0) {
        const pacakge = await SkyTrailsPackageModel.findOneAndUpdate(
          { _id: packageId },
          { $set: { is_active: activeStatus } },
          { new: true }
        );
        msg = "change package status";
        actionCompleteResponse(res, pacakge.is_active, msg);
      }
    } else {
      msg = "only Admin can upadate Active status";
      actionCompleteResponse(res, {}, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};


exports.holidayPackageDelete = async (req, res) => {
  try {
    const user = await User.findById(req.body.isAdmin);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === "admin") {
      const package = await SkyTrailsPackageModel.findByIdAndRemove(req.params.packageId);
      msg = "Package successfully deleted";
      actionCompleteResponse(res, package.title, msg);
    } else {
      msg = "only admin can delete pakage";
      actionCompleteResponse(res, {}, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//get filter packages based on the amount

exports.holidayPackageFilterByAmount = async (req, res) => {
  try {
    const { amount } = req?.query;
    if (!amount) {
      return res
        .status(400)
        .json({ status: 400, message: "Amount parameter is required." });
    }
    // const cacheKey = JSON.stringify(amount);
    // const isExistIntoCache = await client.get(cacheKey);

    // if (isExistIntoCache) {
    //   return res.status(statusCode.OK).json({ status: 200, message:`Packages found for less than ${amount}`,result: JSON.parse(isExistIntoCache),
    //   });
    // }
    // return;
    // Parse the amount into an integer
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid amount parameter." });
    }

    let query = { is_active: 1 };

    // Determine the range based on the `amount` parameter
    if (parsedAmount === 50000) {
      query["packageAmount.amount"] = { $lt: parsedAmount };
    } else if (parsedAmount === 100000) {
      query["packageAmount.amount"] = { $gt: 49999, $lt: parsedAmount };
    } else if (parsedAmount === 150000) {
      query["packageAmount.amount"] = { $gt: 99999, $lt: parsedAmount };
    } else if (parsedAmount === 200000) {
      query["packageAmount.amount"] = { $gt: 149999 };
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid amount range." });
    }

    // Perform the query
    const packages = await SkyTrailsPackageModel.find(query)
      .sort({ "packageAmount.amount": 1, createdAt: -1 })
      .select(
        "_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist"
      )
      .lean();

    // Return response based on whether packages were found
    if (packages && packages.length > 0) {
      const msg = `Packages found for less than ${amount}`;
      // const data1= await client.set(cacheKey, JSON.stringify(packages),{ EX: 3600 });
      return actionCompleteResponse(res, packages, msg);
    } else {
      const msg = `No packages found for this range`;
      return actionCompleteResponse(res, [], msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//holiday package by category

exports.getHolidayPackageFilterByCategory = async (req, res) => {
  try {
    const { seeAll, keyword } = req.query;
    const cacheKey = JSON.stringify(req.query);
    // const isExistIntoCache = await client.get(cacheKey);

    // if (isExistIntoCache) {
    //   return res.status(statusCode.OK).json({ status: 200, message:`Get Package related to ${keyword}`,
    //     result: JSON.parse(isExistIntoCache),
    //   });
    // }
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page if no limit is provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    let queryObj = {};
    if (seeAll == "true") {
      // for (const key of keywordsArray) {
      queryObj = {
        [`inclusions.${keyword}`]: "true",
        is_active: 1,
      };
      const results = await SkyTrailsPackageModel.find(queryObj)
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .select(
          "_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist"
        )
        .exec();
      // const data1= await client.set(cacheKey, JSON.stringify(results),{ EX: 3600 });

      return res.status(200).send({
        status: 200,
        message: `${keyword} Package Found`,
        data: results,
        resultsl: results.length,
      });
    }

    const categoryArray = await PackageCategoryModel.find();
    // Check if keyword exists and is an array
    // console.log(categoryArray)
    if (categoryArray.length > 0) {
      const finalRes = [];
      const results = {};
      // Iterate over each keyword
      for (const key of categoryArray) {
        queryObj = {
          [`inclusions.${key.inclusion}`]: 'true',
          is_active: 1,
        };

        //  console.log(queryObj)

        // Perform pagination query
        const result = await SkyTrailsPackageModel.find(queryObj)
          .skip(skip) // Skip the appropriate number of items
          .limit(limit) // Limit the number of items returned
          .sort({ createdAt: -1 }) // Sort by creation date in descending order
          .select(
            "_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist"
          )
          .exec();
        results[key.inclusion] = result;
        // Push result along with additional information to finalRes array
        finalRes.push({
          inclusion: key.inclusion,
          result: result,
          colorCode: key.colorCode,
          Icon: key.images,
          headingCode: key.headingCode,
        });
      }
      // const data1= await client.set(cacheKey, JSON.stringify(finalRes),{ EX: 3600 });
      return res.status(200).send({
        statusCode: 200,
        responseMessage: "Category Data Found",
        data: finalRes,
      });
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//get Latest Holiday packages

exports.getLatestHolidayPackages = async (req, res) => {
  try {
    // const cacheKey = JSON.stringify("packagesForToday");
    // const isExistIntoCache = await client.get(cacheKey);

    // if (isExistIntoCache) {
    //   return res.status(statusCode.OK).json({ status: 200, message:`Get Package for today`,
    //     result: JSON.parse(isExistIntoCache),
    //   });

    // }
    // Fetch all active packages from the database
    const allPackages = await SkyTrailsPackageModel.find({ is_active: 1 })
      .sort({ createdAt: -1 })
      .select(
        "_id title days country coverImage destination packageAmount packageHighLight specialTag inclusions wishlist"
      )
      .exec();

    // If no packages are available, return an empty response
    if (allPackages.length === 0) {
      const msg = "No active packages found";
      return actionCompleteResponse(res, [], msg);
    }

    // Shuffle the packages using the daily seed
    const shuffledPackages = shuffleArray(allPackages);

    // Pick the first 6 packages after shuffling
    const packagesForToday = shuffledPackages.slice(0, 6);

    const msg = "Latest packages fetched successfully for today!";
    actionCompleteResponse(res, packagesForToday, msg);
    // const data1= await client.set(cacheKey, JSON.stringify(packagesForToday),{ EX: 1800 });
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

// Function to shuffle an array using the Fisher-Yates (Durstenfeld) algorithm
function shuffleArray(array) {
  const arr = [...array]; // Clone the array to avoid mutation
  let currentIndex = arr.length,
    randomIndex,
    temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex); // Random index
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}
