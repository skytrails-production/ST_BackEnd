const aiVisaDocModel = require('../../model/intelliVisa/inhouseFilling');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const aiVisaDocServices={
    createAiVisaDoc: async (insertObj) => {
        return await aiVisaDocModel.create(insertObj);
    },
    insertManyAiVisaDoc: async (insertObj) => {
        return await aiVisaDocModel.insertMany(insertObj);
    },
    findAiVisaDoc: async (query) => {
        return await aiVisaDocModel.findOne(query) ;
    },
    deleteAiVisaDoc: async (query) => {
        return await aiVisaDocModel.deleteOne(query);
    },

    aiVisaDocList: async (query) => {
        return await aiVisaDocModel.find(query);
    },
    updateAiVisaDoc: async (query, updateObj) => {
        return await aiVisaDocModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalAiVisaDoc: async (body) => {
        return await aiVisaDocModel.countDocuments(body);
    }    
}
module.exports ={aiVisaDocServices}