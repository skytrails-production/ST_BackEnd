const issuedType = require("../enums/issuedType");
const status = require("../enums/status");
const visaModel=require("../model/visaModel/visaModel");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//


const visaServices = {


    createWeeklyVisa: async (insertObj) => {
        return await visaModel.create(insertObj);
    },
    createMultipleVisa: async (insertObj) => {
        return await visaModel.insertMany(insertObj);
    },

    findWeeklyVisa: async (query) => {
        return await visaModel.findOne(query);
    },
    findWeeklyVisaPopulate: async (query) => {
        return await visaModel.findOne(query).populate({path:'visaCategoryId'});
    },
    deleteWeeklyVisa: async (query) => {
        return await visaModel.deleteOne(query);
    },

    weeklyVisaList:async(query)=>{
        return await visaModel.find(query);
    },

    populatedVisaList: async (query) => {
        return await visaModel.find(query)
            .populate('visaCategoryId') // Populating VisaCategory reference
            .populate('requireDocumentId'); // Populating RequiredDocument reference
    },
    updateWeeklyVisa: async (query, updateObj) => {
        return await visaModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    weeklyVisaListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE,issuedType:"WEEKLY VISA"};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 200,
            sort: { createdAt: -1 ,},
        };
        options.populate = [
            { path: 'visaCategoryId',},
            { path: 'requireDocumentId',select:'-createdAt -updatedAt -visaCountry -requiredDocumentCategories', populate: { path: 'visaCategory',select:'-description  -createdAt -updatedAt' }}
        ]; 
        const result= await visaModel.paginate(query, options);
        return result;
    },

    getNoVisaByPaginate:async(query)=>{
        let {page,limit}=query;
        let data={status:status.ACTIVE,issuedType:"NO VISA"};
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 200,
            sort: { createdAt: -1 ,},
        };
        return await visaModel.paginate(data, options);
    },
    montholyVisaListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE,issuedType:"MONTHLY VISA"};
        const { page, limit,search} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 200,
            sort: { createdAt: -1 },
        };
        options.populate = [
            { path: 'visaCategoryId',},
            { path: 'requireDocumentId',select:'-createdAt -updatedAt -visaCountry -requiredDocumentCategories', populate: { path: 'visaCategory',select:'-description  -createdAt -updatedAt' }}
        ]; 
        return await visaModel.paginate(query, options);
    },
    onarrivalVisaListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE,issuedType:"VISA ON ARRIVAL"};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 200,
            sort: { createdAt: -1 ,},
        };
        options.populate = [
            { path: 'visaCategoryId',},
            { path: 'requireDocumentId',select:'-createdAt -updatedAt -visaCountry -requiredDocumentCategories', populate: { path: 'visaCategory',select:'-description  -createdAt -updatedAt' }}
        ];     
        return await visaModel.paginate(query, options);
    },
    aiVisaCounPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE,aiListed:true};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 2000,
            sort: { createdAt: -1 ,},
        };
        // options.populate = [
        //     { path: 'visaCategoryId',},
        //     { path: 'requireDocumentId',select:'-createdAt -updatedAt -visaCountry -requiredDocumentCategories', populate: { path: 'visaCategory',select:'-description  -createdAt -updatedAt' }}
        // ];     
        return await visaModel.paginate(query, options);
    },
}

module.exports = { visaServices };