const advertisementModel = require('../../model/btocModel/busAdvertisemnetModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const busadvertisementServices={
    createbusadvertisement: async (insertObj) => {
        return await advertisementModel.create(insertObj);
    },

    findbusadvertisementData: async (query) => {
        return await advertisementModel.findOne(query)
    },

    deletebusadvertisement: async (query) => {
        return await advertisementModel.deleteOne(query);
    },

    advertisementbusList: async (query) => {
        return await advertisementModel.find(query)
    },
    updatebusadvertisement: async (query, updateObj) => {
        return await advertisementModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countbusTotaladvertisement: async (body) => {
        return await advertisementModel.countDocuments(body)
    },
    getbusAdvertisment:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await advertisementModel.paginate(query, options);
    }
}
module.exports ={busadvertisementServices}