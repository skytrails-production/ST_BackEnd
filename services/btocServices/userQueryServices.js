const queryModel=require('../../model/btocModel/queryModel');
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userInquiryServices = {
    createUserInquiry: async (insertObj) => {
        return await queryModel.create(insertObj);
    },

    findUserInquiry: async (query) => {
        return await queryModel.findOne(query)
    },
    deleteUserInquiry: async (query) => {
        return await queryModel.deleteOne(query);
    },
    userInquiryList: async (query) => {
        return await queryModel.find(query);
    },
    userInquiryfind: async (query) => {
        return await queryModel.find(query).sort({ createdAt: -1 });
    },    
    updateUserInquiry: async (query, updateObj) => {
        return await queryModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    countTotalUserInquiry: async (body) => {
        return await queryModel.countDocuments(body)
    }
}

module.exports = { userInquiryServices }