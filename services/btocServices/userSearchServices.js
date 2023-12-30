const userSerachesModel = require('../../model/btocModel/userSerachesModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userSerachesServices = {
    createUserSearch: async (insertObj) => {
        return await userSerachesModel.create(insertObj);
    },

    findUserSearch: async (query) => {
        return await userSerachesModel.findOne(query)
    },
    deleteUserSearch: async (query) => {
        return await userSerachesModel.deleteOne(query);
    },

    userSearchList: async (query) => {
        return await userSerachesModel.find(query).populate('userId').exec();
    },
    updateUserSearch: async (query, updateObj) => {
        return await userSerachesModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserSearch: async (body) => {
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
        return await userSerachesModel.paginate(query, options);
    },
    countTotalUserSearch: async (body) => {
        return await userSerachesModel.countDocuments(body)
    }
}

module.exports = { userSerachesServices }