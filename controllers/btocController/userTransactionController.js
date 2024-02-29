const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const axios = require("axios");
const merchant_id = process.env.PHONE_PAY_MERCHANT_ID;
const salt_key = process.env.PHONE_PAY_SALT_KEY;
const paymentStatus = require("../../enums/paymentStatus");
const { URLSearchParams } = require("url");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const client_secret = process.env.CASHFREE_API_KEY;
const clientId = process.env.CASHFREE_API_ID;
// const Cashfree=require("cashfree-pg"); 
// const Cashfree = require('cashfree-sdk');
// Cashfree.XClientId = process.env.CASHFREE_API_ID;
// Cashfree.XClientSecret = process.env.CASHFREE_API_KEY;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
//razor pay instance******************************************
let instance = new Razorpay({
  key_id: process.env.Razorpay_KEY_ID,
  key_secret: process.env.Razorpay_KEY_SECRET,
});

/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const sendSMSUtils = require("../../utilities/sendSms");
const { responseMessages } = require("../../common/const");
const {
  transactionModelServices,
} = require("../../services/btocServices/transactionServices");
const {
  createUsertransaction,
  findUsertransaction,
  getUsertransaction,
  deleteUsertransaction,
  userUsertransactionList,
  updateUsertransaction,
  paginateUsertransaction,
  countTotalUsertransaction,
} = transactionModelServices;
const {
  userBookingFailedServices,
} = require("../../services/btocServices/userBookingFailedServices");
const { stat } = require("fs");
const {
  createUserBookingFailed,
  findUserBookingFailed,
  getUserBookingFailed,
  deleteUserBookingFailed,
  countTotalUserBookingFailed,
} = userBookingFailedServices;

var config = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV,
  enable_iframe: process.env.EASEBUZZ_IFRAME,
};
const currentDate = new Date();
const newDate = new Date(currentDate.getTime() + 16 * 60000); // Adding 16 minutes in milliseconds (1 minute = 60,000 milliseconds)

// console.log(newDate.toISOString());

exports.transaction = async (req, res, next) => {
  try {
    const userId = req.userId;
    const data = req.body;
    const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
    if (isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
  } catch (error) {
    console.log("error: " + error);
    return next(error);
  }
};

exports.makePayment = async (req, res, next) => {
  try {
    const { bookingType, amount } = req.body;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    var options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
      partial_payment: true,
    };
    const razorpayOrder = await instance.orders.create(options);

    // Log the order details for debugging
    // console.log("Razorpay Order:", razorpayOrder);

    //   const transactionData={
    //     userId:isUserExist._id,
    //     orderId:razorpayOrder.id,
    //     amount:amount,
    //     bookingType:bookingType
    //   };
    //  const result= await createUsertransaction(transactionData);

    res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.PAYMENT_SUCCESS,
      result: razorpayOrder,
    });
  } catch (error) {
    console.log("error in transaction===========", error);
    return next(error);
  }
};

exports.payVerify = async (req, res, next) => {
  try {
    const { orderID, paymentId, signature } = req.body;
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    var expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    const isAuth = expectedSignature === signature;
    if (isAuth) {
      // await instance.paymentLink.create({orderID,paymentId,signature});
      const transactionData = {
        userId: isUserExist._id,
        orderId: razorpayOrder.id,
        amount: amount,
        paymentId: paymentId,
        signature: signature,
        bookingType: bookingType,
      };
      const result = await createUsertransaction(transactionData);
      res.redirect(
        `http://localhost:8000/paymentsuccess?reference=${paymentId}`
      );
    }
  } catch (error) {
    console.log("Error in payment verification=>>", error.message);
    return next(error);
  }
};

exports.paymentUrl = async (req, res, next) => {
  try {
    const { amount, name, email, contact, policyName } = req.body;

    const orderData = {
      amount: amount,
      currency: "INR",
      accept_partial: true,
      first_min_partial_amount: 100,
      description: "For payment purpose",
      customer: {
        name: name,
        email: email,
        contact: contact,
      },
      notify: {
        sms: true,
        email: true,
        whatsapp: true,
      },
      reminder_enable: true,
      notes: {
        policy_name: policyName || "payment for bookings",
      },
    };

    const response = await instance.paymentLink.create(orderData);
    // console.log("Entire Response: ", JSON.stringify(response, null, 2));

    let paymentLink = response.short_url;
    if (!paymentLink) {
      console.error("Payment link not found in the response");
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.InternalError,
        responseMessage: "Payment link not found",
        result: paymentLink,
      });
    }

    // console.log("paymentLink==============", paymentLink);

    // In a real-world scenario, you would save the payment link or associated order details in your database.

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.PAYMENT_SUCCESS,
      result: paymentLink,
    });
  } catch (error) {
    console.error("Error creating url:", error);
    if (error.response && error.response.data) {
      console.error("Razorpay Error Details:", error.response.data);
    }
    return next(error);
  }
};

exports.bookingFailedUser = async (req, res, next) => {
  try {
    const { paymentId, amount, bookingType } = req.body;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const obj = {
      paymentId: paymentId,
      amount: amount,
      bookingType: bookingType,
      userId: isUserExist._id,
      phoneNumber: isUserExist.phone.mobile_number,
    };
    const result = await createUserBookingFailed(obj);
    // console.log("result===========", result);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.error("Error creating url:", error);
    // if (error.response && error.response.data) {
    //   console.error("Razorpay Error Details:", error.response.data);
    // }
    return next(error);
  }
};

// Function to create a Razorpay order
const createRazorpayOrder = (orderOptions) => {
  return new Promise((resolve, reject) => {
    instance.orders.create(orderOptions, (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        reject(err);
      } else {
        resolve(order);
      }
    });
  });
};

//phone pay paymnet********************************
// const data ={
//   name: 'Waleed',
//   amount: 1,
//   number: '7498608775',
//   MUID: "MUID" + Date.now(),
//   transactionId: 'T' + Date.now(),
// }
// exports.makePhonePayPayment = (req, res, next) => {
//   try {
//     const merchantTransactionId = req.body.transactionId;
//     const data = {
//       merchantId: merchant_id,
//       merchantTransactionId: "T" + Date.now(),
//       merchantUserId: "MUID" + Date.now(),
//       name: "Charu",
//       amount: 200 * 100,
//       redirectUrl: `http://localhost:8000/${"T" + Date.now()}`,
//       redirectMode: "POST",
//       mobileNumber: "8115199076",
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };
//     console.log("data", data);
//     const payload = JSON.stringify(data);
//  const payloadMain = Buffer.from(payload).toString('base64');
//  const keyIndex = 2;
//  const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
//  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//  const checksum = sha256 + '###' + keyIndex;
// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
//  const options = {
//  method: 'POST',
//  url: prod_URL,
//  headers: {
//  accept: 'application/json',
//  'Content-Type': 'application/json',
//  'X-VERIFY': checksum
//  },
//  data: {
//  request: payloadMain
//  }
//  };
// axios.request(options).then(function (response) {
//  return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
//  })
//  .catch(function (error) {
//  console.error(error);
//  });
// } catch (error) {
//  res.status(500).send({
//  message: error.message,
//  success: false
//  })
//  }
// }
// exports.checkStatus = async(req, res) => {
//  const merchantTransactionId = req.params['txnId']
//  const merchantId = process.env.MERCHANT_ID
//  const keyIndex = 2;
//  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
//  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//  const checksum = sha256 + "###" + keyIndex;
// const options = {
//  method: 'GET',
//  url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//  headers: {
//  accept: 'application/json',
//  'Content-Type': 'application/json',
//  'X-VERIFY': checksum,
//  'X-MERCHANT-ID': `${merchantId}`
//  }
//  };
// // CHECK PAYMENT STATUS
//  axios.request(options).then(async(response) => {
//  if (response.data.success === true) {
//  console.log(response.data)
//  return res.status(200).send({success: true, message:"Payment Success"});
//  } else {
//  return res.status(400).send({success: false, message:"Payment Failure"});
//  }
//  })
//  .catch((err) => {
//  console.error(err);
//  res.status(500).send({msg: err.message});
//  });
// };

exports.makePhonePayPayment1 = async (req, res, next) => {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set("key", "2PBP7IABZ2");
    encodedParams.set("txnid", "tt");
    encodedParams.set("amount", 200);
    encodedParams.set("productinfo", "travel");
    encodedParams.set("firstname", "charu");
    encodedParams.set("phone", "8115199076");
    encodedParams.set("email", "charuyadav594@gmail.com");
    encodedParams.set("surl", "https://www.google.co.in");
    encodedParams.set("furl", "https://www.google.co.in");
    const hashComponents = [
      "2PBP7IABZ2",
      "tt",
      "200",
      "travel",
      "charu",
      "charuyadav594@gmail.com",
    ];
    const hashString = hashComponents.join("|");
    const inputString = `${hashString}|||||||||||DAH88E3UWQ`;
    const sha512Hash = generateSHA512Hash(inputString);
    encodedParams.set("hash", sha512Hash);
    const options = {
      method: "POST",
      url: "https://testpay.easebuzz.in/payment/initiateLink",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      data: encodedParams,
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
      res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: data,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
    }
  } catch (error) {
    console.log("error ", error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

exports.easebussPayment = async (req, res, next) => {
  try {
    const {
      firstname,
      phone,
      email,
      amount,
      productinfo,
      bookingType,
      surl,
      furl,
    } = req.body;

    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const txnId = "T" + Date.now();
    const hashComponents = [
      config.key,
      txnId,
      amount,
      productinfo,
      firstname,
      email,
    ];
    const hashString = hashComponents.join("|");
    const inputString = `${hashString}|||||||||||${config.salt}`;
    const sha512Hash = generateSHA512Hash(inputString);
    const encodedParams = new URLSearchParams();
    encodedParams.set("key", config.key);
    encodedParams.set("txnid", txnId);
    encodedParams.set("amount", amount);
    encodedParams.set("productinfo", productinfo);
    encodedParams.set("firstname", firstname);
    encodedParams.set("phone", phone);
    encodedParams.set("email", email);
    encodedParams.set("surl", `${surl}${txnId}`);
    encodedParams.set("furl", `${furl}${txnId}`);
    encodedParams.set("hash", sha512Hash);
    const options = {
      method: "POST",
      url: "https://pay.easebuzz.in/payment/initiateLink",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      data: encodedParams,
    };
    try {
      const { data } = await axios.request(options);
      console.log(data);
      const result = {
        access: data.data,
        key: process.env.EASEBUZZ_KEY,
        env: process.env.EASEBUZZ_ENV,
      };
      const env = config.env;
      // https://pay.easebuzz.in/
      const redirectURL = `${env}/v2/pay/${data.data}`;
      // console.log("redirectURL=========", redirectURL);
      const object = {
        userId: isUserExist._id,
        amount: amount,
        paymentId: txnId,
        bookingType: bookingType,
        easeBuzzPayId:"NA"
      };
      const createData = await createUsertransaction(object);
      res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: result,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
    }
  } catch (error) {
    console.log("error into easebuzz ", error);
    return next(error);
  }
};

//refund api*******************************************************
// function generateHash_refund() {
//   //"key|txnid|amount|refund_amount|email|phone";
//   var hashstring = config.key + "|" + 'T1703663988309' + "|" + 200.4 + "|" + data.refund_amount + "|" + data.merchant_email + "|" + data.phone + "|" + config.salt;
//   hash_key = sha512.sha512(hashstring);
//   return (hash_key);
// }
exports.refundApi = async (req, res, next) => {
  try {
    const { refund_amount, txnId } = req.body;
    // console.log(refund_amount, txnId, "body data");
    const merchantId = "M" + Date.now();
    const hashComponents = [config.key, merchantId, txnId, refund_amount];
    const hashString = hashComponents.join("|");
    const inputString = `${hashString}|${config.salt}`;
    const sha512Hash = generateSHA512Hash(inputString);
    // console.log(sha512Hash, "hash");
    const options = {
      method: "POST",
      url: "https://dashboard.easebuzz.in/transaction/v2/refund",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        key: config.key,
        merchant_refund_id: merchantId,
        easebuzz_id: txnId,
        refund_amount: refund_amount,
        hash: sha512Hash,
      },
    };

    try {
      const { data } = await axios.request(options);
      return res.send({ data: data });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log("error while we refund ", error.message);
    return next(error);
  }
};

//handle transaction details into db ****************************************
exports.makePhonePayPayment = async (req, res, next) => {
  try {
    const { firstname, phone, amount, redirectUrl, bookingType } = req.body;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const merchantTransactionId = "T" + Date.now();
    const data = {
      merchantId: process.env.PHONE_PAY_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "M" + Date.now() + 4,
      name: firstname,
      amount: amount * 100,
      redirectUrl: `http://localhost:8000//skyTrails/api/transaction/paymentSuccess?merchantTransactionId=${merchantTransactionId}`,
      // redirectUrl: `${redirectUrl}/${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `http://localhost:8000/skyTrails/api/transaction/paymentFailure?merchantTransactionId=${merchantTransactionId}`,
      mobileNumber: phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const string = payloadMain + "/pg/v1/pay" + process.env.PHONE_PAY_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + process.env.PHONE_PAY_INDEX;
    // console.log("checksum==", checksum);
    const options = {
      method: "post",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };
    try {
      const { data } = await axios.request(options);
      // console.log("data==", data);
      const object = {
        userId: isUserExist._id,
        amount: amount,
        paymentId: data.data.merchantTransactionId,
        bookingType: bookingType,
      };
      const createData = await createUsertransaction(object);
      // console.log("createData========", createData);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: data.data.instrumentResponse.redirectInfo.url,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
    }
  } catch (error) {
    console.log("error while make payment", error);
  }
};

exports.checkPaymentStatus = async (req, res, next) => {
  try {
    const { merchanttransactionId } = req.query;
    // SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
    const string =
      "/pg/v1/status/" +
      process.env.PHONE_PAY_MERCHANT_ID +
      "/" +
      merchanttransactionId +
      process.env.PHONE_PAY_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + process.env.PHONE_PAY_INDEX;
    const options = {
      method: "get",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${process.env.PHONE_PAY_MERCHANT_ID}/${merchanttransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.PHONE_PAY_MERCHANT_ID,
      },
    };
    axios.request(options).then(function (response) {
        // console.log(response.data);
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.OK,
          result: checksum,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    console.log("error while trying to status", error);
    return next(error);
  }
};

//success response********************************************************
exports.paymentSuccess = async (req, res, next) => {
  try {
    // console.log("successVerifyApi==",successVerifyApi)
    const easypayId=req.body.easeBuzzPayId
    const { merchantTransactionId, transactionId } = req.query;
    const isTransactionExist = await findUsertransaction({
      paymentId: merchantTransactionId,
    });
    // console.log("isTransactionExist==", isTransactionExist);
    if (isTransactionExist) {
      // console.log("isTransactionExist=========", isTransactionExist);
      const result = await updateUsertransaction(
        { _id: isTransactionExist._id },
        { transactionStatus: paymentStatus.SUCCESS,
          easeBuzzPayId:easypayId||"" }
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_SUCCESS,
        result: result,
      });
    }
  } catch (error) {
    console.log("error ==========", error);
    return next(error);
  }
};

//success response********************************************************
exports.paymentFailure = async (req, res, next) => {
  try {
    const { merchantTransactionId, transactionId } = req.query;
    const isTransactionExist = await findUsertransaction({
      paymentId: merchantTransactionId,
    });
    console.log("successVerifyApi==", merchantTransactionId);
    console.log("isTransactionExist==", isTransactionExist);
    if (isTransactionExist) {
      const result = await updateUsertransaction(
        { _id: isTransactionExist._id },
        { transactionStatus: paymentStatus.FAILED }
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_FAILURE,
      });
    }
  } catch (error) {
    console.log("error on failure operation", error);
    return next(error);
  }
};

//PHone pay payemnet status ****************************************************
//success response********************************************************
exports.paymentSuccessPhonePe = async (req, res, next) => {
  try {
    // console.log("successVerifyApi==",successVerifyApi)
    const { merchantTransactionId, transactionId } = req.query;
    const isTransactionExist = await findUsertransaction({
      paymentId: merchantTransactionId,
    });
    // console.log("isTransactionExist==", isTransactionExist);
    if (isTransactionExist) {
      // console.log("isTransactionExist=========", isTransactionExist);
      const result = await updateUsertransaction(
        { _id: isTransactionExist._id },
        { transactionStatus: paymentStatus.SUCCESS }
      );

      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_SUCCESS,
      });
    }
  } catch (error) {
    console.log("error ==========", error);
    return next(error);
  }
};

//success response********************************************************
exports.paymentFailurePhonePe = async (req, res, next) => {
  try {
    const { merchantTransactionId, transactionId } = req.query;
    const isTransactionExist = await findUsertransaction({
      paymentId: merchantTransactionId,
    });
    // console.log("successVerifyApi==", merchantTransactionId);
    // console.log("isTransactionExist==", isTransactionExist);
    if (isTransactionExist) {
      const result = await updateUsertransaction(
        { _id: isTransactionExist._id },
        { transactionStatus: paymentStatus.FAILED }
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_FAILURE,
      });
    }
  } catch (error) {
    console.log("error on failure operation", error);
    return next(error);
  }
};
//hash geneerate function *************************************************
function generateSHA512Hash(input) {
  const hash = crypto.createHash("sha512");
  hash.update(input);
  return hash.digest("hex");
}

exports.makeCashfreePayment = async (req, res, next) => {
  try {
    const { firstname, phone, email,amount, redirectUrl, bookingType} = req.body;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const currentDate = new Date();
    const newDate = new Date(currentDate.getTime() + 16 * 60000); // Adding 4 minutes in milliseconds (1 minute = 60,000 milliseconds)
    const client_secret = process.env.CASHFREE_API_KEY;
    const clientId = process.env.CASHFREE_API_ID;
    const payUrl = process.env.CASHFREE_URL;
    const merchantTransactionId = "customer" + Date.now();
    const OrderId = "ORDIDTST" + Date.now();
    const object = {
      customer_details: {
        customer_id: merchantTransactionId,
        customer_email: "lcharu071@gmail.com",
        customer_phone: "8115199076",
        customer_name:'Charu Yadav',
        // customer_uid:uuid
      },
      order_id: OrderId,
      "order_meta": {
        "return_url": `https://www.cashfree.com/devstudio/preview/pg/mobile/android?order_id=${OrderId}`,
        "notify_url": "https://www.cashfree.com/devstudio/preview/pg/webhooks/77891295"
    },
      order_expiry_time: newDate,
      order_amount: 1,
      order_currency: "INR",
    };
    const options = {
      method: "post",
      url: `https://api.cashfree.com/pg/orders`,
      headers: {
        accept: "application/json",
        "x-api-version": "2023-08-01",
        "content-type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": client_secret,
      },
      data: object,
    };
    try {
      const {data} = await axios.request(options);
      console.log("data==>>>>>>>>>>>>>>>>>>>", data);
      const objectData = {
        userId: isUserExist._id,
        amount: object.order_amount,
        paymentId: data.order_id,
        orderId: data.cf_order_id,
        signature: data.customer_details.customer_id,
        bookingType: bookingType,
        // object.order_currency,
      };
      const createData = await createUsertransaction(objectData);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: data,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
      console.log("error===================", error.message);
    }
  } catch (error) {
    console.log("error while make payment", error);
    return next(error);
  }
};
exports.checkCashfreePaymentStatus = async (req, res, next) => {
  try {
    const clientSecret = process.env.CASHFREE_API_KEY;
    const clientId = process.env.CASHFREE_API_ID;
    const orderId = req.query.orderid;
    const options = {
      method: 'get',
      url: `https://api.cashfree.com/pg/orders/${orderId}`,
      headers: {
        accept: 'application/json',
        'x-api-version': '2023-08-01',
        'content-type': 'application/json',
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
      },
    };
    const { data } = await axios.request(options);
    const orderStatus = data.order_status; // Adjust accordingly based on the API response structure
    const isTransactionExist = await findUsertransaction({
      paymentId: orderId,
    });
    console.log("isTransactionExist=========",isTransactionExist);
    if (isTransactionExist){
      // Handle payment status as needed
      if (orderStatus === 'PAID') {
        const result = await updateUsertransaction(
        { _id: isTransactionExist._id },
        { transactionStatus: paymentStatus.SUCCESS }
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_SUCCESS,
        result:result
      });
      } 
      await updateUsertransaction(
        { _id: isTransactionExist._id },
        { transactionStatus: paymentStatus.FAILED }
      );

      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_FAILURE,
      });
    }
  } catch (error) {
    console.error('Error while trying to get status:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const option = {};
  } catch (error) {
    console.log("error while make payment", error);
    return next(error);
  }
};

exports.CCEVENUEPayment1 = async (req, res, next) => {
  try {
    const {
      firstname,
      phone,
      email,
      amount,
      productinfo,
      bookingType,
      surl,
      furl,
    } = req.body;

    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    // if (!isUserExist) {
    //   return res.status(statusCode.NotFound).send({
    //     statusCode: statusCode.NotFound,
    //     message: responseMessage.USERS_NOT_FOUND,
    //   });
    // }
    const txnId = "T" + Date.now();
    try {
      const redirectURL = `${env}/v2/pay/${data.data}`;
      // console.log("redirectURL=========", redirectURL);
      const object = {
        userId: isUserExist._id,
        amount: amount,
        paymentId: txnId,
        bookingType: bookingType,
      };
      const createData = await createUsertransaction(object);
      res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: result,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
    }
  } catch (error) {
    console.log("error into easebuzz ", error);
    return next(error);
  }
};

exports.cashfreeRefund=async(req,res,next)=>{
  try {
    const{orderId,amount,refund_id,refund_speed}=req.body;
    const refundId = "REFUNDTST" + Date.now();
    const requestData = {
      refund_amount: amount,
      refund_id: refundId,
      refund_speed: refund_speed
    };    
    const options = {
      method: "post",
      url: `https://api.cashfree.com/pg/orders/${orderId}/refunds`,
      headers:{
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-api-version': '2023-08-01',
        "x-client-id": clientId,
        "x-client-secret": client_secret,
      },
      data: requestData,
    };
    await axios.request(options).then(response => {
      console.log(response.data);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: response.data,
      });
    })
    .catch(error => {
      console.error("error.response==================",error.response);
      return res.status(statusCode.OK).send({
        statusCode: error.response.status,
        responseMessage: responseMessage.INVALD_REQUEST,
        result: error.response.data,
      });
    });
  } catch (error) {
    console.log("error while refund====>>>",error);
    return next(error);

  }
}
const nodeCCAvenue = require("node-ccavenue");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: process.env.CC_AVENUE_MERCHANT_ID,
  working_key:
    process.env.CC_AVENUE_ACCESSCODE1 || process.env.CC_AVENUE_ACCESSCODE,
  access_code:
    process.env.CC_AVENUE_WORKING_KEY1 || process.env.CC_AVENUE_WORKING_KEY,
});
exports.CCEVENUEPayment = async (req, res, next) => {
  try {
    const {customerEmail,bookingType,customerPhone,customerAddress,country,customerName,orderId,amount,refund_id,refund_note,refund_speed,redirect_url,cancel_url} = req.body;
      const url = "https://secure.ccavenue.com/transaction/initTrans";
      const txnId = "orderId" + Date.now();
      const data={
        working_key:process.env.CC_AVENUE_WORKING_KEY,
        access_code:process.env.CC_AVENUE_ACCESSCODE,
        request_type:JSON
      }
      const checksum = ccav.encrypt(data);
      // Prepare request data
      const requestData = {
        merchant_id: merchant_id,
        order_id: txnId,
        currency: "INR", // Change currency based on your requirement
        amount: '1',
        redirect_url: `http://localhost:8000//skyTrails/api/transaction/paymentSuccess?merchantTransactionId=${txnId}`,
        cancel_url: `http://localhost:8000//skyTrails/api/transaction/paymentFailure?merchantTransactionId=${txnId}`,
        language: "EN", // Change language as needed
        billing_name: customerName, // Change customer name as needed
        billing_address: customerAddress, // Change customer address as needed
        billing_country: country, // Change country as needed
        billing_tel: customerPhone, // Change customer phone as needed
        billing_email: customerEmail, // Change customer email as needed
      };
console.log("requestData",requestData);
      // Generate checksum
     
      console.log("checksum==============",checksum);
      const encryptedData = ccav.encrypt(requestData);
      console.log(encryptedData);
      const decryptedData = ccav.decrypt(encryptedData);
      console.log(decryptedData);
      try {
        // Send request to CCAvenue
        const response = await axios.post(url, checksum);

        // Redirect user to CCAvenue payment page
        console.log("Redirecting to CCAvenue payment page:", response.data);
      } catch (error) {
        console.error("Error initiating payment:", error.message);
        // Handle error
      }
    
    // Example function to initiate payment
    // async function initiatePayment(amount, orderId) {
    //     try {
    //       // Generate payment form
    //       const form = await ccav.getPaymentForm({
    //         order_id: orderId,
    //         amount: amount,
    //         currency: 'INR',
    //         language: 'EN',
    //         billing_name: 'Customer Name',
    //         billing_address: 'Customer Address',
    //         billing_country: 'India',
    //         billing_tel: 'Customer Phone',
    //         billing_email: 'customer@example.com',
    //         redirect_url: 'https://yourwebsite.com/payment/redirect', // Redirect URL after payment
    //         cancel_url: 'https://yourwebsite.com/payment/cancel', // Cancel URL
    //       });

    //       // The 'form' variable now contains the HTML form to be rendered in your view
    //       console.log(form);
    //     } catch (error) {
    //       console.error('Error initiating payment:', error.message);
    //       // Handle error
    //     }
    //   }
  } catch (error) {
    console.log("error while trying to refund amount==", error);
    return next(error);
  }
};


