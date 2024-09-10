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

    paginateUserSearchHistory:async(body)=>{
        let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } };
        const { page, limit, search } = body;
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [
            { origin: searchRegex },
            { destination: searchRegex },
            { status: searchRegex },
            { journeyType: searchRegex },
            { searchType: searchRegex },
          ];
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