const requiredDocumentModel = require('../../model/visaModel/requiredDocument');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const requireDocServices={
    createRequireDoc: async (insertObj) => {
        return await requiredDocumentModel.create(insertObj);
    },

    findRequireDocData: async (query) => {
        return await requiredDocumentModel.findOne(query)
    },
    findRequireDocData1: async (query) => {
        return await requiredDocumentModel.findOne(query)
            .populate('visaCountry','-requireDocumentId')  // Assuming 'visaCountry' has a 'name' field
            .populate('visaCategory','categoryName visaType -_id') // Assuming 'visaCategory' has a 'name' field
            .select('-requiredDocumentCategories -createdAt -updatedAt');
    },
    
    deleteRequireDoc: async (query) => {
        return await requiredDocumentModel.deleteOne(query);
    },

    requireDocList: async (query) => {
        return await requiredDocumentModel.find(query)
    },

    requireDocListPopulate: async (query) => {
        return await requiredDocumentModel.find(query).populate({path:'visaCountry',select:'countryName'}).populate({path:'visaCategory',select:'categoryName'})
    },

    updateRequireDoc: async (query, updateObj) => {
        return await requiredDocumentModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalRequireDoc: async (body) => {
        return await requiredDocumentModel.countDocuments(body)
    },
    getRequireDoc:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await requiredDocumentModel.paginate(query, options);
    }
}
module.exports ={requireDocServices}