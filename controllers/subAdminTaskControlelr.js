const db = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const commonFunction = require("../utilities/commonFunctions");
const whatsappAPIUrl = require("../utilities/whatsApi");
const approvalStatus = require("../enums/approveStatus");
const adminModel=require("../model/user.model")
//***********************************SERVICES********************************************** */
const {subAdminTaskServices}=require("../services/subAdminTaskServices");
const {createSubAdminTask,findSubAdminTask,findSubAdminTaskData,deleteSubAdminTask,subAdminTaskList,updateSubAdminTask,countTotalSubAdminTask}=subAdminTaskServices;
// const { userServices } = require("../services/userServices");
// const {createUser,findUser,getUser,findUserData,updateUser} = userServices;

exports.createTask=async(req,res,next)=>{
    try {
        const {authType,task,adminId}=req.body;
        console.log("req.body===========",req.body);
        const isAdmin=await adminModel.findOne({_id:adminId});
        if(!isAdmin){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.ADMIN_NOT_FOUND});
        }
        const object={
            authType:authType,
            task:task
        }
        console.log("object=============",object);
        const result=await createSubAdminTask(object);
        console.log("result=============",result);
        if(result){
            return res.status(statusCode.OK).send({
                status: statusCode.OK,
                message: responseMessage.TASK_CREATED,
                result: result,
              });
        }
    } catch (error) {
        console.error("error while create task",error);
        return next(error)
    }
}