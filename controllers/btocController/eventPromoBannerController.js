const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const adminModel=require('../../model/user.model')

//*****************************************SERVICES************************************************/
const {appPromoEventServices}=require('../../services/btocServices/appPromoBannerServices');
const {createPromoEvent,findPromoEventData,deletePromoEvent,promoBannnerList,promoBannnerSortedList,eventBookingListPopulated,updatePromoEvent,countTotalPromoEvent}=appPromoEventServices;

exports.createPromotinalBanner=async(req,res,next)=>{
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const{startDate,endDate,url,isClickAble,content,adminId}=req.body;
        const isAdminExist=await adminModel.findOne({_id:adminId});
        if(!isAdminExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                message: responseMessage.ADMIN_NOT_FOUND,
              });
        };
        const obj={
            startDate:startDate,endDate:endDate,images:imageFiles,url:url,isClickAble:isClickAble,content:content
        }
        if (isClickAble && isClickAble === 'true') {
            if (!url) {
                return res.status(statusCode.badRequest).send({
                    statusCode: statusCode.badRequest,
                    message: responseMessage.URL_MANDATORY,
                });
            }
        }
            
        const result=await createPromoEvent(obj);
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            message: responseMessage.CREATED_SUCCESS,
            result: result,
          });
    } catch (error) {
        return next(error);
    }
}

exports.getPromotionalBanner=async(req,res,next)=>{
    try {
        const result=await promoBannnerSortedList({status:status.ACTIVE});
        if(result.length==0||result==null){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                message: responseMessage.DATA_NOT_FOUND,
              });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            message: responseMessage.DATA_FOUND,
            result: result,
          });
    } catch (error) {
        return next(error);
    }
}

exports.deletePromoEvent=async(req,res,next)=>{
    try {
        const {eventId}=req.body;
        const updateEvent = await updatePromoEvent({ _id: eventId, status: { $ne: status.DELETE } }, { status: status.DELETE });
        if(updateEvent){
             return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            message: responseMessage.UPDATE_SUCCESS,
            result:updateEvent
          });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.badRequest,
            message: responseMessage.EVENT_NOT_FOUND,
          });
    } catch (error) {
        return next(error);
    }
}
exports.deletePermanentPromoEvent=async(req,res,next)=>{
    try {
        const deleteEvent=await deletePromoEvent({_id:req.body.eventId});
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            message: responseMessage.DELETE_SUCCESS,
            result:deleteEvent
          });
    } catch (error) {
        return next(error);
    }
}

exports.updatePromotBanner=async(req,res,next)=>{
    try {
        const{startDate,endDate,url,isClickAble,content,adminId,postId}=req.body;
        if (req.file) {
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        req.body.images=imageFiles
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
          }
         
          const isAdminExist=await adminModel.findOne({_id:adminId});
          if(!isAdminExist){
              return res.status(statusCode.OK).send({
                  statusCode: statusCode.NotFound,
                  message: responseMessage.ADMIN_NOT_FOUND,
                });
          };
          const isBannerExist=await findPromoEventData({_id:postId});
          if(!isBannerExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                message: responseMessage.EVENT_NOT_FOUND,
              });
          }
          
        const updateBanner=await updatePromoEvent({_id:isBannerExist._id},req.body);
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            message: responseMessage.CREATED_SUCCESS,
            result: updateBanner,
          });
    } catch (error) {
        console.error("Error while trying to update promobanner",error);
        return next(error);
    }
}