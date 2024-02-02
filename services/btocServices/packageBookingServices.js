const packageBookingModel = require('../../model/btocModel/packageBookingModel');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const mongoose=require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const packageBookingModelServices = {
    createPackage: async (insertObj) => {
        return await packageBookingModel.create(insertObj);
    },

    findPackage: async (query) => {
        return await packageBookingModel.findOne(query)
    },

    findPackagePopulate: async (query) => {
        return await packageBookingModel.findOne(query).populate('packageId').exec();
    },
    getUserPackage: async (query) => {
        return await packageBookingModel.find(query)
    },

    deletePackage: async (query) => {
        return await packageBookingModel.deleteOne(query);
    },
    updatePackage: async (query, updateObj) => {
        return await packageBookingModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    getPackageEnquiry:async(body)=>{
        let query = { status:status.ACTIVE }
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { _id: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } }
            ]
        }
       

        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await packageBookingModel.paginate(query, options);
    },
    countTotalPackage: async (body) => {
        return await packageBookingModel.countDocuments(body)
    }
 
    
}

module.exports = { packageBookingModelServices }