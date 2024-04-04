const status = require("../enums/status");
const referralAmountModel = require("../model/referralAmountModel");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//
const referralAmountServices = {
    createReferralAmount: async (insertObj) => {
        return await referralAmountModel.create(insertObj);
    },

    findReferralAmount: async (query) => {
        return await referralAmountModel.findOne(query);
    },

    deleteReferralAmount: async (query) => {
        return await referralAmountModel.deleteOne(query);
    },

    referralAmountList: async (query) => {
        return await referralAmountModel.find(query);
    },

    updateReferralAmount: async (query, updateObj) => {
        return await referralAmountModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    referralAmountListPaginate: async (validatedBody) => {
        let query = { status: status.ACTIVE };
        const { page, limit } = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await referralAmountModel.paginate(query, options);
    },
};

module.exports = { referralAmountServices };