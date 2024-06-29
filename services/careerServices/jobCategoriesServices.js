const jobCategoryModel = require('../../model/carrersModel/jobCategoryModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const jobCategoryServices={
    createJobCategory: async (insertObj) => {
        return await jobCategoryModel.create(insertObj);
    },

    findjJobCategoryData: async (query) => {
        return await jobCategoryModel.findOne(query).populate({path: 'documentTypesId'})
    },

    deleteJobCategory: async (query) => {
        return await jobCategoryModel.deleteOne(query);
    },

    jobCategoryList: async (query) => {
        // .populate({path: 'documentTypesId'})
        return await jobCategoryModel.find(query)
    },
    updateJobCategory: async (query, updateObj) => {
        return await jobCategoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalJobCategory: async (body) => {
        return await jobCategoryModel.countDocuments(body)
    },
    getJobCategory:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await jobCategoryModel.paginate(query, options);
    }
}
module.exports ={jobCategoryServices}