const status = require("../enums/status");
const packageBannerModel=require("../model/packageBannerModel")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const packageBannerServices={
    createPackageBanner: async (insertObj) => {
        return await packageBannerModel.create(insertObj);
    },

    findPackageBanner: async (query) => {
        return await packageBannerModel.findOne(query);
    },

    findPackageBannerData: async (query) => {

        const a=await packageBannerModel.find(query);
        return a;
    },

    deletePackageBanner: async (query) => {
        return await packageBannerModel.deleteOne(query);
    },

   
    updatePackageBanner: async (query, updateObj) => {
        return await packageBannerModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={packageBannerServices}