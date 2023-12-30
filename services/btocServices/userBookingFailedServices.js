const userBookingFailed = require('../../model/btocModel/userBookingFailed');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userBookingFailedServices = {
    createUserBookingFailed: async (insertObj) => {
        return await userBookingFailed.create(insertObj);
    },

    findUserBookingFailed: async (query) => {
        return await userBookingFailed.findOne(query)
    },

    getUserBookingFailed: async (query) => {
        return await userBookingFailed.findOne(query)
    },

    deleteUserBookingFailed: async (query) => {
        return await userBookingFailed.deleteOne(query);
    },

    userUserBookingFailedList: async (query) => {
        return await userBookingFailed.find(query)
    },
    updateUserBookingFailed: async (query, updateObj) => {
        return await userBookingFailed.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateUserBookingFailed: async (body) => {
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
        return await userBookingFailed.paginate(query, options);
    },
    countTotalUserBookingFailed: async (body) => {
        return await userBookingFailed.countDocuments(body)
    }
}

module.exports = { userBookingFailedServices }