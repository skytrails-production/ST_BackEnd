const status = require("../enums/status");
const appVersionModel=require("../model/appVersion")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const appVersionServices = {


    createappVersion: async (insertObj) => {
        return await appVersionModel.create(insertObj);
    },

    findappVersion: async (query) => {
        return await appVersionModel.findOne(query).select('-createdAt -updatedAt -status');
    },

    deleteappVersion: async (query) => {
        return await appVersionModel.deleteOne(query);
    },

    appVersionList:async(query)=>{
        return await appVersionModel.find(query).select('-createdAt -updatedAt -status');
    },
    updateappVersion: async (query, updateObj) => {
        return await appVersionModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt -status');
    },
    appVersionListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 ,},
        };
        return await appVersionModel.paginate(query, options);
    },
}

module.exports = { appVersionServices };