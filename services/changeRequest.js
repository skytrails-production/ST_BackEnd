const changeRequestModel = require('../model/changeFlightRequest');
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const changeRequestServices = {
    createchangeRequest: async (insertObj) => {
        return await changeRequestModel.create(insertObj);
    },

    findchangeRequest: async (query) => {
        return await changeRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    getchangeRequest: async (query) => {
        return await changeRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    findchangeRequestData: async (query) => {
        return await changeRequestModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletechangeRequest: async (query) => {
        return await changeRequestModel.deleteOne(query);
    },

    changeRequestList: async (query) => {
        return await changeRequestModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatechangeRequest: async (query, updateObj) => {
        return await changeRequestModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatechangeRequestSearch: async (body) => {
        // changeRequestType: { $ne: [changeRequestType.ADMIN,changeRequestType.SUBADMIN] }
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
        return await changeRequestModel.paginate(query, options);
    },

    aggregatePaginatechangeRequestList: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $lookup: {
                    from: "userb2bs",
                    localField: 'agentId',
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
                    from: "flightbookingdatas",
                    localField: 'flightBookingId',
                    foreignField: '_id',
                    as: "flightDetails",
                }
            },
            {
                $unwind: {
                    path: "$flightDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { "hotelName": { $regex: data, $options: "i" }, },
                        { "userDetails.personal_details.first_name": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.last_name": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.email": { $regex: data, $options: "i" } },
                        { "flightDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "flightDetails.destination": { $regex: data, $options: "i" } },
                        { "amount": parseInt(data) },
                        { "room": parseInt(data) },
                        { "bookingId":parseInt(data) }
                    ],
                }
            },
        ]
        if (fromDate && !toDate) {
            pipeline.CheckInDate = { $eq: fromDate };
        }
        if (!fromDate && toDate) {
            pipeline.CheckOutDate = { $eq: toDate };
        }
        if (fromDate && toDate) {
            pipeline.$and = [
                { CheckInDate: { $eq: fromDate } },
                { CheckOutDate: { $eq: toDate } },
            ]
        }
        let aggregate = changeRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await changeRequestModel.aggregatePaginate(aggregate, options)

    },

    countTotalchangeRequest:async()=>{
        return await changeRequestModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },

    flightchangeRequestAgentList:async(body)=>{
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
                $lookup: {
                    from: "flightbookingdatas",
                    localField: 'flightBookingId',
                    foreignField: '_id',
                    as: "flightDetails",
                }
            },
            {
                $unwind: {
                    path: "$flightDetails",
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
                        { "flightDetails.": parseInt(data) },
                        { "room": parseInt(data) },
                        { "flightDetails.bookingId": { $regex: data, $options: "i" } }
                    ],
                }
            },
        ]
        if (fromDate && !toDate) {
            pipeline.CheckInDate = { $eq: fromDate };
        }
        if (!fromDate && toDate) {
            pipeline.CheckOutDate = { $eq: toDate };
        }
        if (fromDate && toDate) {
            pipeline.$and = [
                { CheckInDate: { $eq: fromDate } },
                { CheckOutDate: { $eq: toDate } },
            ]
        }
        let aggregate = changeRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await changeRequestModel.aggregatePaginate(aggregate, options)

    }
}

module.exports = { changeRequestServices }