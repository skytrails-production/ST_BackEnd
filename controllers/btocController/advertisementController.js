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
const { advertisementServices } = require("../../services/btocServices/advertisementServices");
const { createadvertisement, findadvertisementData, deleteadvertisement, advertisementList, updateadvertisement, countTotaladvertisement ,getAdvertisment} = advertisementServices;
const { flightadvertisementServices } = require("../../services/btocServices/flightAdvertismentServices");
const { createflightadvertisement, findflightadvertisementData, deleteflightadvertisement, advertisementflightList, updateflightadvertisement, countTotalflightadvertisement ,getflightAdvertisment} =flightadvertisementServices;
const { hoteladvertisementServices } = require("../../services/btocServices/hotelAdvertisementServices");
const {createhoteladvertisement,findhoteladvertisementData,deletehoteladvertisement,hoteladvertisementList,updatehoteladvertisement,countTotalhoteladvertisement,gethotelAdvertisment}=hoteladvertisementServices;
const { busadvertisementServices } = require("../../services/btocServices/busAdvertiseMentServices");
const {createbusadvertisement,findbusadvertisementData,deletebusadvertisement,advertisementbusList,updatebusadvertisement,countbusTotaladvertisement,getbusAdvertisment}=busadvertisementServices;


exports.createadvertismentController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {  title, content, startDate, endDate, remainingDays} = req.body;
        // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        // if (!isAdmin) {
        //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await createadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });
    } catch (error) {
        console.log("error: ", error);
        return next(error);
    }
}

exports.updateadvertisementController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {  title, content, startDate, endDate, remainingDays,advertisementId } = req.body
        const isExist=await findadvertisementData({_id:advertisementId,status:status.ACTIVE});
        if(!isExist){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await updateadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}
// approvalStatus:{$nin:[approvalStatus.PENDING,approvalStatus.REJECT]},
exports.getadvertisementController = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
       
        const result=await getAdvertisment(req.query);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    } catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
}


// flight adds ********************************************************
exports.createflightadvertismentController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {  title, content, startDate, endDate, remainingDays } = req.body;
        // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        // if (!isAdmin) {
        //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await createflightadvertisement(object);
        if(!result){
            return res.status(statusCode.InternalError).send({statusCode:statusCode.InternalError,responseMessage:responseMessage.INTERNAL_ERROR})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });
    } catch (error) {
        console.log("error: ", error);
        return next(error);
    }
}

exports.updateflightadvertisementController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {  title, content, startDate, endDate, remainingDays,advertisementId } = req.body
        const isExist=await findflightadvertisementData({_id:advertisementId,status:status.ACTIVE});
        if(!isExist){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, responseMessage: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await updateflightadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}
// approvalStatus:{$nin:[approvalStatus.PENDING,approvalStatus.REJECT]},
exports.getflightadvertisementController = async (req, res, next) => {
    try {
        // const { page, limit } = req.query;
        const currentDate = new Date();
console.log("currentDate=======>>>>>",currentDate)
// endDate: { $gt: currentDate },
        const result=await advertisementflightList({status:status.ACTIVE});
        if (!result || result.length === 0) {
            return res.status(statusCode.NotFound).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
            });
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    } catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
}

// bus adds ********************************************************
exports.createbustadvertismentController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {  title, content, startDate, endDate, remainingDays } = req.body;
        // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        // if (!isAdmin) {
        //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await createbusadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });
    } catch (error) {
        console.log("error: ", error);
        return next(error);
    }
}

exports.updatebusadvertisementController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {  title, content, startDate, endDate, remainingDays,packageId } = req.body
        const isExist=await findbusadvertisementData({_id:packageId,status:status.ACTIVE});
        if(!isExist){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, responseMessage: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await updatebusadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}
// approvalStatus:{$nin:[approvalStatus.PENDING,approvalStatus.REJECT]},
exports.getbusadvertisementController = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const currentDate = new Date();
        console.log("currentDate=======>>>>>",currentDate)
        // endDate: { $gt: currentDate },
        const result=await advertisementbusList({status:status.ACTIVE});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    } catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
}


// hotel adds ********************************************************
exports.createhoteladvertismentController = async (req, res, next) => {
    try {
        if (!req.file) {
          return res.status(400).send({ message: "No file uploaded." });
        }
        const {  title, content, startDate, endDate, remainingDays } = req.body;
        // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        // if (!isAdmin) {
        //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await createhoteladvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });
    } catch (error) {
        console.log("error: ", error);
        return next(error);
    }
}

exports.updatehoteladvertisementController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {title, content, startDate, endDate, remainingDays,packageId } = req.body
        const isExist=await findhoteladvertisementData({_id:packageId,status:status.ACTIVE});
        if(!isExist){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, responseMessage: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await updatehoteladvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}
// approvalStatus:{$nin:[approvalStatus.PENDING,approvalStatus.REJECT]},
exports.gethoteladvertisementController = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const currentDate = new Date();
        console.log("currentDate=======>>>>>",currentDate)
        // endDate: { $gt: currentDate },
        const result=await hoteladvertisementList({status:status.ACTIVE});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    } catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
}


exports.uploadImage=async(req,res,next)=>{
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        if(req.file){
            const imageFiles = await commonFunction.getImageUrlAWS(req.file);
            if (!imageFiles) {
                return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
            }
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.UPLOAD_SUCCESS,result: imageFiles});
        }
        
    } catch (error) {
     console.log("error while trying to upload image on cloud",error);
     return next(error)   
    }
}