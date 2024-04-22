const userPackageBooking = require('../../model/btocModel/userPackageBooking');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const mongoose=require('mongoose');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userPackageBookingServices = {
    createPackageBookNow: async (insertObj) => {
        return await userPackageBooking.create(insertObj);
    },

    findPackageBookNow: async (query) => {
        return await userPackageBooking.findOne(query)
    },

    findPackageBookNowPopulate: async (query) => {
        return await userPackageBooking.findOne(query).populate('packageId').exec();
    },
    getUserPackageBookNow: async (query) => {
        return await userPackageBooking.find(query)
    },

    deletePackageBookNow: async (query) => {
        return await userPackageBooking.deleteOne(query);
    },
    updatePackageBookNow: async (query, updateObj) => {
        return await userPackageBooking.findOneAndUpdate(query, updateObj, { new: true });
    },

    getPackageBookNowEnquiry:async(body)=>{
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
            populate: { path: 'packageId', model: 'internationls',select: 'country destination pakage_title pakage_amount' } 
        };
        const data = await userPackageBooking.paginate(query, options);
        return data;
    },
    countTotalPackageBookNow: async (body) => {
        return await userPackageBooking.countDocuments(body)
    }
 
    
}

module.exports = { userPackageBookingServices }