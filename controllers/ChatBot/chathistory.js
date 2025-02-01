const { v4: uuidv4 } = require("uuid");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");

//  SERVICES
const {
  chatBotServices,
} = require("../../services/chatBotServices/chatBotServices");
const {
  createConversation,
  findConversation,
  deleteConversation,
  listConversations,
  updateConversation,
  countConversations,
  paginateConversations,
  markAsLead,
  updateLeadStatus,
  getLeads,
} = chatBotServices;
const {
  chatBotPromptServices,
} = require("../../services/chatBotServices/chatBotTrainingServices");
const {
  createPrompt,
  findPrompt,
  updatePromptById,
  deletePromptById,
  listPrompts,
  countPrompts,
  paginatePrompts,
  getPromptsByCategory,
  searchPrompts,
} = chatBotPromptServices;
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



exports.createChatHistory = async (req, res, next) => {
  try {
    const {
      userId,
      userName,
      userPhoneNumber,
      query,
      respoense,
      queryId,
      conversationId,
      messages,
    } = req.body;
    if(userId){
        const isUserExist = await findUser({
            userId: userId,
          });
          if(!isUserExist){
            return res.status(statusCode.OK).json({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.USERS_NOT_FOUND,
              });
          }
    }
    const isChatExist = await findConversation({
      userId: userId,
      queryId: queryId,
    });
    // const message=["sender","userQuery","botRespoense","timestamp"];
    if (isChatExist) {
      const createConv = await updateConversation(
        { userId: userId, queryId: queryId, conversationId: conversationId },
        { $push: { messages: messages } }
      );
      return res.status(statusCode.OK).json({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: createConv,
      });
    }

    const result = await createConversation(req.body);
    return res.status(statusCode.OK).json({
      statusCode: statusCode.created,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create history", error);
    return next(error);
  }
};


exports.getChatHistory=async(req,res,next)=>{
    try {
        const isUserExist=await findUser({_id:req.params.userID});
        if(!isUserExist){
            return res.status(statusCode.OK).json({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.USERS_NOT_FOUND,
              });
        }
        const chatList=await listConversations({userId:isUserExist._id});
        if(!chatList){
            return res.status(statusCode.OK).json({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.CHAT_NOT_FIND,
              });
        }
        return res.status(statusCode.OK).json({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.UPDATE_SUCCESS,
            result: chatList,
          });
    } catch (error) {
        console.log("Error while get chat history",error);
        
    }
}