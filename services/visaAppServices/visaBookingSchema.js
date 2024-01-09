const visaBookingModel = require('../../model/visaModel/visaBookingModel');
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

    findVisaBookingData: async (query) => {
        return await visaBookingModel.findOne(query)
    },

    deleteVisaBooking: async (query) => {
        return await visaBookingModel.deleteOne(query);
    },

    visaBookingList: async (query) => {
        return await visaBookingModel.find(query)
    },
    updateVisaBooking: async (query, updateObj) => {
        return await visaBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalVisaBooking: async (body) => {
        return await visaBookingModel.countDocuments(body)
    },
    getVisaBooking:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await visaBookingModel.paginate(query, options);
    }
}
module.exports ={visaBookingServices}