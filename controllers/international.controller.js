const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const {
  internationl,
  packagebookingSchema,
  confirmPackagebookingSchema,
  packageCityData,
  packageEnquirySchema,
  specialPackageCityData
} = require("../model/international.model");
const aws = require("aws-sdk");
const Internationalapi = require("../utilities/Internationalapi");
const { object } = require("joi");
const User = require("../model/user.model");
const Role = require("../model/role.model");

const UserBooking = require("../model/btocModel/packageBookingModel");

const { response } = require("express");
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
//*************************Services****************************************/
const {packageCategoryServices}=require('../services/packageCategoryServices');
const commonFunctions = require("../utilities/commonFunctions");
const {createPackageCategory,findPackageCategory,findPackageCategoryData,deletePackageCategory,updatePackageCategory}=packageCategoryServices;
// exports.internationalCreate = async (req, res) => {
//   const reqData = JSON.parse(req.body.data);
//   const file = req?.file;
//   const s3Params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `packageImages/${file.originalname}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: "public-read",
//   };
//   s3.upload(s3Params, async (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       const data1 = new internationl({
//         userId:reqData.userId,
//         pakage_title: reqData.pakage_title,
//         pakage_img: data.Location,
//         destination: reqData.destination,
//         country: reqData.country,
//         days: reqData.days,
//         schedule: {
//           flexible: reqData.flexible,
//           fixed_departure: reqData.fixed_departure,
//         },
//         pakage_amount: {
//           currency: reqData.pakage_amount.currency,
//           amount: reqData.pakage_amount.amount,
//         },
//         insclusions: reqData.insclusions,
//         hotel_details: reqData.hotel_details,
//         insclusion_note: reqData.insclusion_note,
//         exclusion_note: reqData.exclusion_note,
//         detailed_ltinerary: reqData.detailed_ltinerary,
//         overview: reqData.overview,
//         select_tags: reqData.select_tags,
//         term_Conditions: reqData.term_Conditions,
//         cancellation_Policy: reqData.cancellation_Policy,
//       });
//       try {
//         const response = await data1.save();
//         msg = "Pakage is created";
//         actionCompleteResponse(res, response, msg);
//       } catch (err) {
//         sendActionFailedResponse(res, {}, err.message);
//       }
//     }
//   });
// };

//mulitiImage

exports.internationalCreate = async (req, res) => {
  const reqData = JSON.parse(req.body.data);
  const files = req?.files;
  const imageUrls = [];
  for (const file of files) {
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `packageImages/${file.originalname}`,
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
      return res.status(500).send(err);
    }
  }

  const dataDestination=reqData?.destination?.map(item => {
    if (item.addMore) {
      item.addMore = item.addMore.toLowerCase().trim(); // Convert to lowercase and trim whitespace
       // Capitalize the first letter
      item.addMore = item.addMore.charAt(0).toUpperCase() + item.addMore.slice(1);
    }
    return item;
  });


      const data1 = new internationl({
        userId:reqData.userId,
        pakage_title: reqData.pakage_title,
        package_img: imageUrls,
        pakage_img:imageUrls[0],
        destination: dataDestination,
        country: reqData.country,
        days: reqData.days,
        schedule: {
          flexible: reqData.flexible,
          fixed_departure: reqData.fixed_departure,
        },
        pakage_amount: {
          currency: reqData.pakage_amount.currency,
          amount: reqData.pakage_amount.amount,
        },
        insclusions: reqData?.insclusions,
        hotel_details: reqData?.hotel_details,
        insclusion_note: reqData?.insclusion_note,
        exclusion_note: reqData?.exclusion_note,
        detailed_ltinerary: reqData?.detailed_ltinerary,
        overview: reqData?.overview,
        select_tags: reqData?.select_tags,
        term_Conditions: reqData?.term_Conditions,
        cancellation_Policy: reqData?.cancellation_Policy,
        package_expiry_date:reqData?.package_expiry_date
      });
      try {
        const response = await data1.save();
        msg = "Pakage is created";
        actionCompleteResponse(res, response, msg);
      } catch (err) {
        sendActionFailedResponse(res, {}, err.message);
      }
    
 
};

exports.internationalupdate = async (req, res) => {
  const reqData = JSON.parse(req.body.data);
  const file = req?.file;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `packageImages/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const data1 = {
        pakage_title: reqData.pakage_title,
        pakage_img: data.Location,
        destination: reqData.destination,
        country: reqData.country,
        days: reqData.days,
        schedule: {
          flexible: reqData.flexible,
          fixed_departure: reqData.fixed_departure,
        },
        pakage_amount: {
          currency: reqData.pakage_amount.currency,
          amount: reqData.pakage_amount.amount,
        },
        insclusions: reqData.insclusions,
        hotel_details: reqData.hotel_details,
        insclusion_note: reqData.insclusion_note,
        exclusion_note: reqData.exclusion_note,
        detailed_ltinerary: reqData.detailed_ltinerary,
        overview: reqData.overview,
        select_tags: reqData.select_tags,
        term_Conditions: reqData.term_Conditions,
        cancellation_Policy: reqData.cancellation_Policy,
        is_active: 0,
      };
      try {
        const user = await User.findById(reqData.isAdmin);
        const role = await Role.findById(user.roles[0].toString());
        if (role.name === "admin" || role.name === "user") {
          const response = await internationl.findByIdAndUpdate(
            req.params.id,
            data1
          );
          msg = "Pakage has been updated successfully";
          actionCompleteResponse(res, response, msg);
        } else {
          msg = "only admin can be updated";
          actionCompleteResponse(res, response, msg);
        }
      } catch (err) {
        sendActionFailedResponse(res, {}, err.message);
      }
    }
  });
};

exports.internationalFind = async (req, res) => {
  try {
    const pakage = await internationl.findById(req.params.id);
    msg = "Pakage successfully found";
    actionCompleteResponse(res, pakage, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.internationalDelete = async (req, res) => {
  try {
    const user = await User.findById(req.body.isAdmin);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === "admin") {
      const pakage = await internationl.findByIdAndRemove(req.params.id);
      msg = "Pakage successfully deleted";
      actionCompleteResponse(res, pakage, msg);
    } else {
      msg = "only admin can delete pakage";
      actionCompleteResponse(res, {}, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.internationalgetAll = async (req, res) => {
  try {
    let pagintionData = 10;

    const apiSearch = new Internationalapi(internationl.find({is_active:1}).find(), req.query)
      .search()
      .filter()
      .pagintion(pagintionData);

    let pakage = await apiSearch.query;
    if (pakage.length === 0) {
      // pakage=await internationl.find({ 'destination.addMore': req.query.keyword }).exec();
      pakage = await internationl.find({is_active:1})
        .find({
          $or: [
            {
              destination: {
                $elemMatch: {
                  addMore: req.query.keyword, // 'i' flag for case-insensitive search
                },
              },
            },
            { country: req.query.keyword },
          ],
        }).sort({createdAt: -1 })
        .exec();
    }

    for (let p = 0; p < pakage.length; p++) {
      var arr = [];
      var arr1 = [];
      var tags = 0;
      var insclusion = 0;

      for (let i = 0; i < pakage[p].select_tags.length; i++) {
        const key = Object.values(pakage[p].select_tags[i]);
        if (key[0] === true) arr[tags++] = pakage[p].select_tags[i];
      }
      pakage[p].select_tags = arr.slice(0);

      for (let j = 0; j < pakage[p].insclusions.length; j++) {
        const key = Object.values(pakage[p].insclusions[j]);
        if (key[0] === "true") arr1[insclusion++] = pakage[p].insclusions[j];
      }
      pakage[p].insclusions = arr1.slice(0);
    }
    // =================================================================> <======================================//
    const countData = pakage.length;
    let page = Number(req.query.page) || 1;
    let totalPages =
      countData - Math.floor(countData / pagintionData) * pagintionData > 0
        ? Math.floor(countData / pagintionData) + 1
        : Math.floor(countData / pagintionData);
    let skip = pagintionData * (page - 1) || 0;
    let currentPage = page - 1 < 1 ? 1 : page - 1;
    let endingLink =
      currentPage + 3 <= totalPages
        ? currentPage + 3
        : page + (totalPages - page);
    if (endingLink < page) {
      currentPage -= page - totalPages;
    }
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    let data = {
      startIndex: skip,
      endingLink: endingLink,
      currentPage: currentPage,
      totalPages: totalPages,
      pages: pages,
      pakage: pakage,
    };
    // const pakage = await international.find();
    msg = "successfully";
    actionCompleteResponse(res, data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.crmPackage= async (req, res) => {
  try {
    let pagintionData = 10; 

    let pakage = await internationl.find({is_active:1}).sort({createdAt: -1 });

    for (let p = 0; p < pakage.length; p++) {
      var arr = [];
      var arr1 = [];
      var tags = 0;
      var insclusion = 0;

      for (let i = 0; i < pakage[p].select_tags.length; i++) {
        const key = Object.values(pakage[p].select_tags[i]);
        if (key[0] === true) arr[tags++] = pakage[p].select_tags[i];
      }
      pakage[p].select_tags = arr.slice(0);

      for (let j = 0; j < pakage[p].insclusions.length; j++) {
        const key = Object.values(pakage[p].insclusions[j]);
        if (key[0] === "true") arr1[insclusion++] = pakage[p].insclusions[j];
      }
      pakage[p].insclusions = arr1.slice(0);
    }
    // =================================================================> <======================================//
    const countData = pakage.length;
    let page = Number(req.query.page) || 1;
    let totalPages =
      countData - Math.floor(countData / pagintionData) * pagintionData > 0
        ? Math.floor(countData / pagintionData) + 1
        : Math.floor(countData / pagintionData);
    let skip = pagintionData * (page - 1) || 0;
    let currentPage = page - 1 < 1 ? 1 : page - 1;
    let endingLink =
      currentPage + 3 <= totalPages
        ? currentPage + 3
        : page + (totalPages - page);
    if (endingLink < page) {
      currentPage -= page - totalPages;
    }
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    let data = {
      startIndex: skip,
      endingLink: endingLink,
      currentPage: currentPage,
      totalPages: totalPages,
      pages: pages,
      pakage: pakage,
    };
    // const pakage = await international.find();
    msg = "successfully";
    actionCompleteResponse(res, data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};


// inactive packages

exports.inactivePackages = async (req, res) =>{
  try {

    const data=await internationl.find({is_active:0}).sort({createdAt: -1 });

    msg = "Search inActive packages successfully";
    actionCompleteResponse(res, data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }

}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
// exports.packageCityList = async (req, res) => {
//   try {
//     const regex = new RegExp(escapeRegex(req.query.keyword), "gi");

//     const response = await internationl.aggregate([
//       { $match: { 'destination.addMore': regex } },
//       { $unwind: '$destination' },
//       { $match: { 'destination.addMore': regex } },
//       { $group: { _id: null, addMoreList: { $addToSet: '$destination.addMore' } } }
//     ]);

//     if (response.length > 0) {
//       const addMoreList = response[0].addMoreList;
//       const msg = "List of Package City List values retrieved successfully";
//       actionCompleteResponse(res, addMoreList, msg);
//     } else {
//       const msg = "No matching Package City values found";
//       actionCompleteResponse(res, [], msg);
//     }
//   } catch (error) {
//     sendActionFailedResponse(res, {}, error.message);
//   }
// };

// new list

exports.packageCityList = async (req, res) => {
  try {

    const keyword=req?.query?.keyword
    if(!keyword){
      return res.status(404).send({status:404,message:"Please Select keyword"})

    }else{
    const regex = new RegExp(escapeRegex(keyword), "gi");

    const cityResponse = await internationl.aggregate([
      { $match: { "destination.addMore": regex ,is_active:1} },
      {
        $group: {
          _id: null,
          addMoreList: { $addToSet: "$destination.addMore" },
        },
      },
    ]);

    const countryResponse = await internationl.aggregate([
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
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//get latest packages

// exports.latestPackages = async (req, res) => {
//   try {
//     const packages = await internationl
//       .find({is_active:1})
//       .sort({createdAt: -1 })
//       .limit(6);

//     if (packages.length > 0) {
//       const msg = "Latest 6 packages search successfully";
//       actionCompleteResponse(res, packages, msg);
//     } else {
//       const msg = "No data found";
//       actionCompleteResponse(res, [], msg);
//     }
//   } catch (error) {
//     sendActionFailedResponse(res, {}, error.message);
//   }
// };


exports.latestPackages = async (req, res) => {
  try {
    // Get the current date
    

    // Fetch all active packages from the database
    const allPackages = await internationl.find({ is_active: 1 }).sort({ createdAt: -1 });

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

  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


//Packages search by insclusions category

exports.beachesPackages = async (req, res) => {
  try {
    const data = req.query.keyword;
    let query = {};
    // for (var key in data) {
      // if (Object.hasOwnProperty.call(data, key)) {
        // var value = data[key];

        query[`insclusions.${data}`] = "true";
      // }
    // }


    const packages = await internationl.find({ $and: [{ is_active: 1 }, query] }).sort({createdAt: -1 });

    if (packages.length > 0) {
      const msg =
        "Successfully retrieved packages through the 'inclusions' category search.";
      actionCompleteResponse(res, packages, msg);
    } else {
      const msg = "No data found";
      actionCompleteResponse(res, [], msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

// package search via country

exports.domesticAndInternational = async (req, res) => {
  try {

    const limit = parseInt(req.query.limit, 10) || 50; // Default to 20 if not provided
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ error: "Country parameter is required." });
    }

    let query;

    if (country === "All") {
      // Handle query for all packages 
      query = {};      
    } else {
      // Handle query for other countries
      query = { country: country };
      
    }

    const count = await internationl.countDocuments({ $and: [{ is_active: 1 }, query] });
    const packages = await internationl.find({ $and: [{ is_active: 1 }, query] }).sort({ updatedAt: -1 }).skip(skip).limit(limit);


    if (packages.length > 0) {
      // const msg = `आपने किया है ${country === 'India' ? 'देशी' : 'विदेशी'} पैकेजं सर्च`;
      const msg = `packages found for ${
        country === "All" ?  "All Countries":country }`;
      actionCompleteResponse(res, packages, msg);
    } else {
      const msg = `No packages found for ${
        country === country ? country : "All Countries"
      } countries`;
      actionCompleteResponse(res, [], msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.domesticAndInternationalWithPagination = async (req, res) => {
  try {

    const limit = parseInt(req.query.limit, 10) || 162; // Default to 20 if not provided
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ error: "Country parameter is required." });
    }

    let query;

    if (country === "All") {
      // Handle query for all packages 
      query = {};      
    } else {
      // Handle query for other countries
      query = { country: country };
      
    }

    const count = await internationl.countDocuments({ $and: [{ is_active: 1 }, query] });
    const packages = await internationl.find({ $and: [{ is_active: 1 }, query] }).sort({ updatedAt: -1 }).skip(skip).limit(limit);

     // Calculate total pages
  const totalPages = Math.ceil(count / limit);
  const modifiedData = packages.map(item => ({
    _id: item?._id,
    pakage_amount: item?.pakage_amount,
    pakage_title:item?.pakage_title,
    package_img:item?.package_img[0],
    pakage_img:item?.pakage_img,
    days:item?.days
  }));

  // Build the response object
  const data = {
    packages:modifiedData,
    // packages,
    totalPages,
    skipPackage:skip,
    currentPage: page,
    totalRecords: count
  };

    if (packages.length > 0) {
      // const msg = `आपने किया है ${country === 'India' ? 'देशी' : 'विदेशी'} पैकेजं सर्च`;
      const msg = `packages found for ${
        country === "All" ?  "All Countries":country }`;
      actionCompleteResponse(res, data, msg);
    } else {
      const msg = `No packages found for ${
        country === country ? country : "All Countries"
      } countries`;
      actionCompleteResponse(res, [], msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

 
// package search by country

exports.countryPackage = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ error: 'Country parameter is required.' });
    }

    const packages = await internationl.find({ $and: [{ is_active: 1 }, {'country':country}] }).sort({createdAt: -1 });

    if (packages.length > 0) {
      const msg =`packages found for ${country}`;
      actionCompleteResponse(res, packages, msg);
    } else {
      const msg = `No packages found for ${country}`;
      actionCompleteResponse(res, [], msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//agent Packages

exports.agentPackages = async (req, res) => {
  try {
    let packages=[];
    const { userId, isActive } = req.params;  
    
    if (userId) {
      const query = isActive? { is_active: isActive, userId: userId } : { userId: userId };
       packages = await internationl.find(query).sort({createdAt: -1 });
    }
    
    const msg = packages.length > 0 ? 'Packages found' : 'No packages found';
    actionCompleteResponse(res, packages, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}   


exports.agentAllPackage= async (req, res) => {
  try {
    let packages=[];
    // const { userId, isActive } = req.params;
    const userId = req.params.userId;
  
    
    
    if (userId) {

       packages = await internationl.find({userId:userId}).sort({createdAt: -1 });
    }
    
    const msg = packages.length > 0 ? 'Packages found' : 'No packages found';
    actionCompleteResponse(res, packages, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}   

//agent Leads

exports.agentLeads = async (req, res) =>{

  try {
    const agent=req.params;
    const agentPackagesData=await internationl.find(agent);
    const filterData = agentPackagesData.map((item) => item._id);

    const userBookings = await UserBooking.find({ packageId: { $in: filterData } }).sort({createdAt: -1 });
    const agentBookings = await packagebookingSchema.find({ pakageid: { $in: filterData } }).sort({createdAt: -1 })

    const response = {
      agentPackages: agentPackagesData,
      userBookings: userBookings,
      agentBookings: agentBookings
    };

    actionCompleteResponse(res, response, "Search");
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);    
  }
}


exports.internationalSetActive = async (req, res) => {
  const { pakageId, isAdmin, activeStatus } = req.body;
  try {
    const user = await User.findById(isAdmin);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === "admin") {
      const response = await internationl.findById(pakageId);
      var size = Object.keys(response).length;
      if (size > 0) {
        const user = await internationl.findOneAndUpdate(
          { _id: pakageId },
          { $set: { is_active: activeStatus } },
          { new: true }
        );
        msg = "pakage successfully Active";
        actionCompleteResponse(res, user, msg);
      }
    } else {
      msg = "only Admin can upadate Active status";
      actionCompleteResponse(res, {}, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

// ========================================> pakage booking request <======================================================//

exports.pakageBookingrequest = async (req, res) => {
  try {
    const data = {
      pakageid: req.body.pakageid,
      userId: req.body.userId,
      email: req.body.email,
      fullName: req.body.fullName,
      contactNumber: {
        contryCode: req.body.contactNumber.contryCode,
        phone: req.body.contactNumber.phone,
      },
      departureCity: req.body.departureCity,
      adults: req.body.adults || 1,
      child: req.body.child || 0,
      selectRoom: req.body.selectRoom || 1,
      checkIndate: req.body.checkIndate,
    };
    const response = await packagebookingSchema.create(data);
    msg = "booking request send successfully to admin";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getALLpakageBookingrequest = async (req, res) => {
  try {
    const bookingRequestData = await packagebookingSchema.find();
    msg = "get all booking request successfully";
    actionCompleteResponse(res, bookingRequestData, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, err.message);
  }
};
exports.pakageBooking = async (req, res) => {
  try {
    const data = new confirmPackagebookingSchema({
      pakageid: req.body.pakageid,
      userId: req.body.userId,
      travellers: req.body.travellers,
      contact_details: req.body.contact_details,
      sale_summary: req.body.sale_summary,
      departureCity: req.body.departureCity,
      adults: req.body.adults || 1,
      child: req.body.child || 0,
    });
    const response = await data.save();
    msg = "booking request send successfully to admin";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};



exports.editPackage = async (req, res, next) => {
  try {
    const {
      packageId,
      pakage_title,
      destination,
      country,
      schedule,
      pakage_amount,
      days,
      insclusions,
      hotel_details,
      insclusion_note,
      exclusion_note,
      detailed_ltinerary,
      overview,
      select_tags,
      term_Conditions,
      cancellation_Policy,
      
    } = req.body;

    const file = req.file;
    // const isPackageExist = await internationl.findOne({ _id: packageId });
    const isPackageExist=await internationl.findOne({_id:packageId})
    if (!isPackageExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PACKAGE_NOT_EXIST,
      });
    }

    if (file) {
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `packageImages/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      try {
        const data = await new Promise((resolve, reject) => {
          s3.upload(s3Params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
        req.body.pakage_img = data.Location;
      } catch (error) {
        return res.status(500).send(error);
      }
    }

    const dataDestination=destination?.map(item => {
      if (item.addMore) {
        item.addMore = item.addMore.toLowerCase().trim(); // Convert to lowercase and trim whitespace
         // Capitalize the first letter
        item.addMore = item.addMore.charAt(0).toUpperCase() + item.addMore.slice(1);
      }
      return item;
    });


    const object = {
      pakage_title:pakage_title,
      pakage_img:req.body.pakage_img,
      destination:dataDestination,
      country:country,
      schedule: schedule,
      days:days,
      pakage_amount: pakage_amount,
      insclusions:insclusions,
      hotel_details:hotel_details,
      insclusion_note:insclusion_note,
      exclusion_note:exclusion_note,
      detailed_ltinerary:detailed_ltinerary,
      overview:overview,
      select_tags:select_tags,
      term_Conditions:term_Conditions,
      cancellation_Policy:cancellation_Policy,
    };
    try {
      const response = await internationl.findOneAndUpdate(
        { _id: isPackageExist._id },
        object,
        { new: true }
      );
      const msg = "Package is updated successfully.";
      actionCompleteResponse(res, response, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  } catch (error) {
    return next(error);
  }
};


exports.internationalgetAdminAll = async (req, res) => {
  try {
    let pagintionData = 10;

    const apiSearch = new Internationalapi(internationl.find({is_active:1}).find(), req.query)
      .search()
      .filter()
      .pagintion(pagintionData);

    let pakage = await apiSearch.query;
    if (pakage.length === 0) {
      // pakage=await internationl.find({ 'destination.addMore': req.query.keyword }).exec();
      pakage = await internationl.find()
        .find({
          $or: [
            {
              destination: {
                $elemMatch: {
                  addMore: { $regex: new RegExp(req.query.keyword, "i") }, // 'i' flag for case-insensitive search
                },
              },
            },
            { country: { $regex: new RegExp(req.query.keyword, "i") } },
          ],
        
        },
        
      )
        .exec();
    }

    for (let p = 0; p < pakage.length; p++) {
      var arr = [];
      var arr1 = [];
      var tags = 0;
      var insclusion = 0;

      for (let i = 0; i < pakage[p].select_tags.length; i++) {
        const key = Object.values(pakage[p].select_tags[i]);
        if (key[0] === true) arr[tags++] = pakage[p].select_tags[i];
      }
      pakage[p].select_tags = arr.slice(0);

      for (let j = 0; j < pakage[p].insclusions.length; j++) {
        const key = Object.values(pakage[p].insclusions[j]);
        if (key[0] === "true") arr1[insclusion++] = pakage[p].insclusions[j];
      }
      pakage[p].insclusions = arr1.slice(0);
    }
    // =================================================================> <======================================//
    const countData = pakage.length;
    let page = Number(req.query.page) || 1;
    let totalPages =
      countData - Math.floor(countData / pagintionData) * pagintionData > 0
        ? Math.floor(countData / pagintionData) + 1
        : Math.floor(countData / pagintionData);
    let skip = pagintionData * (page - 1) || 0;
    let currentPage = page - 1 < 1 ? 1 : page - 1;
    let endingLink =
      currentPage + 3 <= totalPages
        ? currentPage + 3
        : page + (totalPages - page);
    if (endingLink < page) {
      currentPage -= page - totalPages;
    }
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    let data = {
      startIndex: skip,
      endingLink: endingLink,
      currentPage: currentPage,
      totalPages: totalPages,
      pages: pages,
      pakage: pakage,
    };
    // const pakage = await international.find();
    msg = "successfully";
    actionCompleteResponse(res, data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//getAllHolidayPackagesForAdmin


exports.getAllHolidayPackagesForAdmin = async (req, res) => {

  try {
    let pagintionData = 10;

    const apiSearch = new Internationalapi(internationl.find({is_active:1}).find(), req.query)
      .search()
      .filter()
      .pagintion(pagintionData);

    let pakage = await apiSearch.query;
    if (pakage.length === 0) {
      // pakage=await internationl.find({ 'destination.addMore': req.query.keyword }).exec();
      pakage = await internationl.find()
        .find({
          $or: [
            {
              destination: {
                $elemMatch: {
                  addMore: { $regex: new RegExp(req.query.keyword, "i") }, // 'i' flag for case-insensitive search
                },
              },
            },
            { country: { $regex: new RegExp(req.query.keyword, "i") } },
          ],
        
        },
        
      ).select('_id pakage_title days createdAt is_active pakage_amount')
        .exec();
    }

    // for (let p = 0; p < pakage.length; p++) {
    //   var arr = [];
    //   var arr1 = [];
    //   var tags = 0;
    //   var insclusion = 0;

    //   for (let i = 0; i < pakage[p].select_tags.length; i++) {
    //     const key = Object.values(pakage[p].select_tags[i]);
    //     if (key[0] === true) arr[tags++] = pakage[p].select_tags[i];
    //   }
    //   pakage[p].select_tags = arr.slice(0);

    //   for (let j = 0; j < pakage[p].insclusions.length; j++) {
    //     const key = Object.values(pakage[p].insclusions[j]);
    //     if (key[0] === "true") arr1[insclusion++] = pakage[p].insclusions[j];
    //   }
    //   pakage[p].insclusions = arr1.slice(0);
    // }
    // =================================================================> <======================================//
    const countData = pakage.length;
    let page = Number(req.query.page) || 1;
    let totalPages =
      countData - Math.floor(countData / pagintionData) * pagintionData > 0
        ? Math.floor(countData / pagintionData) + 1
        : Math.floor(countData / pagintionData);
    let skip = pagintionData * (page - 1) || 0;
    let currentPage = page - 1 < 1 ? 1 : page - 1;
    let endingLink =
      currentPage + 3 <= totalPages
        ? currentPage + 3
        : page + (totalPages - page);
    if (endingLink < page) {
      currentPage -= page - totalPages;
    }
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    let data = {
      startIndex: skip,
      endingLink: endingLink,
      currentPage: currentPage,
      totalPages: totalPages,
      pages: pages,
      pakage: pakage,
    };
    // const pakage = await international.find();
    msg = "successfully";
    actionCompleteResponse(res, data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
 
};


exports.getAllPackagesList=async(req,res,next)=>{
  try {
    
  } catch (error) {
    return next(error);
  }
}


exports.packageCityData = async (req, res) =>{ 
  const file = req.file; // Access the uploaded file
  const { cityName, description } = req.body;

  const isExistingCityName=await packageCityData.findOne(cityName);

  if(isExistingCityName){
    return  actionCompleteResponse(res, isExistingCityName, "Package city data already exist.");
  }
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `packageImages/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  }; 

    try {
       // Upload file to S3
       const data = await s3.upload(s3Params).promise();
       // Store the URL of the uploaded image
       const newData = new packageCityData({
        cityName,
        description,
        imageUrl: data.Location, // Store the URL of the uploaded image
      });
       // Save to database
       const response = await newData.save();
       msg = "Package Data Created";
        actionCompleteResponse(res, response, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
}


exports.getPackageCityData = async (req, res) =>{
  const data = req?.query?.keyword?.toLowerCase();
    try{
      const response=await packageCityData.findOne({cityName:data}).select('-createdAt -updatedAt -__v');

  msg = "Package City Data";
      actionCompleteResponse(res, response, msg);  
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }

}


//get filter packages based on the amount

exports.packageFilterAmount = async (req, res) => {
  try {
    const { amount } = req.query;

    if (!amount) {
      return res.status(400).json({ error: 'amount parameter is required.' });
    }

    let packages;

    if (amount === "100000") {
      packages = await internationl.find({ is_active: 1, 'pakage_amount.amount': { $lt: parseInt(amount) } }).sort({ 'pakage_amount.amount': 1 });
    } else if (amount === "200000") {
      packages = await internationl.find({ is_active: 1, 'pakage_amount.amount': { $gt: 99999, $lt: parseInt(amount) } }).sort({ 'pakage_amount.amount': 1 });
    } else if (amount === "300000") {
      packages = await internationl.find({ is_active: 1, 'pakage_amount.amount': { $gt: 199999, $lt: parseInt(amount) } }).sort({ 'pakage_amount.amount': 1 });
    } else if (amount === "400000") {
      packages = await internationl.find({ is_active: 1, 'pakage_amount.amount': { $gt: 299999 } }).sort({ 'pakage_amount.amount': 1 });
    }

    if (packages && packages.length > 0) {
      const msg = `Packages found for less than ${amount}`;
      actionCompleteResponse(res, packages, msg);
    } else {
      const msg = `No packages found for this range`;
      actionCompleteResponse(res, [], msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
}

exports.beachesPackagesCategory = async (req, res, next) => {
  try {
    const { page , limit , keyword } = req.query;
    let queryObj = {};
    // Constructing the query based on the provided keyword
    if (keyword) {
      queryObj[`insclusions.${keyword}`] = "true";
    }
    queryObj.is_active = 1;
    const options = {
      page: Number(page)||1,
      limit: Number(limit)||5,
      sort: { createdAt: -1 }
    };

    const result = await internationl.paginate(queryObj, options);
    if (result.docs.length === 0) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.beachesPackagesCategoryArr = async (req, res, next) => {
  try {
    const { page, limit,seeAll,keyword } = req.query;
    let queryObj = {};
    if(seeAll=="true"){
      // for (const key of keywordsArray) {
        queryObj = {
          [`insclusions.${keyword}`]: "true",
          is_active: 1
        };
      // }
        const results=await internationl.find(queryObj);
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          results: results,
          resultsl:results.length
        });
    }
    const categoryArray=await findPackageCategoryData({});
     // Check if keyword exists and is an array
     if (categoryArray.length > 0) {
      const finalRes=[]
      const results = {};
      // Iterate over each keyword
      for (const key of categoryArray) {
        queryObj = {
          [`insclusions.${key.inclusion}`]: "true",
          is_active: 1
        };
        const options = {
          page: Number(page) || 1,
          limit: Number(limit) || 5,
          sort: { createdAt: -1 },
          select:{pakage_amount:1,pakage_title:1,pakage_img:1,days:1,package_img:1,insclusions:1}
        };
        // Perform pagination query
        const result = await internationl.paginate(queryObj, options);
        results[key.inclusion] = result;
      // Push result along with additional information to finalRes array
      finalRes.push({
        inclusion: key.inclusion,
        result: result,
        colorCode: key.colorCode,
        Icon: key.images,
        headingCode:key.headingCode
      });

      }
      
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        results: finalRes,
      });
    } 
  } catch (error) {
    return next(error);
  }
};

exports.getPackageByCategory=async(req,res,next)=>{
  try {
    const data = req.query.keyword;
    const modified=data.replace(/\s+/g, '').toLowerCase();
   let query={};
   query[`select_tags.${modified}`] = "true";
   const result = await internationl.find({ $and: [{ is_active: 1 }, query] });
   if(result.length==0){
    return res.status(statusCode.OK).send({
      statusCode: statusCode.NotFound,
      responseMessage: responseMessage.DATA_NOT_FOUND,
      // result: result,
    });
   }
   return res.status(statusCode.OK).send({
    statusCode: statusCode.OK,
    responseMessage: responseMessage.DATA_FOUND,
    result: result,
  });
  } catch (error) {
    return next(error);
  }
}

exports.getPackageByLocation=async(req,res,next)=>{
  try {
    const {city}=req.query;
    let query={};
    query[`destination.addMore`] = city;
    const result=await internationl.find({$and:[{ is_active: 1 },{$or:[{'destination.addMore':city},{country:city}]}]});
    if(result.length==0){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
     }
     return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
}

exports.beachesPackagesCategoryArr1 = async (req, res, next) => {
  try {
    const { page, limit,seeAll,keyword } = req.query;
    let queryObj = {};
    if(seeAll=="true"){
      // for (const key of keywordsArray) {
        queryObj = {
          [`insclusions.${keyword}`]: "true",
          is_active: 1
        };
      // }\
        const results=await internationl.find(queryObj);
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          results: results,
          resultsl:results.length
        });
    }
    const categoryArray=await findPackageCategoryData({});
     // Check if keyword exists and is an array
     if (categoryArray.length > 0) {
      const finalRes=[]
      const results = {};
      // Iterate over each keyword
      for (const key of categoryArray) {
        
        queryObj = {
          [`insclusions.${key.inclusion}`]: "true",
          is_active: 1
        };
        const options = {
          page: Number(page) || 1,
          limit: Number(limit) || 5,
          sort: { createdAt: -1 },
          select:{pakage_amount:1,pakage_title:1,pakage_img:1,days:1}
        };
        // Perform pagination query
        const result = await internationl.paginate(queryObj, options, {
          
        });
      // Push result along with additional information to finalRes array
      // const modifiedobject={}
      // for(const data of result.docs){

      // }
      finalRes.push({
        inclusion: key.inclusion,
        result,
        colorCode: key.colorCode,
        Icon: key.images,
        headingCode:key.headingCode
      });

      }
      
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        results: finalRes,
      });
    } 
  } catch (error) {
    return next(error);
  }
};

//b2c landing page packages enquiry data
exports.packagesEnquiry = async (req, res) =>{

  try {

    const results=await packageEnquirySchema.create(req.body);

    await commonFunctions.packageLandingPageMail(results);

    actionCompleteResponse(res, results, "Enquiry for Pacakge Booking");

    
  } catch (err) {
    sendActionFailedResponse(res, {err}, err.message);
    
  }
  
}




//getLocationWisePackages

exports.getLocationWisePackages = async (req, res) =>{


  try{
  const data=await internationl.find({})


 

    actionCompleteResponse(res, data, "msg");
} catch (err) {
  sendActionFailedResponse(res, {}, err.message);
}
  



}



//createPackageSpecialCity

exports.createPackageSpecialCity = async (req, res) =>{

    const file = req?.file; // Access the uploaded file
    // const { country, destination ,startFrom} = JSON.parse(req?.body?.data);
    const { country, destination ,startFrom} = req?.body;

    if(!file){
      return  res.status(404).send({status:404,message:"select jpg/png file"});
    }

    if(!country || !destination || !startFrom){
      return  res.status(404).send({status:404,message:"country, destination and startFrom value can't be null"});
    }

    

    // console.log(req.body.data,req.body)
  
    const isExistingSpecialCityName=await specialPackageCityData.findOne({destination});
  
    if(isExistingSpecialCityName){
      return  actionCompleteResponse(res, isExistingSpecialCityName, "Special Package city data already exist.");
    }
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `packageImages/packageSpecialCity/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    }; 
  
      try {
         // Upload file to S3
         const data = await s3.upload(s3Params).promise();
         // Store the URL of the uploaded image
         const newData = new specialPackageCityData({
          country,
          destination,
          imageUrl: data.Location, // Store the URL of the uploaded image
          startFrom
        });
         // Save to database
         const response = await newData.save();
         msg = "Special Package Data Created";
          actionCompleteResponse(res, response, msg);

} catch (err) {
  sendActionFailedResponse(res, {}, err.message);
}
  



}



//getPackageSpecialCity
exports.getPackageSpecialCity = async (req, res) =>{
  try{
    const data=await specialPackageCityData.find({ status: "ACTIVE" })
    .sort({ createdAt: -1 }).select('-createdAt -updatedAt -__v');
    if(data.length===0){
    return res.status(404).send({status:404, message:"No data Found"})
    }

    actionCompleteResponse(res, data, "Special Package Cities retrieved successfully.");
} catch (err) {
  sendActionFailedResponse(res, {}, err.message);
}
  



}

exports.getPackageSpecialCityById = async (req, res) =>{

  try {
    const id=req?.params?.id;
    
    if (!id) {
      return res.status(400).json({
        status: 400,
        message: 'No valid data provided for update.',
      });
    }

    const packageCityData = await specialPackageCityData.findById(id)

    if (!packageCityData) {
      return res.status(404).json({
        status: 404,
        message: 'Special City Package not found.',
      });
    }

    // Send back the updated data
    actionCompleteResponse(res,packageCityData ,'Special City Package found successfully.');

    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
}
//updatePackageSpecialCityById

exports.updatePackageSpecialCityById = async (req, res) =>{

  try {
    const id=req?.params?.id;
    const updateData = req?.body;
    // console.log(updateData)

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No valid data provided for update.',
      });
    }

    const updatedCityData = await specialPackageCityData.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }  // `new: true` to return updated document
    );

    if (!updatedCityData) {
      return res.status(404).json({
        status: 404,
        message: 'Special City Package not found.',
      });
    }

    // Send back the updated data
    actionCompleteResponse(res,updatedCityData ,'Special City Package updated successfully.');

    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
}


//deletePackageSpecialCity

exports.deletePackageSpecialCity = async (req, res) => {
      
    try {
      const id = req?.params?.id;
  
      if (!id) {
        return res.status(400).json({
          status:400,
          message: "ID parameter is required."
        });
      }
  
      // Attempt to delete the record
      const data = await specialPackageCityData.findByIdAndRemove(id);
  
      // Check if deletion was successful
      if (data) {
        return res.status(200).json({
          status:200,
          message: "Special package city deleted successfully."
        });
      } else {
        return res.status(404).json({
          status:404,
          message: "Special package city not found."
        });
      }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
}







// Function to shuffle an array using the Fisher-Yates (Durstenfeld) algorithm
function shuffleArray(array) {
  const arr = [...array]; // Clone the array to avoid mutation
  let currentIndex = arr.length, randomIndex, temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex); // Random index
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}
