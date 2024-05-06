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
                partnerId: process.env.MIHURUPARTNERID,
                apiKey: process.env.MIHURUAPIKEY              
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


//signUp 

exports.signUp = async (req, res) => {
  
}


exports.travelPlanGenerator = async (req, res) =>{

  try{
    const data={            
      
        confirmPersonalDetails: true,
        panid: "CTLPJ9569B",
        pincode: "263655",
        dob: "2000-06-08",
        navigateToMihuruUrlForDocsUpload: true,
        partnerCallbackUrl: "https://theskytrails.com/"
                
    };
    const token ="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJtb2hpdGpvc2hpNzg3ODk4QGdtYWlsLmNvbSIsIkVtYWlsIjoibW9oaXRqb3NoaTc4Nzg5OEBnbWFpbC5jb20iLCJBcHBVc2VySWQiOiI1NjE5Y2Q4OC0xNmNiLTQ0YjEtYTk4Zi1jODIzMmYyYWZhNTAiLCJBcHBsaWNhdGlvbklkIjoiMTIzMTciLCJuYmYiOjE3MTAzOTk4NzMsImV4cCI6MTcxMTAwNDY3MywiaWF0IjoxNzEwMzk5ODczfQ.a-0LTBgJob1P9FjSAfemwgf3FHhzAFP63R-ulIaN4goX0z65YTM4xDHTbUkLycDmCU-k0ClLjIrgX4M5aZjUmA";
    const response = await axios.post(`${api.travelPlanGenerator}`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );
    // console.log(response.data,"response");
    // console.log(data,"data")

    msg = "submit Otp Successfully!";
    actionCompleteResponse(res, response.data, msg);      
} catch (err) {
  // console.log(err);
  sendActionFailedResponse(res, {}, err.message);
}

}