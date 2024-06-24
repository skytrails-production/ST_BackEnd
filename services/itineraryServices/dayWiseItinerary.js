const status = require("../../enums/status");
const createDayWiseItineraryModel=require("../../model/Itinerary/createDayWiseItinerary")


const createDayWiseItineraryServices={
    createDayWiseItinerary: async (insertObj) => {
        return await createDayWiseItineraryModel.create(insertObj);
    },

    finOneDayWiseItinerary: async (query) => {
        return await createDayWiseItineraryModel.findOne(query);
    },

    findAllDayWiseItinerary: async (query) => {
        return await createDayWiseItineraryModel.find(query);
    },

    deleteDayWiseItinerary: async (query) => {
        return await createDayWiseItineraryModel.deleteOne(query);
    },

    updateDayWiseItinerary: async (query, updateObj) => {
        return await createDayWiseItineraryModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={createDayWiseItineraryServices}