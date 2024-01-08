const webUserOfferModel = require('../../model/btocModel/webUserOfferModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const webAdvertisementServices={
    createWebadvertisement: async (insertObj) => {
        return await webUserOfferModel.create(insertObj);
    },

    findWebadvertisementData: async (query) => {
        return await webUserOfferModel.findOne(query)
    },

    deletWebeadvertisement: async (query) => {
        return await webUserOfferModel.deleteOne(query);
    },

    webAdvertisementList: async (query) => {
        return await webUserOfferModel.find(query)
    },
    updateWebadvertisement: async (query, updateObj) => {
        return await webUserOfferModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalWebadvertisement: async (body) => {
        return await webUserOfferModel.countDocuments(body)
    },
    getWebAdvertisment:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        return await webUserOfferModel.paginate(query, options);
    }
}
module.exports ={webAdvertisementServices}