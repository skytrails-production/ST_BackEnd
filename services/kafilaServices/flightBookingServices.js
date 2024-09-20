const kafilaFlightBookingModel = require("../../model/kafilaModel/kafilaFlightBookingModel");
const Type = require("../../enums/userType");
const Status = require("../../enums/status");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a service which we need MongoDB queries to perform operations on the DB********//

const userKafilaFlightBookingServices = {
  createKafilaFlightBooking: async (insertObj) => {
    return await kafilaFlightBookingModel.create(insertObj);
  },

  findKafilaFlightBooking: async (query) => {
    return await kafilaFlightBookingModel.findOne(query);
  },

  getKafilaFlightBookings: async (query) => {
    return await kafilaFlightBookingModel.find(query);
  },
 
  deleteKafilaFlightBooking: async (query) => {
    return await kafilaFlightBookingModel.deleteOne(query);
  },

  updateKafilaFlightBooking: async (query, updateObj) => {
    return await kafilaFlightBookingModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  paginateKafilaFlightBookingSearch: async (body) => {
    let query = {};
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
    
    return await kafilaFlightBookingModel.paginate(query, options);
  },

  countTotalKafilaFlightBookings: async (body) => {
    return await kafilaFlightBookingModel.countDocuments(body);
  },

  aggregatePaginateGetKafilaFlightBooking: async (query) => {
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
    
    let aggregate = kafilaFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 1000000,
      sort: { "airlineDetails.0.Origin.DepTime": -1 },
    };
    const result = await kafilaFlightBookingModel.aggregatePaginate(aggregate, options);
    return result;
  },

  aggregatePaginateGetKafilaFlightBooking1: async (query) => {
    const { toDate, fromDate, page, limit, search,userId } = query;

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
      {
        $match:{userId:userId}
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

    let aggregate = kafilaFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 1000000,
      sort: { createdAt: -1 },
    };
    const result = await kafilaFlightBookingModel.aggregatePaginate(aggregate, options);
    return result;
  },
  aggrPagGetKafilaFlightBooking: async (query) => {
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

    let aggregate = kafilaFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10000,
      sort: { createdAt: -1 },
    };
    const result = await kafilaFlightBookingModel.aggregatePaginate(aggregate, options);
    return result;
  },


  aggPagGetBookingList:async(query)=>{
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
    let aggregate = kafilaFlightBookingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await kafilaFlightBookingModel.aggregatePaginate(aggregate, options);
    return result;
  }
};

module.exports = { userKafilaFlightBookingServices };
