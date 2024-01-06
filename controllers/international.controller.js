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
        pakage_title: reqData.pakage_title,
        pakage_img: data.Location,
        destination: reqData.destination,
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
        console.log(user);
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
    console.log(pakage.pakage_img);
    actionCompleteResponse(res, pakage, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.internationalDelete = async (req, res) => {
  try {
    const user = await User.findById(req.body.isAdmin);
    console.log(user);
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

    const apiSearch = new Internationalapi(internationl.find(), req.query)
      .search()
      .filter()
      .pagintion(pagintionData);
      // console.log("data",apiSearch.length);

    let pakage = await apiSearch.query;
    // console.log(pakage.length,"package")
  if(pakage.length=== 0){
    console.log(req.query)
    // pakage=await internationl.find({ 'destination.addMore': req.query.keyword }).exec();
    pakage=await internationl.find({
      'destination': {
        $elemMatch: {
          'addMore': { $regex: new RegExp(req.query.keyword, 'i') } // 'i' flag for case-insensitive search
        }
      }
    }).exec();
    console.log(pakage,"data")
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

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
exports.packageCityList = async (req, res) => {
  try {
    const regex = new RegExp(escapeRegex(req.query.keyword), "gi");
    
    const response = await internationl.aggregate([
      { $match: { 'destination.addMore': regex } },
      { $unwind: '$destination' },
      { $match: { 'destination.addMore': regex } },
      { $group: { _id: null, addMoreList: { $addToSet: '$destination.addMore' } } }
    ]);
    
    if (response.length > 0) {
      const addMoreList = response[0].addMoreList;
      const msg = "List of Package City List values retrieved successfully";
      actionCompleteResponse(res, addMoreList, msg);
    } else {
      const msg = "No matching Package City values found";
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
    console.log(user);
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
