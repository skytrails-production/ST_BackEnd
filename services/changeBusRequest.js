const changeBusRequestModel = require('../model/changeBusBookings');
const status = require("../enums/status");
const bookingStatus=require("../enums/bookingStatus");
const mongoose =require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const changeBusRequestServices = {
    createchangeBusRequest: async (insertObj) => {
        return await changeBusRequestModel.create(insertObj);
    },

    findchangeBusRequest: async (query) => {
        return await changeBusRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    getchangeBusRequest: async (query) => {
        return await changeBusRequestModel.findOne(query).select('-createdAt -updatedAt');
    },

    findchangeBusRequestData: async (query) => {
        return await changeBusRequestModel.findOne(query).select('-createdAt -updatedAt ');
    },

    deletechangeBusRequest: async (query) => {
        return await changeBusRequestModel.deleteOne(query);
    },

    changeBusRequestList: async (query) => {
        return await changeBusRequestModel.find(query).populate('userId').select('-createdAt -updatedAt');
    },
    updatechangeBusRequest: async (query, updateObj) => {
        return await changeBusRequestModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },

    paginatechangeBusRequestSearch: async (body) => {
        // changeBusRequestType: { $ne: [changeBusRequestType.ADMIN,changeBusRequestType.SUBADMIN] }
        let query = {}
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { BusName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await changeBusRequestModel.paginate(query, options);
    },

   
    aggregatePaginatechangeBusRequestList: async (body) => {
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
                    from: "busBookingData",
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
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "busDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "busDetails.busId": { $regex: data, $options: "i" } },
                        { "busDetails.pnr": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "busDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "busDetails.amount": parseInt(data) }
                    ],
                }
            }
        ]
        if (fromDate) {
            pipeline.push({ $match: { "busDetails.dateOfJourney": { $eq: fromDate } } });
        }

        if (toDate) {
            pipeline.push({ $match: { "busDetails.createdAt": { $eq: toDate } } });
        }

        pipeline.push({
            $sort: { createdAt: -1 },
        });

        let aggregate = changeBusRequestModel.aggregate(pipeline);
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        };

        const result = await changeBusRequestModel.aggregatePaginate(aggregate, options);
        return result;
    },

    countTotalchangeBusRequest:async()=>{
        return await changeBusRequestModel.countDocuments({bookingStatus:bookingStatus.BOOKED})
    },
}

module.exports = { changeBusRequestServices }