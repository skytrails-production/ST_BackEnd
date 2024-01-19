const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const {
  internationl,
  packagebookingSchema,
  confirmPackagebookingSchema,
} = require("../model/international.model");
const aws = require("aws-sdk");
const Internationalapi = require("../utilities/Internationalapi");
const { object } = require("joi");
const User = require("../model/user.model");
const Role = require("../model/role.model");
const { response } = require("express");
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.internationalCreate = async (req, res) => {
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
      const data1 = new internationl({
        userId:reqData.userId,
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
      });
      try {
        const response = await data1.save();
        msg = "Pakage is created";
        actionCompleteResponse(res, response, msg);
      } catch (err) {
        sendActionFailedResponse(res, {}, err.message);
      }
    }
  });
};

exports.internationalupdate = async (req, res) => {
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
        // console.log(user);
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
    // console.log(pakage.pakage_img);
    actionCompleteResponse(res, pakage, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.internationalDelete = async (req, res) => {
  try {
    const user = await User.findById(req.body.isAdmin);
    // console.log(user);
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
    // console.log("data",apiSearch.length);

    let pakage = await apiSearch.query;
    // console.log(pakage.length,"package")
    if (pakage.length === 0) {
      // console.log(req.query)
      // pakage=await internationl.find({ 'destination.addMore': req.query.keyword }).exec();
      pakage = await internationl.find({is_active:1})
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
        })
        .exec();
      // console.log(pakage,"data")
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

// inactive packages

exports.inactivePackages = async (req, res) =>{
  try {

    const data=await internationl.find({is_active:0});

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
    const regex = new RegExp(escapeRegex(req.query.keyword), "gi");

    const cityResponse = await internationl.aggregate([
      { $match: { "destination.addMore": regex } },
      {
        $group: {
          _id: null,
          addMoreList: { $addToSet: "$destination.addMore" },
        },
      },
    ]);

    const countryResponse = await internationl.aggregate([
      { $match: { country: regex } },
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
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//get latest packages

exports.latestPackages = async (req, res) => {
  try {
    const packages = await internationl
      .find({is_active:1})
      .sort({ "pakage_amount.amount": 1, createdAt: -1 })
      .limit(6);

    if (packages.length > 0) {
      const msg = "Latest 6 packages search successfully";
      actionCompleteResponse(res, packages, msg);
    } else {
      const msg = "No data found";
      actionCompleteResponse(res, [], msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//Packages search by insclusions category

exports.beachesPackages = async (req, res) => {
  try {
    const data = req.query;
    let query = {};

    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        var value = data[key];

        query[`insclusions.${key}`] = value;
      }
    }

    // console.log('Generated Query:', query);

    const packages = await internationl.find({ $and: [{ is_active: 1 }, query] });

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
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ error: "Country parameter is required." });
    }

    let query;

    if (country === "India") {
      // Handle query for Indian packages
      query = { country: "India" };
    } else {
      // Handle query for other countries
      query = { country: { $ne: "India" } };
    }

    const packages = await internationl.find({ $and: [{ is_active: 1 }, query] });

    if (packages.length > 0) {
      // const msg = `आपने किया है ${country === 'India' ? 'देशी' : 'विदेशी'} पैकेजं सर्च`;
      const msg = `packages found for ${
        country === "India" ? "Indian" : "others countries"
      }`;
      actionCompleteResponse(res, packages, msg);
    } else {
      const msg = `No packages found for ${
        country === "India" ? "Indian" : "other"
      } countries`;
      actionCompleteResponse(res, [], msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


//package search by country

exports.countryPackage = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ error: 'Country parameter is required.' });
    }

    const packages = await internationl.find({ $and: [{ is_active: 1 }, {'country':country}] });

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




exports.internationalSetActive = async (req, res) => {
  const { pakageId, isAdmin, activeStatus } = req.body;
  try {
    const user = await User.findById(isAdmin);
    // console.log(user);
    const role = await Role.findById(user.roles[0].toString());
    //  console.log(r.name);
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
    const isPackageExist = await internationl.findOne({ _id: packageId });

    if (!isPackageExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PACKAGE_NOT_EXIST,
      });
    }

    if (file) {
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
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
        console.error("Error during S3 upload:", error);
        return res.status(500).send(error);
      }
    }
    const object = {
      pakage_title:pakage_title,
      pakage_img:req.body.pakage_img,
      destination:destination,
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
    console.log("Error while editing package.", error);
    return next(error);
  }
};
