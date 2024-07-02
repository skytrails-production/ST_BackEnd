const appPromoEvent = require("../../model/btocModel/appPromoEvent");
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus = require("../../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
//**************************************WORK BY****************/
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

exports.createDayWiseActivity = async (req, res, next) => {
  try {
    const { destination, origin, dayAt,activities } = req.body;
    console.log("req.body===========",req.body)
    const object = {
      destination,
      origin,
      dayAt,
      activities
    };
    console.log("object=============",object)
    const result = await createDayWiseItinerary(object);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to create itinerary", error);
    return next(error);
  }
};

exports.getDayWiseActivity = async (req, res, next) => {
  try {
    const { origin, destination,noOfDays } = req.query;
    const result = await findAllDayWiseItinerary({
      destination: destination,
      origin: origin,
      noOfDays:noOfDays
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
    console.log("error while trying to get daywise activity", error);
    return next(error);
  }
};

exports.updateDayWiseActivity = async (rqe, res, next) => {
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
    console.log("error while trying to get daywise activity", error);
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
        console.log("error while trying to delete",error);
        return next(error);
    }
}
