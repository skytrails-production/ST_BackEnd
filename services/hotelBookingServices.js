const hotelBookingModel = require('../model/hotelBooking.model');
const userHotelBookingModel = require('../model/btocModel/hotelBookingModel')
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const mongoose = require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const hotelBookingServicess = {
    createhotelBooking: async (insertObj) => {
        return await hotelBookingModel.create(insertObj);
    },

    findhotelBooking: async (query) => {
        return await hotelBookingModel.findOne(query).select('-createdAt -updatedAt');
    },

    gethotelBooking: async (query) => {
        return await hotelBookingModel.findOne(query).select('-createdAt -updatedAt');
    },

    findhotelBookingData: async (query) => {
        return await hotelBookingModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletehotelBooking: async (query) => {
        return await hotelBookingModel.deleteOne(query);
    },

    hotelBookingList: async (query) => {
        return await hotelBookingModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatehotelBooking: async (query, updateObj) => {
        return await hotelBookingModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatehotelBookingSearch: async (body) => {
        // hotelBookingType: { $ne: [hotelBookingType.ADMIN,hotelBookingType.SUBADMIN] }
        let query = {}
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { hotelName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await hotelBookingModel.paginate(query, options);
    },

    aggregatePaginateHotelBookingList: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $lookup: {
                    from: "userb2bs",
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
                $match: {
                    $or: [
                        { "hotelName": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.email": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.first_name": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.last_name": { $regex: data, $options: "i" } },
                        { "paymentStatus": { $regex: data, $options: "i" } },
                        { "destination": { $regex: data, $options: "i" } },
                        { "night": parseInt(data) },
                        { "room": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } },
                        { "bookingId": parseInt(data) },
                        { "amount": parseInt(data) },
                    ],
                }
            },
        ]
        if (fromDate && !toDate) {
            pipeline.push({ $match: { CheckInDate: { $eq: new Date(fromDate) } } });
        }
        if (!fromDate && toDate) {
            pipeline.push({ $match: { CheckOutDate: { $eq: new Date(toDate) } } });
        }
        if (fromDate && toDate) {
            pipeline.push({
                $match: {
                    $and: [
                        { CheckInDate: { $eq: new Date(fromDate) } },
                        { CheckOutDate: { $eq: new Date(toDate) } },
                    ]
                }
            });
        }
        
        let aggregate = hotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await hotelBookingModel.aggregatePaginate(aggregate, options)

    },

    countAgentTotalBooking: async () => {
        return await hotelBookingModel.countDocuments({ bookingStatus: bookingStatus.BOOKED })
    },
    aggregatePaginateHotelBookingList1: async (body) => {
        const { page, limit, search, fromDate, userId } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
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
                $match: {
                    $or: [
                        { "hotelName": { $regex: data, $options: "i" }, },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "paymentStatus": { $regex: data, $options: "i" } },
                        { "destination": { $regex: data, $options: "i" } },
                        { "night": parseInt(data) },
                        { "room": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } }
                    ],

                }
            },

        ]
        if (fromDate ) {
            pipeline.CheckInDate = { $eq: fromDate };
        }
        let aggregate = userHotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        const result= await userHotelBookingModel.aggregatePaginate(aggregate, options);
        return result;

    },
    aggregatePaginateHotelBookings: async (body) => {
        const { page, limit, search, fromDate, userId } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
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
                $match: {
                    $or: [
                        { "hotelName": { $regex: data, $options: "i" }, },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "paymentStatus": { $regex: data, $options: "i" } },
                        { "destination": { $regex: data, $options: "i" } },
                        { "night": parseInt(data) },
                        { "room": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } }
                    ],

                }
            },

        ]
        if (fromDate ) {
            pipeline.CheckInDate = { $eq: fromDate };
        }
        let aggregate = userHotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        const result= await userHotelBookingModel.aggregatePaginate(aggregate, options);
        console.log("result===========",result);
        return result;

    },
   
}

module.exports = { hotelBookingServicess }