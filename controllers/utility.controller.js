const axios = require("axios");
const { tokenGenerator, api } = require("../common/const");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const { userIPDetail } = require("../model/city.model");
const requestIp = require('request-ip');

const headerSet=  {
  "Content-Type": "application/json",
  token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
};

exports.getOTP = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getOTPRequest}`, params, {
      headers: headerSet
    });
    msg = "Send OTP Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getVerifyOTP = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getVerifyOTPRequest}`, params, {
      headers: headerSet
    });
    msg = "OTP verify Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getPromoCode = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getPromoCodeRequest}`, params, {
      headers: headerSet
    });
    msg = "Get Promo Code Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getPromoService = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(
      `${api.getPromoServicesRequest}`,
      params,
      {
        headers: headerSet
      }
    );
    msg = "Get Promo Services Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getUserBalance = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getUserBalanceRequest}`, params, {
      headers: headerSet
    });
    msg = "Get User Balance Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};
exports.userLogin = async (req, res) => {
  const { UserName, Passwd, SponsorFormNo } = req.body;

  const data = {
    UserName,
    Passwd,
    SponsorFormNo,
  };

  try {
    const response = await axios.post(`${api.utilityloginwebapiURL}`, data, {
      headers: headerSet
    });

    msg = "Login Success!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//------------------------Recharge API----------------------------//
const header= {
  UserName: "Skytrial",
  Password: "trail@441",
  SponsorFormNo: "1000053099",
}

exports.getService = async (req, res) => {
  try {
   
    const { data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getServiceRechegeURL}`, params, {
      headers:headerSet
    });
    msg = "Get Service Provider List!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getRechargePlan = async (req, res) => {
  try {
    
    const {data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getRechargePlanULR}`, params, {
      headers: headerSet
    });
    msg = "Get Recharge Plan Successfully";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getRechargePlanDetails = async (req, res) => {
  try {
    const { data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getPlanDetailURL}`, params, {
      headers:headerSet
    });
    msg = "Get Recharge plan Details Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.rechageRequest = async (req, res) => {
  try {
    const { data } = req.body;
    let params = { header: header, data: data };

    const userIP = requestIp.getClientIp(req);
    const userBookingIpDetails={userIp:userIP,
      bookingType:"Recharge"
    };
    await userIPDetail.create(userBookingIpDetails);

    const response = await axios.post(`${api.rechageRequestURL}`, params, {
      headers:headerSet
    });
    msg = "Recharge Successfully done!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};
//-------------------------Recharge API -----------END--------




//----------------------------Billing Api --------------Start-----


//get bill service

exports.getBillService = async (req, res) => {
  try {
    const  data = req.body;
    let params = { header: header, data: data };


    const response = await axios.post(`${api.getBillServiceURL}`, params, {
      headers:headerSet
    });
    msg = "Get Bill Agency List!";


    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};


//GetBillServiceParamemter

exports.getBillServiceParamemter = async (req, res) =>{

  try {
    const  data = req.body;
    let params = { header: header, data: data };


    const response = await axios.post(`${api.getBillServiceParamemterURL}`, params, {
      headers:headerSet
    });
    msg = "Get Bill Service Details!";


    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }

}


//saveBillPayment

exports.saveBillPayment=async (req, res) =>{
  try {
    const  data = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.saveBillPaymentURL}`, params, {
      headers:headerSet
    });
    msg = "Save Bill Payment!";


    actionCompleteResponse(res, response.data, msg);
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
}


//----------------------------Billing Api --------------End-----