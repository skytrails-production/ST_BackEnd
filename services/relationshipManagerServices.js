const relationShipManagerModel = require('../model/relationManagerModel/relationShipManagerModel');
const userType = require("../enums/userType");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const relationShipManagerServices = {
    createRelationShipManager: async (insertObj) => {
        return await relationShipManagerModel.create(insertObj);
    },

    findRelationShipManager: async (query) => {
        return await relationShipManagerModel.findOne(query);
    },

    

    findRelationShipManagerData: async (query) => {
        return await relationShipManagerModel.findOne(query);
    },

    deleteRelationShipManager: async (query) => {
        return await relationShipManagerModel.deleteOne(query);
    },

    relationShipManagerList: async (query) => {
        return await relationShipManagerModel.find(query);
    },
    updateRelationShipManager: async (query, updateObj) => {
        return await relationShipManagerModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateRelationShipManagerSearch: async (body) => {
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
        return await relationShipManagerModel.paginate(query, options);
    },
    countTotalRelationShipManager: async (body) => {
        return await relationShipManagerModel.countDocuments(body)
    }
}

module.exports = { relationShipManagerServices }