const status = require("../../enums/status");
const schemas = require("../../utilities/schema.utilities");
const commonFuction = require("../../utilities/commonFunctions");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const base64 = require("nodejs-base64");
const storyStatus=require ('../../enums/storyStatus')
//************************************SERVICES**********************************************************/
//testing
const { forumQueServices } = require("../../services/forumQueServices");
const {
  createforumQue,
  findforumQue,
  forumQueDataList,
  findforumQueData,
  deleteforumQue,
  updateforumQue,
  forumQueListLookUp,
  forumQueListLookUp1,
  getTopSTories,
  forumQueListLookUpOfUser,
} = forumQueServices;
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
} = userServices;
const { forumQueAnsCommServices } = require("../../services/forumQueAnsComm");
const {
  createforumQueAnsComm,
  findforumQueAnsComm,
  findforumQueAnsCommData,
  updateforumQueAnsComm,
  deleteforumQueAnsComm,
  forumListLookUp,
} = forumQueAnsCommServices;
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const { bookmarkServices } = require("../../services/bookmarkServices");
const {
  createbookmark,
  findbookmark,
  deletebookmark,
  bookmarkList,
  updatebookmark,
  bookmarkListPaginate,
} = bookmarkServices;

const { PostlikesServices } = require("../../services/likesForumServices");
const {
  createPostlikes,
  findPostlikes,
  findPostlikesData,
  deletePostlikes,
  updatePostlikes,
} = PostlikesServices;


const {
  referralAmountServices,
} = require("../../services/referralAmountServices");
const { date } = require("joi");
const {
  createReferralAmount,
  findReferralAmount,
  deleteReferralAmount,
  referralAmountList,
  updateReferralAmount,
  referralAmountListPaginate,
} = referralAmountServices;

//****************************************************API's****************************************** */
exports.createPost = async (req, res, next) => {
  try {
    const { content,location } = req.body;
    const isUser = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUser) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (req.file) {
      const secureurl = await commonFuction.getImageUrlAWS(req.file);
      req.body.image = secureurl;
    }
    const obj = {
      userId: isUser._id,
      content: content,
      location:location,
      image: req.body.image,
    };
    const result = await createforumQue(obj);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.POST_CREATED,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const result = {}; // Declare as an object
    const { search, page, limit, questionId, userId } = req.query;
    const post = await forumQueListLookUp1({});
    if (post) {
      result.post = post;
    } else {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    const unanswered = await forumQueListLookUp(req.query);
    if (unanswered) {
      result.unanswered = unanswered;
    } else {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    if (result.unanswered) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
    } else {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { content,location } = req.body;
    const isUser = await findUser({ _id: req.userId });
    if (!isUser) {
      return sendActionFailedResponse(res, {}, "User not found");
    }
    const result = await updateforumQue(
      { userID: isUser._id },
      { content: content,location:location }
    );
    return actionCompleteResponse(res, result, "Post edited successfully.");
  } catch (error) {
    // sendActionFailedResponse(res,{},error.message);
    return next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const isUser = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUser) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isPostExist=await findforumQue({_id:req.body.postId,status:status.ACTIVE});
    if(!isPostExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.POST_NOT_FOUND,
      });
    }
    const result = await updateforumQue(
      {_id:isPostExist._id,userID: isUser._id },
      { status: status.DELETE }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.POST_DELETED,
    });
  } catch (error) {
    // sendActionFailedResponse(res,{},error.message);
    return next(error);
  }
};

exports.getPostOfUser = async (req, res, next) => {
  try {
    const { search, page, limit, questionId, userId } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
      otpVerified: true,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    // req.query.userId = isUserExist._id;
    const result = await forumQueDataList({userId:isUserExist._id,status:[storyStatus.ACTIVE,storyStatus.PENDING]});
    // const likeLength=await findPostlikes({postId:result})

    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
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
//add question in bookmark
exports.addBookmark = async (req, res, next) => {
  try {
    const { questionId, userId } = req.body;
    const isUser = await findUser({ _id: userId });
    if (!isUser) {
      return sendActionFailedResponse(res, {}, "User not found");
    }
    const isQuestionExist = await findforumQue({ _id: questionId });
    if (!isQuestionExist) {
      return sendActionFailedResponse(res, {}, "Post not found");
    }
    const isAlreadyBookmarked = await findbookmark({
      userId: userId,
      status: status.ACTIVE,
    });
    if (!isAlreadyBookmarked) {
      const obj = {
        questionId: questionId,
        userId: userId,
      };
      const result = await createbookmark(obj);
      return actionCompleteResponse(
        res,
        result,
        "Post added in your bookmark successfully."
      );
    }
    if (isAlreadyBookmarked.questionId.includes(questionId)) {
      const updateResult = await updatebookmark(
        { userId: isUser._id, status: status.ACTIVE },
        { $pull: { questionId: questionId } }
      );
      return actionCompleteResponse(
        res,
        updateResult,
        "You have removed  post from your bookmark"
      );
    } else {
      const updateResult = await updatebookmark(
        { userId: isUser._id, status: status.ACTIVE },
        { $push: { questionId: questionId } }
      );
      return actionCompleteResponse(
        res,
        updateResult,
        "You have liked the comment"
      );
    }
  } catch (error) {
    return next(error);
  }
};
//get top rated stories**************************************************
exports.getTopStories = async (req, res, next) => {
  try {
    const { search, page, limit, questionId, } = req.query;
    const result = await getTopSTories(req.query);
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
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
//get post by ID*********************************************************************
exports.getPostByID = async (req, res, next) => {
  try {
    const postId = req.query.postId;
    const result = await findforumQue({ _id: postId, status: { $in: [storyStatus.ACTIVE, storyStatus.PENDING] } });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
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

exports.getComments = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const getComments = await findforumQueAnsComm({
      questionId: questionId,
      status: status.ACTIVE,
    });
    if (!getComments) {
      return res.status(statusCode.badRequest).send({
        statusCode: statusCode.badRequest,
        message: responseMessage.BAD_REQUEST,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: getComments,
    });
  } catch (error) {
    return next(error);
  }
};

//like posy which user give on post*********************************************

exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const isUser = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUser) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }

    for (const post of postId) {
      const isPostExist = await findforumQue({
        _id: post,
        status: status.ACTIVE,
      });
      if (!isPostExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
      }

      const isAlreadyLiked = await findPostlikes({
        postId: isPostExist._id,
      });

      if (!isAlreadyLiked) {
        const newLike = {
          postId: post,
          likes: [isUser._id],
          status: "ACTIVE",
        };
        const savedLike = await createPostlikes(newLike);
        await updateforumQue(
          { _id: isPostExist._id },
          { $inc: { likesCount: 1 }, $push: { likes: isUser._id } }
        );
      } else {
        if (isAlreadyLiked.likes.includes(isUser._id)) {
          if (isPostExist.likesCount > 0) {
            const updateResult = await updatePostlikes(
              { postId: isPostExist._id, status: status.ACTIVE },
              { $pull: { likes: isUser._id } }
            );
            await updateforumQue(
              { _id: isPostExist._id },
              {
                $inc: { likesCount: -1 },
                $pull: { likes: isUser._id },
              }
            );
          }
        } else {
          const updateResult = await updatePostlikes(
            { postId: isPostExist._id, status: status.ACTIVE },
            { $push: { likes: isUser._id } }
          );
          await updateforumQue(
            { _id: isPostExist._id },
            { $inc: { likesCount: 1 }, $push: { likes: isUser._id } }
          );
        }
      }
    }

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.POST_LIKED,
    });
  } catch (error) {
    return next(error);
  }
};


//get top trending stories**************************************************
exports.getTrendingStories = async (req, res, next) => {
  try {
    
    const { search, page, limit, questionId, userId } = req.query;
    const result = await getTopSTories(req.query);
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
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


exports.postLike=async(req,res,next)=>{
  try {
    const { postId } = req.body;
    let liked;
    const isUser = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUser) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    for (const post of postId) {
      const isPostExist = await findforumQue({
        _id: post,
        status: status.ACTIVE,
      });
      if (!isPostExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.POST_NOT_FOUND,
        });
      }
      const isAlreadyLiked = await findforumQue({
        _id: isPostExist._id, likes: { $in: isUser._id }
      });
      if(isAlreadyLiked||isAlreadyLiked!=null){
          return res.status(statusCode.OK).send({
            statusCode: statusCode.badRequest,
            message: responseMessage.ALREADY_LIKE,
          });
      }  
      liked= await updateforumQue(
        { _id: isPostExist._id },
        { $inc: { likesCount: 1 }, $push: { likes: isUser._id } }
      );
      const checkReward = await findReferralAmount({});
      const walletObj={
        amount:checkReward.likeCoins,
        details:"You've earned a Coin🪙 for liking a post!📸",
        transactionType:'credit',
        createdAt: date.now
      }
      const updated=await updateUser(
        { _id: isPostExist.userId },
        {
          $inc: { balance: checkReward.likeCoins},
          $push:{walletHistory:walletObj}
        }
      );

      // await updateUser({_id:isUser._id},{ $inc: { likesCount: 1 }, $push: { likes: isUser._id }})
      
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.POST_LIKED,
      result:liked
    });
  } catch (error) {
    return next(error);
  }
};

