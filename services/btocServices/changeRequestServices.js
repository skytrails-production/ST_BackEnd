const userChangeBusModel = require("../../model/btocModel/userChangeBusModel");
const userChangeHotelModel = require("../../model/btocModel/userChangeHotelModel");
const userChangeFlightModel = require("../../model/btocModel/userChangeFlightModel");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const mongoose = require('mongoose');

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const changeUserBookingServices = {
    createUserFlightChangeRequest: async (insertObj) => {
        return await userChangeFlightModel.create(insertObj);
    },
    flightchangeRequestUserList:async(body)=>{
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $match:{status:status.ACTIVE}
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
                    from: "userflightBookingDetail",
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

        ]
        let aggregate = userChangeFlightModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await userChangeFlightModel.aggregatePaginate(aggregate, options)

    },
    flightchangeRequestUserList1:async(body)=>{
        const { page, limit, search, fromDate, toDate,userId } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $match:{userId:userId,status:status.ACTIVE}
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
        ]
        let aggregate = userChangeFlightModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await userChangeFlightModel.aggregatePaginate(aggregate, options)

    },
    createUserHotelChangeRequest: async (insertObj) => {
        return await userChangeHotelModel.create(insertObj);
    },
    hotelchangeRequestUserList:async(body)=>{
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $match:{status:status.ACTIVE}
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
                    from: "userHotelBookingDetail",
                    localField: 'hotelBookingId',
                    foreignField: '_id',
                    as: "hotelDetails",
                }
            },
            {
                $unwind: {
                    path: "$hotelDetails",
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
                        { "hotelDetails.": parseInt(data) },
                        { "room": parseInt(data) },
                        { "hotelDetails.bookingId": { $regex: data, $options: "i" } }
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
        let aggregate = userChangeHotelModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await userChangeHotelModel.aggregatePaginate(aggregate, options)

    },
    createUserBusChangeRequest: async (insertObj) => {
        return await userChangeBusModel.create(insertObj);
    },
    buschangeRequestUserList:async(body)=>{
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {
                $match:{status:status.ACTIVE}
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
                    from: "userbusBookingDetail",
                    localField: 'busBookingId',
                    foreignField: '_id',
                    as: "busDetails",
                }
            },
            {
                $unwind: {
                    path: "$busDetails",
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
                        { "busDetails.": parseInt(data) },
                        { "room": parseInt(data) },
                        { "busDetails.bookingId": { $regex: data, $options: "i" } }
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
        let aggregate = userChangeBusModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await userChangeBusModel.aggregatePaginate(aggregate, options)

    },
    countChangeBusRequest:async(body)=>{
        return await userChangeBusModel.countDocuments(body)
    },
    countChangeHotelRequest:async(body)=>{
        return await userChangeHotelModel.countDocuments(body)
    },
    countChangeFlightRequest:async(body)=>{
        return await userChangeFlightModel.countDocuments(body)
    }
}

module.exports = { changeUserBookingServices }
