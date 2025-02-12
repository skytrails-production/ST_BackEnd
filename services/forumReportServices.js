const status = require("../enums/status");
const forumReportModel=require("../model/forum/postReport")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const forumReportServices={
    createforumReport: async (insertObj) => {
        return await forumReportModel.create(insertObj);
    },

    findforumReport: async (query) => {
        return await forumReportModel.findOne(query);
    },

    findAllForumReports: async (query) => {
        return await forumReportModel.find(query);
    },

    deleteForumReport: async (query) => {
        return await forumReportModel.deleteOne(query);
    },

   
    updateForumReport: async (query, updateObj) => {
        return await forumReportModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    popolateForeignKeys:async(query)=>{
        return await forumReportModel.find(query)
        .populate("postId", "title content userId") 
        .populate("userId", "name email") 
        .sort({ createdAt: -1 })
        .lean();
}
}

module.exports={forumReportServices}