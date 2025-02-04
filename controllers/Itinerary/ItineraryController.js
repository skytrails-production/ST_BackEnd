const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");

//*****************************************SERVICES************************************************/
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
  ItineraryServices,
} = require("../../services/itineraryServices/proposal");
const {
  createProposal,
  finOneProposal,
  findAllProposal,
  deleteProposal,
  updateProposal,
} = ItineraryServices;

exports.ourProposal = async (req, res, next) => {
  try {
    const data = {...req.body};
    // req.body.hotelDetails = JSON.parse(hotelDetails);
    // req.body.flightDetails = JSON.parse(flightDetails);
    // let media=[];
    // if (req.files) {
    //     for(const img of req.files){
    //         const secureurl = await commonFunction.getImageUrlAWS(img);
    //         media.push(secureurl);
    //     }
    //     req.body.packageGallery=media;
    // }
    const result = await createProposal(data);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getProposalById=async(req,res,next)=>{
  try {
    const {proposalId}=req.query;
    const result=await finOneProposal({_id:proposalId});
    if(!result){
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

exports.getAllProposal=async(req,res,next)=>{
  try {
    const result=await findAllProposal({});
    if(result.length<1){
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
