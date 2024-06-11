const grnCancelModel=require("../../model/btocModel/grnCancelltionModel")
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const mongoose=require('mongoose');

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userGrnCancelServices={
    createUserGrnCancellation:async(insertObj)=>{
        return await grnCancelModel.create(insertObj);
    },
    findUserGrnCancellation: async (query) => {
        return await grnCancelModel.findOne(query)
    },
    findUserGrnCancellationList: async (query) => {
        return await grnCancelModel.find(query).sort({createdAt:-1})
    },
    deleteUserGrnCancellation: async (query) => {
        return await grnCancelModel.deleteOne(query);
    },
    updateGrnCancellation: async (query, updateObj) => {
        return await grnCancelModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    userGrnCancellation: async (query) => {
        return await grnCancelModel.find(query)
    },
    getUserGrnCancellation: async (query) => {
        return await grnCancelModel.findOne(query)
    },
}

module.exports = { userGrnCancelServices }