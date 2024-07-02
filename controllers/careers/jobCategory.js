const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const categorySchema= require("../../model/carrersModel/jobMainCategoryModel")
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");

//*****************************************SERVICES************************************************/
const {
  jobSectionServices,
} = require("../../services/careerServices/jobSectionServices");
const {
  createjobSection,
  findjobSectionData,
  deletejobSection,
  jobSectionList,
  updatejobSection,
  countTotaljobSection,
  getjobSection,
} = jobSectionServices;
const {
  jobCategoryServices,
} = require("../../services/careerServices/jobCategoriesServices");
const { sendActionFailedResponse, actionCompleteResponse } = require("../../common/common");
const {
  createJobCategory,
  findjJobCategoryData,
  deleteJobCategory,
  jobCategoryList,
  updateJobCategory,
  countTotalJobCategory,
  getJobCategory,
} = jobCategoryServices;
//***************API'S************************************/
exports.createJobCategory = async (req, res, next) => {
  try {
    const {
        categoryName,description,status,parentCategory} = req.body;
        if(parentCategory){
          const findIsExist=await findjJobCategoryData({_id:parentCategory});
          if(!findIsExist){
            return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.JOB_CATEGORY_NOT_FOUND,
            }); 
          }
        }
    const result = await createJobCategory(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to create opening", error);
    return next(error);
  }
};
exports.getOpening = async (req, res, next) => {
  try {
    const {id}=req.query;
    const result = await findjJobCategoryData({_id:id});
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get all openings", error);
    return next(error);
  }
};

exports.getAllOpening = async (req, res, next) => {
  try {
    const result = await jobCategoryList({ status:status.ACTIVE});
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get all openings", error);
    return next(error);
  }
};

exports.deleteOpening=async(req,res,next)=>{
    try {
       const {id}=req.body;
       const isExist=await findjJobCategoryData({_id:id});
       if(!isExist){
        return res.status(statusCode.OK).send({
            statusCode: statusCode.NotFound,
            responseMessage: responseMessage.NOT_FOUND,
          });
       }
const deletedData=await deleteJobCategory({_id:id});
return res.status(statusCode.OK).send({
  statusCode: statusCode.OK,
  responseMessage: responseMessage.DELETE_SUCCESS,
  result: deletedData,
});
    } catch (error) {
        console.log("error while trying to delete openneing",error);
        return next(error);
    }
}



exports.createJobMainCategory = async (req, res) =>{

 try {
  const data=req.body;

  const response= await categorySchema.create(data);

  actionCompleteResponse(res, response, "success");
  
 } catch (error) {

  sendActionFailedResponse(res, {error}, error.message);
  
 }


  
}