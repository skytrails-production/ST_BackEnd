const status = require("../../enums/status");
const quizModel=require("../../model/btocModel/quizModel")
const quizResponsemodel=require("../../model/btocModel/quizResponseModel")

const quizServices={
    createQuizContent: async (insertObj) => {
        return await quizModel.create(insertObj);
    },

    createQuizesContent:async(insertObj)=>{
        return await quizModel.insertMany(insertObj);
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
        return await quizResponsemodel.findOne(query).populate({
            path: 'user',
            select: 'username' // Specify the fields you want to show
          });
    },
    findQuizResponseData: async (query) => {
        return await quizResponsemodel.find(query).populate({
            path: 'user',
            select: 'username' // Specify the fields you want to show
          }).sort({createdAt:-1});
    },
     findWinnerlastday:async (query) => {
        return await quizResponsemodel.findOne(query)
          .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
          .populate({
            path: 'user',
            select: 'username' // Specify the fields you want to show
          })
      },
    deleteQuizResponse: async (query) => {
        return await quizResponsemodel.deleteOne(query);
    },

   
    updateQuizResponse: async (query, updateObj) => {
        return await quizResponsemodel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={quizServices}