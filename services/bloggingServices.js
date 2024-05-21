const bloggingModel = require('../model/bloggingModel');
const userType = require("../enums/userType");
const approveStatus=require("../enums/approveStatus")
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
        return await bloggingModel.find(query).sort({createdAt:-1});
    },
    deleteBlog: async (query) => {
        return await bloggingModel.deleteOne(query);
    },

    blogList: async (query) => {
        return await bloggingModel.find(query).sort({ createdAt: -1 }).limit(6);
    },
    updateBlog: async (query, updateObj) => {
        return await bloggingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateBlogSearch: async (body) => {
        // BloggingType: { $ne: [BloggingType.ADMIN,BloggingType.SUBADMIN] }
        let query = { approveStatus:approveStatus.PENDING,is_active:0 }
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { 'personal_details.first_name': { $regex: search, $options: 'i' } },
                { 'personal_details.last_name': { $regex: search, $options: 'i' } },
                { 'personal_details.email': { $regex: search, $options: 'i' } },
                { 'agency_details.agency_name': { $regex: search, $options: 'i' } },
                { 'agency_details.pan_number': { $regex: search, $options: 'i' } },
                { 'personal_details.city': { $regex: search, $options: 'i' } }
            ]
        }
       
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await bloggingModel.paginate(query, options);
    },
    countTotalBlog: async (body) => {
        return await bloggingModel.countDocuments(body)
    }
}

module.exports = { bloggingServices }