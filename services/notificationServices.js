const status = require("../enums/status");
const notificationModel=require("../model/notificationModel")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//


const notificationServices={
    createNotification: async (insertObj) => {
        return await notificationModel.create(insertObj);
    },

    findNotification: async (query) => {
        return await notificationModel.findOne(query);
    },

    findNotificationData: async (query) => {
        return await notificationModel.find(query);
    },

    deleteNotification: async (query) => {
        return await notificationModel.deleteOne(query).select('-status -createdAt -updatedAt');
    },

   
    updateNotification: async (query, updateObj) => {
        return await notificationModel.findOneAndUpdate(query, updateObj, { new: true }).select('-status -createdAt -updatedAt');
    },

    countNotification:async(query)=>{
        return await notificationModel.countDocuments(query);
    }
}

module.exports={notificationServices}