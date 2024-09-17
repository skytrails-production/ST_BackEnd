const hotelBookingModel = require('../../model/btocModel/hotelBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const mongoose=require('mongoose');

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userhotelBookingModelServices = {
    createUserhotelBookingModel: async (insertObj) => {
        return await hotelBookingModel.create(insertObj);
    },

    findUserhotelBookingModel: async (query) => {
        return await hotelBookingModel.findOne(query)
    },

    getUserhotelBookingModel: async (query) => {
        return await hotelBookingModel.findOne(query)
    },

    findUserhotelBookingModelData: async (query) => {
        return await hotelBookingModel.find(query)
    },

    deleteUserhotelBookingModel: async (query) => {
        return await hotelBookingModel.deleteOne(query);
    },

    userhotelBookingModelList: async (query) => {
        return await hotelBookingModel.find(query)
    },
    updateUserhotelBookingModel: async (query, updateObj) => {
        return await hotelBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserhotelBookingModelSearch: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } }
        const { page, limit, usersType1, search } = body;
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
        return await hotelBookingModel.paginate(query, options);
    },
    countTotalhotelBooking: async (body) => {
        return await hotelBookingModel.countDocuments(body)
    }
    ,
    aggregatePaginateHotelBookingList:async(body)=>{
        const { page, limit, search, fromDate, toDate,userId } = body;
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
            {
                $sort:{CheckInDate:-1}
            }

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
        let aggregate = hotelBookingModel.aggregate(pipeline)
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 1000000,
            sort: { createdAt: -1 },
        };
        return await hotelBookingModel.aggregatePaginate(aggregate, options)

    },
    
}

module.exports = { userhotelBookingModelServices }