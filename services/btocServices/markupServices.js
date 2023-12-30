const markupModel = require('../../model/btocModel/markupForApp');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const mongoose=require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const markupModelServices = {
    createMarkup: async (insertObj) => {
        return await markupModel.create(insertObj);
    },

    findMarkup: async (query) => {
        return await markupModel.findOne(query)
    },

    getUserMarkup: async (query) => {
        return await markupModel.findOne(query)
    },

    deleteMarkup: async (query) => {
        return await markupModel.deleteOne(query);
    },

    markupList: async (query) => {
        return await markupModel.find(query)
    },
    updateMarkup: async (query, updateObj) => {
        return await markupModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalMarkup: async (body) => {
        return await markupModel.countDocuments(body)
    }
    ,
 
    
}

module.exports = { markupModelServices }