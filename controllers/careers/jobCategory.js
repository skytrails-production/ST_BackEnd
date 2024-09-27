const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const categorySchema= require("../../model/carrersModel/jobMainCategoryModel");

const skyCategorySchema= require("../../model/carrersModel/jobCategoryModel");
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
       
        const isExisting=await findjJobCategoryData({categoryName});
        if(isExisting){
                return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: "Job category already Exist",
            }); 
        }else{
    const result = await createJobCategory(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  }
  } catch (error) {
    return next(error);
  }
};

exports.getJobCategory = async (req, res)=>{

  try {

    const limit=Number.parseInt(req.query.pagesize)||10;

    const page=Number.parseInt(req.query.page)||1;
    const sortBy=req.query.sort||'-createdAt';
    const skip=limit*(page-1);
    const count=await skyCategorySchema.countDocuments();
    if(count<1){
      actionCompleteResponse(res, {count}, "No data found");
    }else{    
    const result = await skyCategorySchema.find().sort(sortBy).skip(skip).limit(limit).select('-__v -createdAt -updatedAt').populate('parentCategory', '-__v -createdAt -updatedAt');
  
    actionCompleteResponse(res, {result,count}, "success");
    }
    
  } catch (error) {

    sendActionFailedResponse(res, {error}, error.message);    
  }

}


exports.deleteJobCategory = async (req , res) =>{

  try {
    const id=req.query.id;
    const result=await skyCategorySchema.findByIdAndDelete({_id:id});
    if(result===null){
      actionCompleteResponse(res, [],"fail");
    }else{

    actionCompleteResponse(res, result, "success");
  }
    
  } catch (error) {

    sendActionFailedResponse(res, {error}, error.message);    
  }

}

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
        return next(error);
    }
}



exports.createJobMainCategory = async (req, res) =>{

 try {
  const data=req.body;
  
  const existingCategory = await categorySchema.findOne({categoryName:data.categoryName});
  // return;
  if(existingCategory){
    actionCompleteResponse(res, existingCategory, "already existing category");
  }else{
  const response= await categorySchema.create(data);

  actionCompleteResponse(res, response, "success");
  }
  
 } catch (error) {

  sendActionFailedResponse(res, {error}, error.message);
  
 }


  
}


exports.getJobMainCategory = async (req, res ) =>{

  try {
    const limit=Number.parseInt(req.query.pagesize)||10;

    const page=Number.parseInt(req.query.page)||1;
    const sortBy=req.query.sort||'-createdAt';
    const skip=limit*(page-1);
    const count=await categorySchema.countDocuments();
    if(count<1){
      actionCompleteResponse(res, {count}, "No data found");
    }else{    
    const result = await categorySchema.find().sort(sortBy).skip(skip).limit(limit).select('-__v -createdAt -updatedAt');
  
    actionCompleteResponse(res, {result,count}, "success");
    }
    
   } catch (error) {
  
    sendActionFailedResponse(res, {error}, error.message);
    
   }

}


//delete JobMainCategory

exports.deleteJobMainCategory = async (req, res) =>{

  try {
    const id=req.query.id;
    const result=await categorySchema.findByIdAndDelete({_id:id});
    if(result===null){
      actionCompleteResponse(res, [],"fail");
    }else{

    actionCompleteResponse(res, result, "success");
  }
    
  } catch (error) {

    sendActionFailedResponse(res, {error}, error.message);    
  }

}

