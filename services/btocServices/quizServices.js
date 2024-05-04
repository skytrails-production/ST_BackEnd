const status = require("../../enums/status");
const quizModel=require("../../model/btocModel/quizModel")
const quizResponsemodel=require("../../model/btocModel/quizResponseModel")

const quizServices={
    createQuizContent: async (insertObj) => {
        return await quizModel.create(insertObj);
    },

    findQuizContent: async (query) => {
        return await quizModel.findOne(query);
    },

    findQuizData: async (query) => {
        return await quizModel.find(query);
    },

    deleteQuiz: async (query) => {
        return await quizModel.deleteOne(query);
    },

   
    updateQuiz: async (query, updateObj) => {
        return await quizModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    createQuizResponseContent: async (insertObj) => {
        return await quizResponsemodel.create(insertObj);
    },

    findQuizResponseContent: async (query) => {
        return await quizResponsemodel.findOne(query);
    },
    findQuizResponseContentPop: async (query) => {
        return await quizResponsemodel.findOne(query).populate('user');
    },
    findQuizResponseData: async (query) => {
        return await quizResponsemodel.find(query).populate('user');
    },

    deleteQuizResponse: async (query) => {
        return await quizResponsemodel.deleteOne(query);
    },

   
    updateQuizResponse: async (query, updateObj) => {
        return await quizResponsemodel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={quizServices}