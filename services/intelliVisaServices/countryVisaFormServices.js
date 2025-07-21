const countryWiseFormModel = require('../../model/intelliVisa/countryWiseForm');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const countryWiseFormServices={
    createCountryFrom: async (insertObj) => {
        return await countryWiseFormModel.create(insertObj);
    },
    insertManyCountryFrom: async (insertObj) => {
        return await countryWiseFormModel.insertMany(insertObj);
    },
    findCountryFrom: async (query) => {
        return await countryWiseFormModel.findOne(query) ;
    },
    findCountryFromPop: async (query) => {
        return await countryWiseFormModel.findOne(query).populate('userId') ;
    },
    deleteCountryFrom: async (query) => {
        return await countryWiseFormModel.deleteOne(query);
    },

    countryWiseFormList: async (query) => {
        return await countryWiseFormModel.find(query);
    },
    updateCountryFrom: async (query, updateObj) => {
        return await countryWiseFormModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalCountryFrom: async (body) => {
        return await countryWiseFormModel.countDocuments(body);
    } 
}
module.exports ={countryWiseFormServices}