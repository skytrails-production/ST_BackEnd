const twilio = require("twilio");
const axios = require("axios");
const querystring = require("querystring");
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const YOUR_TWILIO_PHONE_NUMBER = process.env.YOUR_TWILIO_PHONE_NUMBER;
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const key = process.env.SMSAPIKEY;
const senderid = process.env.SMSSENDERID;
const route = process.env.ROUTE;
const templateid = process.env.OTP_TEMLATEID;
const templateid1 = process.env.FLIGHT_TEMLATEID;
const templateid2 = process.env.HOTEL_TEMLATEID;
const templateid3 = process.env.BUS_TEMLATEID;
const subAdmintemplateid = process.env.SUBADMINTEMPLATEId;
const agentTempId = process.env.AGENTTEMPLATEID;
const visaTempId = process.env.VISATEMPLATEID;
const eventTempId = process.env.EVENTID;
const packageTempId = process.env.PACKAGETEMPID;
const PEFAID = process.env.PEFAID;
const EVENTTEMPID=process.env.EVENT_UPDATE_TEMPLATEID
const baseURL = "https://localhost:8000";

module.exports = {
  sendSMSForFlightBookingConfirmation: async (data) => {
    const recipientPhoneNumber = `${data.passengerDetails[0].phone.country_code} ${data.passengerDetails[0].phone.mobile_number}`; // The passenger's phone number
    const message =
      `Hello ${data.passengerDetails[0].firstName} ${data.passengerDetails[0].lastName},\n\n` +
      `Thank you for booking your flight with The Skytrails. Your booking is confirmed! Here are the details:\n\n` +
      `PNR NO: [Flight Number]\n` +
      `Departure Date & Time: [Departure Date and Time]\n` +
      `Departure Airport: [Departure Airport Code]\n` +
      `Arrival Airport: [Arrival Airport Code]\n` +
      `Booking Reference: [Booking Reference]\n` +
      `Seat(s): [Seat Number(s)]\n\n` +
      `Please arrive at the airport at least [Arrival Time] before the flight.\n\n` +
      `For any inquiries or changes to your booking, please contact [Airline Contact Information].\n\n` +
      `Have a great flight with [Airline Name]!\n\n` +
      `Safe travels!`;

    client.messages
      .create({
        body: message,
        from: YOUR_TWILIO_PHONE_NUMBER,
        to: "+919973884727 ",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
  sendSMSForHotelBookingConfirmation: async (data) => {
    const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`; // The passenger's phone number
    const message =
      `Hello ${data.firstName} ${data.lastName},\n\n` +
      `Thank you for booking your hotel stay with The Skytrails. Your reservation is confirmed! Here are the details:\n\n` +
      `Booking Reference: ${data.bookingReference}\n` +
      `Check-in Date: ${data.checkInDate}\n` +
      `Check-out Date: ${data.checkOutDate}\n` +
      `Hotel Name: ${data.hotelName}\n` +
      `Room Type: ${data.roomType}\n` +
      `Number of Guests: ${data.numberOfGuests}\n` +
      `Total Price: ${data.totalPrice} USD\n\n` +
      `If you have any questions or need to make changes to your reservation, please contact our customer support at [Customer Support Phone Number].\n\n` +
      `We hope you enjoy your stay at ${data.hotelName}!\n\n` +
      `Safe travels!`;

    client.messages
      .create({
        body: message,
        from: YOUR_TWILIO_PHONE_NUMBER,
        to: "+919973884727 ",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
  sendSMSForBusBookingConfirmation: async (data) => {
    const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`; // The passenger's phone number
    const message =
      `Hello ${data.firstName} ${data.lastName},\n\n` +
      `Thank you for booking your bus ticket with The Sky Bus Company. Your booking is confirmed! Here are the details:\n\n` +
      `Booking Reference: ${data.bookingReference}\n` +
      `Departure Date & Time: ${data.departureDateTime}\n` +
      `Departure Location: ${data.departureLocation}\n` +
      `Arrival Location: ${data.arrivalLocation}\n` +
      `Seat Number: ${data.seatNumber}\n\n` +
      `Please arrive at the departure location at least 30 minutes before departure.\n\n` +
      `For any inquiries or changes to your booking, please contact our customer support at [Customer Support Phone Number].\n\n` +
      `We wish you a pleasant journey with The Sky Bus Company!\n\n` +
      `Safe travels!`;

    client.messages
      .create({
        body: message,
        from: YOUR_TWILIO_PHONE_NUMBER,
        to: "+919973884727",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
  sendSMSForOtp: async (mobileNumber, otp) => {
    const messageContent = `Use this OTP ${otp} to login to your. theskytrails account`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSForHotelBooking: async (data) => {
    const urldata = "https://theskytrails.com/";
    const details = `Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:${urldata}. Or You Can login theskytrails.com/login`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid2,
      number: data.phone,
      message: details,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSForFlightBooking: async (data) => {
    const userName = `${data?.passengerDetails[0]?.firstName} ${data?.passengerDetails[0]?.lastName}`;
    const url1 = "login";
    const phone = data?.passengerDetails[0]?.ContactNo;
    const details = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details:https://theskytrails.com/${url1}`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid1,
      number: phone,
      message: details,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSBusBooking: async (data, name) => {
    const details = `Hello, ${name}.We appreciate your Bus booking with The Skytrails. Your booking has been verified! Click the following link to view details= https://theskytrails.com/bookinghistory`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid3,
      number: data,
      message: details,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSForFlightBookingAgent: async (data) => {
    const userName =
      data.passengerDetails[0].firstName +
      " " +
      data.passengerDetails[0].lastName;
    const details = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details:https://b2b.theskytrails.com/Login`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid1,
      number: data.passengerDetails[0].ContactNo,
      message: details,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSBusBookingAgent: async (data) => {
    const name = `${data.passenger[0]?.title} ${data.passenger[0]?.firstName} ${data.passenger[0]?.lastName}`;
    const phone = `${data.passenger[0]?.Phone}`;
    const details = `Hello, ${name}.We appreciate your Bus booking with The Skytrails. Your booking has been verified! Click the following link to view details= https://b2b.theskytrails.com/Login`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid3,
      number: phone,
      message: details,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSForHotelBookingAgent: async (data) => {
    const urldata = "https://b2b.theskytrails.com/Login";
    const details = `Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:${urldata}. Or You Can login https://b2b.theskytrails.com/Login`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid2,
      number: data.phone,
      message: details,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSForSubAdmin: async (mobileNumber, otp) => {
    const messageContent = `Welcome to TheSkyTrails, and check your mail for login credential your mail is: ${otp} to login to your account https://b2b.theskytrails.com/subAdminLogin`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: subAdmintemplateid,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSAgents: async (mobileNumber, message) => {
    const messageContent = `Welcome to TheSkyTrails, and check your mail for login credential your mail is: ${message} to login to your account https://b2b.theskytrails.com/subAdminLogin`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: agentTempId,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSVisaBooking: async (mobileNumber, message) => {
    const messageContent = `Dear ${message} Thank you for booking your visa with us. We have received your request and partial payment. Further processing is required, and we will keep you informed about the progress. Please make sure to keep all required documents ready for the visa application process. If you have any questions, please feel free to reach out to our customer support team. Best regards, TheSkyTrails Pvt ltd`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: visaTempId,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSPackageEnquiry: async (mobileNumber, message) => {
    const messageContent = `Dear ${message}, Thank you for your package enquiry. Our team is reviewing the details and will get back to you soon. For any queries, reach our website https://theskytrails.com Best Regards, TheSkyTrails pvt ltd`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: packageTempId,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSEventEnquiry: async (mobileNumber, message) => {
    // const dta="PEFA2024";
    const messageContent = `Exciting News! Thank you for securing your spot at ${message}! We're over the moon to have you with us. Brace yourself for an amazing time! For event specifics, check out https://play.google.com/store/apps/details?id=com.skytrails. Get ready for a blast! See you at the event! TheSkyTrails Pvt Ltd`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: eventTempId,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      // console.log("response====",response.data)
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendSMSPasses: async (mobileNumber) => {
    const dta = "PEFA2024";
    const messageContent = `Greetings User! Your seat is now secured for the PEFA event. Get ready to groove to Punjabi beats. Heartfelt thanks for choosing TheSkytrails - we're thrilled to create memorable moments on your journey!`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: PEFAID,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      console.log("response====", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
  sendEventUpdate: async (mobileNumber,messageContent) => {
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: EVENTTEMPID,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      // throw error;
    }
  },
};
