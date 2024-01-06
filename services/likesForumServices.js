const status = require("../enums/status");
const likesModel=require("../model/forum/forumQueLikes")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//


const PostlikesServices={
    createPostlikes: async (insertObj) => {
        return await likesModel.create(insertObj);
    },

    findPostlikes: async (query) => {
        return await likesModel.findOne(query).select('-status -createdAt -updatedAt');
    },

    findPostlikesData: async (query) => {
        return await likesModel.find(query).select('-status -createdAt -updatedAt');
    },

    deletePostlikes: async (query) => {
        return await likesModel.deleteOne(query).select('-status -createdAt -updatedAt');
    },

   
    updatePostlikes: async (query, updateObj) => {
        return await likesModel.findOneAndUpdate(query, updateObj, { new: true }).select('-status -createdAt -updatedAt');
    },
}

module.exports={PostlikesServices}