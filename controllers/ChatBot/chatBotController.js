const {getAiResponse,getAiResponseCustomPackage} = require("./chatBotConfig");
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");
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
    if (!req.body || !req.body.userPrompt) {
      return res
        .status(400)
        .json({ error: "Invalid request: 'userPrompt' is required." });
    }
    const userPrompt = req.body.userPrompt.trim().toLowerCase();
    const includeWords = userPrompt.split(' ')
   
console.log("includeWords======",includeWords);

    let response = []; // Initialize response as an array

    if (includeWords.includes("package") || includeWords.includes("price")) {
      console.log("Response from OpenAI:========", userPrompt);
      // const sanitizedPrompt = userPrompt.replace(
      //   /([.*+?^=!:${}()|\[\]\/\\])/g,
      //   "\\$1"
      // ); // Escape special characters in the user prompt
      // const regex = new RegExp(`\\b${sanitizedPrompt}\\b`, "i");
      // const keywords = userPrompt.split(" ")`;
      // Find packages matching the user prompt
      let packages;
      const data = await SkyTrailsPackageModel.find({}).select("_id title packageAmount");
      console.log("data===",data);
      
      for(var keyWord of includeWords){
        console.log("keyWord====",keyWord);
        
         packages = await SkyTrailsPackageModel.find({  title: { $regex: keyWord, $options: 'i' } })
        .sort({ "packageAmount.0.amount": 1 }) // Sort by price (lowest first)
        .select("_id title packageAmount specialTag"); // Select the relevant fields
      console.log("packages===", packages);

      }
    
      if (packages.length > 0) {
        // If packages are found, add them to the response
        packages.forEach((pkg) => {
          response.push({
            title: pkg.title,
            price: pkg.packageAmount[0].amount,
            details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
            specialTag:pkg.specialTag
          });
        });
      } else {
        // If no matching packages found, call the AI for package-related information
        console.log("form open ai search from our platform");
        response = response = await getAiResponse(
          `${req.body.userPrompt} and tell me about https://theskytrails.com/`
        );
      }
    } else if (userPrompt.includes("website")) {
      // If the user asks about the website, return the website URL
      response = ["https://theskytrails.com/"];
    } else {
      // Only call the AI if the user prompt does not match packages or website
      response = await getAiResponse(req.body.userPrompt);
    }

    console.log("Final response:", response);
    res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error in initialiseBot:", error);
    next(new Error("Failed to process your request"));
  }
};

exports.initialiseBot = async (req, res, next) => {
  try {
    // Validate the user prompt
    if (!req.body || !req.body.userPrompt) {
      return res.status(400).json({ error: "Invalid request: 'userPrompt' is required." });
    }
    const userPrompt = req.body.userPrompt.trim().toLowerCase();
    const includeWords = userPrompt.split(/\s+/); 
    let response = [];
    let botResponse = ""; 
    if (includeWords.includes("package") || includeWords.includes("price")) {
      const allPackages = await SkyTrailsPackageModel.find({})
        .select("_id title packageAmount specialTag");
      const matchedPackages = allPackages.filter(pkg =>
        includeWords.some(word =>
          new RegExp(`\\b${word}\\b`, "i").test(pkg.title) || // Match in title
          pkg.specialTag.some(tag => tag[word] === true) // Match in specialTag
        )
      );
      if (matchedPackages.length > 0) {
        // If matches found, format the response
        const inhouseResponse = matchedPackages.map(pkg => ({
          title: pkg.title,
          price: pkg.packageAmount?.[0]?.amount || "N/A",
          details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
        }));
        response=await getAiResponseCustomPackage(userPrompt,inhouseResponse);
        botResponse = response.aiResp;
      } else {
        // If no matches, query OpenAI
        console.log("No matching packages found. Calling OpenAI for response...");
        response = await getAiResponse(
          `${req.body.userPrompt} and tell me about https://theskytrails.com/`
        );
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


exports.contactUs = async (req, res, next) => {
  try {
  } catch (error) {
    next(new Error("Failed to process your request"));
  }
};
