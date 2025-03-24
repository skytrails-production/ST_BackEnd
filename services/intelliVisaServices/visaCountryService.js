const countryListModel = require('../../model/intelliVisa/countryList');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const visaCountryServices={
    createCountryList: async (insertObj) => {
        return await countryListModel.create(insertObj);
    },

    findCountry: async (query) => {
        return await countryListModel.findOne(query) ;
    },

    deleteCountryList: async (query) => {
        return await countryListModel.deleteOne(query);
    },

    countryList: async (query) => {
        return await countryListModel.find(query)
    },
    updatecountryList: async (query, updateObj) => {
        return await countryListModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalcountryList: async (body) => {
        return await countryListModel.countDocuments(body)
    }    
}
module.exports ={visaCountryServices}