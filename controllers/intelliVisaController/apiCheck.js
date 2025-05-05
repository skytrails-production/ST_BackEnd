const axios = require("axios");
const qs = require("qs");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const CLIENT_ID = process.env.VISA_CLIENT_ID;
const CLIENT_SECRET = process.env.VISA_CLIENT_SECRET;
const Agency_UID = process.env.VISA_Agency_UID;
const realmName = process.env.VISA_realmName;
const authbaseUrl=process.env.VISA_AUTH_BASE_URL;
const baseUrl=process.env.VISA_BASE_URL;
const frontURL=process.env.VISA_FRONT_URL;
const VISA_TOKEN=process.env.VISA_TOKEN;
exports.getToken = async (req, res,next) => {
  try {
    const BASE_URL = `${authbaseUrl}/realms/${realmName}/protocol/openid-connect/token`;
    const response = await axios.post(
      BASE_URL,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          response: response.data,
        });
  } catch (err) {
    console.log(err, "eror to get token");
    return next(err);
  }
};

exports.createApplicant = async (req, res, next) => {
  try {
    const url = `${baseUrl}/v1/applicant/createD2C`;
    let { applicant, access_token } = req.body;
    applicant.agencyUid = Agency_UID;
    if (!applicant) {
      return res.status(400).json({ message: "applicant are required" });
    }
    const payload = JSON.stringify({ applicant });
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "realm-client-id": CLIENT_ID,
      },
    });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      response: response.data,
    });
  } catch (err) {
    console.log(
      err.response?.data || err.message,
      "Error while creating applicant"
    );
    return next(next);
  }
};

exports.getTokenExchange = async (req, res, next) => {
  try {
    const baseURL = `${authbaseUrl}/realms/${realmName}/protocol/openid-connect/token`;
    const { subject_token, requested_subject } = req.body;
    const data = qs.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      subject_token,
      audience: CLIENT_ID,
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      requested_token_type: "urn:ietf:params:oauth:token-type:refresh_token",
      requested_subject,
    });
    const response = await axios.post(baseURL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      response: response.data,
    });
  } catch (err) {
    console.error(err);
    return next(next);
  }
};

// exports.fetchVisaDetails = async (req, res) => {
//   try {
//     const {
//       applicantUid,
//       bearerToken,
//       visaCategory,
//       visaType,
//       visaDuration,
//       fromDate,
//       toDate,
//       sourceCountry,
//       destinationCountry,
//       applicationCreationKey,
//       premiumVerificationKey,
//     } = req.query;
//     // if (!applicantUid || !bearerToken || !visaCategory || !visaType || !visaDuration ||
//     //     !fromDate || !toDate || !sourceCountry || !destinationCountry || !applicationCreationKey || !premiumVerificationKey) {
//     //     return res.status(400).json({ success: false, message: 'Missing required query parameters' });
//     // }

//     const baseUrl = "https://sandbox-iam.intellivisa.ai/v1/visa/details";

//     const url = `${baseUrl}?agencyUid=${Agency_UID}&applicantUid=${applicantUid}&bearerToken=${bearerToken}&visaCategory=${visaCategory}&visaType=${visaType}&visaDuration=${visaDuration}&fromDate=${fromDate}&toDate=${toDate}&sourceCountry=${sourceCountry}&destinationCountry=${destinationCountry}&applicationCreationKey=${applicationCreationKey}&premiumVerificationKey=${premiumVerificationKey}`;

//     console.log("Requesting Visa API:", url);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${bearerToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching visa details:",
//       error.response?.data || error.message
//     );
//     return res.status(error.response?.status || 500).json({
//       success: false,
//       message: error.response?.data || "Something went wrong",
//     });
//   }
// };
exports.getApplicationCreationKey=async(req,res,next)=>{
  try {
    const url=`${baseUrl}/v1/application/generate-creation-key`
    const {accessToken,applicantUid}=req.query;
    headers={
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "realm-client-id": CLIENT_ID,
      };
    const response=await axios.post(url,{applicantUid},{headers});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      response: response.data,
    });
  } catch (error) {
    console.log("error while get application creation key",error);
    return next(error)
    
  }
}

exports.createRedirectURL=async(req,res,next)=>{
  try {
     const url=`${baseUrl}/v1/application/generate-creation-key`
    const {applicantUid,accessToken,bearerToken,visaType,visaDuration,fromDate,toDate,sourceCountry,destinationCountry}=req.query;
    headers={
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "realm-client-id": CLIENT_ID,
    };
    const applicationCreationKey=await axios.post(url,{applicantUid},{headers});
   const redirectURL= `${frontURL}?token=${VISA_TOKEN}&applicantUid=${applicantUid}
&bearerToken=${bearerToken}
&visaCategory=${visaType}
&fromDate=${fromDate}
&toDate=${toDate}
&sourceCountry=${sourceCountry}
&destinationCountry=${destinationCountry}
&applicationCreationKey=${applicationCreationKey.data.creationKey}`;
return res.status(statusCode.OK).send({
  statusCode: statusCode.OK,
  responseMessage: responseMessage.DATA_FOUND,
  response: redirectURL, 
});
  } catch (error) {
    console.log("error while trying to create redircet url",error);
    return next(error);
    
  }
}