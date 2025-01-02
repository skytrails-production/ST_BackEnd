const {
  getAiResponse,
  getAiResponseCustomPackage,
} = require("./chatBotConfig");
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");
const packagePrompts=require("../../utilities/prompts")

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
      return res
        .status(400)
        .json({ error: "Invalid request: 'userPrompt' is required." });
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

    if (includeWords.some((word) => keywords.includes(word))) {
      const response = await handlePackageQuery(userPrompt, includeWords);
      return res.status(200).json({ message: response });
    } else {
      console.log("Non-package query. Calling OpenAI...");
      const botResponse = await getAiResponse(userPrompt);
      return res.status(200).json({ message: botResponse });
    }
  } catch (error) {
    console.error("Error in initialiseBot:", error.message, error.stack);
    next(new Error("Failed to process your request"));
  }
};

const handlePackageQuery = async (userPrompt, includeWords) => {
  try {
    const allPackages = await SkyTrailsPackageModel.find({}).select(
      "_id title packageAmount specialTag"
    );
    const numbersInPrompt = userPrompt.match(/\d+/g)?.map(Number) || [];

    let matchedPackages = allPackages.filter((pkg) =>
      includeWords.some(
        (word) =>
          new RegExp(`\\b${word}\\b`, "i").test(pkg.title) ||
          pkg.specialTag.some((tag) => tag[word] === true)
      )
    );
    console.log("userPrompt===",userPrompt);
    console.log("numbersInPrompt====>>>>>",numbersInPrompt);
    
    
    // Apply number-based filtering if numbers are present in the user prompt
    if (numbersInPrompt.length > 0) {
      const number = numbersInPrompt[0]; // Use the first number found
      if (userPrompt.includes("above")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount >= number
        );
      } else if (userPrompt.includes("under") || userPrompt.includes("below")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount <= number
        );
        console.log("matchedPackages===========",matchedPackages);
        
      } else if (userPrompt.includes("equal")) {
        matchedPackages = matchedPackages.filter(
          (pkg) => pkg.packageAmount?.[0]?.amount === number
        );
      }
    }
    console.log("matchedPackages.length====",matchedPackages.length);
    
    if (matchedPackages.length > 0) {
      const formattedPackages = matchedPackages.map((pkg) => ({
        title: pkg.title,
        price: pkg.packageAmount?.[0]?.amount || "N/A",
        details: `https://theskytrails.com/holidaypackages/packagedetails/${pkg._id}`,
      }));
console.log("formattedPackages=============",formattedPackages);

      const resp= await getAiResponseCustomPackage(userPrompt, formattedPackages);
console.log("resp======>>>>>>>>>>",resp);

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

exports.suggestPrompt = async (req, res, next) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid input. 'input' must be a non-empty string." });
    }
    const lowerCaseInput = input.toLowerCase();
    const suggestions = packagePrompts.filter((prompt) =>
      prompt.toLowerCase().includes(lowerCaseInput)
    );

    res.json({ suggestions });
  } catch (error) {
    console.log("error ", error);
    return next(error);
  }
};

exports.contactUs = async (req, res, next) => {
  try {
  } catch (error) {
    next(new Error("Failed to process your request"));
  }
};
