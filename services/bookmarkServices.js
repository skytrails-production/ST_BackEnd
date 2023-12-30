const status = require("../enums/status");
const bookmarkModel=require("../model/forum/bookmark")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const bookmarkServices = {


    createbookmark: async (insertObj) => {
        return await bookmarkModel.create(insertObj);
    },

    findbookmark: async (query) => {
        return await bookmarkModel.findOne(query).select('-createdAt -updatedAt -status');
    },

    deletebookmark: async (query) => {
        return await bookmarkModel.deleteOne(query);
    },

    bookmarkList:async(query)=>{
        return await bookmarkModel.find(query).select('-createdAt -updatedAt -status');
    },
    updatebookmark: async (query, updateObj) => {
        return await bookmarkModel.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt -status');
    },
    bookmarkListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 ,},
        };
        return await bookmarkModel.paginate(query, options);
    },
}

module.exports = { bookmarkServices };