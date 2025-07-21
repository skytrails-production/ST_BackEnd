const responseMessage = require("../../utilities/responses");
const axios = require("axios");
const statusCode = require("../../utilities/responceCode");
const VISA_TOKEN = process.env.VISA_OPENAI_SECRET_KEY;
const commonFunction = require("../../utilities/commonFunctions");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.VISA_OPENAI_SECRET_KEY,
});
const openAIKey = process.env.VISA_OPENAI_SECRET_KEY;
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const {
  aiVisaDocServices,
} = require("../../services/intelliVisaServices/dynamicDb");
const {
  createAiVisaDoc,
  findAiVisaDoc,
  findAiVisaDocPop,
  deleteAiVisaDoc,
  aiVisaDocList,
  updateAiVisaDoc,
  countTotalAiVisaDoc,
  insertManyAiVisaDoc,
} = aiVisaDocServices;

const convertPdfToImages = require("../../utilities/pdfToImage");
const fs = require("fs");
//function========
async function extractPages(pdfBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  return pages;
}

// async function convertPdfToImages(pdfPath) {
//   const options = {
//     density: 100,
//     saveFilename: "untitled",
//     savePath: "./images",
//     format: "png",
//     width: 600,
//     height: 800,
//   };

//   const storeAsImage = fromPath(pdfPath, options);
//   const pageToConvertAsImage = 1;

//   const resolve = await storeAsImage(pageToConvertAsImage);
//   console.log("Page 1 is now converted as image");
// }

exports.ImageDetails = async (req, res, next) => {
  try {
    const { userId, applicantEmail } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    let imageeDetails = [];
    for (const imageData of req.files) {
      const imageBuffer = imageData.buffer;
      const mimeType = imageData.mimetype;
      const base64Image = imageBuffer.toString("base64");
      const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(
        imageData,
        "aiVisaDocs"
      );
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },

              {
                type: "text",
                text: `Please analyze the uploaded document image and provide the following:
1. Document Type (e.g., Aadhaar card, PAN card, Passport, Passbook)
2. Extracted Details:
* If readable, I'll extract details such as:
   - Name
   - Date of Birth
   - Document Number
   - Address (if available)
   - Any other identifiable details
* If not readable, Provide the Please provide Document Type Other
extract details as much as possible ,Provide the response in JSON format with key-value pairs representing each piece of  data found.
3. Automatically rotate it if it's in the wrong direction.`,
              },
            ],
            response_format: { type: "json_object" },
          },
        ],
      });
      const content = response.choices[0].message.content;
      console.log("content===", content);
      if (content) {
        const cleanedContent = content.replace(
          /```json\n([\s\S]*?)\n```/,
          "$1"
        );
        const parsedData = JSON.parse(cleanedContent);
        imageeDetails.push({
          parsedData,
          imageUrl,
        });
      } else {
        // fallback if no content
        imageeDetails.push({ imageUrl });
      }
    }
    let result;
    if (imageeDetails.length > 0) {
      const insertObj = { userId, applicantEmail, imageeDetails };
      result = await createAiVisaDoc(insertObj);
    }

    // Send the imageeDetails back to the client
    res.json({ result });
  } catch (error) {
    console.log("error----------", error);

    console.error("Error processing images:", error.message);
    return next(error.message);
  }
};

exports.uploadedDocsDetails1 = async (req, res, next) => {
  try {
    const { userId, applicantEmail } = req.body;
    if (!req.files || req.files.length === 0) {
      //  res.status(400).json({ error: "No files uploaded" });

      return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        responseMessage: "No files uploaded",
      });
    }

    let imageeDetails = [];
    for (const file of req.files) {
      const mimeType = file.mimetype;

      if (mimeType === "application/pdf") {
        try {
          const {
            imagePaths,
            outputDir,
            tempPdfPath,
          } = await convertPdfToImages(file.buffer);

          for (const imagePath of imagePaths) {
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString("base64");

            const fileObject = {
              buffer: imageBuffer,
              originalname: path.basename(imagePath),
              mimetype: "image/png",
            };

            const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(
              fileObject,
              "aiVisaDocs"
            );

            const response = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:image/png;base64,${base64Image}`,
                      },
                    },
                    {
                      type: "text",
                      text: `You are a document analysis system.

Analyze the uploaded image. Rotate if needed to correct orientation.  
Return only valid JSON in the below format.  
⚠️ Omit any key (and its nested keys) if the value is missing or empty. Do not return null or empty strings or arrays.

Format:
{
  "Document_Type": "Aadhaar card | PAN card | Bank Statement | Passport | Photo | IncomeTax | etc.",
  "Extracted_Details": {
    "Name": "if found",
    "Date_of_Birth": "if found",
    "Document_Number": "if found (e.g., Aadhaar Number, PAN Number, Acknowledgement Number, etc.)",
    "Address": {
      "Village": "...",
      "VTC": "...",
      "PO": "...",
      "District": "...",
      "Sub_District": "...",
      "State": "...",
      "PinCode": "..."
    },
    "Other_Identifiable_Details": {
      "VID": "...",
      "Bank_Name": "...",
      "Bride_Name": "...",
      "Groom_Name": "...",
      "Transactions": [
        {
          "Txn_Date": "DD MMM YYYY",
          "Description": "...",
          "Debit": 0.0,
          "Credit": 0.0,
          "Balance": 0.0
        }
      ]
    },
    "IncomeTax_Important_Details": {
      "Assessment_Year": "...",
      "PAN": "...",
      "Acknowledgement_Number": "...",
      "Filing_Date": "DD-MMM-YYYY",
      "Gross_Total_Income": 0.0,
      "Total_Taxable_Income": 0.0,
      "Total_Tax_Payable": 0.0,
      "Employer_Name": "..."
    }
  },
  "Detected_Errors": ["..."]
}

Rules:
- If the document is a **photo** (e.g., personal image with no document), return:
{
  "Document_Type": "Photo",
  "Extracted_Details": {},
  "Detected_Errors": ["No identifiable information. Image is a photo."]
}

- If the system fails to recognize the document or format, return:
{
  "Document_Type": "Unknown",
  "Extracted_Details": {},
  "Detected_Errors": ["System unable to extract due to restrictions or unsupported format."]
}
`,
                    },
                  ],
                },
              ],
              response_format: { type: "json_object" },
            });

            const content = response.choices[0]?.message?.content?.trim();
            if (content) {
              let cleanedContent = content;

              // 🧹 Remove ```json ``` blocks if present
              if (cleanedContent.startsWith("```json")) {
                cleanedContent = cleanedContent
                  .replace(/```json\s*([\s\S]*?)\s*```/, "$1")
                  .trim();
              }

              // ✅ Robust JSON parse (escaped or not)
              try {
                let parsedData;
                try {
                  parsedData = JSON.parse(cleanedContent);
                } catch (err1) {
                  const unescaped = cleanedContent
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, "")
                    .replace(/\\r/g, "")
                    .replace(/\\\\/g, "\\");
                  parsedData = JSON.parse(unescaped);
                }

                imageeDetails.push({ parsedData, imageUrl });
              } catch (jsonErr) {
                console.error(
                  "❌ Failed to parse JSON from OpenAI:",
                  jsonErr.message
                );
                imageeDetails.push({
                  imageUrl,
                  error: "Invalid JSON structure from OpenAI",
                  rawResponse: cleanedContent,
                });
              }
            } else {
              imageeDetails.push({
                imageUrl,
                error: "Empty response from OpenAI",
              });
            }
            // 🧹 Clean up temp files
            // fs.rmSync(outputDir, { recursive: true, force: true });
            // fs.rmSync(tempPdfPath);
          }
          if (outputDir) fs.rmSync(outputDir, { recursive: true, force: true });
          if (tempPdfPath) fs.rmSync(tempPdfPath, { force: true });
        } catch (err) {
          console.error("PDF processing failed:", err);
        }
      } else if (mimeType.startsWith("image/")) {
        try {
          if (!file?.buffer || !mimeType) {
            return res.status(statusCode.badRequest).json({
              statusCode: statusCode.badRequest,
              responseMessage: "Invalid image file or MIME type",
            });
          }

          const base64Image = file.buffer.toString("base64");

          const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(
            file,
            "aiVisaDocs"
          );

          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${base64Image}`,
                    },
                  },
                  {
                    type: "text",
                    text: `You are a document analysis system.

Analyze the uploaded image. Rotate if needed to correct orientation.  
Return only valid JSON in the below format.  
⚠️ Omit any key (and its nested keys) if the value is missing or empty. Do not return null or empty strings or arrays.

Format:
{
  "Document_Type": "Aadhaar card | PAN card | Bank Statement | Passport | Photo | IncomeTax | etc.",
  "Extracted_Details": {
    "Name": "if found",
    "Date_of_Birth": "if found",
    "Document_Number": "if found (e.g., Aadhaar Number, PAN Number, Acknowledgement Number, etc.)",
    "Address": {
      "Village": "...",
      "VTC": "...",
      "PO": "...",
      "District": "...",
      "Sub_District": "...",
      "State": "...",
      "PinCode": "..."
    },
    "Other_Identifiable_Details": {
      "VID": "...",
      "Bank_Name": "...",
      "Bride_Name": "...",
      "Groom_Name": "...",
      "Transactions": [
        {
          "Txn_Date": "DD MMM YYYY",
          "Description": "...",
          "Debit": 0.0,
          "Credit": 0.0,
          "Balance": 0.0
        }
      ]
    },
    "IncomeTax_Important_Details": {
      "Assessment_Year": "...",
      "PAN": "...",
      "Acknowledgement_Number": "...",
      "Filing_Date": "DD-MMM-YYYY",
      "Gross_Total_Income": 0.0,
      "Total_Taxable_Income": 0.0,
      "Total_Tax_Payable": 0.0,
      "Employer_Name": "..."
    }
  },
  "Detected_Errors": ["..."]
}

Rules:
- If the document is a **photo** (e.g., personal image with no document), return:
{
  "Document_Type": "Photo",
  "Extracted_Details": {},
  "Detected_Errors": ["No identifiable information. Image is a photo."]
}

- If the system fails to recognize the document or format, return:
{
  "Document_Type": "Unknown",
  "Extracted_Details": {},
  "Detected_Errors": ["System unable to extract due to restrictions or unsupported format."]
}
`,
                  },
                ],
              },
            ],
            response_format: { type: "json_object" },
          });

          const content = response.choices[0].message.content?.trim();
          if (content) {
            // Remove ```json ... ``` if it exists
            let cleanedContent = content;
            if (cleanedContent.startsWith("```json")) {
              cleanedContent = cleanedContent
                .replace(/```json\s*([\s\S]*?)\s*```/, "$1")
                .trim();
            }

            try {
              const parsedData = JSON.parse(cleanedContent);
              imageeDetails.push({ parsedData, imageUrl });
            } catch (jsonErr) {
              console.error(
                "Failed to parse JSON from OpenAI:",
                jsonErr.message
              );
              imageeDetails.push({
                imageUrl,
                error: "Invalid JSON structure from OpenAI",
                rawResponse: cleanedContent,
              });
            }
          } else {
            imageeDetails.push({
              imageUrl,
              error: "Empty response from OpenAI",
            });
          }
        } catch (err) {
          console.error("Error in image processing:", err);
          imageeDetails.push({
            imageUrl: file.originalname || "Unknown",
            error: "Exception while processing image with OpenAI",
          });
        }
      } else {
        continue;
      }
    }
    let result;
    if (imageeDetails.length > 0) {
      const insertObj = { userId, applicantEmail, imageeDetails };
      result = insertObj;
    }
    res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPLOAD_SUCCESS,
      result,
    });
  } catch (err) {
    console.log("error====", err);
    if (err.status === 429) {
      res.status(statusCode.OK).send({
        statusCode: statusCode.Exceed,
        responseMessage: err.error.message,
      });
    }

    // return next(err.message);
  }
};

exports.uploadedDocsDetails = async (req, res) => {
  try {
    const { userId, applicantEmail } = req.body;
    const files = req.files || [];

    if (!files.length) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        responseMessage: "No files uploaded",
      });
    }

    const imageeDetails = await Promise.all(
      files.map(async (file) => {
        const mimeType = file.mimetype;

        // 🧾 Handle PDF
        if (mimeType === "application/pdf") {
          try {
            const {
              imagePaths,
              outputDir,
              tempPdfPath,
            } = await convertPdfToImages(file.buffer);

            const perPageDetails = await Promise.all(
              imagePaths.map(async (imagePath) => {
                try {
                  const imageBuffer = fs.readFileSync(imagePath);
                  const base64Image = imageBuffer.toString("base64");

                  const fileObject = {
                    buffer: imageBuffer,
                    originalname: path.basename(imagePath),
                    mimetype: "image/png",
                  };

                  const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(
                    fileObject,
                    "aiVisaDocs"
                  );

                  const gptResponse = await callGPTAnalysisPrompt(
                    base64Image,
                    "image/png"
                  );

                  return {
                    parsedData: gptResponse,
                    imageUrl,
                  };
                } catch (innerErr) {
                  return {
                    imageUrl: null,
                    error: `Failed to process PDF image: ${innerErr.message}`,
                  };
                }
              })
            );

            // Cleanup
            if (outputDir)
              fs.rmSync(outputDir, { recursive: true, force: true });
            if (tempPdfPath) fs.rmSync(tempPdfPath, { force: true });

            return perPageDetails;
          } catch (err) {
            return [{ error: `PDF processing failed: ${err.message}` }];
          }
        }

        // 🖼️ Handle image
        else if (mimeType.startsWith("image/")) {
          try {
            const base64Image = file.buffer.toString("base64");

            const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(
              file,
              "aiVisaDocs"
            );

            const gptResponse = await callGPTAnalysisPrompt(
              base64Image,
              mimeType
            );

            return {
              parsedData: gptResponse,
              imageUrl,
            };
          } catch (err) {
            return {
              imageUrl: file.originalname || "Unknown",
              error: `Image processing failed: ${err.message}`,
            };
          }
        }

        // ❌ Unsupported file
        return {
          error: `Unsupported file type: ${mimeType}`,
          imageUrl: file.originalname,
        };
      })
    );

    // Flatten nested results (from PDFs)
    const flatDetails = imageeDetails.flat();

    const result = {
      userId,
      applicantEmail,
      imageeDetails: flatDetails,
    };

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPLOAD_SUCCESS,
      result,
    });
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(statusCode.OK).send({
      statusCode: err.status || statusCode.internalServerError,
      responseMessage: err.message || "Server error occurred",
    });
  }
};

// 📦 Modular GPT call logic
async function callGPTAnalysisPrompt(base64Image, mimeType) {
  // use your OpenAI setup

  const promptText = `You are a document analysis system.

Analyze the uploaded image. Rotate if needed to correct orientation.  
Return only valid JSON in the below format.  
Carefully review the document for any signs of tampering, editing, or alteration. Check:
   - Text-level changes: font inconsistencies, spacing errors, misalignment, overwritten content, replaced names/numbers.
   - Image manipulation: pasted elements, unnatural blurring, mismatched shadows, compression artifacts, cloned regions.
   - Metadata: creation/modification timestamps, editing tools used, inconsistency with document content.

⚠️ Omit any key (and its nested keys) if the value is missing or empty. Do not return null or empty strings or arrays.

Format:
{
  "Document_Type": "Aadhaar card | PAN card | Bank Statement | Passport | Photo | IncomeTax | GST Registration Documnet| GSTIN Document| GST Registration Details | GST Document | Certificate of Marriage |etc.",
  "Extracted_Details": {
    "Name": "if found",
    "Date_of_Birth": "if found",
    "Document_Number": "if found (e.g., Aadhaar Number, PAN Number, Acknowledgement Number, etc.)",
    "Address": {
      "Village": "...",
      "VTC": "...",
      "PO": "...",
      "District": "...",
      "Sub_District": "...",
      "State": "...",
      "PinCode": "..."
    },
    "Other_Identifiable_Details": {
      "VID": "...",
      "Bank_Name": "...",
      "Bride_Name": "...",
      "Groom_Name": "...",
      "Transactions": [
        {
          "Txn_Date": "DD MMM YYYY",
          "Description": "...",
          "Debit": 0.0,
          "Credit": 0.0,
          "Balance": 0.0
        }
      ]
    },
    "IncomeTax_Important_Details": {
      "Assessment_Year": "...",
      "PAN": "...",
      "Acknowledgement_Number": "...",
      "Filing_Date": "DD-MMM-YYYY",
      "Gross_Total_Income": 0.0,
      "Total_Taxable_Income": 0.0,
      "Total_Tax_Payable": 0.0,
      "Employer_Name": "..."
    }
  },
  "Detected_Errors": ["..."]
}

Rules:
- If the document is a **photo** (e.g., personal image with no document), return:
{
  "Document_Type": "Photo",
  "Extracted_Details": {},
  "Detected_Errors": ["No identifiable information. Image is a photo."]
}

- If the system fails to recognize the document or format, return:
{
  "Document_Type": "Unknown",
  "Extracted_Details": {},
  "Detected_Errors": ["System unable to extract due to restrictions or unsupported format."]
}
`;
//   const promptText = `You are a document analysis system.

// Analyze the uploaded image or PDF document.

// 1. Rotate the document if needed to correct orientation.
// 2. Carefully review the document for any signs of tampering, editing, or alteration. Check:
//    - Text-level changes: font inconsistencies, spacing errors, misalignment, overwritten content, replaced names/numbers.
//    - Image manipulation: pasted elements, unnatural blurring, mismatched shadows, compression artifacts, cloned regions.
//    - Metadata: creation/modification timestamps, editing tools used, inconsistency with document content.

// 3. Extract all identifiable information, such as:
//    - Name, Date of Birth, Document Number (Aadhaar, PAN, etc.)
//    - Address details (Village, District, State, etc.)
//    - Income Tax details (Assessment Year, PAN, Tax Payable, etc.)
//    - Bank transaction details (date, amount, balance)
//    - Certificate details (Bride/Groom name)

// 4. Return only valid JSON in this structure:

// {
//   "Document_Type": "Aadhaar card | PAN card | Bank Statement | Passport | Photo | IncomeTax | GST Registration Document | etc.",
//   "Extracted_Details": {
//     "Name": "...",
//     "Date_of_Birth": "...",
//     "Document_Number": "...",
//     "Address": {
//       "Village": "...",
//       "VTC": "...",
//       "PO": "...",
//       "District": "...",
//       "Sub_District": "...",
//       "State": "...",
//       "PinCode": "..."
//     },
//     "Other_Identifiable_Details": {
//       "VID": "...",
//       "Bank_Name": "...",
//       "Bride_Name": "...",
//       "Groom_Name": "...",
//       "Transactions": [
//         {
//           "Txn_Date": "DD MMM YYYY",
//           "Description": "...",
//           "Debit": 0.0,
//           "Credit": 0.0,
//           "Balance": 0.0
//         }
//       ]
//     },
//     "IncomeTax_Important_Details": {
//       "Assessment_Year": "...",
//       "PAN": "...",
//       "Acknowledgement_Number": "...",
//       "Filing_Date": "DD-MMM-YYYY",
//       "Gross_Total_Income": 0.0,
//       "Total_Taxable_Income": 0.0,
//       "Total_Tax_Payable": 0.0,
//       "Employer_Name": "..."
//     }
//   },
//   "Detected_Errors": ["List of anomalies, e.g., 'Font mismatch in PAN number', 'Photoshop detected', etc."]
// }

// ⚠️ Rules:
// - Omit any key (and its nested keys) if the value is missing or empty.
// - Do **not** return 'null' , empty string '""', or empty array '[]''.
// - If the document is a **photo**, return:
//   {
//     "Document_Type": "Photo",
//     "Extracted_Details": {},
//     "Detected_Errors": ["No identifiable information. Image is a photo."]
//   }
// - If the document is **unrecognized or unsupported**, return:
//   {
//     "Document_Type": "Unknown",
//     "Extracted_Details": {},
//     "Detected_Errors": ["System unable to extract due to restrictions or unsupported format."]
//   }
// `;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
          {
            type: "text",
            text: promptText,
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  let content = response.choices[0]?.message?.content?.trim() || "";

  if (content.startsWith("```json")) {
    content = content.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim();
  }

  try {
    return JSON.parse(content);
  } catch {
    const unescaped = content
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "")
      .replace(/\\r/g, "")
      .replace(/\\\\/g, "\\");
    return JSON.parse(unescaped);
  }
}

exports.getApplicationDocDerails = async (req, res, next) => {
  try {
    const { appID } = req.query;
    const getAppDocDetail = await findAiVisaDocPop({ _id: appID });
    if (!getAppDocDetail) {
      res.status(statusCode.OK).send({
        statusCode: statusCode.Exceed,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: getAppDocDetail,
    });
  } catch (error) {
    return next(error);
  }
};
