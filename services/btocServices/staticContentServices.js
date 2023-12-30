const status = require("../../enums/status");
const staticContentModel=require("../../model/btocModel/staticContentModel")


const staticContentServices={
    createstaticContent: async (insertObj) => {
        return await staticContentModel.create(insertObj);
    },

    findstaticContent: async (query) => {
        return await staticContentModel.findOne(query);
    },

    findstaticContentData: async (query) => {
        return await staticContentModel.find(query);
    },

    deletestaticContentStatic: async (query) => {
        return await staticContentModel.deleteOne(query);
    },

   
    updatestaticContentStatic: async (query, updateObj) => {
        return await staticContentModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={staticContentServices}