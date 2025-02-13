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
  blogList,
  deleteBlog,
  updateBlog,
  countTotalBlog,
  aggPagGetBlogList,
  paginateBlogSearch
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
    if (req.files) {
        for(const img of req.files){
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
      const { toDate, fromDate, page, limit, search}=req.query;
      const result=await paginateBlogSearch(req.query);

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
       return next(error);
    }
};
exports.getBlogById=async(req,res,next)=>{
    try {
        const {blogId}=req.query;
        const allResult={};
        const result=await findBlog({_id:blogId});
        if(!result){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              }); 
        }
        const updateViews=await updateBlog({ _id: result._id }, { $inc: { views: 1 } });
        allResult.searchedBlog=updateViews;
        allResult.trendingBlog=await blogList({status:status.ACTIVE});
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.BLOG_GET_SUCCESSFULLY,
            result: allResult,
          });
    } catch (error) {
       return next(error);
    }
};
exports.deleteBlog=async(req,res,next)=>{
  try {
    const {blogId}=req.body;
    const isBlogExits=await findBlog({_id:blogId});
    if(!isBlogExits){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BLOG_NOT_FOUND,
      }); 
    }
    const deleteddata=await deleteBlog({_id:isBlogExits._id});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result:deleteddata
    }); 
  } catch (error) {
    return next(error);
  }
}
exports.hideBlog=async(req,res,next)=>{
  try {
    const {blogId,}=req.body;
    const isBlogExits=await findBlog({_id:blogId,status:status.ACTIVE});
    if(!isBlogExits){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BLOG_NOT_FOUND,
      }); 
    }
    const update=await updateBlog({_id:isBlogExits._id},{status:status.DELETE});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result:update
    }); 
  } catch (error) {
    return next(error);
  }
}
exports.updateBlog=async(req,res,next)=>{
  try {
    const {blogId,title,content,location}=req.body;
    const isBlogExits=await findBlog({_id:blogId,status:status.ACTIVE});
    if(!isBlogExits){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BLOG_NOT_FOUND,
      }); 
    }
    const update=await updateBlog({_id:isBlogExits._id},req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result:update
    });
  } catch (error) {
    return next(error);
  }
}
exports.getBlogListAdmin=async(req,res,next)=>{
  try {
    const result=await findBlogData();

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
     return next(error);
  }
};
exports.activeStatus=async(req,res,next)=>{
  try {
    const {blogId,status}=req.body;
    const isBlogExits=await findBlog({_id:blogId});
    if(!isBlogExits){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BLOG_NOT_FOUND,
      }); 
    }
    const update=await updateBlog({_id:isBlogExits._id},{status:status});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result:update
    });
  } catch (error) {
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
       return next(error);
    }
}
exports.getBlogByTitle=async(req,res,next)=>{
  try {
    const {blogTitle}=req.query;
    const allResult={};
    const result=await findBlog({title:blogTitle});
    if(!result){
        return res.status(statusCode.OK).send({
            statusCode: statusCode.NotFound,
            responseMessage: responseMessage.DATA_NOT_FOUND,
          }); 
    }
    const updateViews=await updateBlog({ _id: result._id }, { $inc: { views: 1 } });
    allResult.searchedBlog=updateViews;
    allResult.trendingBlog=await blogList({status:status.ACTIVE});
    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.BLOG_GET_SUCCESSFULLY,
        result: allResult,
      });
} catch (error) {
   return next(error);
}
}
exports.editImage=async(req,res,next)=>{
  try {
    const {blogId}=req.body;
    const isBlogExits=await findBlog({_id:blogId,status:status.ACTIVE});
    if(!isBlogExits){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BLOG_NOT_FOUND,
      }); 
    }
    if (req.file) {
          const secureurl = await commonFuction.getImageUrlAWS(req.file);
          req.body.img=secureurl;
      }
      const result = await updateBlog({ _id: blogId },  { media: req.body.img } );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: result,
      });
  } catch (error) {
    return next(error);
  }
}
