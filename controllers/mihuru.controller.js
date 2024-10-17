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

    msg = "Token Generate Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
};

//signUp

exports.signUp = async (req, res) => {
  try {
    const requestBody = req.body;

    const userIP =requestIp.getClientIp(req)!=="::1"?requestIp.getClientIp(req):"103.154.247.235";

    const userLocation = geoip.lookup(userIP);
    // const userLocation=geoip.lookup("192.168.10.10");

    const data = {
      ...requestBody,
      travelAgentName: "B2C",
      travelBrandName: "SkyTrails",
      travelAgentEmailId: "shivam@theskytrails.com",
      travelType:'Flight',
      travelAgentMobile: "8847301811",
      ipAddress:userIP,
      latitude:userLocation?.ll[0],
      longitude:userLocation?.ll[1]
    };

    // return;

    const apiToken = req.headers.mihirutoken;

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


    const apiToken = req.headers.mihirutoken;
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



//initiateFlightBooking


exports.initiateFlightBooking = async (req , res) =>{

  try {

    const data=req.body;

    const response = await axios.post(`${api.initiateFlightBooking}`, data);

    msg = "Initiate Flight Booking";
    actionCompleteResponse(res, response.data, msg);
    
  } catch (error) {
    sendActionFailedResponse(res, { error }, error.message);
  }

}


//initiateHotelBooking

exports.initiateHotelBooking = async (req, res) =>{

  try {

    const data=req.body;

    const response = await axios.post(`${api.initiateHotelBooking}`, data);

    msg = "Initiate Hotel Booking";
    actionCompleteResponse(res, response.data, msg);
    
  } catch (error) {
    sendActionFailedResponse(res, { error }, error.message);
  }

}



//initiateHolidayPackageBooking

exports.initiateHolidayPackageBooking = async (req, res) =>{

  try {

    const data=req.body;

    const response = await axios.post(`${api.initiateHolidayPackageBooking}`, data);

    msg = "Initiate Holiday Package Booking";
    actionCompleteResponse(res, response.data, msg);
    
  } catch (error) {
    sendActionFailedResponse(res, { error }, error.message);
  }


}