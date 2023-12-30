const bookEventModel = require('../../model/btocModel/bookEventModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const eventBookingServices={
    createBookingEvent: async (insertObj) => {
        return await bookEventModel.create(insertObj);
    },

    findBookingEventData: async (query) => {
        return await bookEventModel.findOne(query)
    },

    deleteBookingEvent: async (query) => {
        return await bookEventModel.deleteOne(query);
    },

    eventBookingList: async (query) => {
        return await bookEventModel.find(query)
    },
    updateBookingEvent: async (query, updateObj) => {
        return await bookEventModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalBookingEvent: async (body) => {
        return await bookEventModel.countDocuments(body)
    },
    getBookingEvent:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await bookEventModel.paginate(query, options);
    }
}
module.exports ={eventBookingServices}