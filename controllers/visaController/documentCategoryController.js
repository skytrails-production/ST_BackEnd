const statusCode = require('../../utilities/responceCode');
const responseMessage = require('../../utilities/responses');
const status = require("../../enums/status");
const issuedType = require('../../enums/issuedType');



//********************************************SERVICES*******************************************/
const { userServices } = require("../../services/userServices");
const {createUser,findUser,getUser,findUserData,updateUser,paginateUserSearch,countTotalUser,} = userServices;
const {docCategoryServices}=require("../../services/visaAppServices/documentCategoryServices");
const {createDocCategory,findDocCategoryData,deleteDocCategory,docCategoryList,updateDocCategory,countTotalDocCategory,getDocCategory}=docCategoryServices;
const {docTypeServices}=require("../../services/visaAppServices/documentTypeServices");
const {createdocType,findDocTypeData,deleteDocType,docTypeList,updateDocType,countTotalDocType,getDocType,}=docTypeServices;

//************************************API'S Implementation***************************************************/
exports.createDocumentCategory=async(req,res,next)=>{
    try {
        const {categoryName,description,documentTypes,docType,}=req.body;
        const isCategoryExist=await findDocCategoryData({categoryName:categoryName});
         console.log("isCategoryExist=========",isCategoryExist)
        if(isCategoryExist && isCategoryExist.documentTypesId && isCategoryExist.documentTypesId.documentName === documentTypes){
            const update=await updateDocCategory({_id:isCategoryExist._id},req.body);
            return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.UPDATE_SUCCESS,result: update,});
        }else{
          const isDocType=await findDocTypeData({documentName:documentTypes});
        if(!isDocType){
            return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DOCUMENTTYPE_NOT_EXIST,});
        
        }
        req.body.documentTypesId=isDocType._id;
        req.body.documentName=isDocType.documentName;
        const result=await createDocCategory(req.body);
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.CREATED_SUCCESS,result: result,});
  
        }
        
    } catch (error) {
        console.log("error while create Document Category",error);
        return next(error)
    }
}

exports.getDocumnetCategory=async(req,res,next)=>{
    try {
        const result=await docCategoryList({});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
   
    } catch (error) {
        console.log("error while trying to get doc category.");
        return next(error)
    }
}

exports.getDocumnetCategoryById=async(req,res,next)=>{
    try {
        const {docId}=req.query;
        const result=await findDocCategoryData({_id:docId});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
    } catch (error) {
        console.log("error while get data",error);
        return next(error)
    }
}