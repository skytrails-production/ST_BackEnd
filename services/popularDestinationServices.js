const status = require("../enums/status");
const popularDestinationModel=require("../model/popularDestinationModel")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const popularDestinationServices={
    createPopularDestination: async (insertObj) => {
        return await popularDestinationModel.create(insertObj);
    },

    findPopularDestination: async (query) => {
        return await popularDestinationModel.findOne(query);
    },

    findPopularDestinationData: async (query) => {

        const a=await popularDestinationModel.find(query);
        return a;
    },

    deletePopularDestination: async (query) => {
        return await popularDestinationModel.deleteOne(query);
    },

   
    updatePopularDestination: async (query, updateObj) => {
        return await popularDestinationModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={popularDestinationServices}