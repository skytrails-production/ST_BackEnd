const {
  getAiResponse,
  getAiResponseCustomPackage,
} = require("./chatBotConfig");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");


//  SERVICES
const {chatBotServices}=require("../../services/chatBotServices/chatBotServices");
const {createConversation,findConversation,deleteConversation,listConversations,updateConversation,countConversations,paginateConversations,markAsLead,updateLeadStatus,getLeads}=chatBotServices;
const {chatBotPromptServices}=require("../../services/chatBotServices/chatBotTrainingServices");
const {createPrompt,findPrompt,updatePromptById,deletePromptById,listPrompts,countPrompts,paginatePrompts,getPromptsByCategory,searchPrompts}=chatBotPromptServices;
// exports.initialiseBot = async (req, res, next) => {
//   try {
//     const userPrompt = req.body.userPrompt.trim().toLowerCase();
//     if (!req.body || !req.body.userPrompt) {
//       return res
//         .status(400)
//         .json({ error: "Invalid request: 'userPrompt' is required." });
//     }
//     let response = [];
//     if (userPrompt.includes("package") || userPrompt.includes("price")) {
//         console.log("Response from DB:========");

//         // Find packages matching the user prompt
//         const packages = await SkyTrailsPackageModel.find({
//           text: { $regex: `\\b${userPrompt}\\b`, $options: "i" },
//           specialTag: {
//             $elemMatch: { [userPrompt]: true }
//           }
//         }).sort({ "packageAmount.0.amount": 1 }).select("_id title packageAmount"); // Sort by price in ascending order (lowest first)
//           // If matches are found, respond with the matched packages
//         //   response = "Here are the matching holiday packages:\n";
//         console.log("packages===",packages);

//           if (packages.length > 0) {
//           packages.forEach((pkg) => {
//             response.push({
//                 title: pkg.title,
//                 price: pkg.packageAmount[0].amount,
//                 details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
//               });
//             });
//         }else {
//             // If no matching packages found, call the AI for package-related information
//             response = await getAiResponse("Tell me about holiday packages or suggest some package details.");
//           }
//         // }
//      } else (userPrompt.includes("website")){
//         response = "https://theskytrails.com/";
//      }
//       response = await getAiResponse(req.body.userPrompt);

//     console.log("Response from OpenAI:", response);
//     res.status(200).json({ message: response });
//   } catch (error) {
//     console.error("Error in initialiseBot:", error);
//     next(new Error("Failed to process your request"));
//   }
// };

exports.initialiseBot = async (req, res, next) => {
  try {
    // Validate the user prompt
    if (!req.body || !req.body.userPrompt) {
      return res
        .status(400)
        .json({ error: "Invalid request: 'userPrompt' is required." });
    }
    const userPrompt = req.body.userPrompt.trim().toLowerCase();
    const includeWords = userPrompt.toLowerCase().split(/\s+/);
    let response;
    let botResponse;

    if (
      includeWords.includes("package") ||
      includeWords.includes("price") ||
      includeWords.includes("packages")
    ) {
      const allPackages = await SkyTrailsPackageModel.find({}).select(
        "_id title packageAmount specialTag"
      );
      const matchedPackages = allPackages.filter((pkg) =>
        includeWords.some(
          (word) =>
            new RegExp(`\\b${word}\\b`, "i").test(pkg.title) || // Match in title
            pkg.specialTag.some((tag) => tag[word] === true) // Match in specialTag
        )
      );
      console.log("matchedPackages==", matchedPackages);
      if (matchedPackages.length > 0) {
        // If matches found, format the response
        const inhouseResponse = matchedPackages.map((pkg) => ({
          title: pkg.title,
          price: pkg.packageAmount?.[0]?.amount || "N/A",
          details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
        }));
        response = await getAiResponseCustomPackage(
          userPrompt,
          inhouseResponse
        );
        botResponse = response.aiResp;
      } else {
        // If no matches, query OpenAI
        response = await getAiResponseCustomPackage(req.body.userPrompt, " ");
        botResponse = response;
      }
    } else if (userPrompt.includes("website")) {
      // Respond with the website URL for website-related queries
      botResponse = "https://theskytrails.com/";
      response = [botResponse];
    } else {
      // For other queries, call OpenAI
      console.log("Non-package query. Calling OpenAI...");
      response = await getAiResponse(req.body.userPrompt);
      botResponse = response;
    }
    res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error in initialiseBot:", error);
    next(new Error("Failed to process your request"));
  }
};

exports.initialiseBot2 = async (req, res, next) => {
  try {
    const userPrompt = req.body?.userPrompt?.trim();
    if (!userPrompt) {
         return res.status(statusCode.OK).send({
                statusCode: statusCode.badRequest, 
                responseMessage: responseMessage.USER_PROMPT_REQ,
              });
    }
    // Keywords for package-related queries
    const keywords = [
      "package",
      "packages",
      "price",
      "amount",
      "cost",
      "rates",
    ];
    const includeWords = userPrompt.toLowerCase().split(/\s+/);
    const allPackages = await SkyTrailsPackageModel.find({}).select(
      "_id title packageAmount specialTag"
    ).sort({ 'packageAmount.amount': -1, title: 1 });
    if (includeWords.some((word) => keywords.includes(word))) {
      const response = await handlePackageQuery                              (userPrompt, includeWords,allPackages);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK, 
        responseMessage: responseMessage.DATA_FOUND,
        response:response
      });
    } else {
      console.log("Non-package query. Calling OpenAI...");
      const botResponse = await getAiResponse(userPrompt,allPackages);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK, 
        responseMessage: responseMessage.DATA_FOUND,
        response:botResponse
      });
    }
  } catch (error) {
    console.error("Error in initialiseBot:", error.message, error.stack);
    next(new Error("Failed to process your request"));
  }
};

const handlePackageQuery = async (userPrompt, includeWords,allPackages) => {
  try {
   
    const numbersInPrompt = userPrompt.match(/\d+/g)?.map(Number) || [];

    let matchedPackages = allPackages.filter((pkg) =>
      includeWords.some(
        (word) =>
          new RegExp(`\\b${word}\\b`, "i").test(pkg.title) ||
          pkg.specialTag.some((tag) => tag[word] === true)
      )
    );    
    // Apply number-based filtering if numbers are present in the user prompt
    if (numbersInPrompt.length > 0) {
      const number = numbersInPrompt[0]; // Use the first number found
      if (userPrompt.includes("above")||userPrompt.includes('>')||userPrompt.includes(">=")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount >= number
        );
      } else if (userPrompt.includes("under") || userPrompt.includes("below")||userPrompt.includes('<')||userPrompt.includes("<=")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount <= number
        );
        
      } else if (userPrompt.includes("equal")||userPrompt.includes("=")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount === number
        );
      }
    }
    if (matchedPackages.length > 0) {
      const formattedPackages = matchedPackages.map((pkg) => ({
        title: pkg.title,
        price: pkg.packageAmount?.[0]?.amount || "N/A",
        details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
      }));
      
      const resp= await getAiResponseCustomPackage(userPrompt, formattedPackages);

      return resp;
    }else{
      return await getAiResponseCustomPackage(userPrompt, []);
    }

    // If no matches found
  } catch (error) {
    console.error("Error in handlePackageQuery:", error.message, error.stack);
    return next("Failed to handle package query:",error);
  }
};



exports.contactUs = async (req, res, next) => {
  try {
  } catch (error) {
    next(new Error("Failed to process your request"));
  }
};


exports.createChatHistory=async(req,res,next)=>{
  try {
    const {userId,userName,userPhoneNumber,query,respoense,queryId,conversationId,messages}=req.body;
    // const message=["sender","userQuery","botRespoense","timestamp"];
    if(userId&&queryId&&conversationId){
      const createConv=await updateConversation({userId:userId,queryId:queryId,conversationId:conversationId},{$push:{messages:messages}});
      console.log('Conversation updated:', createConv);
    }
    const result=await createConversation(req.body);
    return res.status(statusCode.OK).json({
            statusCode: statusCode.created,
            responseMessage: responseMessage.CREATED_SUCCESS,
            result:result
          });
  } catch (error) {
    console.log("Error while trying to create history",error);
    return next(error);
  }
}