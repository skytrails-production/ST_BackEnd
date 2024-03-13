const aws = require("aws-sdk");
const axios = require("axios");
const { api } = require("../common/const");

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const commonFunctions = require("../utilities/commonFunctions");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});



exports.partnerAuthentication =async (req,res) =>{
    try{
        const data={            
                // partnerId: process.env.MIHURUPARTNERID,
                // apiKey: process.env.MIHURUAPIKEY              
        };
        const response = await axios.post(`${api.partnerAuthentication}`, data);
        // console.log(response.data,"response");
        // console.log(data,"data")

        msg = "Token Generate Successfully!";
        actionCompleteResponse(res, response.data, msg);      
    } catch (err) {
      // console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
}