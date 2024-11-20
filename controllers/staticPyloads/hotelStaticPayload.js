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
const { hotelPayloadServices } = require("../../services/staticPayloads/hotelStaticPayload");
const {createhotelPayload,findhotelPayload,findhotelPayloadData,deletehotelPayloadStatic,updatehotelPayloadStatic} = hotelPayloadServices;
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  
exports.createStaticHotelPayload=async(req,res,next)=>{
    try {
        const {cityName,tboCityCode,tboCountryName,tboCountryCode,tbostateProvince,tbostateProvinceCode,grnCityCode,grnCountryName,grnCountryCode,isTrending,isInternational}=req.body;
        if(req.file){
            const images=await commonFunction.getImageUrlAWSByFolderSingle(req.file,"hotelStaticPayload");
            req.body.image=images;
        }
        const result= await createhotelPayload(req.body);
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

exports.getListOfStaticHotelPayload=async(req,res,next)=>{
    try {
        const result=await findhotelPayloadData({});
        if(result.length<1){
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
        const updatePayload=await updatehotelPayloadStatic({_id:payloadId},{isTrending:value});
        return res.status(statusCode.OK).json({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result:updatePayload
          });
    } catch (error) {
        return next(error);
    }
}