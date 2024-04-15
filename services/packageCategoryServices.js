const status = require("../enums/status");
const packageCategoryModel=require("../model/packageCategoryModel")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const packageCategoryServices={
    createPackageCategory: async (insertObj) => {
        return await packageCategoryModel.create(insertObj);
    },

    findPackageCategory: async (query) => {
        return await packageCategoryModel.findOne(query);
    },

    findPackageCategoryData: async (query) => {

        const a=await packageCategoryModel.find(query);
        return a;
    },

    deletePackageCategory: async (query) => {
        return await packageCategoryModel.deleteOne(query);
    },

   
    updatePackageCategory: async (query, updateObj) => {
        return await packageCategoryModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={packageCategoryServices}