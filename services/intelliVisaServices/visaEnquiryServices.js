const visaEnquiryModel = require('../../model/intelliVisa/visaEnquiryModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const visaEnquiryServices={
    createvisaEnquiryList: async (insertObj) => {
        return await visaEnquiryModel.create(insertObj);
    },

    findvisaEnquiry: async (query) => {
        return await visaEnquiryModel.findOne(query) ;
    },

    deletevisaEnquiryList: async (query) => {
        return await visaEnquiryModel.deleteOne(query);
    },

    visaEnquiryList: async (query) => {
        return await visaEnquiryModel.find(query);
    },
    updatevisaEnquiryList: async (query, updateObj) => {
        return await visaEnquiryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalvisaEnquiryList: async (body) => {
        return await visaEnquiryModel.countDocuments(body);
    }    
}
module.exports ={visaEnquiryServices}