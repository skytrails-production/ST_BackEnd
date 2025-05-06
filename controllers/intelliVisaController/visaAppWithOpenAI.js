const responseMessage = require("../../utilities/responses");
const axios = require('axios');
const statusCode = require("../../utilities/responceCode");
const { createWorker } = require('tesseract.js');
const VISA_TOKEN=process.env.VISA_OPENAI_SECRET_KEY;
const commonFunction = require("../../utilities/commonFunctions");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.VISA_OPENAI_SECRET_KEY,
});
const openAIKey=process.env.VISA_OPENAI_SECRET_KEY
const path = require('path');
const {
    aiVisaDocServices,
} = require("../../services/intelliVisaServices/dynamicDb");
const {createAiVisaDoc,findAiVisaDoc,deleteAiVisaDoc,aiVisaDocList,updateAiVisaDoc,countTotalAiVisaDoc,insertManyAiVisaDoc}=aiVisaDocServices;
exports.ImageDetails = async (req, res, next) => {
  try {
    const {userId,applicantEmail}=req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    let imageeDetails = [];
    for (const imageData of req.files) {
      const imageBuffer = imageData.buffer;
      const mimeType = imageData.mimetype;
      const base64Image = imageBuffer.toString('base64');
       const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(imageData, "aiVisaDocs");
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
           
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
              
              {
                type: 'text',
                text: `Please analyze the uploaded document image and provide the following:
1. Document Type (e.g., Aadhaar card, PAN card, Passport, Passbook)
2. Extracted Details:
   - Name
   - Date of Birth
   - Document Number
   - Address (if available)
extract details as much as possible ,Provide the response in JSON format with key-value pairs representing each piece of  data found.`,
              },
            ],
            response_format: { type: 'json_object' }
          },
          
        ],
      });

      const content = response.choices[0].message.content;
      
      const cleanedContent = content.replace(/```json\n([\s\S]*?)\n```/, '$1');
const parsedData = JSON.parse(cleanedContent);

      imageeDetails.push({
        parsedData,
        imageUrl:imageUrl
      });
    }
    if (imageeDetails.length > 0) {

        const insertObj = { userId,applicantEmail,imageeDetails };
        await createAiVisaDoc(insertObj);
      }
  

    // Send the imageeDetails back to the client
    res.json({ imageeDetails });
  } catch (error) {
    console.error('Error processing images:', error.message);
    return next(error.message);
  }
};
