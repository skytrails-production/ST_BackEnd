const countryViseApplyModel = require('../../model/intelliVisa/countryViseApply');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const countryViseApplyServices={
    createVisaAppCountryWise: async (insertObj) => {
        return await countryViseApplyModel.create(insertObj);
    },
    insertManyVisaAppCountryWise: async (insertObj) => {
        return await countryViseApplyModel.insertMany(insertObj);
    },
    findVisaAppCountryWise: async (query) => {
        return await countryViseApplyModel.findOne(query) ;
    },
    findVisaAppCountryWisePop: async (query) => {
        return await countryViseApplyModel.findOne(query).populate('userId') ;
    },
    deleteVisaAppCountryWise: async (query) => {
        return await countryViseApplyModel.deleteOne(query);
    },

    countryViseApplyList: async (query) => {
        return await countryViseApplyModel.find(query);
    },
    updateVisaAppCountryWise: async (query, updateObj) => {
        return await countryViseApplyModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalVisaAppCountryWise: async (body) => {
        return await countryViseApplyModel.countDocuments(body);
    } ,
    findVisaAppCountryWiseKeys: async (query) => {
        return await countryViseApplyModel.findOne(query, { 'imageeDetails.parsedData.ument_Type': 1, 'imageeDetails.imageUrl': 1,applicantEmail:1}) ;
    },   
}
module.exports ={countryViseApplyServices}