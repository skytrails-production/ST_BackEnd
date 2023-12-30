const status = require("../../enums/status");
const Razorpay = require("razorpay");
const schemas = require("../../utilities/schema.utilities");
const commonFuction = require("../../utilities/commonFunctions");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");

//razor pay credentials*******************************
var instance = new Razorpay({
  key_id: "rzp_test_uONAICwyPN5etQ",
  key_secret: "QnsQtx8UwN6OMd09pxSOoLru",
});
//**************************************SERVICES***************************************/
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
  countTotalUsertransaction,
} = transactionModelServices;

// exports.createOrder = async (req, res, next) => {
//   const orderData = {
//     amount: 50000, // amount in paise (e.g., 50000 for 500 INR)
//     currency: 'INR',
//     receipt: 'order_receipt',
//     payment_capture: 1, // Auto capture payment
//   };

//   try {
//     const response = await instance.orders.create(orderData);
//     console.log("response=>>>>>>>>>>>>>>>", response);

//     // Log the entire response to inspect its structure
//     console.log("Entire Response: ", JSON.stringify(response, null, 2));

//     // Check if there's a payment link in the response (adjust based on inspection)
//     let paymentLink = response.short_url;

//     if (!paymentLink) {
//       // If still not found, you may need to adjust this based on the actual response structure
//       console.error("Payment link not found in the response");
//       res.status(500).json({ error: "Payment link not found" });
//       return;
//     }

//     console.log("paymentLink==============", paymentLink);
//     res.json({ paymentLink });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createOrder = async (req, res, next) => {
//   const orderData = {
//     amount: 500,
//     currency: "INR",
//     accept_partial: true,
//     first_min_partial_amount: 100,
//     description: "For XYZ purpose",
//     customer: {
//       name: "Gaurav Kumar",
//       email: "gaurav.kumar@example.com",
//       contact: "+919000090000",
//     },
//     notify: {
//       sms: true,
//       email: true,
//     },
//     reminder_enable: true,
//     notes: {
//       policy_name: "Jeevan Bima",
//     }, // Auto capture payment
//   };

//   try {
//     const response = instance.paymentLink.create(orderData);
//     console.log("response=>>>>>>>>>>>>>>>", response);

//     // Log the entire response to inspect its structure
//     console.log("Entire Response: ", JSON.stringify(response, null, 2));

//     // Check if there's a payment link in the response (adjust based on inspection)
//     let paymentLink = response.short_url;
//     if (!paymentLink) {
//       // If still not found, you may need to adjust this based on the actual response structure
//       console.error("Payment link not found in the response");
//       res.status(500).json({ error: "Payment link not found" });
//       return;
//     }

//     // const paymentLink = `https://example.com/payment-page?orderId=${orderId}`;
//     // console.log("paymentLink==============", paymentLink);
//     // res.json({ paymentLink });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: error.message });
//   }
// };



exports.createOrder = async (req, res, next) => {
  const orderData = {
    amount: 500,
    currency: "INR",
    accept_partial: true,
    first_min_partial_amount: 100,
    description: "For XYZ purpose",
    customer: {
      name: "Gaurav Kumar",
      email: "gaurav.kumar@example.com",
      contact: "+919000090000",
    },
    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: true,
    notes: {
      policy_name: "Jeevan Bima",
    },
  };

  try {
    const response = await instance.paymentLink.create(orderData); // Use 'await' here
    console.log("response=>>>>>>>>>>>>>>>", response);

    // Log the entire response to inspect its structure
    console.log("Entire Response: ", JSON.stringify(response, null, 2));

    // Check if there's a payment link in the response (adjust based on inspection)
    let paymentLink = response.short_url;
    if (!paymentLink) {
      // If still not found, you may need to adjust this based on the actual response structure
      console.error("Payment link not found in the response");
      res.status(500).json({ error: "Payment link not found" });
      return;
    }

    // Provide the payment link in the response
    console.log("paymentLink==============", paymentLink);
    res.json({ paymentLink });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

const verifySignature = async (order_id, payment_id, signature) => {
  generated_signature = hmac_sha256(
    order_id + "|" + razorpay_payment_id,
    secret
  );

  if (generated_signature == razorpay_signature) {
    console.log(" payment is successful");
  }
};


//update b2b balance using razorpay
exports.makePayment = async (req, res) => {

  try {
    const { _id, amount, paymentId } = req.body; // Destructure userId and additionalBalance from the request body

    // Check if userId is valid in your user table
    console.log(req.body);


    let instance = new Razorpay({
      key_id: process.env.Razorpay_KEY_ID,
      key_secret: process.env.Razorpay_KEY_SECRET,
    });

    var options = {
      amount: Number(req.body.amount) * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    console.log(req.body.amount);
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.error(err);
        return res.status(500).json({ code: 500, message: "Server Error" });
      }

      console.log(order);
      // return res.send({
      //   code: 200,
      //   message: "order Created Successfully",
      //   data: order,
      // });
    });

    const AgentWalletData={
      userId:_id,
      orderId:paymentId,
      amount:amount
    };
    await agentWallets.create(AgentWalletData);
    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "Invalid userId");
    }

    // Update the user's balance by adding the additional balance
    user.balance += Number(amount);

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user object
    actionCompleteResponse(res, updatedUser, "User balance updated successfully");

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }

};

exports.payVerify = (req, res) => {
  try {
    console.log(req.body);
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', process.env.Razorpay_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);

    if (expectedSignature === req.body.razorpay_signature) {
      console.log("Payment Success");
    } else {
      console.log("Payment Fail");
    }

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error.message);
  }
}
