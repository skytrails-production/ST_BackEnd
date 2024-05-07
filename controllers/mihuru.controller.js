const axios = require("axios");
const { api } = require("../common/const");

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const commonFunctions = require("../utilities/commonFunctions");




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
  try {
    const requestBody=req.body;

    const data={...requestBody,
      partnerTransactionId: "emt1049",
      travelAgentName: "Deepika Padukone",
      travelBrandName: "WDS",
      travelAgentEmailId: "abc@gmail.com",
      travelAgentMobile: "9999999999"
    };
    // console.log(data,"data");

    // return;

    const apiToken=req.headers.mihirutoken;
    // console.log(req.headers,"token")



    const response = await axios.post(`${api.customerSignUp}`, data,{
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });
    
    msg = "user signUp successfully!";
  actionCompleteResponse(res, response.data, msg); 

  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
  
}

//submitOtp


exports.submitOtp = async (req, res) =>{

  try {
    const data=req.body;

    // console.log(requestBody,"data");



    const apiToken=req.headers.mihirutoken;
    // console.log(apiToken,"token");
        // return;



    const response = await axios.post(`${api.submitOtp}`, data,{
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });
    
    msg = "submit otp successfully!";
  actionCompleteResponse(res, response.data, msg); 

  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }

}

exports.travelPlanGenerator = async (req, res) =>{

  try{
    const requestBody=req.body;
    const data={ 
      ...requestBody,     
        confirmPersonalDetails: true,
        navigateToMihuruUrlForDocsUpload: true,
        partnerCallbackUrl: "https://theskytrails.com/"
                
    };

    const apiToken=req.headers.mihirutoken;
    console.log(apiToken,"data");
    
    const response = await axios.post(`${api.travelPlanGenerator}`, data,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    }
    );
    // console.log(response,"response");
    // console.log(data,"data")

    msg = "submit Otp Successfully!";
    actionCompleteResponse(res, response.data, msg);      
} catch (err) {
  console.log(err);
  sendActionFailedResponse(res, {}, err.message);
}

}