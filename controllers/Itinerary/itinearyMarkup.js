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
    itineraryMarkupServices,
} = require("../../services/itineraryServices/itineraryMarkup");
const {
    createItineraryMarkup,
    finOneItineraryMarkup,
    findAllItineraryMarkup,
    deleteItineraryMarkup,
    updateItineraryMarkup,
} = itineraryMarkupServices;

exports.createItinearyMarkup = async (req, res, next) => {
  try {
    const {originCity,destinationCity, value,valueType} = req.body;
  const obj={
    originCity,destinationCity,markup:{value,valueType}
  }
  const findIsExist = await finOneItineraryMarkup({originCity:originCity,destinationCity:destinationCity});
  if(findIsExist){
    const updateData=await updateItineraryMarkup({_id:findIsExist._id},obj);
    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: updateData,
      });
  }
    const result = await createItineraryMarkup(obj);
    return res.status(statusCode.created).send({
      statusCode: statusCode.created,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.finOneItinearyMarkup = async (req, res, next) => {
  try {
    const {originCity,destinationCity} = req.query;
    const result = await finOneItineraryMarkup({originCity:originCity,destinationCity:destinationCity});
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

exports.findAllItinearyMarkup = async (req, res, next) => {
  try {
    // const { } = req.body;
    const result = await findAllItineraryMarkup({});
    if (!result) {
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

exports.deleteItinearyMarkup=async(req,res,next)=>{
    try {
        const{id}=req.body;
    //     const result = await finOneItinearyMarkup({ _id: id });
    // if (!result) {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.NotFound,
    //     responseMessage: responseMessage.DATA_NOT_FOUND,
    //   });
    // }
    const deletedData=await deleteItineraryMarkup({_id:id});
    return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DELETE_SUCCESS,
        result:deletedData
      });
    } catch (error) {
        return next(error);
    }
}

exports.updateItineraryMrkup=async(req,res,next)=>{
    try {
        const {}=req.body;
        const updatedData=await updateItineraryMarkup();
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result: updatedData,
          });
    } catch (error) {
       return next(error);
    }
}

