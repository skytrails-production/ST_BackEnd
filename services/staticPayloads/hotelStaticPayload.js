// const status = require("../enums/status");
const hotelPayloadModel=require("../../model/payloadModel/hotelPayload")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const hotelPayloadServices={
    createhotelPayload: async (insertObj) => {
        return await hotelPayloadModel.create(insertObj);
    },

    findhotelPayload: async (query) => {
        return await hotelPayloadModel.findOne(query);
    },

    findhotelPayloadData: async (query) => {
        return await hotelPayloadModel.find(query);
    },

    deletehotelPayloadStatic: async (query) => {
        return await hotelPayloadModel.deleteOne(query);
    },

   
    updatehotelPayloadStatic: async (query, updateObj) => {
        return await hotelPayloadModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={hotelPayloadServices}