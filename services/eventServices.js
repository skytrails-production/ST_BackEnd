
const eventModel=require("../model/addEventsModel")
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const mongoose = require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const eventServices={
    createEvent: async (insertObj) => {
        return await eventModel.create(insertObj);
    },

    findEventData: async (query) => {
        return await eventModel.findOne(query)
    },

    deleteEvent: async (query) => {
        return await eventModel.deleteOne(query);
    },

    eventList: async (query) => {
        return await eventModel.find(query)
    },
    updateEvent: async (query, updateObj) => {
        return await eventModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalEvent: async (body) => {
        return await eventModel.countDocuments(body)
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
        return await eventModel.paginate(query, options);
    }
}
module.exports ={eventServices}