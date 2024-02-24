const status = require("../enums/status");
const pushNotificationModel=require("../model/pushNotificationodel")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//


const pushNotificationServices={
    createPushNotification: async (insertObj) => {
        return await pushNotificationModel.create(insertObj);
    },

    findPushNotification: async (query) => {
        return await pushNotificationModel.findOne(query);
    },

    findPushNotificationData: async (query) => {
        return await pushNotificationModel.find(query);
    },

    deletePushNotification: async (query) => {
        return await pushNotificationModel.deleteOne(query).select('-status -createdAt -updatedAt');
    },

   
    updatePushNotification: async (query, updateObj) => {
        return await pushNotificationModel.findOneAndUpdate(query, updateObj, { new: true }).select('-status -createdAt -updatedAt');
    },

    countPushNotification:async(query)=>{
        return await pushNotificationModel.countDocuments(query);
    }
}

module.exports={pushNotificationServices}