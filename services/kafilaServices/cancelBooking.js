const userFlightCancelRequestModel = require("../../model/kafilaModel/kafilaFlighCancelReq");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");


//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const KafilaCancellationServices = {
    createKafilaCancelFlightBookings: async (insertObj) => {
        return await userFlightCancelRequestModel.create(insertObj);
    },

    findKafilaCancelFlightBookings:async(object)=>{
        return await userFlightCancelRequestModel.findOne(object)
    },
    updateKafilacancelFlightBookings: async (query, updateObj) => {
        return await userFlightCancelRequestModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
    },
    aggrPagcancelFlightBookingsList: async (body) => {
        
        const { page, limit, search, fromDate, toDate ,userId} = body;
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
              {
                $lookup: {
                    from: "userAmadeusCancelTickects",
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
                        { "flightDetails.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "flightDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "flightDetails.destination": { $regex: data, $options: "i" } },
                        { "flightDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "flightDetails.origin": { $regex: data, $options: "i" } },
                        { "reason": { $regex: data, $options: "i" } },
                        { "flightDetails.amount": parseInt(data) }
                    ],
            }
        }
        ]
        if (fromDate) {
            pipeline.dateOfJourney = { $eq: fromDate };
        }
        if (toDate) {
            pipeline.createdAt = { $eq: toDate }
        }
        let aggregate = userFlightCancelRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        const result= await userFlightCancelRequestModel.aggregatePaginate(aggregate, options)
        return result;
    },
    aggPagKafilaCancelFlightBookingsList1: async (body) => {
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
                    from: "userAmadeusCancelTickects",
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
                        { "flightDetails.AirlineName": { $regex: data, $options: "i" } },
                        { "userDetails.username": { $regex: data, $options: "i" } },
                        { "userDetails.email": { $regex: data, $options: "i" } },
                        { "flightDetails.paymentStatus": { $regex: data, $options: "i" } },
                        { "flightDetails.destination": { $regex: data, $options: "i" } },
                        { "flightDetails.dateOfJourney": { $regex: data, $options: "i" } },
                        { "bookingId": { $regex: data, $options: "i" } },
                        { "flightDetails.origin": { $regex: data, $options: "i" } },
                        { "reason": { $regex: data, $options: "i" } },
                        { "flightDetails.amount": parseInt(data) }
                    ],
            }
        }
        ]
        if (fromDate) {
            pipeline.dateOfJourney = { $eq: fromDate };
        }
        if (toDate) {
            pipeline.createdAt = { $eq: toDate }
        }
        let aggregate = userFlightCancelRequestModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 },
        };
        const result= await userFlightCancelRequestModel.aggregatePaginate(aggregate, options)
        return result;
    },
    countTotalKafilaCancelFlightBookings: async (body) => {
        return await userFlightCancelRequestModel.countDocuments(body)
    }
}

module.exports = { KafilaCancellationServices }