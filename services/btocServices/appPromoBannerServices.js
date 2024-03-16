const appPromoEvent = require('../../model/btocModel/appPromoEvent');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const appPromoEventServices={
    createPromoEvent: async (insertObj) => {
        return await appPromoEvent.create(insertObj);
    },

    findPromoEventData: async (query) => {
        return await appPromoEvent.findOne(query)
    },

    deletePromoEvent: async (query) => {
        return await appPromoEvent.deleteOne(query);
    },

    promoBannnerList: async (query) => {
        return await appPromoEvent.find(query)
    },
    promoBannnerSortedList: async (query) => {
        return await appPromoEvent.find(query).sort({createdAt: -1})
    },
    eventBookingListPopulated: async (query) => {
        return await appPromoEvent.find(query).populate('eventId','location.coordinates image showType age venue').sort({createdAt: -1});
    },
    updatePromoEvent: async (query, updateObj) => {
        return await appPromoEvent.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalPromoEvent: async (body) => {
        return await appPromoEvent.countDocuments(body)
    }
   
    
}
module.exports ={appPromoEventServices}