const status = require("../../enums/status");
const schemas = require("../../utilities/schema.utilities");
const commonFuction = require("../../utilities/commonFunctions");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const base64 = require("nodejs-base64");
//************************************SERVICES**********************************************************/
//testing
const { forumQueServices } = require("../../services/forumQueServices");
const {
  createforumQue,
  findforumQue,
  findforumQueData,
  deleteforumQue,
  updateforumQue,
  forumQueListLookUp,
  forumQueListLookUp1,
  getTopSTories,
  forumQueListLookUpOfUser
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

exports.createPost = async (req, res, next) => {
  try {
    console.log("req.files",req.file)
    const { content } = req.body;
    const isUser = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUser) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.USERS_NOT_FOUND,
        });
    }
    if (req.file) {
      const secureurl = await commonFuction.getImageUrl(req.file);
      req.file = secureurl;
    }
    const obj = {
      userId: isUser._id,
      content: content,
      image: req.file,
    };
    const result = await createforumQue(obj);
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.POST_CREATED,
        result: result,
      });
  } catch (error) {
    console.log("error========>>>>>>", error);
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
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
    console.log("lenghth", post.length);
    const unanswered = await forumQueListLookUp(req.query);
    if (unanswered) {
      result.unanswered = unanswered;
    } else {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
    if (result.unanswered) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          result: result,
        });
    } else {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
  } catch (error) {
    console.log("error========>>>>>>", error);
    return next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const isUser = await findUser({ _id: req.userId });
    if (!isUser) {
      return sendActionFailedResponse(res, {}, "User not found");
    }
    const result = await updateforumQue(
      { userID: isUser._id },
      { content: content }
    );
    return actionCompleteResponse(res, result, "Post edited successfully.");
  } catch (error) {
    console.log("error========>>>>>>", error);
    // sendActionFailedResponse(res,{},error.message);
    return next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const isUser = await findUser({ _id: req.userId });
    if (!isUser) {
      return sendActionFailedResponse(res, {}, "User not found");
    }
    const result = await updateforumQue(
      { userID: isUser._id },
      { status: status.DELETE }
    );
    return actionCompleteResponse(res, result, "Post deleted successfully.");
  } catch (error) {
    console.log("error========>>>>>>", error);
    // sendActionFailedResponse(res,{},error.message);
    return next(error);
  }
};

exports.getPostOfUser = async (req, res, next) => {
  try {
    const { search, page, limit, questionId, userId } = req.query;
    const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE,otpVerified:true });
        console.log("isAgentExists", isUserExist);
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
         req.query.userId=isUserExist._id;
        const result=await forumQueListLookUp1(req.query)
        if(!result){
          return res
          .status(statusCode.NotFound)
          .send({
            statusCode: statusCode.NotFound,
            message: responseMessage.DATA_NOT_FOUND,
          });
        }
        return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          result: result,
        });
    // const unanswered = await forumQueListLookUp(req.query);
    // const answered = await forumListLookUp(req.query);
    // const result = {
    //   unanswered,
    //   answered,
    // };
    // if (!unanswered) {
    //   return actionCompleteResponse(res, result, "All posts successfully.");
    // } else if (!answered) {
    //   return sendActionFailedResponse(res, [], "No posts found.");
    // }
  } catch (error) {
    console.log("error========>>>>>>", error);
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
    console.log("error========>>>>>>", error);
    return next(error);
  }
};

//get top rated stories**************************************************
exports.getTopStories = async (req, res, next) => {
  try {
    const { search, page, limit, questionId, userId } = req.query;
    const result = await getTopSTories(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    console.log("error========", error);
    return next(error);
  }
};

//get post by ID*********************************************************************
exports.getPostByID = async (req, res, next) => {
  try {
    const postId = req.query.postId;
    const result = await findforumQue({ _id: postId, status: status.ACTIVE });
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    console.log("Error to get data from server", error);
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
      return res
        .status(statusCode.badRequest)
        .send({
          statusCode: statusCode.badRequest,
          message: responseMessage.BAD_REQUEST,
        });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: getComments,
      });
  } catch (error) {
    console.log("get comments ============", error);
    return next(error);
  }
};
