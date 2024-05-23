const userAmadeusFlightBookingModel = require("../../model/amadeusModel/userFlightBookingModel");
const UserType = require("../../enums/userType");
const Status = require("../../enums/status");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a service which we need MongoDB queries to perform operations on the DB********//

const userAmadeusFlightBookingServices = {
  createUserAmadeusFlightBooking: async (insertObj) => {
    return await userAmadeusFlightBookingModel.create(insertObj);
  },

  findUserAmadeusFlightBooking: async (query) => {
    return await userAmadeusFlightBookingModel.findOne(query);
  },

  getUserAmadeusFlightBooking: async (query) => {
    return await userAmadeusFlightBookingModel.findOne(query);
  },

  findUserAmadeusFlightBookingData: async (query) => {
    return await userAmadeusFlightBookingModel.findOne(query);
  },

  deleteUserAmadeusFlightBooking: async (query) => {
    return await userAmadeusFlightBookingModel.deleteOne(query);
  },

  listUserAmadeusFlightBookings: async (query) => {
    return await userAmadeusFlightBookingModel.find(query);
  },

  updateUserAmadeusFlightBooking: async (query, updateObj) => {
    return await userAmadeusFlightBookingModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  paginateUserAmadeusFlightBookingSearch: async (body) => {
    let query = { userType: { $nin: [UserType.ADMIN, UserType.SUBADMIN] } };
    const { page, limit, userType: userTypeFilter, search } = body;
    
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    if (userTypeFilter) {
      query.userType = userTypeFilter;
    }

    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    
    return await userAmadeusFlightBookingModel.paginate(query, options);
  },

  countTotalUserAmadeusFlightBookings: async (body) => {
    return await userAmadeusFlightBookingModel.countDocuments(body);
  },

  aggregatePaginateGetUserAmadeusFlightBooking: async (query) => {
    const { toDate, fromDate, userId, page, limit, search } = query;

    if (search) {
        var filter = search;
      }
      let data = filter || "";
    let pipeline = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userBtoC",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "airlineDetails.0.Origin.DepTime": -1 },
      },
    ];

    if (fromDate && toDate) {
      pipeline.push({
        $match: {
            $and: [
                { "airlineDetails[0].Origin.DepTime": { $eq: new Date(fromDate) } },
                {"airlineDetails[0].Destination.ArrTime": {$eq: new Date(toDate),},},
              ],
        },
      });
    } else if (fromDate) {
      pipeline.push({
        $match: {
            "airlineDetails[0].Origin.DepTime": { $eq: new Date(fromDate) },
          },
      });
    } else if (toDate) {
      pipeline.push({
        $match: {
            "airlineDetails[0].Destination.ArrTime": { $eq: new Date(toDate) },
          },
      });
    }
    
    let aggregate = userAmadeusFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 1000000,
      sort: { "airlineDetails.0.Origin.DepTime": -1 },
    };
    const result = await userAmadeusFlightBookingModel.aggregatePaginate(aggregate, options);
    return result;
  },

  aggregatePaginateGetUserAmadeusFlightBooking1: async (query) => {
    const { toDate, fromDate, page, limit, search } = query;

    let pipeline = [
      {
        $lookup: {
          from: "userBtoC",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (fromDate && toDate) {
      pipeline.push({
        $match: {
          $and: [
            { CheckInDate: { $eq: new Date(fromDate) } },
            { CheckOutDate: { $eq: new Date(toDate) } },
          ],
        },
      });
    } else if (fromDate) {
      pipeline.push({
        $match: { CheckInDate: { $eq: new Date(fromDate) } },
      });
    } else if (toDate) {
      pipeline.push({
        $match: { CheckOutDate: { $eq: new Date(toDate) } },
      });
    }

    let aggregate = userAmadeusFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await userAmadeusFlightBookingModel.aggregatePaginate(aggregate, options);
    return result;
  },

  aggPagGetUserBookingList:async(query)=>{
    const { toDate, fromDate, page, limit, search } = query;

    let pipeline = [
      {
        $lookup: {
          from: "userBtoC",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    let aggregate = userAmadeusFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await userAmadeusFlightBookingModel.aggregatePaginate(aggregate, options);
    console.log("result============",result);
    return result;
  }
};

module.exports = { userAmadeusFlightBookingServices };
