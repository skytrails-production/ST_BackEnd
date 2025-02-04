const statusCode = require('../../utilities/responceCode');
const responseMessage = require('../../utilities/responses');
const status = require("../../enums/status");
const issuedType = require('../../enums/issuedType');

//********************************************SERVICES*******************************************/
const { userServices } = require("../../services/userServices");
const {createUser,findUser,getUser,findUserData,updateUser,paginateUserSearch,countTotalUser,} = userServices;
const {visaCategoryServices}=require("../../services/visaAppServices/visaCategoryServices");
const {createVisaCategory,findVisaCategoryData,deleteVisaCategory,visaCategoryList,updateVisaCategory,countTotalVisaCategory,getVisaCategory}=visaCategoryServices;

//********************************************SERVICES*******************************************/

exports.createVisaCategory=async(req,res,next)=>{
    try {
        const {visaType,categoryName,description,}=req.body
        const isAlreadyExist=await findVisaCategoryData({visaType:visaType,categoryName:categoryName});
        if(isAlreadyExist){
            const update=await updateVisaCategory({_id:isAlreadyExist._id},req.body);
            return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.UPDATE_SUCCESS,result: update,});
        }
        const result=await createVisaCategory(req.body);
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.CREATED_SUCCESS,result: result,});

    } catch (error) {
        return next(error)
    }
}

exports.getVisaCategory=async(req,res,next)=>{
    try {
        const result=await visaCategoryList({});
        if(!result){
            return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
   
    } catch (error) {
        return next(error)
    }
}

exports.getVisaCategoryById=async(req,res,next)=>{
    try {
        const {visaCategoryId}=req.query
        const result=await visaCategoryList({_id:visaCategoryId});
        if(!result){
            return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
   
    } catch (error) {
        return next(error)
    }
}