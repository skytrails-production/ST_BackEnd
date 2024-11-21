// const appPromoEvent = require('../../model/btocModel/promoEmailModel');
const callbackRequestModel=require("../../model/btocModel/callbackRequest")
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const callbackRequestServices={
    createCallbackRequest: async (insertObj) => {
        return await callbackRequestModel.create(insertObj);
    },

    findCallbackRequest: async (query) => {
        return await callbackRequestModel.findOne(query)
    },

    deleteCallbackRequest: async (query) => {
        return await callbackRequestModel.deleteOne(query);
    },

    findCallbackRequestList: async (query) => {
        return await callbackRequestModel.find(query).sort({createdAt:-1})
    },
    // promoBannnerSortedList: async (query) => {
    //     return await callbackRequestModel.find(query).sort({createdAt: -1})
    // },
    // eventBookingListPopulated: async (query) => {
    //     return await callbackRequestModel.find(query).populate('eventId','location.coordinates image showType age venue').sort({createdAt: -1});
    // },
    updateCallbackRequest: async (query, updateObj) => {
        return await callbackRequestModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalCallbackRequest: async (body) => {
        return await callbackRequestModel.countDocuments(body)
    }
   
    
}
module.exports ={callbackRequestServices}