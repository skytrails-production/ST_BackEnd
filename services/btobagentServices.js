const brbuserModel = require('../model/brbuser.model');
const userType = require("../enums/userType");
const approveStatus=require("../enums/approveStatus")
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const brbuserServices = {
    createbrbuser: async (insertObj) => {
        return await brbuserModel.create(insertObj);
    },

    findbrbuser: async (query) => {
        return await brbuserModel.findOne(query).select('-otp -isApproved -roles ');
    },

    getbrbuser: async (query) => {
        return await brbuserModel.findOne(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime');
    },

    findbrbuserData: async (query) => {
        return await brbuserModel.findOne(query).select('-createdAt -updatedAt -roles -password -isOnline -firstTime -isApproved');
    },

    deletebrbuser: async (query) => {
        return await brbuserModel.deleteOne(query);
    },

    brbuserList: async (query) => {
        return await brbuserModel.find(query).select('-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime -approveStatus -socialLinks -confirmPassword -password  -isApprove -createdAt -updatedAt');
    },
    updatebrbuser: async (query, updateObj) => {
        return await brbuserModel.findOneAndUpdate(query, updateObj, { new: true }).select('-otp');
    },

    paginatebrbuserSearch: async (body) => {
        // brbuserType: { $ne: [brbuserType.ADMIN,brbuserType.SUBADMIN] }
        let query = { approveStatus:approveStatus.PENDING }
        const { page, limit, search } = body;
        if (search) {
            query.$or = [
                { 'personal_details.first_name': { $regex: search, $options: 'i' } },
                { 'personal_details.last_name': { $regex: search, $options: 'i' } },
                { 'personal_details.email': { $regex: search, $options: 'i' } },
                { 'agency_details.agency_name': { $regex: search, $options: 'i' } },
                { 'agency_details.pan_number': { $regex: search, $options: 'i' } },
                { 'personal_details.city': { $regex: search, $options: 'i' } }
            ]
        }
       
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await brbuserModel.paginate(query, options);
    },
    countTotalbrbUser: async (body) => {
        return await brbuserModel.countDocuments(body)
    }
}

module.exports = { brbuserServices }