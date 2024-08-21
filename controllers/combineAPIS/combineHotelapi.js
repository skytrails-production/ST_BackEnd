const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const axios = require("axios");
const nodeCrypto = require("crypto");
const xml2js = require("xml2js");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
function generateRandomBytes(length) {
  return crypto.randomBytes(length);
}
const commonUrl = require("../common/const");
const NONCE = bytesToBase64(randomBytes);
const TIMESTAMP = new Date().toISOString(); // Current timestamp in seconds
const CLEARPASSWORD = process.env.AMADAPASS;

const buffer = Buffer.concat([
  Buffer.from(NONCE, "base64"),
  Buffer.from(TIMESTAMP),
  nodeCrypto.createHash("sha1").update(Buffer.from(CLEARPASSWORD)).digest(),
]);

const url = process.env.AMADEUSURL;

/**********************************************************SERVICES***************************************************/







//***********************************Combine response api******************************************/
exports.combineHotelApiData=async(req,res,next)=>{
    try {
         // Define the URLs for the three APIs
         const api1Url = '';
         const api2Url = '';
         const api3Url = '';
 
         // Use Promise.all to fetch data from all three APIs concurrently
         const [response1, response2, response3] = await Promise.all([
             axios.get(api1Url),
             axios.get(api2Url),
             axios.get(api3Url),
         ]);
 
         // Extract the data from each response
         let resultArray = [
             response1.data,
             response2.data,
             response3.data,
         ];
 
         // Sort the result array by the 'process' key in ascending order
         resultArray.sort((a, b) => {
             return a.process - b.process;
         });
 
         // Send the sorted result as the response
         return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.USERS_FOUND,
            result: resultArray,
          });
    } catch (error) {
        console.log("Error fetching data from APIs:",error);
        
    }
}