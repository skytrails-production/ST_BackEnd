const userWalletHistoryModel = require('../../model/btocModel/userWalletHistoryModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userWalletHistoryServices = {
    createUserWalletHistory: async (insertObj) => {
        return await userWalletHistoryModel.create(insertObj);
    },

    findUserWalletHistory: async (query) => {
        return await userWalletHistoryModel.findOne(query)
    },
    deleteUserWalletHistory: async (query) => {
        return await userWalletHistoryModel.deleteOne(query);
    },

    userWalletHistoryList: async (query) => {
        return await userWalletHistoryModel.find(query).populate('userId').exec();
    },
    updateUserWalletHistory: async (query, updateObj) => {
        return await userWalletHistoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    // paginateUserUserWalletHistoryHistory: async (body) => {
    //     // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
    //     let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } }
    //     const { page, limit, usersType1, search } = body;
    //     if (search) {
    //         query.$or = [
    //             // { username: { $regex: search, $options: 'i' } },
    //             // { email: { $regex: search, $options: 'i' } },
    //             { _id: { $regex: search, $options: 'i' } },
    //             { status: { $regex: search, $options: 'i' } }
    //         ]
    //     }
    //     if (usersType1) {
    //         query.userType = usersType1
    //     }

    //     let options = {
    //         page: Number(page) || 1,
    //         limit: Number(limit) || 8,
    //         sort: { createdAt: -1 },
    //     };
    //     return await userWalletHistoryModel.paginate(query, options);
    // },
    countTotalUserWalletHistory: async (body) => {
        return await userWalletHistoryModel.countDocuments(body)
    }
}

module.exports = { userWalletHistoryServices }