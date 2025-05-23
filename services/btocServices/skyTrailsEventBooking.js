const skyTrailsEventBookingModel = require('../../model/btocModel/skyTrailsEventBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const skyEventBookingServices={
    createBookingSkyEvent: async (insertObj) => {
        return await skyTrailsEventBookingModel.create(insertObj);
    },

    findBookingSkyEventData: async (query) => {
        return await skyTrailsEventBookingModel.findOne(query)
    },

    deleteBookingSkyEvent: async (query) => {
        return await skyTrailsEventBookingModel.deleteOne(query);
    },

    skyeventBookingList: async (query) => {
        return await skyTrailsEventBookingModel.find(query)
    },
    skyeventBookingListPopulated: async (query) => {
        return await skyTrailsEventBookingModel.find(query).populate('eventId','location.coordinates image showType age venue').sort({createdAt: -1});
    },
    skyEventBookingListPopulated: async (query) => {
        return await skyTrailsEventBookingModel.find(query)
            .populate('eventId', 'title location.coordinates image showType age venue')
            .populate('userId','username email') 
            .sort({ createdAt: -1 });
    },
    updateBookingSkyEvent: async (query, updateObj) => {
        return await skyTrailsEventBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalBookingSkyEvent: async (body) => {
        return await skyTrailsEventBookingModel.countDocuments(body)
    },
    getBookingSkyEvent:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await skyTrailsEventBookingModel.paginate(query, options);
    },
    getSkyEventPopulate1:async(body)=>{
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
        const data = await skyTrailsEventBookingModel.paginate(query, options);
        
        return data;
        
    },
    getSkyEventPopulate: async (body) => {
        const { page, limit, search } = body;
        let query = {status:status.ACTIVE,}
        if (search) {
            query.$or = [
                // { profession: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { 'contactNo.mobile_number': { $regex: search, $options: 'i' } },
            ]
        }
        const currentDate = new Date().toISOString();
        // query.eventDate = { $gte: currentDate }; 
        let pipeline = [
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
            {
                $match:query
            },
            {$project: {
                "userDetails.username": 1,
                "userDetails.email": 1,
                "userDetails.phone.mobile_number": 1,
                "eventDetails.title": 1,
                "eventDetails.venue": 1,
                "eventDetails.isPaid": 1,
                name: 1,
                city: 1,
                profession: 1,
                'contactNo.mobile_number': 1,
                tickets: 1,
                isluckyUser: 1,
                deviceType: 1,
                eventDate: 1,
                createdAt:1
              },},
              {$sort:{createdAt:-1}}

        ];
       const aggregate=  skyTrailsEventBookingModel.aggregate(pipeline);
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await skyTrailsEventBookingModel.aggregatePaginate(aggregate, options);
      },
    getEventBookingByAggregate:async(query)=>{
    const queryOpt=await skyTrailsEventBookingModel.aggregate(query);
    return queryOpt[0].totalTickets;
    }
}
module.exports ={skyEventBookingServices}