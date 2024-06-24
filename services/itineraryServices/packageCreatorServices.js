const status = require("../../enums/status");
const packageCreatorModel=require("../../model/Itinerary/packageCreatorModel")


const packageCreatorModelServices={
    createPckgCreator: async (insertObj) => {
        return await packageCreatorModel.create(insertObj);
    },

    finOnePckgCreator: async (query) => {
        return await packageCreatorModel.findOne(query);
    },

    findAllPckgCreator: async (query) => {
        return await packageCreatorModel.find(query);
    },

    deletePckgCreator: async (query) => {
        return await packageCreatorModel.deleteOne(query);
    },

   
    updatePckgCreator: async (query, updateObj) => {
        return await packageCreatorModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={packageCreatorModelServices}