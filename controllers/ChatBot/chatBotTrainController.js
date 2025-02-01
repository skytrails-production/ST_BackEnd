const {
    getAiResponse,
    getAiResponseCustomPackage,
  } = require("./chatBotConfig");
  const responseMessage = require("../../utilities/responses");
  const statusCode = require("../../utilities/responceCode");
  const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");
  const packagePrompts=require("../../utilities/prompts");

  // services

const {chatBotPromptServices}=require("../../services/chatBotServices/chatBotTrainingServices");
const {createPrompt,insertManyPrompts,findPrompt,updatePromptById,deletePromptById,listPrompts,countPrompts,paginatePrompts,getPromptsByCategory,searchPrompts}=chatBotPromptServices;


exports.crateChatBotPrompt=async(req,res,next)=>{
    try {
        const {promptsArray}=req.body;  
        let createdPrompt
        if(promptsArray.length<2){
           createdPrompt = await createPrompt(promptsArray);
        }
       createdPrompt = await insertManyPrompts(promptsArray);
  
      // Sending success response
      return res.status(statusCode.OK).json({
        statusCode: statusCode.created,
        responseMessage: responseMessage.CREATED_SUCCESS,
        data: createdPrompt,
      });
    } catch (error) {
        console.log("error while trying to create prompt",error);
        return next(error);
        
    }
}

exports.listChatBotPrompt=async(req,res,next)=>{
  try {
    const packagePromptsList=await listPrompts({isActive:"true"});
    if(!packagePromptsList||packagePromptsList.length<1){
      return res.status(statusCode.OK).json({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      data: packagePromptsList,
    });
  } catch (error) {
    console.log("Error while trying to list Prompts",error);
    return next(error);
    
  }
}

exports.suggestPrompt = async (req, res, next) => {
  try {
    const { input } = req.body;
    const packagePrompts=await listPrompts({isActive:"true"});
    if (!input || typeof input !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid input. 'input' must be a non-empty string." });
    }
    const lowerCaseInput = input.toLowerCase();
    const inputWords = lowerCaseInput.split(" ");
    const prompts = packagePrompts.filter((prompt) =>
      inputWords.some((word) => prompt?.prompt.toLowerCase().includes(word))
    ).map((prompt) => prompt?.prompt);
    return res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      data: prompts,
    });
  } catch (error) {
    console.log("error ", error);
    return next(error);
  }
};

