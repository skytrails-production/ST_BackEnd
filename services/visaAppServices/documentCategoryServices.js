const documentCategoryModel = require('../../model/visaModel/documentCategoryModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const docCategoryServices={
    createDocCategory: async (insertObj) => {
        return await documentCategoryModel.create(insertObj);
    },

    findDocCategoryData: async (query) => {
        return await documentCategoryModel.findOne(query).populate({path: 'documentTypesId'})
    },

    deleteDocCategory: async (query) => {
        return await documentCategoryModel.deleteOne(query);
    },

    docCategoryList: async (query) => {
        return await documentCategoryModel.find(query).populate({path: 'documentTypesId'})
    },
    updateDocCategory: async (query, updateObj) => {
        return await documentCategoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalDocCategory: async (body) => {
        return await documentCategoryModel.countDocuments(body)
    },
    getDocCategory:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await documentCategoryModel.paginate(query, options);
    }
}
module.exports ={docCategoryServices}