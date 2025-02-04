const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const status=require('../../enums/status')
const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const admin = require("firebase-admin");
const FCM=require('fcm-node');
const axios=require('axios')
const { google } = require('googleapis');
// Define the required scopes for the Google API you are using
const SCOPES = ['https://www.googleapis.com/auth/drive'];
//Essential Services***************************************************
const {webAdvertisementServices}=require("../../services/btocServices/webUserOfferServices");
const {createWebadvertisement,findWebadvertisementData,deletWebeadvertisement,webAdvertisementList,updateWebadvertisement,countTotalWebadvertisement,getWebAdvertisment}=webAdvertisementServices;
const {
    couponServices,
  } = require("../../services/btocServices/couponServices");
  const {
    createCoupon,
    findCoupon,
    getCoupon,
    findCouponData,
    deleteCoupon,
    couponList,
    updateCoupon,
    paginateCouponSearch,
  } = couponServices;
  const {promotionalEmailServices}=require("../../services/btocServices/promotionalEmailServices");
const {createPromotionaEmail,findPromotionaEmail,findPromotionaEmailList,deletePromotionaEmail,updatePromotionaEmail}=promotionalEmailServices;


exports.createWebAdvertisement=async(req,res,next)=>{
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {title, content, startDate, endDate, remainingDays,addType}=req.body;
        const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const allSubscribedUser=await findPromotionaEmailList({})
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays,
            addType:addType
        }
        const result=await createWebadvertisement(object);

        if(result){
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });}
    } catch (error) {
        return next(error)
    }
}

exports.getWebAdvertisement=async(req,res,next)=>{
    try {
        const currentDate = new Date();

        const result=await webAdvertisementList({status:status.ACTIVE,endDate: { $gte: currentDate }});
        if(!result){
            return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    
    } catch (error) {
        return next(error)
    }
}

exports.getAggregateWebAdvertisement=async(req,res,next)=>{
    try {
        const {page,limit}=req.body;
        const result=await getWebAdvertisment(req.body);
        if(!result){
            return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    
    } catch (error) {
        return next(error)
    }
}

exports.sendNotification = async (req, res, next) => {
    try {
       
        const serverKey = 'AA'; // Replace with your actual server key
        const fcm = new FCM(serverKey);
        // Define your FCM message
        // Define your FCM message
        const message = {
            to: 'ce',
            collapse_key: '1',
            notification: {
                title: 'Aise restart na kro mujhe check krna h ',
                body: 'Bhai qa kr rhe ho vjvhvvjbhvnpcvkiffjpvvbkvjbnm,'
            },
            data: {
                my_key: serverKey,
            }
        };
        fcm.send(message, function (err, response) {
            if (err) {
              
                return next(err);
            } else {
                res.status(200).json({ message: "Notification sent successfully" });
            }
        });
    } catch (error) {
        console.error("Error while trying to send a notification", error);
        return next(error);
    }
};

exports.createWebAdvertisement1=async(req,res,next)=>{
    try {
        let  image;
        let dashboardImg;
        if (!req.files) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const {title, content, startDate, endDate, remainingDays,addType,elseNeedToKnow,howDoUGetit,whtDoUGet,termsAndCond}=req.body;
        // const imageFiles = await commonFunction.getImageUrlAWS(req.file);
        // if (!imageFiles) {
        //     return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        // }
        if (req.files) {
              image =await commonFunction.getImageUrlAWSByFolder(req.files.image,"webOffers");
             dashboardImg = await commonFunction.getImageUrlAWSByFolder(req.files.dashboardImg,"webOfferDashboard");
          }
        const object = {
            image: image,
            dashboardImg:dashboardImg,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays,
            addType:addType,
            termsAndCond:termsAndCond,
            whtDoUGet:whtDoUGet,
            howDoUGetit:howDoUGetit,
            elseNeedToKnow:elseNeedToKnow

        }
        const result=await createWebadvertisement(object);

        if(result){
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });}
    } catch (error) {
        return next(error)
    }
}