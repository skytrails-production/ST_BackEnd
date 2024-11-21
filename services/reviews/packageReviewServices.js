const status = require("../../enums/status");
const packageReviewsModel=require("../../model/userReview/packageReviews")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const packageReviewsServices={
    createpackageReviews: async (insertObj) => {
        return await packageReviewsModel.create(insertObj);
    },

    findpackageReviews: async (query) => {
        return await packageReviewsModel.findOne(query);
    },

    findpackageReviewsData: async (query) => {
        return await packageReviewsModel.find(query).sort({starRating:-1});
    },

    deletepackageReviewsStatic: async (query) => {
        return await packageReviewsModel.deleteOne(query);
    },

   
    updatepackageReviewsStatic: async (query, updateObj) => {
        return await packageReviewsModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={packageReviewsServices}