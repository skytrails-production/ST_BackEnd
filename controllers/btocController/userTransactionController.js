const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const axios = require("axios");
const merchant_id = process.env.PHONE_PAY_MERCHANT_ID;
const salt_key = process.env.PHONE_PAY_SALT_KEY;
const paymentStatus=require("../../enums/paymentStatus")
const { URLSearchParams } = require("url");

const Razorpay = require("razorpay");
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
    console.log("Razorpay Order:", razorpayOrder);

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
    console.log("Entire Response: ", JSON.stringify(response, null, 2));

    let paymentLink = response.short_url;
    if (!paymentLink) {
      console.error("Payment link not found in the response");
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.InternalError,
        responseMessage: "Payment link not found",
        result: paymentLink,
      });
    }

    console.log("paymentLink==============", paymentLink);

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
    console.log("result===========", result);
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
    console.log("data=====================", options);

    try {
      const { data } = await axios.request(options);
      console.log(data);
      res
        .status(statusCode.OK)
        .send({
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
      furl
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
      const result={
        access:data.data,
        key: process.env.EASEBUZZ_KEY,
        env:process.env.EASEBUZZ_ENV
      }
      // data.config.key=config.key;
      // const env = config.env;
      // const redirectURL = `${env}/v2/pay/${data.data}`;
      const object = {
        userId: isUserExist._id,
        amount: amount,
        paymentId: txnId,
        bookingType: bookingType,
      };
      const createData = await createUsertransaction(object);
      res
        .status(statusCode.OK)
        .send({
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
    const {} = req.body;
    const hashComponents = [
      config.key,
      "T" + Date.now(),
      "T1703663988309",
      200.4,
      // 100.8,
      // 'charuyadav594@gmail.com',
      // '8115199076'
    ];
    const hashString = hashComponents.join("|");
    const inputString = `${hashString}|${config.salt}`;
    const sha512Hash = generateSHA512Hash(inputString);
    const options = {
      method: "POST",
      url: "https://dashboard.easebuzz.in/transaction/v2/refund",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        key: config.key,
        merchant_refund_id: "T" + Date.now(),
        easebuzz_id: "T1703663988309",
        refund_amount: 1,
        hash: sha512Hash,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log("data========", data);
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
    console.log("checksum==",checksum)
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
      console.log("data==", data);
      const object = {
        userId: isUserExist._id,
        amount: amount,
        paymentId: data.data.merchantTransactionId,
        bookingType: bookingType,
      };
      const createData = await createUsertransaction(object);
      console.log("createData========",createData)
      return res
        .status(statusCode.OK)
        .send({
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

exports.checkPaymentStatus=async(req,res,next)=>{
  try {
    const {merchanttransactionId}=req.query
    // SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
    const string ="/pg/v1/status/"+process.env.PHONE_PAY_MERCHANT_ID+"/"+merchanttransactionId+process.env.PHONE_PAY_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + process.env.PHONE_PAY_INDEX;
    const options = {
      method: 'get',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${process.env.PHONE_PAY_MERCHANT_ID}/${merchanttransactionId}`,
      headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': process.env.PHONE_PAY_MERCHANT_ID,
            },
    };
    axios
      .request(options)
          .then(function (response) {
          console.log(response.data);
          return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.OK,
          result: checksum,
        });
      })
      .catch(function (error) {
        console.error(error);
      })
  } catch (error) {
    console.log("error while trying to status",error);
    return next(error);
  }
}

//success response********************************************************
exports.paymentSuccess = async (req, res, next) => {
  try {
    // console.log("successVerifyApi==",successVerifyApi)
    const {merchantTransactionId,transactionId}=req.query;
    const isTransactionExist=await findUsertransaction({paymentId:merchantTransactionId});
     console.log("isTransactionExist==",isTransactionExist)
      if(isTransactionExist){
      console.log("isTransactionExist=========",isTransactionExist);
      const result=await updateUsertransaction({_id:isTransactionExist._id},{transactionStatus:paymentStatus.SUCCESS})

      return res
        .status(statusCode.OK)
        .send({
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
exports.paymentFailure=async(req,res,next)=>{
  try {
    const {merchantTransactionId,transactionId}=req.query;
    const isTransactionExist=await findUsertransaction({paymentId:merchantTransactionId});
     console.log("successVerifyApi==",merchantTransactionId)
     console.log("isTransactionExist==",isTransactionExist)
    if(isTransactionExist){
      const result=await updateUsertransaction({_id:isTransactionExist._id},{transactionStatus:paymentStatus.FAILED})
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.PAYMENT_FAILURE,
        });
    }
  } catch (error) {
    console.log("error on failure operation",error);
    return next(error)
  }
}


//PHone pay payemnet status ****************************************************
//success response********************************************************
exports.paymentSuccessPhonePe = async (req, res, next) => {
  try {
    // console.log("successVerifyApi==",successVerifyApi)
    const {merchantTransactionId,transactionId}=req.query;
    const isTransactionExist=await findUsertransaction({paymentId:merchantTransactionId});
     console.log("isTransactionExist==",isTransactionExist)
      if(isTransactionExist){
      console.log("isTransactionExist=========",isTransactionExist);
      const result=await updateUsertransaction({_id:isTransactionExist._id},{transactionStatus:paymentStatus.SUCCESS})

      return res
        .status(statusCode.OK)
        .send({
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
exports.paymentFailurePhonePe =async(req,res,next)=>{
  try {
    const {merchantTransactionId,transactionId}=req.query;
    const isTransactionExist=await findUsertransaction({paymentId:merchantTransactionId});
     console.log("successVerifyApi==",merchantTransactionId)
     console.log("isTransactionExist==",isTransactionExist)
    if(isTransactionExist){
      const result=await updateUsertransaction({_id:isTransactionExist._id},{transactionStatus:paymentStatus.FAILED})
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.PAYMENT_FAILURE,
        });
    }
  } catch (error) {
    console.log("error on failure operation",error);
    return next(error)
  }
}
//hash geneerate function *************************************************
function generateSHA512Hash(input) {
  const hash = crypto.createHash("sha512");
  hash.update(input);
  return hash.digest("hex");
}

//  function makePayment(req, res) {
//   function checkReverseHash(response) {
//     var hashstring = config.salt + "|" + response.status + "|" + response.udf10 + "|" + response.udf9 + "|" + response.udf8 + "|" + response.udf7 +
//       "|" + response.udf6 + "|" + response.udf5 + "|" + response.udf4 + "|" + response.udf3 + "|" + response.udf2 + "|" + response.udf1 + "|" +
//       response.email + "|" + response.firstname + "|" + response.productinfo + "|" + response.amount + "|" + response.txnid + "|" + response.key
//     hash_key = sha512.sha512(hashstring);
//     if (hash_key == req.body.hash)
//       return true;
//     else
//       return false;
//   }
//   if (checkReverseHash(req.body)) {
//     res.send(req.body);
//   }
//   res.send('false, check the hash value ');
// };
