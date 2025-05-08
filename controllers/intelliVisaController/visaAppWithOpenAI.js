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
const { PDFDocument } = require('pdf-lib');
const { fromPath } = require('pdf2pic');
const {
    aiVisaDocServices,
} = require("../../services/intelliVisaServices/dynamicDb");
const {createAiVisaDoc,findAiVisaDoc,deleteAiVisaDoc,aiVisaDocList,updateAiVisaDoc,countTotalAiVisaDoc,insertManyAiVisaDoc}=aiVisaDocServices;

//function========
async function extractPages(pdfBuffer) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    return pages;
  }

async function convertPdfToImages(pdfPath) {
    const options = {
      density: 100,
      saveFilename: "untitled",
      savePath: "./images",
      format: "png",
      width: 600,
      height: 800
    };
    
    const storeAsImage = fromPath(pdfPath, options);
    const pageToConvertAsImage = 1;
  
    const resolve = await storeAsImage(pageToConvertAsImage);
    console.log("Page 1 is now converted as image");
  }


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



exports.uploadedDocsDetails = async (req, res, next) => {
  try {
    const { userId, applicantEmail } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    let imageeDetails = [];

    for (const file of req.files) {
      const mimeType = file.mimetype;

      if (mimeType === 'application/pdf') {
        // Convert PDF pages to images
        const options = {
          density: 100,
          format: 'png',
          width: 600,
          height: 800,
          savePath: './images',
        };
        const storeAsImage = fromBuffer(file.buffer, options);
        const pages = await storeAsImage.bulk(-1, true);

        for (const page of pages) {
          const base64Image = page.base64;
          const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(page, "aiVisaDocs");

          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/png;base64,${base64Image}`,
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
Extract details as much as possible. Provide the response in JSON format with key-value pairs representing each piece of data found.`,
                  },
                ],
                response_format: { type: 'json_object' },
              },
            ],
          });

          const content = response.choices[0].message.content;
          const cleanedContent = content.replace(/```json\n([\s\S]*?)\n```/, '$1');
          const parsedData = JSON.parse(cleanedContent);

          imageeDetails.push({
            parsedData,
            imageUrl,
          });
        }
      } else if (mimeType.startsWith('image/')) {
        const base64Image = file.buffer.toString('base64');
        const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(file, "aiVisaDocs");

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
Extract details as much as possible. Provide the response in JSON format with key-value pairs representing each piece of data found.`,
                },
              ],
              response_format: { type: 'json_object' },
            },
          ],
        });

        const content = response.choices[0].message.content;
        const cleanedContent = content.replace(/```json\n([\s\S]*?)\n```/, '$1');
        const parsedData = JSON.parse(cleanedContent);

        imageeDetails.push({
          parsedData,
          imageUrl,
        });
      } else {
        // Unsupported file type
        continue;
      }
    }

    if (imageeDetails.length > 0) {
      const insertObj = { userId, applicantEmail, imageeDetails };
      await createAiVisaDoc(insertObj);
    }

    res.json({ imageeDetails });
  } catch (error) {
    console.error('Error processing files:', error.message);
    return next(error.message);
  }
};
