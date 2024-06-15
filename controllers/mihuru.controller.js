const axios = require("axios");
const { api } = require("../common/const");

const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const commonFunctions = require("../utilities/commonFunctions");

exports.partnerAuthentication = async (req, res) => {
  try {
    const data = {
      partnerId: process.env.MIHURUPARTNERID,
      apiKey: process.env.MIHURUAPIKEY,
    };
    const response = await axios.post(`${api.partnerAuthentication}`, data);
    // console.log(response.data,"response");
    // console.log(data,"data")

    msg = "Token Generate Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, { err }, err.message);
  }
};

//signUp

exports.signUp = async (req, res) => {
  try {
    const requestBody = req.body;

    const userIP =requestIp.getClientIp(req)||"103.154.247.235";

    const userLocation = geoip.lookup(userIP);
    // const userLocation=geoip.lookup("192.168.10.10");
    // console.log("location", userIP,userLocation);

    const data = {
      ...requestBody,
      partnerTransactionId: "emt1049",
      travelAgentName: "B2C",
      travelBrandName: "SkyTrails",
      travelAgentEmailId: "shivam@theskytrails.com",
      travelAgentMobile: "8847301811",
      ipAddress:userIP,
      latitude:userLocation?.ll[0],
      longitude:userLocation?.ll[1]
    };
    // console.log(data,"data");

    // return;

    const apiToken = req.headers.mihirutoken;
    // console.log(req.headers,"token")

    const response = await axios.post(`${api.customerSignUp}`, data, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    msg = "user signUp successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
};

//submitOtp

exports.submitOtp = async (req, res) => {
  try {
    const data = req.body;

    // console.log(requestBody,"data");

    const apiToken = req.headers.mihirutoken;
    // console.log(apiToken,"token");
    // return;

    const response = await axios.post(`${api.submitOtp}`, data, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    msg = "submit otp successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
};

exports.travelPlanGenerator = async (req, res) => {
  try {
    const requestBody = req.body;
    const data = {
      ...requestBody,
      confirmPersonalDetails: true,
      navigateToMihuruUrlForDocsUpload: true,
    };

    const apiToken = req.headers.mihirutoken;

    const response = await axios.post(`${api.travelPlanGenerator}`, data, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
    msg = "submit Otp Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, { err }, err.message);
  }
};



exports.travelEmiPlan = async (req, res) =>{

  try {
    const data=req.body;

    const response = await axios.post(`${api.emiTravelPlan}`, data, {
      headers: {
        partnerId: process.env.MIHURUPARTNERID,
        apiKey: process.env.MIHURUAPIKEY,
        'Content-Type': "application/json" 
      },
    });

    msg = "Travel Plan EMI Data :";
    actionCompleteResponse(res, response.data, msg);
    
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
}