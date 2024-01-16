const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const status=require('../../enums/status')
const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const admin = require("firebase-admin");
// const FCM=require('fcm-node')
// const fcmKey="Kvo8qhR8xvB0Wd1fElU0-sUhMSg6akkCRZVhWiwEZVs";
// const serviceAccount="AIzaSyAsGxfAYsGpKBN86JzGI38Wd9JjbrK4dxU"
// const fcm=new FCM(fcmKey)
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
        console.log('object',object)
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
// exports.updateWebAdvertisement=async(req,res,next)=>{
//     try {
//         const {}=
//     } catch (error) {
//         console.log("error in updating web ",error);
//         return next(error)
//     }
// }

// exports.deleteWebAdd=async(req,res,next)=>{
//     try {
        
//     } catch (error) {
//         console.log("error during deeletion",error);
//         return next(error)
//     }
// }

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });

// exports.sendNotification=async(req,res,next)=>{
//     try {
//         var message={
//             to:"",
//             notification:{
//                 title:"Notification",
//                 body:"Hello this is test notification"
//             },
//             data:{
//                 title:"ok vhsjkihgfs",
//                 body:'{"name":"charu","product_id":"123","final_price":"0.90"}'
//             }
//         };

//         fcm.send(message,function(err,response){
//             if(err){
//                 console.log("something went wrong",+err);
//                 console.log("responses==============",+response);
//             }else{
//                 console.log("successfully sent with respose:==>>",response);
//             }
//         })
//     } catch (error) {
//         console.log("error while trying get data",error);
//         return next(error)
//     }
// }