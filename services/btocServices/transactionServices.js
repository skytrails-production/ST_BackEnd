const transactionModel = require('../../model/btocModel/usertransactionsModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const transactionModelServices = {
    createUsertransaction: async (insertObj) => {
        return await transactionModel.create(insertObj);
    },

    findUsertransaction: async (query) => {
        return await transactionModel.findOne(query)
    },

    getUsertransaction: async (query) => {
        return await transactionModel.findOne(query)
    },

    deleteUsertransaction: async (query) => {
        return await transactionModel.deleteOne(query);
    },

    userUsertransactionList: async (query) => {
        return await transactionModel.find(query)
    },
    updateUsertransaction: async (query, updateObj) => {
        return await transactionModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUsertransaction: async (body) => {
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
        return await transactionModel.paginate(query, options);
    },
    countTotalUsertransaction: async (body) => {
        return await transactionModel.countDocuments(body)
    }
}

module.exports = { transactionModelServices }