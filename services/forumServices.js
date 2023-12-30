const status = require("../enums/status");
const forumModel=require("../model/forum")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const forumServices={
    createforum: async (insertObj) => {
        return await forumModel.create(insertObj);
    },

    findforum: async (query) => {
        return await forumModel.findOne(query);
    },

    findforumData: async (query) => {
        return await forumModel.find(query);
    },

    deleteforumStatic: async (query) => {
        return await forumModel.deleteOne(query);
    },

   
    updateforumStatic: async (query, updateObj) => {
        return await forumModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={forumServices}