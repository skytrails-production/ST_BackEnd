const status = require("../../enums/status");
const staticContentModel=require("../../model/btocModel/staticContentModel")


const appStaticContentServices={
    createAppStaticContent: async (insertObj) => {
        return await staticContentModel.create(insertObj);
    },

    findAppStaticContent: async (query) => {
        return await staticContentModel.findOne(query);
    },

    findAppStaticContentData: async (query) => {
        return await staticContentModel.find(query);
    },

    deleteAppStaticContentStatic: async (query) => {
        return await staticContentModel.deleteOne(query);
    },

   
    updateAppStaticContentStatic: async (query, updateObj) => {
        return await staticContentModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={appStaticContentServices}