const visaApplicationServices = require('../../model/btocModel/applyVisaModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const visaApplicationServices = {
    createUserVisaApplication: async (insertObj) => {
        return await userSerachesModel.create(insertObj);
    },

    findUserVisaApplication: async (query) => {
        return await userSerachesModel.findOne(query)
    },
    deleteUserVisaApplication: async (query) => {
        return await userSerachesModel.deleteOne(query);
    },
    userVisaApplicationList: async (query) => {
        return await userSerachesModel.find(query).populate('userId').exec();
    },
    updateUserVisaApplication: async (query, updateObj) => {
        return await userSerachesModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    countTotalUserVisaApplication: async (body) => {
        return await userSerachesModel.countDocuments(body)
    }
}

module.exports = { visaApplicationServices }