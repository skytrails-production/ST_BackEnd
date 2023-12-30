const Joi = require("joi");

const {
  offers,
} = require("../../model/offers/offer.model");

const { offerSchemaValidation } = require("../../model/offers/offer.model");
const { Offer } = require("../../model/offers/offer.model");
const { userServices } = require("../../services/userServices");
const { createUser, findUser, getUser, findUserData, updateUser } =
  userServices;

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
// const status = require("../../enums/status");
const offerType = require("../../enums/offerType");

exports.createOffer = async (req, res) => {
  const {
    userId,
    title,
    discount,
    promocode,
    offerdetails,
    status,
    offertype,
  } = req.body;
  var media;
  const isUser = await findUser({ _id: userId });
  if (!isUser) {
    return sendActionFailedResponse(res, {}, "User not found");
  }
  media = req.files.map(async (singleFile) => {
    const finalLocation = `/${singleFile.Key}`;
    return {
      mediaType: "photo",
      link: finalLocation,
    };
  });
  media = await Promise.all(media);

  // Example data to validate
  const dataToValidate = {
    userId: isUser._id,
    title: title,
    media: media,
    discount: {
      amount: discount,
      type: "percentage",
    },
    use_code: promocode,
    offerdetails: offerdetails,
    status: status,
    offertype: offertype,
  };

  try {
    // Validate the data using Joi
    const { error, value } = offerSchemaValidation.validate(dataToValidate);

    if (error) {
      sendActionFailedResponse(res, {}, error.details);
      console.error("Validation error:", error.details);
    } else {
      // Data is valid, you can proceed to save it to the database
      const newOffer = new Offer(value);
      newOffer
        .save()
        .then((savedOffer) => {
          const msg = "Offer saved successfully.";
          actionCompleteResponse(res, savedOffer, msg);
          console.log("Offer saved:", savedOffer);
        })
        .catch((err) => {
          sendActionFailedResponse(res, {}, err.message);
          console.error("Error saving offer:", err);
        });
    }
  } catch (validationError) {
    // Handle any errors that occur during validation
    sendActionFailedResponse(res, {}, validationError.message);
    console.error("Validation error:", validationError);
  }
};


// exports.getOffer = async (req, res) => {
//   try {
//     const { offertype } = req.query;
//     console.log("======================",req.query);
//     let response;
//     if (offertype === offerType.BANKOFFERS) {
//       response = await offers.find({
//         offertype: offerType.BANKOFFERS,
//       });
//     } else if (offertype === offerType.CABS) {
//       response = await offers.find({
//         offertype: offerType.CABS,
//       });
//     } else if (offertype === offerType.FLIGHTS) {
//       response = await offers.find({
//         offertype: offerType.FLIGHTS,
//       });
//     } else if (offertype === offerType.HOLIDAYS) {
//       response = await offers.find({
//         offertype: offerType.HOLIDAYS,
//       });
//     } else if (offertype === offerType.HOTELS) {
//       response = await offers.find({
//         offertype: offerType.HOTELS,
//       });
//     } else if (offertype === offerType.TRAINS) {
//       response = await offers.find({
//         offertype: offerType.TRAINS,
//       });
//     } else {
//       console.log("=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
//       response = await offers.find({});
//       console.log("response==========",response);
//     }
//     const msg = "Offer get data successfully.";
//     actionCompleteResponse(res, result, msg);
//   } catch (error) {
//     console.log("error=====>>>",error);
//     sendActionFailedResponse(res, {}, err.message);
//   }
// };

exports.getOffer = async (req, res) => {
  try {
    const { offertype, page = 1, pageSize = 10 } = req.query; // Set default values for page and pageSize

    const matchStage = {
      $match: {
        offertype: offertype ? offertype : offerType.BANKOFFERS,
      },
    };

    const lookupStage = {
      $lookup: {
        from: 'users', // Replace 'users' with the actual name of your User collection
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    };

    const unwindStage = { $unwind: '$user' };

    const totalOffers = await Offer.aggregate([
      matchStage,
      lookupStage,
      unwindStage,
      {
        $count: 'total',
      },
    ]);

    const options = [
      matchStage,
      lookupStage,
      unwindStage,
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];

    const response = await Offer.aggregate(options);

    const msg = "Offer data retrieved successfully.";
    const result = {
      offers: response,
      totalOffers: totalOffers.length > 0 ? totalOffers[0].total : 0,
      currentPage: page,
      pageSize: pageSize,
    };

    actionCompleteResponse(res, result, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};



exports.updateOffer = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      const msg = "id is required";
      sendActionFailedResponse(res, {}, msg);
    }
    const isDataExist = await Offer.findOne({
      _id: id,
    });
    if (!isDataExist) {
      const msg = "Data not found";
      sendActionFailedResponse(res, {}, msg);
    }
    const result = await Offer.updateOne({ _id: isDataExist._id }, req.body);
    const msg = "Offer updated successfully.";
    actionCompleteResponse(res, result, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.deleteOffer = async (req, res) => {
  const OfferDataId = req.body.id;
  try {
    if (!OfferDataId) {
      const msg = "OfferDataId is required";
      sendActionFailedResponse(res, {}, msg);
    }
    const isDataExist = await Offer.findOne({
      _id: OfferDataId,
    });
    if (!isDataExist) {
      const msg = "Data not found";
      sendActionFailedResponse(res, {}, msg);
    }
    const result = await Offer.deleteOne({ _id: isDataExist._id });
    const msg = "Offer delete successfully.";
    actionCompleteResponse(res, result, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
