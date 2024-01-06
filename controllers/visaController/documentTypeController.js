const statusCode = require('../../utilities/responceCode');
const responseMessage = require('../../utilities/responses');
const status = require("../../enums/status");
const issuedType = require('../../enums/issuedType');

//********************************************SERVICES*******************************************/
const { userServices } = require("../../services/userServices");
const {createUser,findUser,getUser,findUserData,updateUser,paginateUserSearch,countTotalUser,} = userServices;
const {docTypeServices}=require("../../services/visaAppServices/documentTypeServices");
const {createdocType,findDocTypeData,deleteDocType,docTypeList,updateDocType,countTotalDocType,getDocType,}=docTypeServices;

//************************************API'S Implementation***************************************************/

exports.crerateDocType=async(req,res,next)=>{
    try {
        const {documentName,description}=req.body;
        const isAlreadyExist=await findDocTypeData({documentName:documentName});
        if(isAlreadyExist){
            const update=await updateDocType({_id:isAlreadyExist._id},req.body);
            return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.UPDATE_SUCCESS,result: update,});
        }
        const result=await createdocType(req.body);
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.CREATED_SUCCESS,result: result,});

    } catch (error) {
        console.log("error while creating documnetType",error);
        return next(error)
    }
}
exports.getDocType=async(req,res,next)=>{
    try {
        const result=await docTypeList({});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
    } catch (error) {
        console.log("error while get data",error);
        return next(error)
    }
}
exports.getDocTypeById=async(req,res,next)=>{
    try {
        const {docId}=req.query;
        const result=await docTypeList({_id:docId});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
    } catch (error) {
        console.log("error while get data",error);
        return next(error)
    }
}