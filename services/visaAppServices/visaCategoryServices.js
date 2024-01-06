const visaCategoryModel = require('../../model/visaModel/visaCategoryModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const visaCategoryServices={
    createVisaCategory: async (insertObj) => {
        return await visaCategoryModel.create(insertObj);
    },

    findVisaCategoryData: async (query) => {
        return await visaCategoryModel.findOne(query)
    },

    deleteVisaCategory: async (query) => {
        return await visaCategoryModel.deleteOne(query);
    },

    visaCategoryList: async (query) => {
        return await visaCategoryModel.find(query)
    },
    updateVisaCategory: async (query, updateObj) => {
        return await visaCategoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalVisaCategory: async (body) => {
        return await visaCategoryModel.countDocuments(body)
    },
    getVisaCategory:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await visaCategoryModel.paginate(query, options);
    }
}
module.exports ={visaCategoryServices}