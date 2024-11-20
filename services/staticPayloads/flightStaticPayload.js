// const status = require("../enums/status");
const flightPayloadModel=require("../../model/payloadModel/flightPayload")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const flightPayloadServices={
    createflightPayload: async (insertObj) => {
        return await flightPayloadModel.create(insertObj);
    },

    findflightPayload: async (query) => {
        return await flightPayloadModel.findOne(query);
    },

    findflightPayloadData: async (query) => {
        return await flightPayloadModel.find(query);
    },

    deleteflightPayloadStatic: async (query) => {
        return await flightPayloadModel.deleteOne(query);
    },

   
    updateflightPayloadStatic: async (query, updateObj) => {
        return await flightPayloadModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={flightPayloadServices}