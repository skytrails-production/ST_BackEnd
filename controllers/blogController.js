const db = require("../model");
const b2bUser = db.userb2b;
const Joi = require("joi");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const responseMessage = require("../utilities/responses");
const statusCode = require("../utilities/responceCode");
const staticType = require("../enums/staticContentType");
const commonFuction=require("../utilities/commonFunctions");
const status=require("../enums/status")
//*****************************************SERVICES***************************************/
const { bloggingServices } = require("../services/bloggingServices");
const {
  createBlog,
  findBlog,
  findSingleBlog,
  findBlogData,
  deleteBlog,
  updateBlog,
  countTotalBlog,
} = bloggingServices;

//***************************************API's********************************************/

exports.createBlog = async (req, res, next) => {
  try {
    const {
      title,
      content,
      tags,
    //   media,
      trending,
      location,
    } = req.body;
    let media=[];
    console.log("req.files==============", req.files,req.files.length);
    if (req.files) {
        console.log("i============+++++++++++++++++++++++++==========");
        for(const img of req.files){
            console.log("i=================",img);
            const secureurl = await commonFuction.getImageUrlAWS(img);
            media.push(secureurl);
        }
    //   const secureurl = await commonFuction.getImageUrlAWS(req.file);
    //   req.body.media = secureurl;
    }
    const obj={
        title,
        content,
        tags,
        media,
        trending,
        location,
    }
    const result=await createBlog(obj);
    console.log("result==============",result);
    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.POST_CREATED,
        result: result,
      });
  } catch (error) {
    console.log("error while trying to create blog", error);
  }
};

exports.getBlogList=async(req,res,next)=>{
    try {
        const result=await findBlogData({status:status.ACTIVE});
        if(result.length<1){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.BLOG_GET_SUCCESSFULLY,
            result: result,
          });
    } catch (error) {
       console.log("Error while trying to get all blogs",error);
       return next(error);
    }
}
exports.getBlogById=async(req,res,next)=>{
    try {
        const {blogId}=req.query;
        const result=await findBlog({_id:blogId});
        if(!result){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              }); 
        }
        const updateViews=await updateBlog({ _id: result._id }, { $inc: { views: 1 } });
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.BLOG_GET_SUCCESSFULLY,
            result: updateViews,
          });
    } catch (error) {
       console.log("Error while trying to get blogs",error);
       return next(error);
    }
}

exports.likeBlog=async(req,res,next)=>{
    try {
        const {blogId}=req.query;
        
        const result=await findBlog({_id:blogId});
        if(!result){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              }); 
        }
        const updateBlog=await updateBlog({_id:result._id},{likesCount:{$inc:1},likes:{$push:userId}})
    } catch (error) {
        console.log("Error while trying to like  blogs",error);
       return next(error);
    }
}