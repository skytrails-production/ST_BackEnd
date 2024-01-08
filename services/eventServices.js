
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
        return await eventModel.find(query).sort({ createdAt: -1 })
    },
    allEvent:async(query)=>{
        return await eventModel.find(query).sort({saleCount:-1}).limit(4)
    },
    updateEvent: async (query, updateObj) => {
        return await eventModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalEvent: async (body) => {
        return await eventModel.countDocuments(body)
    },
    getEvent:async(body)=>{
        const {page,limit,search}=body;
        const currentDate = new Date().toISOString();
        // endDate: { $gt: currentDate }
        query = {
            status: status.ACTIVE,
            venue: { $eq: search }
        };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, 
                { content: { $regex: search, $options: 'i' } }, 
                { venue: { $regex: search, $options: 'i' } },
            ];
        }
        
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        const data= await eventModel.paginate(query, options);
        console.log("data",data);
        return data;
    }
}
module.exports ={eventServices}