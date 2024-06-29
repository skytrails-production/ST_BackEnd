const status = require("../../enums/status");
const ItineraryModel=require("../../model/Itinerary/ItineraryModel")


const ItineraryServices={
    createProposal: async (insertObj) => {
        return await ItineraryModel.create(insertObj);
    },

    finOneProposal: async (query) => {
        return await ItineraryModel.findOne(query);
    },

    findAllProposal: async (query) => {
        return await ItineraryModel.find(query);
    },

    deleteProposal: async (query) => {
        return await ItineraryModel.deleteOne(query);
    },

   
    updateProposal: async (query, updateObj) => {
        return await ItineraryModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={ItineraryServices}