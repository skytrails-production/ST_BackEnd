const axios = require("axios");
const { tokenGenerator, api } = require("../common/const");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const { userIPDetail } = require("../model/city.model");
const requestIp = require('request-ip');

exports.getOTP = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getOTPRequest}`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Send OTP Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getVerifyOTP = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getVerifyOTPRequest}`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "OTP verify Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getPromoCode = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getPromoCodeRequest}`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Get Promo Code Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
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
        headers: {
          "Content-Type": "application/json",
          token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
        },
      }
    );
    msg = "Get Promo Services Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getUserBalance = async (req, res) => {
  try {
    const { header, data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getUserBalanceRequest}`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Get User Balance Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
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
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });

    msg = "Transaction Success!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
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
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Transaction Success!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getRechargePlan = async (req, res) => {
  try {
    
    const {data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getRechargePlanULR}`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Transaction Success!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getRechargePlanDetails = async (req, res) => {
  try {
    const { data } = req.body;
    let params = { header: header, data: data };
    const response = await axios.post(`${api.getPlanDetailURL}`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Transaction Success!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
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
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Transaction Success!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};
//-------------------------Recharge API -----------END--------




//----------------------------Billing Api --------------Start-----


exports.getBillService = async (req, res) => {
  try {
    const { data } = req.body;
    let params = { header: header, data: data };
    console.log(data,"data");


    const response = await axios.post(`https://utilitywebapi.bisplindia.in/api/Bill/GetBillService`, params, {
      headers: {
        "Content-Type": "application/json",
        token: "QVBJQWNjZXNzQVBJQDEyMw==", // Replace with your actual token
      },
    });
    msg = "Transaction Success!";

    // console.log(response,"response");

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};




//----------------------------Billing Api --------------End-----