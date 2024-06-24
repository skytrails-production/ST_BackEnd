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
const {packageCreatorModelServices}=require('../../services/itineraryServices/packageCreatorServices');
const {createPckgCreator,finOnePckgCreator,findAllPckgCreator,deletePckgCreator,updatePckgCreator}=packageCreatorModelServices;



//*******************************************API'S******************************************************/

exports.SignUp=async(req,res,next)=>{
    try {
        // const {userName,email,password,mobileNumber,firstName,lastName,gender}
    } catch (error) {
        console.log("Error while trying to registeration",error);
        return next(error);
    }
}