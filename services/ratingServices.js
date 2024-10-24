const ratingModel = require('../model/ratingModel');
const userType = require("../enums/userType");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const ratingServices = {
    createRating: async (insertObj) => {
        return await ratingModel.create(insertObj);
    },

    findRating: async (query) => {
        return await ratingModel.findOne(query);
    },

    

    findRatingData: async (query) => {
        return await ratingModel.findOne(query);
    },

    deleteRating: async (query) => {
        return await ratingModel.deleteOne(query);
    },

    ratingList: async (query) => {
        return await ratingModel.find(query);
    },
    ratingListPopulate: async (query) => {
        return await ratingModel.find(query).populate( {path: 'userId',select: 'profilePic'});
    },
    updateRating: async (query, updateObj) => {
        return await ratingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateRatingSearch: async (body) => {
        // userType: { $ne: [userType.AdminTask,userType.SUBAdminTask] }
        let query = { userType:userType.SUBAdminTask,status:status.ACTIVE }
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } }
            ]
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await ratingModel.paginate(query, options);
    },
    countTotalRating: async (body) => {
        return await ratingModel.countDocuments(body)
    }
}

module.exports = { ratingServices }