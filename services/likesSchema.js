const status = require("../enums/status");
const likesModel=require("../model/forum/likes")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//


const likesServices={
    createlikes: async (insertObj) => {
        return await likesModel.create(insertObj);
    },

    findlikes: async (query) => {
        return await likesModel.findOne(query).select('-status -createdAt -updatedAt');
    },

    findlikesData: async (query) => {
        return await likesModel.find(query).select('-status -createdAt -updatedAt');
    },

    deletelikes: async (query) => {
        return await likesModel.deleteOne(query).select('-status -createdAt -updatedAt');
    },

   
    updatelikes: async (query, updateObj) => {
        return await likesModel.findOneAndUpdate(query, updateObj, { new: true }).select('-status -createdAt -updatedAt');
    },
}

module.exports={likesServices}