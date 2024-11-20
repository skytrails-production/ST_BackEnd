const commonFunction = require("../../utilities/commonFunctions");
const approvestatus = require("../../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../../utilities/responceCode");
const responseMessage = require("../../utilities/responses");
// const sendSMS = require("../utilities/sendSms");
// const whatsappAPIUrl = require("../utilities/whatsApi");
// const userType = require("../enums/userType");
// const status = require("../enums/status");
const Moment = require("moment");

const {
    cityData,
    cityBusData,
    newhotelCityCode,
    cityBusProductionData,
    airlineData
  } = require("../../model/city.model");
const { userServices } = require("../../services/userServices");
const {
    createUser,
    findUser,
    getUser,
    findUserData,
    updateUser,
    paginateUserSearch,
    countTotalUser,
    aggregatePaginateUser,
  } = userServices;
const { flightPayloadServices } = require("../../services/staticPayloads/flightStaticPayload");
const {createflightPayload,findflightPayload,findflightPayloadData,deleteflightPayloadStatic,updateflightPayloadStatic} = flightPayloadServices;
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  const { hotelPayloadServices } = require("../../services/staticPayloads/hotelStaticPayload");
  const {createhotelPayload,findhotelPayload,findhotelPayloadData,deletehotelPayloadStatic,updatehotelPayloadStatic} = hotelPayloadServices;

  
exports.createStaticFlightPayload=async(req,res,next)=>{
    try {
        const {id,from,destination,airportDepCode,airportArrCode,fromDetails,to}=req.body;
        req.body.combineCode=`${airportDepCode}-${airportArrCode}`;
        if(req.file){
            const images=await commonFunction.getImageUrlAWSByFolderSingle(req.file,"flightPayload")
            req.body.images=images;
        }
        const result= await createflightPayload(req.body);
        return res.status(statusCode.OK).json({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.CREATED_SUCCESS,
            result:result
          });
        // const cityData=await cityData.find({});
    } catch (error) {
        return next(error);
    }
}

exports.getListOfStaticFlightPayload=async(req,res,next)=>{
    try {
        const flightPayloadResult=await findflightPayloadData({});
        const hotelPayloadResult=await findhotelPayloadData({});
        const result={flightPayloadResult,hotelPayloadResult}
        if(flightPayloadResult.length<1&&hotelPayloadResult<1){
            return res.status(statusCode.OK).json({
                statusCode: statusCode.NotFound,
                message: responseMessage.DATA_NOT_FOUND,
              });
        }
        return res.status(statusCode.OK).json({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result:result
          });
    } catch (error) {
        return next(error);
    }
}

exports.makeTrending=async(req,res,next)=>{
    try {
        const {payloadId,value}=req.body;
        const updatePayload=await updateflightPayloadStatic({_id:payloadId},{isTrending:value});
        return res.status(statusCode.OK).json({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result:updatePayload
          });
    } catch (error) {
        return next(error);
    }
}