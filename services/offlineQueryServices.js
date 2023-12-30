const offlineModel = require('../model/offlinerateQueryModel');
const userType = require("../enums/userType");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const offlineServices = {
    createOffline: async (insertObj) => {
        return await offlineModel.create(insertObj);
    },

    findOffline: async (query) => {
        return await offlineModel.findOne(query);
    },

    deleteOffline: async (query) => {
        return await offlineModel.deleteOne(query);
    },

    offlineList: async (query) => {
        return await offlineModel.find(query);
    },
    updateOffline: async (query, updateObj) => {
        return await offlineModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateOfflineSearch: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.offline] }
        let query = { userType: { $nin: [userType.ADMIN, userType.offline] } }
        const { page, limit, usersType1, search } = body;
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
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
        return await offlineModel.paginate(query, options);
    },
    countTotalOffline: async (body) => {
        return await offlineModel.countDocuments(body)
    }
}

module.exports = { offlineServices }