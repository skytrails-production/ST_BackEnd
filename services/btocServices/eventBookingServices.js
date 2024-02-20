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
    eventBookingListPopulated: async (query) => {
        return await bookEventModel.find(query).populate('eventId','location.coordinates image showType age venue').sort({createdAt: -1});
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
    },
    getEventPopulate:async(body)=>{
        const { page, limit, search } = body;
        const currentDate = new Date().toISOString();
        
        // Construct the initial query
        let query = {
            status: status.ACTIVE,
        };
        
        // Check if the search parameter is provided
        if (search) {
            query.$or = [
                { profession: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { 'contactNo.mobile_number': { $regex: search, $options: 'i' } },
            ];
        }
        
        // Add additional criteria for filtering events based on the current date
        // query.endDate = { $gt: currentDate };
        
        // Set up pagination options
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        
        // Now, retrieve the events using the constructed query and options
        const data = await bookEventModel.paginate(query, options);
        
        return data;
        
    },
    getEventPopulate1: async (body) => {
        const { page, limit, search } = body;
        let filter = {};
    
        if (search) {
            filter = {
                $or: [
                    { profession: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { city: { $regex: search, $options: 'i' } },
                    { 'contactNo.mobile_number': { $regex: search, $options: 'i' } },
                ],
            };
        }
    
        let pipeline = [
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "userBtoC",
                    localField: 'userId',
                    foreignField: '_id',
                    as: "userDetails",
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "skyTrailsEvents",
                    localField: 'eventId',
                    foreignField: '_id',
                    as: "eventDetails",
                }
            },
            {
                $unwind: {
                    path: "$eventDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Add more aggregation stages if needed
        ];
       const aggregate= await bookEventModel.aggregate(pipeline);
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await bookEventModel.paginate(aggregate, options);
      },
    
}
module.exports ={eventBookingServices}