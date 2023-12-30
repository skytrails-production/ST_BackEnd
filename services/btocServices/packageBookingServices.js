const packageBookingModel = require('../../model/btocModel/packageBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const mongoose=require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const packageBookingModelServices = {
    createPackage: async (insertObj) => {
        return await packageBookingModel.create(insertObj);
    },

    findPackage: async (query) => {
        return await packageBookingModel.findOne(query)
    },

    getUserPackage: async (query) => {
        return await packageBookingModel.find(query)
    },

    deletePackage: async (query) => {
        return await packageBookingModel.deleteOne(query);
    },
    updatePackage: async (query, updateObj) => {
        return await packageBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalPackage: async (body) => {
        return await packageBookingModel.countDocuments(body)
    }
 
    
}

module.exports = { packageBookingModelServices }