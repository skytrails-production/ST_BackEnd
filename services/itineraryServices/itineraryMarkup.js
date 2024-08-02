const status = require("../../enums/status");
const itineraryMarkupModel=require("../../model/Itinerary/itinearyMarkup")


const itineraryMarkupServices={
    createItineraryMarkup: async (insertObj) => {
        return await itineraryMarkupModel.create(insertObj);
    },

    finOneItineraryMarkup: async (query) => {
        return await itineraryMarkupModel.findOne(query);
    },

    findAllItineraryMarkup: async (query) => {
        return await itineraryMarkupModel.find(query);
    },

    deleteItineraryMarkup: async (query) => {
        return await itineraryMarkupModel.deleteOne(query);
    },

    updateItineraryMarkup: async (query, updateObj) => {
        return await itineraryMarkupModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={itineraryMarkupServices}