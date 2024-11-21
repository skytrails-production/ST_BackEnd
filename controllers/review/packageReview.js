const status = require("../../enums/status");
const schemas = require("../../utilities/schema.utilities");
const commentStatus = require("../../enums/commentStatus");
const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const { internationl } = require("../../model/international.model");
const commonFunctions = require("../../utilities/commonFunctions");

//************************************SERVICES**********************************************************/

const {packageReviewsServices}=require('../../services/reviews/packageReviewServices')
const {createpackageReviews,findpackageReviews,findpackageReviewsData,deletepackageReviewsStatic,updatepackageReviewsStatic}=packageReviewsServices;


//*****************************************APIS implementation*****************************/

exports.createPackageReview = async (req, res, next) => {
    try {
        const {name,title,description,section,starRating,travelDate,packageId,packageType,isPositive}=req.body;
        const isPackageExist=await internationl.findOne({_id:packageId});
        
        if(!isPackageExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.PACKAGE_NOT_EXIST,
              });
        }
        if(req.files.length>0){
            req.body.gallery=[]
            for(let i=0;i<req.files.length;i++){
                
                req.body.gallery.push(await commonFunctions.getImageUrlAWSByFolderSingle(req?.files?.[i],"packageReview"));
            }
        }
        let result=await createpackageReviews(req.body);
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.CREATED_SUCCESS,
            result:result,
            data:isPackageExist
          });

    } catch (error) {
        return next(error);
    }
}
exports.getPackageReview=async(req,res,next)=>{
    try {
        const data=await findpackageReviewsData({});
        if(!data){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result:data
          });
    } catch (error) {
        return next(error)
    }
}
// exports.editPackageReview=async(req,res,next)=>{
//     try {
//         const {}=req.body;

//     } catch (error) {
//         return next(error);
//     }
// }