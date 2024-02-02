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


// exports.sendNotification = async (req, res, next) => {
//     try {
//         // Define your server key
//         // const serverKey = 'YOUR_SERVER_KEY';
// var serverKey = 'AIzaSyDQHe2Qk9J1zw-gz7kh-e1LEgEflLakR3U'; //put your server key here
// var fcm = new FCM(serverKey);
//         // Define your FCM message
//         // Define your FCM message
//         const message = {
//             to: '866775061632337',
//             collapse_key: '1',
//             notification: {
//                 title: 'Title of your push notification',
//                 body: 'Body of your push notification'
//             },
//             data: {
//                 my_key: serverKey,
//             }
//         };

//         console.log("message===========", message);

//         // Send the FCM message with a callback function
//         fcm.send(message, function (err, response) {
//             if (err) {
//                 console.error("Something has gone wrong!", err);
//                 console.error("error ms",err.message)
//                 return next(err);
//             } else {
//                 console.log("Successfully sent with response: ", response);
//                 res.status(200).json({ message: "Notification sent successfully" });
//             }
//         });
//     } catch (error) {
//         console.error("Error while trying to send a notification", error);
//         return next(error);
//     }
// };


function getAccessToken() {
    return new Promise(function(resolve, reject) {
        const key = {
            "project_info": {
              "project_number": "47420968118",
              "project_id": "theskytrailscom",
              "storage_bucket": "theskytrailscom.appspot.com"
            },
            "client": [
              {
                "client_info": {
                  "mobilesdk_app_id": "1:47420968118:android:394492ac80c122e11aea17",
                  "android_client_info": {
                    "package_name": "com.theskytrails.com"
                  }
                },
                "oauth_client": [],
                "api_key": 
                  {
                    "current_key": "AIzaSyDQHe2Qk9J1zw-gz7kh-e1LEgEflLakR3U"
                  }
                ,
                "services": {
                  "appinvite_service": {
                    "other_platform_oauth_client": []
                  }
                }
              }
            ],
            "configuration_version":"1"
          }
        const jwtClient = new google.auth.JWT(
            key.client[0].client_info.android_client_info.package_name,
            null,
            key.api_key.current_key,
            SCOPES,
            null
        );
        console.log("jwtClient==========",jwtClient);
        jwtClient.authorize(function(err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            console.log("tokens=================",tokens);
            console.log("tokens.access_token=========",tokens.access_token);
            resolve(tokens.access_token);
        });
    });
}
  exports.sendNotification = async (req, res, next) => {
    try {
        // Get the access token by invoking the getAccessToken function
        const accessToken = await getAccessToken();
        console.log("Access Token:", accessToken);

        // Define your server key
        const serverKey = 'BOPPSLM-ymczT_49aZG98nhLCUu7GBWpNpDT0RZr01NNYbWsGNKw1GMeSYhkDvW4xFH-1rweEqaJdn7KGKNlrtI'; // Replace with your actual server key
        const fcm = new FCM(serverKey);

        // Define your FCM message
        const message = {
            to: '1:47420968118:android:394492ac80c122e11aea17',
            collapse_key: '1',
            notification: {
                title: 'Title of your push notification',
                body: 'Body of your push notification'
            },
            data: {
                my_key: serverKey
            }
        };

        // Send the FCM message using axios with the correct headers, including the access token
        const response = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Use 'Bearer' prefix for access token
                'User-Agent': 'axios/1.2.2',
                'Content-Length': '279',
                'Accept-Encoding': 'gzip, compress, deflate, br',
            },
        });

        console.log("Successfully sent with response: ", response.data);
        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Something has gone wrong!", error.message);
        return next(error);
    }
};




// exports.sendNotification=async(req,res,next)=>{
//     try {
//         // var message={
//         //     to:"",
//         //     notification:{
//         //         title:"Notification",
//         //         body:"Hello this is test notification"
//         //     },
//         //     data:{
//         //         title:"ok vhsjkihgfs",
//         //         body:'{"name":"charu","product_id":"123","final_price":"0.90"}'
//         //     }
//         // };

//         // fcm.send(message,function(err,response){
//         //     if(err){
//         //         console.log("something went wrong",+err);
//         //         console.log("responses==============",+response);
//         //     }else{
//         //         console.log("successfully sent with respose:==>>",response);
//         //     }
//         // })

//         var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//             to: '47420968118:android:394492ac80c122e11aea17', 
//             collapse_key: '1',
            
//             notification: {
//                 title: 'Title of your push notification', 
//                 body: 'Body of your push notification' 
//             },
            
//             data: {  //you can send only notification or only data(or include both)
//                 my_key: serverKey,
//                 // my_another_key: 'my another value'
//             }
//         };
        
//         fcm.send(message, function(err, response){
//             if (err) {
//                 console.log("Something has gone wrong!");
//             } else {
//                 console.log("Successfully sent with response: ", response);
//             }
//         });
//     } catch (error) {
//         console.log("error while trying get data",error);
//         return next(error)
//     }
// }


