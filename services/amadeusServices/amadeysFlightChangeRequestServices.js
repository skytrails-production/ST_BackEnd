const userFligthChangeRequestModel = require("../../model/amadeusModel/userFligthChangeRequest");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const mongoose = require('mongoose');

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const changeAmadeusUserBookingServices = {
    createAmdeusUserFlightChangeRequest: async (insertObj) => {
        return await userFligthChangeRequestModel.create(insertObj);
    },
    flightAmdeuschangeRequestUserList:async(body)=>{
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
                    from: "amadeusUserFlightBooking",
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
        let aggregate = userFligthChangeRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await userFligthChangeRequestModel.aggregatePaginate(aggregate, options)

    },
    flightAmdeusChangeRequestUserList1:async(body)=>{
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
        let aggregate = userFligthChangeRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
            sort: { createdAt: -1 },
        };
        return await userChangeFlightModel.aggregatePaginate(aggregate, options)

    },
    amdeusFindOneChangeRequestDetail:async(body)=>{
        return await userFligthChangeRequestModel.findOne(body)
    },
    countAmdeusChangeFlightRequest:async(body)=>{
        return await userFligthChangeRequestModel.countDocuments(body)
    }
}

module.exports = { changeAmadeusUserBookingServices }
