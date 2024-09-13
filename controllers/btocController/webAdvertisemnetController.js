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
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays,
            addType:addType
        }
        // console.log('object',object)
        const result=await createWebadvertisement(object);

        if(result){
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });}
    } catch (error) {
        console.log("error in creating web adds",error);
        return next(error)
    }
}

exports.getWebAdvertisement=async(req,res,next)=>{
    try {
        const result=await webAdvertisementList({status:status.ACTIVE});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    
    } catch (error) {
        console.log("error getting data",error);
        return next(error)
    }
}

exports.getAggregateWebAdvertisement=async(req,res,next)=>{
    try {
        const {page,limit}=req.body;
        const result=await getWebAdvertisment(req.body);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    
    } catch (error) {
        console.log("error while trying get data",error);
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
                console.error("Something has gone wrong!", err);
                console.error("error ms",err.message)
                return next(err);
            } else {
                // console.log("Successfully sent with response: ", response);
                res.status(200).json({ message: "Notification sent successfully" });
            }
        });
    } catch (error) {
        console.error("Error while trying to send a notification", error);
        return next(error);
    }
};

