const userBusBookingModel = require('../../model/btocModel/busBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userBusBookingServices = {
    createUserBusBooking: async (insertObj) => {
        return await userBusBookingModel.create(insertObj);
    },

    findUserBusBooking: async (query) => {
        return await userBusBookingModel.findOne(query)
    },

    getUserBusBooking: async (query) => {
        return await userBusBookingModel.findOne(query)
    },

    findUserBusBookingData: async (query) => {
        return await userBusBookingModel.findOne(query)
    },

    deleteUserBusBooking: async (query) => {
        return await userBusBookingModel.deleteOne(query);
    },

    userBusBookingList: async (query) => {
        return await userBusBookingModel.find(query)
    },
    updateUserBusBooking: async (query, updateObj) => {
        return await userBusBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserBusBookingSearch1: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } }
        const { page, limit, usersType1, search,userId } = body;
        if (search) {
            query.$or = [
                // { username: { $regex: search, $options: 'i' } },
                // { email: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } }
            ]
        }
        if (usersType1) {
            query.userType = usersType1
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await userBusBookingModel.paginate(query, options);
    },
   paginateUserBusBookingSearch:async(body)=>{
    const { page, limit, search, fromDate, toDate,userId } = body;
    if (search) {
        var filter = search;
    }
    let data = filter || ""
    let pipeline = [
        {
            $match: {
                userId: userId
            }
        },
        {
            $lookup: {
                from: "users",
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
                    { "destination": { $regex: data, $options: "i" }, },
                    { "userDetails.username": { $regex: data, $options: "i" } },
                    { "userDetails.email": { $regex: data, $options: "i" } },
                    { "pnr": { $regex: data, $options: "i" } },
                    { "origin": { $regex: data, $options: "i" } },
                    { "busId": parseInt(data) },
                    { "amount": parseInt(data) },
                    { "bookingStatus": { $regex: data, $options: "i" } }
                ],
                
            }
        },
        {
            $sort:{departureTime:-1}
        }

    ]
    if (fromDate && !toDate) {
        pipeline.departureTime = { $eq: fromDate };
    }
    if (!fromDate && toDate) {
        pipeline.arrivalTime = { $eq: toDate };
    }
    if (fromDate && toDate) {
        pipeline.$and = [
            { departureTime: { $eq: fromDate } },
            { arrivalTime: { $eq: toDate } },
        ]
    }
    let aggregate = userBusBookingModel.aggregate(pipeline)
    let options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 1000000,
        sort: { createdAt: -1 },
    };
    return await userBusBookingModel.aggregatePaginate(aggregate, options)
   },
    countTotalUserBusBooking: async (body) => {
        return await userBusBookingModel.countDocuments(body)
    }
}

module.exports = { userBusBookingServices }