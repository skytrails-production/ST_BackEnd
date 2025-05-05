const aiVisaApplicationModel = require('../../model/intelliVisa/aiVisaApplicationModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const aiVisaApplicationServices={
    createAiVisaApplication: async (insertObj) => {
        return await aiVisaApplicationModel.create(insertObj);
    },

    findAiVisaApplication: async (query) => {
        return await aiVisaApplicationModel.findOne(query) ;
    },
    findOneAiVisaApplicationPop: async (query) => {
        return await aiVisaApplicationModel.findOne(query).populate('visaCountryId') ;
    },

    deleteAiVisaApplication: async (query) => {
        return await aiVisaApplicationModel.deleteOne(query);
    },

    aiVisaApplicationList: async (query) => {
        return await aiVisaApplicationModel.find(query);
    },
    aiVisaApplicationListPop: async (query) => {
        return await aiVisaApplicationModel.find(query).populate('visaCountryId');
    },
    updateAiVisaApplication: async (query, updateObj) => {
        return await aiVisaApplicationModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalAiVisaApplication: async (body) => {
        return await aiVisaApplicationModel.countDocuments(body);
    }    
}
module.exports ={aiVisaApplicationServices}