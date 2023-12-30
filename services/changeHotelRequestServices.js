const changeHotelRequestModel = require('../model/changeHotelBookings');
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const changeHotelRequestServices = {
    createchangeHotelRequest: async (insertObj) => {
        return await changeHotelRequestModel.create(insertObj);
    },

    findchangeHotelRequest: async (query) => {
        return await changeHotelRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    getchangeHotelRequest: async (query) => {
        return await changeHotelRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    findchangeHotelRequestData: async (query) => {
        return await changeHotelRequestModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletechangeHotelRequest: async (query) => {
        return await changeHotelRequestModel.deleteOne(query);
    },

    changeHotelRequestList: async (query) => {
        return await changeHotelRequestModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatechangeHotelRequest: async (query, updateObj) => {
        return await changeHotelRequestModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatechangeHotelRequestSearch: async (body) => {
        // changeHotelRequestType: { $ne: [changeHotelRequestType.ADMIN,changeHotelRequestType.SUBADMIN] }
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
        return await changeHotelRequestModel.paginate(query, options);
    },

   
    aggregatePaginatechangeHotelRequestList: async (body) => {
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
                        { "userDetails.personal_details.first_name": { $regex: data, $options: "i" } },
                        { "userDetails.personal_details.last_name": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "hotelDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "hotelDetails.HotelId": { $regex: data, $options: "i" } },
                        { "hotelDetails.pnr": { $regex: data, $options: "i" } },
                        { "hotelDetails.bookingId": { $regex: data, $options: "i" } },
                        { "hotelDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "hotelDetails.amount": parseInt(data) },
                        { "hotelDetails.room": parseInt(data)}
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "HotelDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "HotelDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = changeHotelRequestModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await changeHotelRequestModel.aggregatePaginate(aggregate, options);
        return result;
    },


    countTotalchangeHotelRequest:async()=>{
        return await changeHotelRequestModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },

    changeHotelRequestListaggregate:async(body)=>{
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
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "hotelDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "hotelDetails.HotelId": { $regex: data, $options: "i" } },
                        { "hotelDetails.pnr": { $regex: data, $options: "i" } },
                        { "hotelDetails.bookingId": { $regex: data, $options: "i" } },
                        { "hotelDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "hotelDetails.amount": parseInt(data) },
                        { "hotelDetails.room": parseInt(data)}
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "HotelDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "HotelDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = changeHotelRequestModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await changeHotelRequestModel.aggregatePaginate(aggregate, options);
        return result;
    }
}

module.exports = { changeHotelRequestServices }