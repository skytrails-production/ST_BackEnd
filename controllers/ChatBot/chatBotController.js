const {
  getAiResponse,
  getAiResponseCustomPackage,
  transcribeAudio,
  convertTextToSpeech,askOpenAI,askOpenAIGeneralQuery
} = require("./chatBotConfig");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");
const axios = require("axios");
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

const serviceKeywords = {
  flight: ["flight", "ticket", "airplane", "origin", "destination"],
  hotel: ["hotel", "stay", "room", "accommodation"],
  bus: ["bus", "road travel", "road trip"],
  visa: ["visa", "travel documents", "application"],
  package: ["package", "packages", "price", "amount", "cost", "rates"],
};
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_SECRETKEY,
// });
async function correctGrammar(text) {
  try {
      const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: `Correct the grammar: "${text}"` }]
          },
          {
              headers: { 
                  "Authorization": `Bearer ${process.env.OPENAI_SECRETKEY}`, 
                  "Content-Type": "application/json" // Ensure correct headers
              }
          }
      );
      return response.data.choices[0].message.content;

  } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      return "Error correcting grammar.";
  }
}
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

exports.initialiseBot1 = async (req, res, next) => {
  try {
    // Validate the user prompt
    if (!req.body || !req.body.userPrompt) {
      return res.status(400).json({ error: "Invalid request: 'userPrompt' is required." });
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

exports.initialiseBot = async (req, res, next) => {
  try {
    const {
      userId,
      userName,
      userPhoneNumber,
      query,
      respoense,
      queryId,
      conversationId,
      timestamp,
      botRespoense,
      userQuery,
      sender,
    } = req.body;
    const userPrompt = req.body?.userPrompt?.trim();
    if (!userPrompt) {
      return res.status(400).send({
        statusCode: 400,
        responseMessage: "User prompt is required.",
      });
    }
    const corrected=correctGrammar(userPrompt);    
    const serviceType = getServiceType(userPrompt);
    let includeWords=["package", "packages", "price", "amount", "cost", "rates"]
    let botResponse;
    includeWords.push(...userPrompt.split(" "));
    switch (serviceType) {
      case "flight":
        botResponse = await handleFlightQuery(userPrompt);
        break;
      case "hotel":
        botResponse = await handleHotelQuery(userPrompt);
        break;
      case "bus":
        botResponse = await handleBusQuery(userPrompt);
        break;
      case "visa":
        botResponse = await handleVisaQuery(userPrompt);
        break;
      case "package":
        botResponse = await handlePackageQuery(userPrompt,includeWords);
        break;
      default:
        botResponse = await await askOpenAIGeneralQuery(userPrompt);// General AI response
        break;
    }
    // Fetch all packages
    // const allPackages = await SkyTrailsPackageModel.find({})
    //   .select("_id title packageAmount specialTag")
    //   .sort({ "packageAmount.amount": -1, title: 1 });

    // Check for package-related keywords
    // if (keywords.some((keyword) => trimmedPrompt.includes(keyword))) {
    // botResponse = await handlePackageQuery(trimmedPrompt, allPackages);
    // } else {
    //   botResponse = await getAiResponseCustomPackage(trimmedPrompt);
    // }
    //     const isChatExist=await findConversation({userId:userId,userPrompt:query})
    //   if(isChatExist){
    //     const updateChatHistory=await updateConversation({_id:isChatExist._id},{$push:{messages:{timestamp,botRespoense,userQuery,sender}}});
    //     console.log("updateChatHistory====",updateChatHistory);

    //   }
    //     const newChatHistory=await createConversation(req.body);
    // console.log("newChatHistory===",newChatHistory);

    let audioPath;
    try {
      audioPath = await convertTextToSpeech(botResponse);
    } catch (error) {
      console.warn("Text-to-speech conversion failed:", error.message);
      audioPath = null;
    }

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      response: botResponse,
      audioUrl: audioPath,
    });
  } catch (error) {
    console.error("Error in initialiseBot:", error.message, error.stack);
    return next(error);
  }
};

const handlePackageQuery = async (userPrompt, includeWords) => {
  try {
    const allPackages = await SkyTrailsPackageModel.find({})
    .select("_id title packageAmount specialTag")
    .sort({ "packageAmount.amount": -1, title: 1 });
    const numbersInPrompt = userPrompt.match(/\d+/g)?.map(Number) || [];
    let matchedPackages = allPackages.filter((pkg) =>
      includeWords.some(
        (word) =>
          pkg.specialTag?.some((tag) => tag[word] === true)||new RegExp(`\\b${word}\\b`, "i").test(pkg.title)
      )      
    );
    if (numbersInPrompt.length > 0) {
      const number = numbersInPrompt[0]; // Use the first number found
      if (
        userPrompt.includes("above") ||
        userPrompt.includes(">") ||
        userPrompt.includes(">=")
      ) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount >= number
        );
      } else if (
        userPrompt.includes("under") ||
        userPrompt.includes("below") ||
        userPrompt.includes("<") ||
        userPrompt.includes("<=")
      ) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount <= number
        );
      } else if (userPrompt.includes("equal") || userPrompt.includes("=")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount === number
        );
      }
    }
    if (matchedPackages.length > 0) {
    
      const formattedPackages = await createUrlOfPackage(matchedPackages);
      const resp=await askOpenAI(userPrompt,formattedPackages);
      // const resp = await getAiResponseCustomPackage(
      //   userPrompt,
      //   formattedPackages
      // );
      return resp;
    } else {
      console.log("into else in package");
      const formattedPackages = await createUrlOfPackage(allPackages);
      const resp=await askOpenAI(userPrompt,formattedPackages);
      
      // const resp = await getAiResponseCustomPackage(
      //   userPrompt,
      //   formattedPackages
      // );

      return resp;
    }
  } catch (error) {
    console.error("Error in handlePackageQuery:", error.message, error.stack);
    return error;
  }
};
const createUrlOfPackage = async (packages) => {
  // Fetch all packages
   
  const formattedPackages = packages.map((pkg) => ({
    title: pkg.title,
    price: pkg.packageAmount?.[0]?.amount || "N/A",
    details: `https://theskytrails.com/holidaypackages/packagedetails?packageId=${pkg._id}`,
  }));
  // const formattedPackages1 = [];

  // for (const pkg of packages) {
  //   formattedPackages1.push({
  //     title: pkg.title,
  //     price: pkg.packageAmount?.[0]?.amount || "N/A",
  //     details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
  //   });
  // }
  return formattedPackages;
};

exports.contactUs = async (req, res, next) => {
  try {
  } catch (error) {
    next(new Error("Failed to process your request"));
  }
};


// exports.ask=async(req,res,next)=>{
//   try {
//     const { userMessage } = req.body;

//     // Step 1: Create a thread (if not already created for the user)
//     const threadId = await createThread();

//     // Step 2: Add user's message to the thread
//     await addMessageToThread(threadId, userMessage);

//     // Step 3: Run the assistant in the thread
//     const run = await runAssistantInThread(threadId);
// console.log("run===",run)
//     // Step 4: Fetch and return the assistant’s response
//     const response = await fetchAssistantResponse(run.thread_id);
// console.log("response=========",response);

//     res.json({ response });
//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     return next(error)
//   }
// }

exports.transcribeAudioHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }
    // Generate a unique temp file path
    const tempFilePath = `uploads/${Date.now()}-audio.mp3`;

    // Call the OpenAI transcription service
    const transcript = await transcribeAudio(req.file.buffer, tempFilePath);

    // Send the transcription back to the client
    return res.json({ transcript });
  } catch (error) {
    console.error("Error in transcribeAudioHandler:", error);
    return res.status(500).json({ error: error.message });
  }
};

// const handleFlightQuery = async (userPrompt, includeWords) => {
//   try {
//     const { origin, destination, travelDate } = extractFlightDetails(userPrompt);
//     if (!origin || !destination || !travelDate) {
//       return "Please provide origin, destination, and travel date for flight search.";
//     }
//   } catch (error) {
//     console.error("Error in handlePackageQuery:", error.message, error.stack);
//     return error;
//   }
// };

const getServiceType = (userPrompt) => {
  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    if (
      keywords.some((keyword) => userPrompt.toLowerCase().includes(keyword))
    ) {
      return service;
    }
  }
  return "general"; // Default fallback
};
