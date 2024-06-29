const jobSectionModel = require('../../model/carrersModel/jobSectionModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const jobSectionServices={
    createjobSection: async (insertObj) => {
        return await jobSectionModel.create(insertObj);
    },

    findjobSectionData: async (query) => {
        return await jobSectionModel.findOne(query).populate({path: 'documentTypesId'})
    },

    deletejobSection: async (query) => {
        return await jobSectionModel.deleteOne(query);
    },

    jobSectionList: async (query) => {
        // .populate({path: 'documentTypesId'})
        return await jobSectionModel.find(query)
    },
    updatejobSection: async (query, updateObj) => {
        return await jobSectionModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotaljobSection: async (body) => {
        return await jobSectionModel.countDocuments(body)
    },
    getjobSection:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await jobSectionModel.paginate(query, options);
    }
}
module.exports ={jobSectionServices}