const partnerModel = require('../../model/inventory/hotelinventoryAuth');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const hotelinventoryAuthServices={
    
    createhotelinventoryAuth: async (insertObj) => {
        return await partnerModel.create(insertObj);
    },

    findhotelinventoryAuthData: async (query) => {
        return await partnerModel.findOne(query)
    },

    deletehotelinventoryAuth: async (query) => {
        return await partnerModel.deleteOne(query);
    },

    hotelinventoryAuthList: async (query) => {
        // .populate({path: 'documentTypesId'})
        return await partnerModel.find(query)
    },
    updatehotelinventoryAuth: async (query, updateObj) => {
        return await partnerModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalhotelinventoryAuth: async (body) => {
        return await partnerModel.countDocuments(body)
    },
    gethotelinventoryAuth:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await partnerModel.paginate(query, options);
    }
}
module.exports ={hotelinventoryAuthServices}