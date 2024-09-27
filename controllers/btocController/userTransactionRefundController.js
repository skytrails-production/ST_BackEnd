const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const axios = require("axios");
const merchant_id = process.env.CC_AVENUE_MERCHANT_ID;
const salt_key = process.env.PHONE_PAY_SALT_KEY;
const paymentStatus = require("../../enums/paymentStatus");
const { URLSearchParams } = require("url");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const client_secret = process.env.CASHFREE_API_KEY;
const clientId = process.env.CASHFREE_API_ID;
// const Cashfree=require("cashfree-pg");

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
const {
  refundModelServices,
} = require("../../services/btocServices/userRefundServices");
const {
  createUsertransactionRefund,
  findUsertransactionRefund,
  getUsertransactionRefund,
  deleteUsertransactionRefund,
  userUsertransactionListRefund,
  updateUsertransactionRefund,
  paginateUsertransactionRefund,
  countTotalUsertransactionRefund,
} = refundModelServices;
var config = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV,
  enable_iframe: process.env.EASEBUZZ_IFRAME,
};
const currentDate = new Date();
const newDate = new Date(currentDate.getTime() + 16 * 60000); // Adding 16 minutes in milliseconds (1 minute = 60,000 milliseconds)
const CCAvenue = require("node-ccavenue");

// Initialize CCAvenue with your credentials
// const ccav = new CCAvenue({
//   merchant_id: 'your_merchant_id',
//   working_key: 'your_working_key',
//   access_code: 'your_access_code',
//   redirect_url: 'https://yourwebsite.com/payment/callback', // Your callback URL
// });
const nodeCCAvenue = require("node-ccavenue");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: process.env.CC_AVENUE_MERCHANT_ID,
  working_key:
    process.env.CC_AVENUE_ACCESSCODE1 || process.env.CC_AVENUE_ACCESSCODE,
  access_code:
    process.env.CC_AVENUE_WORKING_KEY1 || process.env.CC_AVENUE_WORKING_KEY,
});
exports.refundUserTransaction = async (req, res, next) => {
  try {
    const {customerEmail,customerPhone,customerAddress,country,customerName,orderId,amount,refund_id,refund_note,refund_speed,redirect_url,cancel_url} = req.body;
      const url = "https://secure.ccavenue.com/transaction/initTrans";

      // Prepare request data
      const requestData = {
        merchant_id: merchant_id,
        order_id: orderId,
        currency: "INR", // Change currency based on your requirement
        amount: amount,
        redirect_url: redirect_url,
        cancel_url: cancel_url,
        integration_type:"iframe_normal",
        language: "EN", // Change language as needed
        billing_name: customerName, // Change customer name as needed
        billing_address: customerAddress, // Change customer address as needed
        billing_country: country, // Change country as needed
        billing_tel: customerPhone, // Change customer phone as needed
        billing_email: customerEmail, // Change customer email as needed
      };

      // Generate checksum
      const checksum = ccav.encrypt(requestData,process.env.CC_AVENUE_WORKING_KEY);
      requestData.checksum =checksum;
      const encryptedData = ccav.encrypt(requestData);
      const decryptedData = ccav.decrypt(encryptedData);
      try {
        // Send request to CCAvenue
        const response = await axios.post(url, requestData);

        // Redirect user to CCAvenue payment page
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
    //       console.ror) {
    //       // Handle error
    //     }
    //   }
  } catch (error) {
    return next(error);
  }
};

// This function sends the payment request to CCAvenue
// async function initiatePayment(amount, orderId, callbackUrl) {
//   const url = "https://secure.ccavenue.com/transaction/initTrans";

//   // Prepare request data
//   const requestData = {
//     merchant_id: MERCHANT_ID,
//     order_id: orderId,
//     currency: "INR", // Change currency based on your requirement
//     amount: amount,
//     redirect_url: callbackUrl,
//     cancel_url: callbackUrl,
//     language: "EN", // Change language as needed
//     billing_name: "Customer Name", // Change customer name as needed
//     billing_address: "Customer Address", // Change customer address as needed
//     billing_country: "India", // Change country as needed
//     billing_tel: "Customer Phone", // Change customer phone as needed
//     billing_email: "customer@example.com", // Change customer email as needed
//   };

//   // Generate checksum
//   requestData.checksum = ccav.encrypt(requestData);
//   const encryptedData = ccav.encrypt(requestData);
//   console.log(encryptedData);
//   const decryptedData = ccav.decrypt(encryptedData);
//   console.log(decryptedData);
//   try {
//     // Send request to CCAvenue
//     const response = await axios.post(url, requestData);

//     // Redirect user to CCAvenue payment page
//     console.log("Redirecting to CCAvenue payment page:", response.data);
//   } catch (error) {
//     console.error("Error initiating payment:", error.message);
//     // Handle error
//   }
// }

// // Example usage
// const amount = 100; // Amount in INR
// const orderId = "ORDER123"; // Unique order ID
// const callbackUrl = "https://yourwebsite.com/payment/callback"; // Your callback URL
// initiatePayment(amount, orderId, callbackUrl);
