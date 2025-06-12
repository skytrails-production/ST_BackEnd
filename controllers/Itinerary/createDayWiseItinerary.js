const appPromoEvent = require("../../model/btocModel/appPromoEvent");
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus = require("../../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
//******************************************WORK BY*********************************************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const {
  createDayWiseItineraryServices,
} = require("../../services/itineraryServices/dayWiseItinerary");
const {
  createDayWiseItinerary,
  finOneDayWiseItinerary,
  findAllDayWiseItinerary,
  deleteDayWiseItinerary,
  updateDayWiseItinerary,
} = createDayWiseItineraryServices;
const {
    itineraryMarkupServices,
} = require("../../services/itineraryServices/itineraryMarkup");
const {
    createItineraryMarkup,
    finOneItineraryMarkup,
    findAllItineraryMarkup,
    deleteItineraryMarkup,
    updateItineraryMarkup,
} = itineraryMarkupServices;

exports.createDayWiseActivity = async (req, res, next) => {
  try {
    // Sanitize all string fields in req.body
    const sanitizeRequestBody = (body) => {
      for (let key in body) {
        if (body.hasOwnProperty(key) && typeof body[key] === "string") {
          body[key] = body[key].trim();
        }
      }
    };

    sanitizeRequestBody(req.body);

    let { destination, origin, dayAt, activities, noOfDays } = req.body;

    // Validate required fields
    if (!destination || !origin || !dayAt || !activities || !noOfDays) {
      return res.status(400).json({
        statusCode: 400,
        responseMessage: "All fields (destination, origin, dayAt, activities, noOfDays) are required.",
      });
    }

    // Build base object
    const itineraryData = {
      destination,
      origin,
      dayAt: dayAt, 
      activities: activities, 
      noOfDays,
    };

    // Check if a matching itinerary exists
    const isExist = await finOneDayWiseItinerary({
      destination,
      origin,
      noOfDays,
    });

    let result;

    if (isExist) {
      // Update existing document by pushing to arrays
      result = await updateDayWiseItinerary(
        { _id: isExist._id },
        {
          $push: {
            dayAt: dayAt,
            activities: activities,
          },
        }
      );
    } else {
      // Create new itinerary document
      result = await createDayWiseItinerary(itineraryData);
    }

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result,
    });
  } catch (error) {
    return next(error);
  }
};


exports.getDayWiseActivity = async (req, res, next) => {
  try {
    const { origin, destination,noOfDays } = req.query;
    const noOfDay1=parseInt(noOfDays)+1;
    const result = await findAllDayWiseItinerary({
      destination: destination,
      origin: origin,
      noOfDays:String(noOfDay1)
    });
    if (result.length < 1) {
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
};

exports.updateDayWiseActivity = async (req, res, next) => {
  try {
    const { id, destination, origin, dayAt } = req.body;
    const result = await finOneDayWiseItinerary({ _id: id });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const updatedData = await updateDayWiseItinerary({_id:result._id},req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: updatedData,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteDayWiseActivity=async(req,res,next)=>{
    try {
        const{id}=req.body;
        const result = await finOneDayWiseItinerary({ _id: id });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const deletedData=await deleteDayWiseItinerary({_id:result._id})
    } catch (error) {
        return next(error);
    }
}
