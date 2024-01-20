const subAmdinTaskModel = require('../model/subAdmin/subAmdinTaskModel');
const userType = require("../enums/userType");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const subAdminTaskServices = {
    createSubAdminTask: async (insertObj) => {
        return await subAmdinTaskModel.create(insertObj);
    },

    findSubAdminTask: async (query) => {
        console.log("query=======",query)
        return await subAmdinTaskModel.findOne(query);
    },

    

    findSubAdminTaskData: async (query) => {
        return await subAmdinTaskModel.findOne(query);
    },

    deleteSubAdminTask: async (query) => {
        return await subAmdinTaskModel.deleteOne(query);
    },

    subAdminTaskList: async (query) => {
        return await subAmdinTaskModel.find(query);
    },
    updateSubAdminTask: async (query, updateObj) => {
        return await subAmdinTaskModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    paginateSubAdminTaskSearch: async (body) => {
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
        return await subAmdinTaskModel.paginate(query, options);
    },
    countTotalSubAdminTask: async (body) => {
        return await subAmdinTaskModel.countDocuments(body)
    }
}

module.exports = { subAdminTaskServices }