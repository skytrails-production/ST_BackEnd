const status = require("../enums/status");
const holidayPackageModel = require("../model/holidayPackageModel");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const holidayPackageServices = {
  createHolidayPackage: async (insertObj) => {
    return await holidayPackageModel.create(insertObj);
  },

  findHolidayPackage: async (query) => {
    return await holidayPackageModel
      .findOne(query)
      .select("-status -createdAt -updatedAt");
  },

  findHolidayPackageData: async (query) => {
    return await holidayPackageModel
      .find(query)
      .select("-status -createdAt -updatedAt");
  },

  deleteHolidayPackage: async (query) => {
    return await holidayPackageModel
      .deleteOne(query)
      .select("-status -createdAt -updatedAt");
  },

  updateHolidayPackage: async (query, updateObj) => {
    return await holidayPackageModel
      .findOneAndUpdate(query, updateObj, { new: true })
      .select("-status -createdAt -updatedAt");
  },

  aggregatePaginateHolidayPackage: async (query) => {
    const { page, limit, search, userId } = query;
    if (search) {
      var filter = search;
    }
    let searchKey = search.toLowerCase();
    let data = filter || "";
    let pipeLine = [
      {
        $match: { userId: mongoose.Types.ObjectId(userId) },
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
        $match: {
          $or: [
            { package_title: { $regex: data, $options: "i" } },
            { destination: { $regex: data, $options: "i" } },
            { country: { $regex: data, $options: "i" } },
            { days: { $regex: data, $options: "i" } },
            { "destination.addMore": { $regex: searchKey, $options: "i" } },
            { days: parseInt(data) },
            { "package_amount.amount'": parseInt(data) },
          ],
        },
      },
      {
        $sort: { CheckInDate: -1 },
      },
    ];
    if (search) {
      pipeLine.push({
        $match: {
          [`inclusions.${searchKey}`]: "true",
        },
      });
      pipeLine.push({
        $match: {
          [`select_tags.${searchKey}`]: "true", // Match select_tags based on search
        },
      });
      pipeLine.push({
        $match: {
          "destination.addMore": { $regex: searchKey, $options: "i" },
        },
      });
    }
    let aggregate = holidayPackageModel.aggregate(pipe);
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 1000000,
      sort: { createdAt: -1 },
    };
    return await holidayPackageModel.aggregatePaginate(aggregate, options);
  },

  paginateHolidayPackage: async (query) => {
    const { page, limit, search } = query;
    querySerach = {is_active:1};
    if (search) {
      querySerach.$or = [
        { status: { $regex: search, $options: "i" } },
        { package_title: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { 'package_amount.amount': parseInt(search)},
        { package_title: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }
    let options = {
        page: Number(page) || 1,
        limit: Number(limit) || 8,
        sort: { createdAt: -1 },
    };
    return await holidayPackageModel.paginate(query, options);
  },
};

module.exports = { holidayPackageServices };
