const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');

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
const   {ItineraryServices}=require('../../services/itineraryServices/proposal');
const {createProposal,finOneProposal,findAllProposal,deleteProposal,updateProposal}=ItineraryServices;

exports.ourProposal=async(req,res,next)=>{
    try {
        const {pakageTitle,destination,country,days,flexible,fixedDeparture,currency,amount,insclusions,highlights,insclusionNote,exclusionNote,detailedItinerary,overview,selectTags,termConditions,cancellationPolicy,hotelDetails,flightDetails,}=req.body;
        // req.body.hotelDetails = JSON.parse(hotelDetails);
        // req.body.flightDetails = JSON.parse(flightDetails);
        let media=[];
        if (req.files) {
            for(const img of req.files){
                const secureurl = await commonFunction.getImageUrlAWS(img);
                media.push(secureurl);
            }
            req.body.packageGallery=media;
        }
        const result=await createProposal(req.body);
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.CREATED_SUCCESS,
            result: result,
          });
    } catch (error) {
        console.log("error while trying to save proposal",error);
        return next(error)
    }
}

// exports.