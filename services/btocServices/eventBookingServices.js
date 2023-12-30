const addEventsModel = require('../../model/addEventsModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const eventServices={
    createEvent: async (insertObj) => {
        return await addEventsModel.create(insertObj);
    },

    findEventData: async (query) => {
        return await addEventsModel.findOne(query)
    },

    deleteEvent: async (query) => {
        return await addEventsModel.deleteOne(query);
    },

    EventList: async (query) => {
        return await addEventsModel.find(query)
    },
    updateEvent: async (query, updateObj) => {
        return await addEventsModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalEvent: async (body) => {
        return await addEventsModel.countDocuments(body)
    },
    getEvent:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await addEventsModel.paginate(query, options);
    }
}
module.exports ={eventServices}