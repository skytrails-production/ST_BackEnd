//common response****************
const statusCode = require('../../utilities/responceCode');
const responseMessage = require('../../utilities/responses');
const commonFunctions = require("../../utilities/commonFunctions");
//*********SERVICES********************* */
const { visaServices } = require('../../services/visaServices');
const { createWeeklyVisa, findWeeklyVisa,populatedVisaList, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa, weeklyVisaListPaginate, getNoVisaByPaginate, montholyVisaListPaginate, onarrivalVisaListPaginate } = visaServices;
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;
const {visaCategoryServices}=require("../../services/visaAppServices/visaCategoryServices");
const {createVisaCategory,findVisaCategoryData,deleteVisaCategory,visaCategoryList,updateVisaCategory,countTotalVisaCategory,getVisaCategory}=visaCategoryServices;


exports.getAllVisaCountry=async(req,res,next)=>{
    try {
       const result=await populatedVisaList({status:status.ACTIVE});
       if(!result||result.length==0){
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_NOT_FOUND});
    }
    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    
    } catch (error) {
        console.log("error while get visaCountry.",error);
        return next(error )
    }
}
