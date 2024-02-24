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
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;

const { advertisementServices } = require("../../services/btocServices/advertisementServices");
const { createadvertisement, findadvertisementData, deleteadvertisement, advertisementList, updateadvertisement, countTotaladvertisement ,getAdvertisment} = advertisementServices;
const { flightadvertisementServices } = require("../../services/btocServices/flightAdvertismentServices");
const { createflightadvertisement, findflightadvertisementData, deleteflightadvertisement, advertisementflightList, updateflightadvertisement, countTotalflightadvertisement ,getflightAdvertisment} =flightadvertisementServices;
const { hoteladvertisementServices } = require("../../services/btocServices/hotelAdvertisementServices");
const {createhoteladvertisement,findhoteladvertisementData,deletehoteladvertisement,hoteladvertisementList,updatehoteladvertisement,countTotalhoteladvertisement,gethotelAdvertisment}=hoteladvertisementServices;
const { busadvertisementServices } = require("../../services/btocServices/busAdvertiseMentServices");
const {createbusadvertisement,findbusadvertisementData,deletebusadvertisement,advertisementbusList,updatebusadvertisement,countbusTotaladvertisement,getbusAdvertisment}=busadvertisementServices;
const {visaApplicationServices}=require("../../services/btocServices/visaApplicationServices");
const {createUserVisaApplication,findUserVisaApplication,deleteUserVisaApplication,userVisaApplicationList,updateUserVisaApplication,countTotalUserVisaApplication}=visaApplicationServices;
//*************************Api controllers**************************************

exports.createVisaApplication=async(req,res,next)=>{
    try {
        const {}=req.body;
        
    } catch (error) {
        
    }
}