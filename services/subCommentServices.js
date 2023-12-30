const status = require("../enums/status");
const subCommentModel=require("../model/forum/subComment")


const subCommentServices={
    createsubComment: async (insertObj) => {
        return await subCommentModel.create(insertObj);
    },

    findsubComment: async (query) => {
        return await subCommentModel.findOne(query).select('-status -createdAt -updatedAt');
    },

    findsubCommentData: async (query) => {
        return await subCommentModel.find(query).select('-status -createdAt -updatedAt');
    },

    deletesubComment: async (query) => {
        return await subCommentModel.deleteOne(query).select('-status -createdAt -updatedAt');
    },

   
    updatesubComment: async (query, updateObj) => {
        return await subCommentModel.findOneAndUpdate(query, updateObj, { new: true }).select('-status -createdAt -updatedAt');
    },
}

module.exports={subCommentServices}