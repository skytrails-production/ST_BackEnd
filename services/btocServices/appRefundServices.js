const appRefundModel = require('../../model/btocModel/appRefundModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const appRefundModelServices = {
    createRefund: async (insertObj) => {
        return await appRefundModel.create(insertObj);
    },

    findUserRefund: async (query) => {
        return await appRefundModel.findOne(query)
    },

    getUserRefund: async (query) => {
        return await appRefundModel.findOne(query)
    },

    deleteUserRefund: async (query) => {
        return await appRefundModel.deleteOne(query);
    },

    userUserListRefund: async (query) => {
        return await appRefundModel.find(query)
    },
    updateUserRefund: async (query, updateObj) => {
        return await appRefundModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserRefund: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } }
        const { page, limit, usersType1, search } = body;
        if (search) {
            query.$or = [
                // { username: { $regex: search, $options: 'i' } },
                // { email: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } }
            ]
        }
        if (usersType1) {
            query.userType = usersType1
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await appRefundModel.paginate(query, options);
    },
    countTotalUserRefund: async (body) => {
        return await appRefundModel.countDocuments(body)
    }
}

module.exports = { appRefundModelServices }