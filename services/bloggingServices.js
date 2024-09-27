const bloggingModel = require("../model/bloggingModel");
const userType = require("../enums/userType");
const approveStatus = require("../enums/approveStatus");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const bloggingServices = {
  createBlog: async (insertObj) => {
    return await bloggingModel.create(insertObj);
  },

  findBlog: async (query) => {
    return await bloggingModel.findOne(query);
  },
  findSingleBlog: async (query) => {
    return await bloggingModel.findOne(query);
  },
  findBlogData: async (query) => {
    return await bloggingModel.find(query).sort({ createdAt: -1 });
  },
  deleteBlog: async (query) => {
    return await bloggingModel.deleteOne(query);
  },

  blogList: async (query) => {
    return await bloggingModel.find(query).sort({ createdAt: -1 }).limit(6);
  },
  updateBlog: async (query, updateObj) => {
    return await bloggingModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  paginateBlogSearch: async (body) => {
    // BloggingType: { $ne: [BloggingType.ADMIN,BloggingType.SUBADMIN] }
    const { search, fromDate, toDate, page, limit } = body;
    let query = {status:status.ACTIVE };
    // const { page, limit, search } = body;
    if (search) {
      query.$or = [
        { "location": { $regex: search, $options: "i" } },
        {"title":{$regex: search, $options: "i" }},
        {"tags":{$regex: search, $options: "i"}}
      ];
    }

    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 18,
      sort: { createdAt: -1 },
    };
    if (fromDate && !toDate) {
        query.createdAt = { $gte: new Date(new Date(fromDate).toISOString().slice(0, 10)) };

    }
    if (!fromDate && toDate) {
        query.createdAt = { $lte: new Date(new Date(toDate).toISOString().slice(0, 10) + 'T23:59:59.999Z') };

    }
    if (fromDate && toDate) {
        query.$and = [
            { createdAt: { $gte: new Date(new Date(fromDate).toISOString().slice(0, 10)) } },
            { createdAt: { $lte: new Date(new Date(toDate).toISOString().slice(0, 10) + 'T23:59:59.999Z') } },
        ]
    }
    return await bloggingModel.paginate(query, options);
  },

  aggPagGetBlogList: async (query) => {
    const { toDate, fromDate, page, limit, search } = query;
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    let pipeline = [{ location: { $regex: filter, $options: "i" } }];
    if (fromDate && toDate) {
      pipeline.push({
        $match: {
          $and: [
            { createdAt: { $gte: new Date(fromDate) } },
            { createdAt: { $lte: new Date(toDate) } },
          ],
        },
      });
    } else if (fromDate) {
      pipeline.push({
        $match: {
          createdAt: { $gte: new Date(fromDate) },
        },
      });
    } else if (toDate) {
      pipeline.push({
        $match: {
          createdAt: { $lte: new Date(toDate) },
        },
      });
    }
    let aggregate = bloggingModel.aggregate(pipeline);
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await bloggingModel.aggregatePaginate(aggregate, options);
    return result;
  },
  countTotalBlog: async (body) => {
    return await bloggingModel.countDocuments(body);
  },
};

module.exports = { bloggingServices };
