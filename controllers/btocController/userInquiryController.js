const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const resolveStatus=require("../../enums/errorType");
const whatsApi=require("../../utilities/whatsApi");
/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  deleteUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const {userInquiryServices}=require('../../services/btocServices/userQueryServices');
const {createUserInquiry,findUserInquiry,deleteUserInquiry,userInquiryList,userInquiryfind,updateUserInquiry,countTotalUserInquiry}=userInquiryServices;

exports.userInquiriesEntry=async(req,res,next)=>{
    try {
        const {name,email,phone,content}=req.body;
        const obj={
            name:name,
            email:email,
            contactNumber:phone,
            message:content
        }
        const result=await createUserInquiry(obj);
        const templates=[String(name)];
        const userContact='+91'+phone
         await whatsApi.sendWhtsAppOTPAISensy(userContact,templates,"userEnquiry");
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.SUCCESS,result:result});

    } catch (error) {
        console.log("error while trying to mentain entry==",error);
        return next(error);

    }
}

exports.getAllInquiriesList=async(req,res,next)=>{
    try {

        const result=await userInquiryList({});
        if(result.length===0||result===null){
            return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result:result});

    } catch (error) {
        console.log("error while trying to get inquiries",error);
        return next(error);
    }
}

exports.updateInquiryResolved=async(req,res,next)=>{
    try {
        const {queryId}=req.body;
        const result=await updateUserInquiry({_id:queryId},{resolveStatus:resolveStatus.RESOLVED});
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result:result});

    } catch (error) {
        console.log("error while trying to resolve inquiry",error);
    }
}