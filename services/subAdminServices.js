const subAdminModel = require('../model/subAdmin/subAdminModel');
const userType = require("../enums/userType");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const subAdminServices = {
    createSubAdmin: async (insertObj) => {
        return await subAdminModel.create(insertObj);
    },

    findSubAdmin: async (query) => {
        return await subAdminModel.findOne(query);
    },

    

    findSubAdminData: async (query) => {
        return await subAdminModel.findOne(query);
    },

    deleteSubAdmin: async (query) => {
        return await subAdminModel.deleteOne(query);
    },

    subAdminList: async (query) => {
        return await subAdminModel.find(query);
    },
    updateSubAdmin: async (query, updateObj) => {
        return await subAdminModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateSubAdminSearch: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = { userType:userType.SUBADMIN}
        const { page, limit, search } = body;
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { userName: searchRegex},
                { email: searchRegex},
                { contactNumber:searchRegex},
                { status:searchRegex},
                {authType:searchRegex}
            ]
        }

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await subAdminModel.paginate(query, options);
    },
    countTotalSubAdmin: async (body) => {
        return await subAdminModel.countDocuments(body)
    }
}

module.exports = { subAdminServices }