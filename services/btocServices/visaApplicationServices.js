const applyVisaModel = require('../../model/btocModel/applyVisaModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const visaApplicationServices = {
    createUserVisaApplication: async (insertObj) => {
        return await applyVisaModel.create(insertObj);
    },

    findUserVisaApplication: async (query) => {
        return await applyVisaModel.findOne(query)
    },
    deleteUserVisaApplication: async (query) => {
        return await applyVisaModel.deleteOne(query);
    },
    userVisaApplicationList: async (query) => {
        return await applyVisaModel.find(query).populate('userId').exec();
    },
    updateUserVisaApplication: async (query, updateObj) => {
        return await applyVisaModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    countTotalUserVisaApplication: async (body) => {
        return await applyVisaModel.countDocuments(body)
    }
}

module.exports = { visaApplicationServices }