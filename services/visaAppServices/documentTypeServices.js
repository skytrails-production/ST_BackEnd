const documentModel = require('../../model/visaModel/documentModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const docTypeServices={
    createdocType: async (insertObj) => {
        return await documentModel.create(insertObj);
    },

    findDocTypeData: async (query) => {
        return await documentModel.findOne(query)
    },

    deleteDocType: async (query) => {
        return await documentModel.deleteOne(query);
    },

    docTypeList: async (query) => {
        return await documentModel.find(query)
    },
    updateDocType: async (query, updateObj) => {
        return await documentModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalDocType: async (body) => {
        return await documentModel.countDocuments(body)
    },
    getDocType:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await documentModel.paginate(query, options);
    }
}
module.exports ={docTypeServices}