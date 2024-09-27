const flightBookingModel = require("../../model/btocModel/flightBookingModel");
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userflightBookingServices = {
  createUserflightBooking: async (insertObj) => {
    return await flightBookingModel.create(insertObj);
  },

  findUserflightBooking: async (query) => {
    return await flightBookingModel.findOne(query);
  },

  getUserflightBooking: async (query) => {
    return await flightBookingModel.findOne(query);
  },

  findUserflightBookingData: async (query) => {
    return await flightBookingModel.findOne(query);
  },

  deleteUserflightBooking: async (query) => {
    return await flightBookingModel.deleteOne(query);
  },

  userflightBookingList: async (query) => {
    return await flightBookingModel.find(query);
  },
  updateUserflightBooking: async (query, updateObj) => {
    return await flightBookingModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  paginateUserflightBookingSearch: async (body) => {
    // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
    let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } };
    const { page, limit, usersType1, search } = body;
    if (search) {
      query.$or = [
        // { username: { $regex: search, $options: 'i' } },
        // { email: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }
    if (usersType1) {
      query.userType = usersType1;
    }

    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    return await flightBookingModel.paginate(query, options);
  },
  countTotalUserFlightBooking: async (body) => {
    return await flightBookingModel.countDocuments(body);
  },

  aggregatePaginateGetBooking: async (query) => {
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
        $sort:{"airlineDetails[0].Origin.DepTime":-1}
      }
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
    let aggregate = flightBookingModel.aggregate(pipeline);
    // console.log("aggregate========>>>>>>>", aggregate);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 1000,
      sort: { createdAt: -1 },
    };
    const result = await flightBookingModel.aggregatePaginate(
      aggregate,
      options
    );
    // console.log("=--------=-=-=--------", result);
    return result;
  },
  aggregatePaginateGetBooking1: async (query) => {
    const { toDate, fromDate, page, limit, search } = query;

    if (search) {
      var filter = search;
    }
    let data = filter || "";
    let pipeline = [
      {
        $sort:{"airlineDetails[0].Origin.DepTime":-1}
      }
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
    let aggregate = flightBookingModel.aggregate(pipeline);
    // console.log("aggregate========>>>>>>>", aggregate);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await flightBookingModel.aggregatePaginate(
      aggregate,
      options
    );
    // console.log("=--------=-=-=--------", result);
    return result;
  },
};

module.exports = { userflightBookingServices };
