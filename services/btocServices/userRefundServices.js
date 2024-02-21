const refundModel = require('../../model/btocModel/userTransactionRefundModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const refundModelServices = {
    createUsertransactionRefund: async (insertObj) => {
        return await refundModel.create(insertObj);
    },

    findUsertransactionRefund: async (query) => {
        return await refundModel.findOne(query)
    },

    getUsertransactionRefund: async (query) => {
        return await refundModel.findOne(query)
    },

    deleteUsertransactionRefund: async (query) => {
        return await refundModel.deleteOne(query);
    },

    userUsertransactionListRefund: async (query) => {
        return await refundModel.find(query)
    },
    updateUsertransactionRefund: async (query, updateObj) => {
        return await refundModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUsertransactionRefund: async (body) => {
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
        return await refundModel.paginate(query, options);
    },
    countTotalUsertransactionRefund: async (body) => {
        return await refundModel.countDocuments(body)
    }
}

module.exports = { refundModelServices }