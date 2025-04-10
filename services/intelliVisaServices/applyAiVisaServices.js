const visaBookingModel = require('../../model/intelliVisa/createVisaBooking');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const visaBookingServices={
    createvisaBooking: async (insertObj) => {
        return await visaBookingModel.create(insertObj);
    },

    findVisaBooking: async (query) => {
        return await visaBookingModel.findOne(query) ;
    },
    findOneVisaBookingPop: async (query) => {
        return await visaBookingModel.findOne(query).populate('visaCountryId') ;
    },

    deleteVisaBooking: async (query) => {
        return await visaBookingModel.deleteOne(query);
    },

    visaBookingList: async (query) => {
        return await visaBookingModel.find(query);
    },
    visaBookingListPop: async (query) => {
        return await visaBookingModel.find(query).populate('visaCountryId');
    },
    updateVisaBooking: async (query, updateObj) => {
        return await visaBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalVisaBooking: async (body) => {
        return await visaBookingModel.countDocuments(body);
    }    
}
module.exports ={visaBookingServices}