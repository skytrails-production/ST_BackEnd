const userRechargeModel = require('../../model/btocModel/userRechargeModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userRechargeServices = {
    createUserRechargeApplication: async (insertObj) => {
        return await userRechargeModel.create(insertObj);
    },

    findUserRechargeApplication: async (query) => {
        return await userRechargeModel.findOne(query)
    },
    deleteUserRechargeApplication: async (query) => {
        return await userRechargeModel.deleteOne(query);
    },
    userRechargeApplicationList: async (query) => {
        return await userRechargeModel.find(query).populate('userId').exec();
    },
    userRechargeApplicationfind: async (query) => {
        return await userRechargeModel.find(query);
    },
    updateUserRechargeApplication: async (query, updateObj) => {
        return await userRechargeModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    countTotalUserRechargeApplication: async (body) => {
        return await userRechargeModel.countDocuments(body)
    }
}

module.exports = { userRechargeServices }