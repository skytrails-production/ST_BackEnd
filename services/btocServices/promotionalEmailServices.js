// const appPromoEvent = require('../../model/btocModel/promoEmailModel');
const promoMailModel=require("../../model/btocModel/promotionsEmail")
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const promotionalEmailServices={
    createPromotionaEmail: async (insertObj) => {
        return await promoMailModel.create(insertObj);
    },

    findPromotionaEmail: async (query) => {
        return await promoMailModel.findOne(query)
    },

    deletePromotionaEmail: async (query) => {
        return await promoMailModel.deleteOne(query);
    },

    findPromotionaEmailList: async (query) => {
        return await promoMailModel.find(query)
    },
    // promoBannnerSortedList: async (query) => {
    //     return await promoMailModel.find(query).sort({createdAt: -1})
    // },
    // eventBookingListPopulated: async (query) => {
    //     return await promoMailModel.find(query).populate('eventId','location.coordinates image showType age venue').sort({createdAt: -1});
    // },
    updatePromotionaEmail: async (query, updateObj) => {
        return await promoMailModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalPromoEmails: async (body) => {
        return await promoMailModel.countDocuments(body)
    }
   
    
}
module.exports ={promotionalEmailServices}