const cancelFlightBookingsModel = require("../model/cancelFlightBookings");
const cancelHotelModel = require("../model/cancelHotelBookings");
const cancelBusModel = require("../model/cancelBusBookings");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const mongoose = require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const cancelBookingServices = {
    createcancelFlightBookings: async (insertObj) => {
        return await cancelFlightBookingsModel.create(insertObj);
    },
    findAnd: async (object) => {
        return await cancelFlightBookingsModel.find(object)
    },
    updatecancelFlightBookings: async (query, updateObj) => {
        return await cancelFlightBookingsModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },
    aggregatePaginatecancelFlightBookingsList: async (body) => {
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
                        { "flightDetails.airlineDetails[0].Airline.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "flightDetails.pnr": { $regex: data, $options: "i" } },
                        { "flightDetails.destination": { $regex: data, $options: "i" } },
                        { "flightDetails.airlineDetails[0].Origin.DepTime": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "flightDetails.airlineDetails[0].Origin.CityName": { $regex: data, $options: "i" } },
                        { "flightDetails.totalAmount": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "flightDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "flightDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelFlightBookingsModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelFlightBookingsModel.aggregatePaginate(aggregate, options);
        return result;
    },
    aggregatecancelFlightBookingsList: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {$match:{status:status.ACTIVE}},
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
                        // { "flightDetails.airlineDetails[0].Airline.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.first_name": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.last_name": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.email": { $regex: data, $options: "i" } },
                        // { "flightDetails.pnr": { $regex: data, $options: "i" } },
                        // { "flightDetails.destination": { $regex: data, $options: "i" } },
                        // { "flightDetails.airlineDetails[0].Origin.DepTime": { $regex: data, $options: "i" } },
                        // { "bookingId": { $regex: data, $options: "i" } },
                        // { "flightDetails.airlineDetails[0].Origin.CityName": { $regex: data, $options: "i" } },
                        // { "flightDetails.totalAmount": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "flightDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "flightDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelFlightBookingsModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelFlightBookingsModel.aggregatePaginate(aggregate, options);
        return result;
    },
    countTotalAgentcancelFlightBookings: async (body) => {
        return await cancelFlightBookingsModel.countDocuments(body)
    },
    createHotelCancelRequest: async (object) => {
        return await cancelHotelModel.create(object)
    },
    updateHotelCancelRequest: async (query, updateObj) => {
        return await cancelHotelModel.findOneAndUpdate(query, updateObj, { new: true })
    },
    getHotelRequest: async (data) => {
        return await cancelHotelModel.findOneAndUpdate(data)
    },
    getHotelCancelRequesrByAggregate: async (body) => {
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
                    from: "hotelBookingDetail",
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
                        { "hotelDetails.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "hotelDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "hotelDetails.destination": { $regex: data, $options: "i" } },
                        { "hotelDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "hotelDetails.origin": { $regex: data, $options: "i" } },
                        { "hotelDetails.amount": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "hotelDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "hotelDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelHotelModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelHotelModel.aggregatePaginate(aggregate, options);
        return result;
    },  
    getAgentHotelCancelRequesrByAggregate: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {$match:{status:status.ACTIVE}},
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
                    from: "hotelBookingDetail",
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
                        { "hotelDetails.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "hotelDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "hotelDetails.destination": { $regex: data, $options: "i" } },
                        { "hotelDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "hotelDetails.origin": { $regex: data, $options: "i" } },
                        { "hotelDetails.amount": parseInt(data) },
                        { "reason": { $regex: data, $options: "i" } },
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "hotelDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "hotelDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelHotelModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelHotelModel.aggregatePaginate(aggregate, options);
        return result;
    },  
    countTotalAgentHotelCancelled: async (body) => {
        return await cancelHotelModel.countDocuments(body)
    },
    createBusCancelRequest: async (object) => {
        return await cancelBusModel.create(object)
    },
    updateBusCancelRequest: async (query, updateObj) => {
        return await cancelBusModel.findOneAndUpdate(query, updateObj, { new: true })
    },
    getBusCancelRequestByAggregate: async (info) => {
        const { page, limit, search, fromDate, toDate } = info;
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
                        { "hotelName": { $regex: data, $options: "i" }, },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "paymentStatus": { $regex: data, $options: "i" } },
                        { "busId": parseInt(data) },
                        { "noOfSeats": parseInt(data) },
                        { "bookingStatus": { $regex: data, $options: "i" } },
                        { "destination": { $regex: data, $options: "i" } },
                        { "origin": { $regex: data, $options: "i" } },
                        { "pnr": { $regex: data, $options: "i" } },
                        { "busType": { $regex: data, $options: "i" } },
                    ],
                }
            },
        ]
        if (fromDate) {
            pipeline.push({ $match: { "flightDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "flightDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelBusModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelBusModel.aggregatePaginate(aggregate, options);
        return result;
    },

    getBusCancellation: async (body) => {
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
                    from: "busBookingData",
                    localField: 'busBookingId',
                    foreignField: '_id',
                    as: "bustDetails",
                }
            },
            {
                $unwind: {
                    path: "$bustDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { "userDetails.personal_details.username": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.email": { $regex: data, $options: "i" } },
                        { "bustDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "bustDetails.busType": { $regex: data, $options: "i" } },
                        { "bustDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "bustDetails.origin": { $regex: data, $options: "i" } },
                        { "busId": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "bustDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "bustDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelBusModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelBusModel.aggregatePaginate(aggregate, options);
        // console.log("result============",result)
        return result;
    },
    getBusCancellationAgent: async (body) => {
        const { page, limit, search, fromDate, toDate } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let pipeline = [
            {$match:{status:status.ACTIVE}},
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
                    from: "busBookingData",
                    localField: 'busBookingId',
                    foreignField: '_id',
                    as: "bustDetails",
                }
            },
            {
                $unwind: {
                    path: "$bustDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { "userDetails.personal_details.username": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.email": { $regex: data, $options: "i" } },
                        { "bustDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "bustDetails.busType": { $regex: data, $options: "i" } },
                        { "bustDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "bustDetails.origin": { $regex: data, $options: "i" } },
                        { "busId": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "bustDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "bustDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = cancelBusModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await cancelBusModel.aggregatePaginate(aggregate, options);
        // console.log("result============",result)
        return result;
    },
    countTotalAgentBusCancelled: async (body) => {
        return await cancelBusModel.countDocuments(body)
    },
}

module.exports = { cancelBookingServices }