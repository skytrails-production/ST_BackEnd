const {nodemailerConfig,nodemailerConfigHawaiYatra} = require("../config/nodeConfig");
const { PDFDocument, rgb } = require("pdf-lib");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("../config/auth.config.js");
const moment=require('moment')
const {
  flightMail,
  busMail,
  hotelMail,
  otpMail,
  welcomeMail,
  welcomeAgentMail,
  ssdcMail,
  packageLandingMail,
  hotelGrnMail,
  ResetPassword,
  SubAdminResetPassword
} = require("./mailingFunction.js");
let cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function getHtmlContent(name) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Booking Mail</title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <img src="https://res.cloudinary.com/dultedeh8/image/upload/v1702102549/fiouwt8xot7qv5qjqbbk.jpg"
                        style="width: 30%;" alt="logo">
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${name},
                            Your Booking successfully from skyTrails.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}
const crypto = require('crypto');



// console.log("generateReferralCode=======",generateReferralCode());
module.exports = {
  getOTP() {
    var otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  },
  generateReferralCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  },
  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.secret, { expiresIn: "1y" });
    return token;
  },

  sendSignUpEmailOtp: async (to, otp) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px; align="center" />
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                                ${otp} is your OTP for signing up for skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailerConfig.createTransport({
      service: nodemailerConfig.service,
      auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    return await transporter.sendMail(mailOptions);
  },

  sendSignUpEmailOtp: async (to, otp) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px; align="center" />
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                                ${otp} is your OTP for signing up for skyTrails.
                        
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailerConfig.createTransport({
      service: nodemailerConfig.service,
      auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  // sendHotelBookingConfirmation: async (to) => {
  //   let html = `<!DOCTYPE html>
  //       <html lang="en">

  //       <head>
  //           <title></title>
  //       </head>
  //       <body>
  //           <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  //               transition: 0.3s;
  //               width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
  //               <div class="main" style="background-image: url('');">
  //                   <div class="main-container" style="text-align: center;">
  //                       <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
  //                       <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
  //                           style="width: 30%;" alt="logo">

  //                       <div style="width: 90%;margin: auto; text-align: left;">
  //                           <br><br>
  //                           <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
  //                               you are booked hotel successfully from skyTrails.<br>Yor details is:=== <br>hotelName:${to.hotelName}<br>CheckInDate:${to.CheckInDate}<br>CheckOutDate:${to.CheckOutDate}<br>noOfPeople: ${to.noOfPeople}<br>night: ${to.night}<br>room:${to.room}<br>
  //                       </div>
  //                   </div>

  //               </div>
  //           </div>

  //       </body>
  //       </html>`;
  //   var transporter = nodemailer.createTransport({
  //     host: "smtp.gmail.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: nodemailerConfig.options.auth.user,
  //       pass: nodemailerConfig.options.auth.pass,
  //     },
  //   });
  //   var mailOptions = {
  //     from: nodemailerConfig.options.auth.user,
  //     to: to.email,
  //     subject: "Hotel Booking Confirmation",
  //     html: html,
  //   };
  //   try {
  //     // Verify the connection
  //     transporter.verify(function (error, success) {
  //       if (error) {
  //         console.log("SMTP Connection Error: " + error);
  //       } else {
  //         console.log("SMTP Connection Success: " + success);
  //       }
  //     });

  //     // Send the email
  //     const info = await transporter.sendMail(mailOptions);
  //     console.log("Email sent: " + info.response);
  //     return info;
  //   } catch (error) {
  //     console.error("Email sending failed:", error);
  //     throw error;
  //   }
  // },

  sendBusBookingConfirmation: async (to) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px; align="center" />
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                                you are booked bus successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Bus Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Visa Apply Confirmation Mail =======
  //==========================================================

  VisaApplyConfirmationMail: async (to) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title>VisaApplyConfirmationMail</title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px; align="center" />
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${
                              to.firstName + to.lastName
                            },
                                Your Visa Application successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Visa Apply Confirmation Mail",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Flight Booking Confirmation Mail with pdf=======
  //==========================================================

  FlightBookingConfirmationMail: async (to) => {
    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const formatDate = (dateString) => {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      };

      const date = new Date(dateString);
      return date.toLocaleString("en-US", options);
    };

    // console.log("to================>>>>>>>",to)
    const name = `${to?.passengerDetails[0]?.firstName} ${to?.passengerDetails[0]?.lastName}`;
    // Define your HTML content with nested elements
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
        <title>Flight booking pdf</title>
      </head>
      
      <body>
        <div style=" background:#fff; overflow:hidden; padding: 10px; width: 800px; border:1px solid #D6D8E7;font-size:12px; font-family:arial, sans-serif; margin:10px auto;">
          <div style="
                    justify-content: space-between;
                    align-items: flex-start;
                    display: flex;
                    margin-top: 24px;
                  ">
            <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px;" />
            <div style="
                      color: black;
                      font-size: 24px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    ">
              E - Ticket
            </div>
            <div style="
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 8px;
                      display: flex;
                    ">
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  Booking Id:
                </div>
                <div style="
                          color: #071c2c;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  ${to.bookingId}
                </div>
              </div>
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  PNR:
                </div>
                <div style="
                          color: #071c2c;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  ${to.pnr}
                </div>
              </div>
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  (Booked on ${formattedDate})
                </div>
              </div>
            </div>
          </div>
          <div style="
                    background: white;
                    padding: 24px;
                    /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
                    border-radius: 12px;
                  ">
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
              <div
                style="width:100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 40%; float: left; margin-right: 0;">
                  Passenger Name</div>
                <div style="width: 30%; float: left; margin-right: 0;">
                  Ticket Number</div>
                <div style="width: 21%; float: right; text-align: left; margin-right: 0;">
                  Frequent flyer no.</div>
              </div>
      

              ${to.passengerDetails
                .map(
                  (item) => `
              <div style="width:100%; float: left; padding: 5px;">
      
                <div style="width:100%; float: left; padding-bottom:5px;">
                  <div style="width: 40%; float: left; margin-right: 0;">
      
      
      
                    <span style="margin-top: 5px; width: 100%; float: left;"><b>Name:</b>
                      ${item.title} ${item.firstName} ${item.lastName}</span><br>      
                  </div>
                  <div style="width: 30%; float: left; margin-right: 8px;">
      
      
      
                    <span style="margin-top: 5px; width: 100%; float: left;">
                      ${item.TicketNumber}      
                    </span>
      
      
                  </div>
                  <div style="width: 15%; float: right; margin-right: 45px; text-align: left;">
      
      
                    <span style="margin-top: 5px; width: 100%; float: left; text-align: left;">-</span>      
                  </div>
                </div>                  
              </div>
                `
                )
                .join("")}
            </div>      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  Flight</div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  Departure</div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  Arrival</div>
                <div style="width: 20%; float: right; margin-right: 10px;">
                  Status</div>
              </div>
              ${to.airlineDetails
                .map(
                  (item) => `      
              <div style="width: 100%; float: left; padding: 5px;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  <span style="margin-top: 5px; width: 18%; height: 75px; float: left;">
                    <img id="airlineLogo" src=${`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.Airline?.AirlineCode}.png`} height="27px" width="30px" alt="UK">
                  </span><span style="margin-top: 5px; width: 70%; float: left;">
                    ${item.Airline.AirlineName}
                    ${item.Airline.AirlineCode}
                    ${item.Airline.FlightNumber}<br>
                    ${item.Airline.FareClass}
                    Class
                    <br>      
                    Operating Carrier:${item.Airline.AirlineCode}
      
                    <label>Cabin:Economy</label>
                  </span>
                </div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${item.Origin.AirportCode}
                    (${item.Origin.AirportName} ,
                    ${item.Origin.CityName}
                    ) </span>
      
                  <span style="margin-top: 5px;
                                   width: 100%; float: left;">Terminal:
                    ${item.Origin.Terminal}
                  </span>
                  <span style="margin-top: 5px; width: 100%; float: left;">
                  ${formatDate(item.Origin.DepTime)}
                  </span>
                </div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${item.Destination.AirportCode}
                    (${item.Destination.AirportName},
                    ${item.Destination.CityName}) </span>

                    <span style="margin-top: 5px;
                                   width: 100%; float: left;">Terminal:
                    ${item.Destination.Terminal}
                  </span>
      
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${formatDate(item.Destination.ArrTime)}
                  </span>
                </div>
                <div style="width: 20%; float: right; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    Confirmed</span>
            
                  <span> <span style="float: left;">Baggage: ${
                    item.Baggage
                  }</span></span>
                 
                    <span style="margin-top: 5px; width: 100%; float: left;">
                    </span>      
                    <span style="margin-top: 5px; width: 100%; float: left;">Non stop</span>
                  </span>
                </div>
              </div>
              `
                )
                .join("")}      
            </div>
      
            <div
              style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; border-bottom: 1px solid #D6D8E7; color: #fff; margin-top: 8px;">
              <div style="width: 43%; float: left; margin-right: 0;" id="paymentDetails">
                Payment Details </div>
            </div>
            <div style="width:100%; float:left; margin-top:8px; padding:5px; border-bottom:1px solid #D6D8E7">
              <div id="txnMsg" style=" width:100%; text-align:center; font-weight:bold; color:red; display:none">
                Txn fee/Discount amount will be equally divided on all the pax except infant and cancelled ticket.
              </div>
              <div style="margin-top:5px; float:left; width:300px; ">
                <div style="float:left; width:100%; text-align:left; font-weight:bold;">
                  This is an electronic ticket. Passengers must carry a valid photo ID card for check-in at the airport.
                </div>
      
              </div>
      
      
              <div style="float:right; width:300px; margin-top:10px;" id="fareDetails">
                <div style="margin-top:5px; float:left; width:100%; font-weight:bold;">
                  <div style="float:left; width:140px; text-align:right">
                    Total Amount:
                  </div>
                  <div style="width:85px; float:right; text-align:right;">
                    ₹ ${to.totalAmount}.00
                  </div>
                </div> 
              </div>
            </div>
            <div style="float: left; width: 100%; margin-top:10px; padding-bottom:10px; border-bottom:1px solid #D6D8E7" "="">         
            <div style=" margin:0; padding:5px;">
              Carriage and other services provided by the carrier are subject to conditions of carriage which hereby
              incorporated by reference. These conditions may be obtained from the issuing carrier. If the passenger's journey
              involves an ultimate destination or stop in a country other than country of departure the Warsaw convention may
              be applicable and the convention governs and in most cases limits the liability of carriers for death or
              personal injury and in respect of loss of or damage to baggage.</div>
              <!-- <p style=" margin:0; padding:15px 5px 5px 5px; color:red">Don't Forget to purchase travel insurance for your
              Visit. Please Contact your travel agent to purchase travel insurance.</p> -->
          </div>
            <!-- Rest of your content -->
            <!-- ... -->
          </div>
          <!-- Booking Details -->
          <div style="
                      
                      margin-top: 5px;
                      
                      padding-top: 24px;
                      padding-bottom: 24px;
                      background: white;
                      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                      border-radius: 12px;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 24px;
                      display: flex;
                      width: 100%;
                    ">
            <div style="
                        color: #e73c33;
                        font-size: 20px;
                        font-family: Montserrat;
                        font-weight: 700;
                        word-wrap: break-word;
                      ">
              The Skytrails Support
            </div>
            <div style="
                        width: 80%;
                        height: 48px;
                        justify-content: center;
                        align-items: center;
                        gap: 40px;
                        display: inline-flex;
                      ">
              <div style="
                          padding: 12px;
                          background-color: #b3b8bd;
                          border-radius: 12px;
                          justify-content: center;
                          align-items: center;
                          gap: 10px;
                          display: flex;
                        ">
                <p style="
                            color: #e73c33;
                            font-size: 20px;
                            font-family: Montserrat;
                            font-weight: 700;
                            word-wrap: break-word;
                            margin:0;
                          ">
                  +91 9209793097
                </p>
              </div>
              <div style="
                          justify-content: flex-start;
                          align-items: flex-start;
                          gap: 8px;
                          display: flex;
                        ">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="
                              width: 20px;
                              height: 20px;
                              left: 0px;
                              top: 0px;
                              position: absolute;
                              background: #21325d;
                            "></div>
                  <div style="
                              width: 16.67px;
                              height: 13.33px;
                              left: 1.67px;
                              top: 3.33px;
                              position: absolute;
                              background-color: #e73c33;
                            "></div>
                </div>
                <div style="
                            color: #e73c33;
                            font-size: 16px;
                            font-family: Montserrat;
                            font-weight: 600;
                            word-wrap: break-word;
                          ">
                          Info@theskytrails.com
                </div>
              </div>
            </div>
          </div>
          <div style="float: left; width: 100%; margin:0px; padding:0px;">
            <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
              margin-top: 15px;
              border-radius: 15px;">
          </div>
          
        </div>
      </body>
      </html>
      `;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "flightbooking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Use pdfFilePath in the email sending part of your code
    // ...

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });

    const passengerEmail = to.passengerDetails[0].email;
    const mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: passengerEmail,
      subject: "Flight Booking Confirmation Mail",
      html: flightMail(to),
      attachments: [{ filename: "flightBooking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await transporter.verify();

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Flight Booking Confirmation Mail pdf with New Email=======
  //==========================================================

  FlightBookingConfirmationMailWithNewEmail: async (to, email) => {
    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const formatDate = (dateString) => {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      };

      const date = new Date(dateString);
      return date.toLocaleString("en-US", options);
    };

    // console.log("to================>>>>>>>",to)
    const name = `${to?.passengerDetails[0]?.firstName} ${to?.passengerDetails[0]?.lastName}`;
    // Define your HTML content with nested elements
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
        <title>Flight booking pdf</title>
      </head>
      
      <body>
        <div style=" background:#fff; overflow:hidden; padding: 10px; width: 800px; border:1px solid #D6D8E7;font-size:12px; font-family:arial, sans-serif; margin:10px auto;">
          <div style="
                    justify-content: space-between;
                    align-items: flex-start;
                    display: flex;
                    margin-top: 24px;
                  ">
            <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px;" />
            <div style="
                      color: black;
                      font-size: 24px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    ">
              E - Ticket
            </div>
            <div style="
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 8px;
                      display: flex;
                    ">
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  Booking Id:
                </div>
                <div style="
                          color: #071c2c;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  ${to.bookingId}
                </div>
              </div>
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  PNR:
                </div>
                <div style="
                          color: #071c2c;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  ${to.pnr}
                </div>
              </div>
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  (Booked on ${formattedDate})
                </div>
              </div>
            </div>
          </div>
          <div style="
                    background: white;
                    padding: 24px;
                    /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
                    border-radius: 12px;
                  ">
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
              <div
                style="width:100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 40%; float: left; margin-right: 0;">
                  Passenger Name</div>
                <div style="width: 30%; float: left; margin-right: 0;">
                  Ticket Number</div>
                <div style="width: 21%; float: right; text-align: left; margin-right: 0;">
                  Frequent flyer no.</div>
              </div>
      

              ${to.passengerDetails
                .map(
                  (item) => `
              <div style="width:100%; float: left; padding: 5px;">
      
                <div style="width:100%; float: left; padding-bottom:5px;">
                  <div style="width: 40%; float: left; margin-right: 0;">
      
      
      
                    <span style="margin-top: 5px; width: 100%; float: left;"><b>Name:</b>
                      ${item.title} ${item.firstName} ${item.lastName}</span><br>      
                  </div>
                  <div style="width: 30%; float: left; margin-right: 8px;">
      
      
      
                    <span style="margin-top: 5px; width: 100%; float: left;">
                      ${item.TicketNumber}      
                    </span>
      
      
                  </div>
                  <div style="width: 15%; float: right; margin-right: 45px; text-align: left;">
      
      
                    <span style="margin-top: 5px; width: 100%; float: left; text-align: left;">-</span>      
                  </div>
                </div>                  
              </div>
                `
                )
                .join("")}
            </div>      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  Flight</div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  Departure</div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  Arrival</div>
                <div style="width: 20%; float: right; margin-right: 10px;">
                  Status</div>
              </div>
              ${to.airlineDetails
                .map(
                  (item) => `      
              <div style="width: 100%; float: left; padding: 5px;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  <span style="margin-top: 5px; width: 18%; height: 75px; float: left;">
                    <img id="airlineLogo" src=${`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.Airline?.AirlineCode}.png`} height="27px" width="30px" alt="UK">
                  </span><span style="margin-top: 5px; width: 70%; float: left;">
                    ${item.Airline.AirlineName}
                    ${item.Airline.AirlineCode}
                    ${item.Airline.FlightNumber}<br>
                    ${item.Airline.FareClass}
                    Class
                    <br>      
                    Operating Carrier:${item.Airline.AirlineCode}
      
                    <label>Cabin:Economy</label>
                  </span>
                </div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${item.Origin.AirportCode}
                    (${item.Origin.AirportName} ,
                    ${item.Origin.CityName}
                    ) </span>
      
                  <span style="margin-top: 5px;
                                   width: 100%; float: left;">Terminal:
                    ${item.Origin.Terminal}
                  </span>
                  <span style="margin-top: 5px; width: 100%; float: left;">
                  ${formatDate(item.Origin.DepTime)}
                  </span>
                </div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${item.Destination.AirportCode}
                    (${item.Destination.AirportName},
                    ${item.Destination.CityName}) </span>

                    <span style="margin-top: 5px;
                                   width: 100%; float: left;">Terminal:
                    ${item.Destination.Terminal}
                  </span>
      
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${formatDate(item.Destination.ArrTime)}
                  </span>
                </div>
                <div style="width: 20%; float: right; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    Confirmed</span>
            
                  <span> <span style="float: left;">Baggage: ${
                    item.Baggage
                  }</span></span>
                 
                    <span style="margin-top: 5px; width: 100%; float: left;">
                    </span>      
                    <span style="margin-top: 5px; width: 100%; float: left;">Non stop</span>
                  </span>
                </div>
              </div>
              `
                )
                .join("")}      
            </div>
      
            <div
              style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; border-bottom: 1px solid #D6D8E7; color: #fff; margin-top: 8px;">
              <div style="width: 43%; float: left; margin-right: 0;" id="paymentDetails">
                Payment Details </div>
            </div>
            <div style="width:100%; float:left; margin-top:8px; padding:5px; border-bottom:1px solid #D6D8E7">
              <div id="txnMsg" style=" width:100%; text-align:center; font-weight:bold; color:red; display:none">
                Txn fee/Discount amount will be equally divided on all the pax except infant and cancelled ticket.
              </div>
              <div style="margin-top:5px; float:left; width:300px; ">
                <div style="float:left; width:100%; text-align:left; font-weight:bold;">
                  This is an electronic ticket. Passengers must carry a valid photo ID card for check-in at the airport.
                </div>
      
              </div>
      
      
              <div style="float:right; width:300px; margin-top:10px;" id="fareDetails">
                <div style="margin-top:5px; float:left; width:100%; font-weight:bold;">
                  <div style="float:left; width:140px; text-align:right">
                    Total Amount:
                  </div>
                  <div style="width:85px; float:right; text-align:right;">
                    ₹ ${to.totalAmount}.00
                  </div>
                </div> 
              </div>
            </div>
            <div style="float: left; width: 100%; margin-top:10px; padding-bottom:10px; border-bottom:1px solid #D6D8E7" "="">         
            <div style=" margin:0; padding:5px;">
              Carriage and other services provided by the carrier are subject to conditions of carriage which hereby
              incorporated by reference. These conditions may be obtained from the issuing carrier. If the passenger's journey
              involves an ultimate destination or stop in a country other than country of departure the Warsaw convention may
              be applicable and the convention governs and in most cases limits the liability of carriers for death or
              personal injury and in respect of loss of or damage to baggage.</div>
              <!-- <p style=" margin:0; padding:15px 5px 5px 5px; color:red">Don't Forget to purchase travel insurance for your
              Visit. Please Contact your travel agent to purchase travel insurance.</p> -->
          </div>
            <!-- Rest of your content -->
            <!-- ... -->
          </div>
          <!-- Booking Details -->
          <div style="
                      
                      margin-top: 5px;
                      
                      padding-top: 24px;
                      padding-bottom: 24px;
                      background: white;
                      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                      border-radius: 12px;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 24px;
                      display: flex;
                      width: 100%;
                    ">
            <div style="
                        color: #e73c33;
                        font-size: 20px;
                        font-family: Montserrat;
                        font-weight: 700;
                        word-wrap: break-word;
                      ">
              The Skytrails Support
            </div>
            <div style="
                        width: 80%;
                        height: 48px;
                        justify-content: center;
                        align-items: center;
                        gap: 40px;
                        display: inline-flex;
                      ">
              <div style="
                          padding: 12px;
                          background-color: #b3b8bd;
                          border-radius: 12px;
                          justify-content: center;
                          align-items: center;
                          gap: 10px;
                          display: flex;
                        ">
                <p style="
                            color: #e73c33;
                            font-size: 20px;
                            font-family: Montserrat;
                            font-weight: 700;
                            word-wrap: break-word;
                            margin:0;
                          ">
                  +91 9209793097
                </p>
              </div>
              <div style="
                          justify-content: flex-start;
                          align-items: flex-start;
                          gap: 8px;
                          display: flex;
                        ">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="
                              width: 20px;
                              height: 20px;
                              left: 0px;
                              top: 0px;
                              position: absolute;
                              background: #21325d;
                            "></div>
                  <div style="
                              width: 16.67px;
                              height: 13.33px;
                              left: 1.67px;
                              top: 3.33px;
                              position: absolute;
                              background-color: #e73c33;
                            "></div>
                </div>
                <div style="
                            color: #e73c33;
                            font-size: 16px;
                            font-family: Montserrat;
                            font-weight: 600;
                            word-wrap: break-word;
                          ">
                          Info@theskytrails.com
                </div>
              </div>
            </div>
          </div>
          <div style="float: left; width: 100%; margin:0px; padding:0px;">
            <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
              margin-top: 15px;
              border-radius: 15px;">
          </div>
          
        </div>
      </body>
      </html>
      `;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "flightbooking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Use pdfFilePath in the email sending part of your code
    // ...

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 120000,
    });

    const passengerEmail = email;
    const mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: email,
      subject: "Flight Booking Confirmation Mail",
      html: flightMail(to),
      attachments: [{ filename: "flightBooking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await transporter.verify();

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Flight Booking Confirmation Mail pdf with agent Markup=======
  //==========================================================

  FlightBookingConfirmationMailwithAgentMarkup: async (to, markup) => {
    // console.log(to,"data",markup);
    // return;

    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const formatDate = (dateString) => {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      };

      const date = new Date(dateString);
      return date.toLocaleString("en-US", options);
    };

    // console.log("to================>>>>>>>",to)
    const name = `${to?.passengerDetails[0]?.firstName} ${to?.passengerDetails[0]?.lastName}`;
    // Define your HTML content with nested elements
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
        <title>Flight booking pdf</title>
      </head>
      
      <body>
        <div style=" background:#fff; overflow:hidden; padding: 10px; width: 800px; border:1px solid #D6D8E7;font-size:12px; font-family:arial, sans-serif; margin:10px auto;">
          <div style="
                    justify-content: space-between;
                    align-items: flex-start;
                    display: flex;
                    margin-top: 24px;
                  ">
            <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px;" />
            <div style="
                      color: black;
                      font-size: 24px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    ">
              E - Ticket
            </div>
            <div style="
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 8px;
                      display: flex;
                    ">
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  Booking Id:
                </div>
                <div style="
                          color: #071c2c;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  ${to.bookingId}
                </div>
              </div>
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  PNR:
                </div>
                <div style="
                          color: #071c2c;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  ${to.pnr}
                </div>
              </div>
              <div style="
                        justify-content: center;
                        align-items: center;
                        gap: 4px;
                        display: flex;
                      ">
                <div style="
                          color: #868686;
                          font-size: 12px;
                          font-family: Montserrat;
                          font-weight: 500;
                          word-wrap: break-word;
                        ">
                  (Booked on ${formattedDate})
                </div>
              </div>
            </div>
          </div>
          <div style="
                    background: white;
                    padding: 24px;
                    /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
                    border-radius: 12px;
                  ">
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
              <div
                style="width:100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 40%; float: left; margin-right: 0;">
                  Passenger Name</div>
                <div style="width: 30%; float: left; margin-right: 0;">
                  Ticket Number</div>
                <div style="width: 21%; float: right; text-align: left; margin-right: 0;">
                  Frequent flyer no.</div>
              </div>
      

              ${to.passengerDetails
                .map(
                  (item) => `
              <div style="width:100%; float: left; padding: 5px;">
      
                <div style="width:100%; float: left; padding-bottom:5px;">
                  <div style="width: 40%; float: left; margin-right: 0;">
      
      
      
                    <span style="margin-top: 5px; width: 100%; float: left;"><b>Name:</b>
                      ${item.title} ${item.firstName} ${item.lastName}</span><br>      
                  </div>
                  <div style="width: 30%; float: left; margin-right: 8px;">
      
      
      
                    <span style="margin-top: 5px; width: 100%; float: left;">
                      ${item.TicketNumber}      
                    </span>
      
      
                  </div>
                  <div style="width: 15%; float: right; margin-right: 45px; text-align: left;">
      
      
                    <span style="margin-top: 5px; width: 100%; float: left; text-align: left;">-</span>      
                  </div>
                </div>                  
              </div>
                `
                )
                .join("")}
            </div>      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  Flight</div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  Departure</div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  Arrival</div>
                <div style="width: 20%; float: right; margin-right: 10px;">
                  Status</div>
              </div>
              ${to.airlineDetails
                .map(
                  (item) => `      
              <div style="width: 100%; float: left; padding: 5px;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  <span style="margin-top: 5px; width: 18%; height: 75px; float: left;">
                    <img id="airlineLogo" src=${`https://raw.githubusercontent.com/The-SkyTrails/ST_BackEnd/main/utilities/FlightImages/${item?.Airline?.AirlineCode}.png`} height="27px" width="30px" alt="UK">
                  </span><span style="margin-top: 5px; width: 70%; float: left;">
                    ${item.Airline.AirlineName}
                    ${item.Airline.AirlineCode}
                    ${item.Airline.FlightNumber}<br>
                    ${item.Airline.FareClass}
                    Class
                    <br>      
                    Operating Carrier:${item.Airline.AirlineCode}
      
                    <label>Cabin:Economy</label>
                  </span>
                </div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${item.Origin.AirportCode}
                    (${item.Origin.AirportName} ,
                    ${item.Origin.CityName}
                    ) </span>
      
                  <span style="margin-top: 5px;
                                   width: 100%; float: left;">Terminal:
                    ${item.Origin.Terminal}
                  </span>
                  <span style="margin-top: 5px; width: 100%; float: left;">
                  ${formatDate(item.Origin.DepTime)}
                  </span>
                </div>
                <div style="width: 25%; float: left; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${item.Destination.AirportCode}
                    (${item.Destination.AirportName},
                    ${item.Destination.CityName}) </span>

                    <span style="margin-top: 5px;
                                   width: 100%; float: left;">Terminal:
                    ${item.Destination.Terminal}
                  </span>
      
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    ${formatDate(item.Destination.ArrTime)}
                  </span>
                </div>
                <div style="width: 20%; float: right; margin-right: 10px;">
                  <span style="margin-top: 5px; width: 100%; float: left;">
                    Confirmed</span>
            
                  <span> <span style="float: left;">Baggage: ${
                    item.Baggage
                  }</span></span>
                 
                    <span style="margin-top: 5px; width: 100%; float: left;">
                    </span>      
                    <span style="margin-top: 5px; width: 100%; float: left;">Non stop</span>
                  </span>
                </div>
              </div>
              `
                )
                .join("")}      
            </div>
      
            <div
              style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; border-bottom: 1px solid #D6D8E7; color: #fff; margin-top: 8px;">
              <div style="width: 43%; float: left; margin-right: 0;" id="paymentDetails">
                Payment Details </div>
            </div>
            <div style="width:100%; float:left; margin-top:8px; padding:5px; border-bottom:1px solid #D6D8E7">
              <div id="txnMsg" style=" width:100%; text-align:center; font-weight:bold; color:red; display:none">
                Txn fee/Discount amount will be equally divided on all the pax except infant and cancelled ticket.
              </div>
              <div style="margin-top:5px; float:left; width:300px; ">
                <div style="float:left; width:100%; text-align:left; font-weight:bold;">
                  This is an electronic ticket. Passengers must carry a valid photo ID card for check-in at the airport.
                </div>
      
              </div>
      
      
              <div style="float:right; width:300px; margin-top:10px;" id="fareDetails">
                <div style="margin-top:5px; float:left; width:100%; font-weight:bold;">
                  <div style="float:left; width:140px; text-align:right">
                    Total Amount:
                  </div>
                  <div style="width:85px; float:right; text-align:right;">
                    ₹ ${Number(to.totalAmount) + Number(markup.price)}.00
                  </div>
                </div> 
              </div>
            </div>
            <div style="float: left; width: 100%; margin-top:10px; padding-bottom:10px; border-bottom:1px solid #D6D8E7" "="">         
            <div style=" margin:0; padding:5px;">
              Carriage and other services provided by the carrier are subject to conditions of carriage which hereby
              incorporated by reference. These conditions may be obtained from the issuing carrier. If the passenger's journey
              involves an ultimate destination or stop in a country other than country of departure the Warsaw convention may
              be applicable and the convention governs and in most cases limits the liability of carriers for death or
              personal injury and in respect of loss of or damage to baggage.</div>
              <!-- <p style=" margin:0; padding:15px 5px 5px 5px; color:red">Don't Forget to purchase travel insurance for your
              Visit. Please Contact your travel agent to purchase travel insurance.</p> -->
          </div>
            <!-- Rest of your content -->
            <!-- ... -->
          </div>
          <!-- Booking Details -->
          <div style="
                      
                      margin-top: 5px;
                      
                      padding-top: 24px;
                      padding-bottom: 24px;
                      background: white;
                      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                      border-radius: 12px;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 24px;
                      display: flex;
                      width: 100%;
                    ">
            <div style="
                        color: #e73c33;
                        font-size: 20px;
                        font-family: Montserrat;
                        font-weight: 700;
                        word-wrap: break-word;
                      ">
              The Skytrails Support
            </div>
            <div style="
                        width: 80%;
                        height: 48px;
                        justify-content: center;
                        align-items: center;
                        gap: 40px;
                        display: inline-flex;
                      ">
              <div style="
                          padding: 12px;
                          background-color: #b3b8bd;
                          border-radius: 12px;
                          justify-content: center;
                          align-items: center;
                          gap: 10px;
                          display: flex;
                        ">
                <p style="
                            color: #e73c33;
                            font-size: 20px;
                            font-family: Montserrat;
                            font-weight: 700;
                            word-wrap: break-word;
                            margin:0;
                          ">
                  +91 9209793097
                </p>
              </div>
              <div style="
                          justify-content: flex-start;
                          align-items: flex-start;
                          gap: 8px;
                          display: flex;
                        ">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="
                              width: 20px;
                              height: 20px;
                              left: 0px;
                              top: 0px;
                              position: absolute;
                              background: #21325d;
                            "></div>
                  <div style="
                              width: 16.67px;
                              height: 13.33px;
                              left: 1.67px;
                              top: 3.33px;
                              position: absolute;
                              background-color: #e73c33;
                            "></div>
                </div>
                <div style="
                            color: #e73c33;
                            font-size: 16px;
                            font-family: Montserrat;
                            font-weight: 600;
                            word-wrap: break-word;
                          ">
                          Info@theskytrails.com
                </div>
              </div>
            </div>
          </div>

          <div style="float: left; width: 100%; margin:0px; padding:0px;">
            <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
              margin-top: 15px;
              border-radius: 15px;">
          </div>
          
        </div>
      </body>
      </html>
      `;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "flightbooking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Use pdfFilePath in the email sending part of your code
    // ...

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });

    const passengerEmail = markup.email;
    const mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: passengerEmail,
      subject: "Flight Booking Confirmation Mail",
      html: flightMail(to),
      attachments: [{ filename: "flightBooking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await transporter.verify();

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Bus Booking Confirmation Mail with pdf=======
  //==========================================================

  BusBookingConfirmationMail: async (to) => {
    // console.log(to,"data");

    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    // dateFormate

    function formatDate(dateString, format) {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleString("en-US", options);
    }

    const boardingTimeFormatted = formatDate(
      to.departureTime,
      "DD MMMM YYYY hh:mm A"
    );
    const journeyDateFormatted = formatDate(
      to.departureTime,
      "ddd, DD MMM YYYY"
    );
    const depTimeFormatted = formatDate(to.departureTime, "hh:mm A");

    // console.log("to================>>>>>>>",to)
    const name = `${to.passenger[0]?.title} ${to.passenger[0]?.firstName} ${to.passenger[0]?.lastName}`;
    // Define your HTML content with nested elements
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet">
        <style>
          p {
            margin: 0 4px 0 0;
          }  
        </style>
        <title></title>
      </head>
      
      
      
      
      <body style="margin: 0; padding: 0; font-size: 16px; font-family: Montserrat, sans-serif; line-height: 1.6;">
      
        <div style=" background:#fff; overflow:hidden; padding: 10px; max-width: 800px; border:2px solid #000;font-size:12px; font-family:Montserrat, sans-serif; margin:10px auto;">
          <div>
            <div  style="justify-content: space-between; align-items: flex-start; display: flex; margin-top: 24px;">
              <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo"
                style="width: 25%; margin-top: -10px;" />
              <div style="color: black; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word;">
                Bus - Ticket
              </div>
              <div style="flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex;">
                <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                  <div
                    style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    Booking Id:
                  </div>
                  <div
                    style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    ${to.pnr}
                  </div>
                </div>
                <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                  <div
                    style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    PNR:
                  </div>
                  <div
                    style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    ${to.pnr}
                  </div>
                </div>
                <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                  <div
                    style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    (Booked on ${formattedDate})
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 15px;">
              <b>Ticket Reservation</b> Please take a print of this ticket. A copy of the ticket has to be produced at the
              time of boarding. Please be present atleast 15 mins prior to time of departure at the boarding point
            </div>
            <div style="width: 100%; margin-top: 20px; border: 1px solid #D6D8E7;">
              <div
                style="width:100%; display: flex; background: #004684; font-weight: bold; padding: 5px;padding-right: 0; color: #fff; overflow: hidden;">
                <p style="width: 40%;">
                  Passenger Name
                </p>
                <p style="width: 20%; text-align: center;">
                  Ticket Number
                </p>
                <p style="width: 20%;text-align: center;">
                  Seat Number
                </p>
                <p style="width: 20%; text-align: center;">
                  Price
                </p>
              </div>
      
              ${to.passenger
                .map(
                  (item) => `
              <div style="width:100%; display: flex; padding: 5px 0 0 5px; overflow: hidden;">
                <p style="width: 40%">
                 ${item?.firstName} ${item?.lastName}
                </p>
                <p style="width: 20%; text-align: center;">
                  ${to.pnr}
                </p>
                <p style="width: 20%; text-align: center;">
                  ${item.seatNumber}
                </p>
                <p style="width: 20%; text-align: center;">
                  Rs. ${item.Price}
                </p>
              </div>
              `
                )
                .join("")}
      
      
      
      
      
      
      
      
            </div>

            <!-- Bus Detail start -->
<div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7; box-sizing: border-box;">

  <div style="width: 100%; background: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff; box-sizing: border-box;">
    <div style="width: 100%; float: left; margin-right: 0; box-sizing: border-box;">
      Bus Details
    </div>
  </div>

  <div style="width: 100%; display: flex; white-space: nowrap; justify-content: space-between; padding: 5px 0 1px 5px; box-sizing: border-box;">
    <div style="width: 100%; max-width: 300px; box-sizing: border-box;">
      <p>
        <strong>From:</strong>
      </p>
      <p>
        <strong>Travels:</strong>
      </p>
      <p>
        <strong>Journey Date:</strong>
      </p>
      <p>
        <strong>PNR:</strong>
      </p>
    </div>
    <div style="width: 100%; max-width: 300px; box-sizing: border-box;">
      <p>
        ${to.origin}
      </p>
      <p>
        ${to.travelName}
      </p>

      <p>
        ${journeyDateFormatted}
      </p>
      <p>
        ${to.pnr}
      </p>
    </div>
    <div style="width: 100%; max-width: 300px; box-sizing: border-box;">
      <p>
        <strong>To:</strong>
      </p>
      <p>
        <strong>Bus Type:</strong>
      </p>

      <p>
        <strong>Dep time:</strong>
      </p>
      <p>
        <strong>FinalPrice:</strong>
      </p>
      <p style="font-size: 9px;margin-top:-8px">
        <span style="color:red; font-size: 16px;"><b>*</b></span>including Tax and coupon if applicable 
      </p>
    </div>
    <div style="width: 100%; max-width: 300px; box-sizing: border-box;">
      <p>
        ${to.destination}
      </p>
      <p>
        ${to.busType}
      </p>

      <p>
        ${depTimeFormatted}
      </p>
      <p>
        ₹ ${to.amount}.00
      </p>
    </div>
  </div>

</div>
<!-- Bus Detail end -->

      
      
      
            <!-- Boarding Detail -->
      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background: #004684; display: flex; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 50%;  margin-right: 0;">
                  Boarding Address
                </div>
                <div style="width: 50%; margin-right: 0;">
                  Bus Support No: 080-30916657
                </div>
              </div>
      
              <div style="width: 100%; display: flex; justify-content: flex-start; gap: 20%; padding: 5px 0 0px 5px;">
                <div style="display: flex; gap: 10px;">
                  <div>
                    <p>
                      <strong>Location:</strong>
                    </p>
                    <p>
                      <strong>Landmark:</strong>
                    </p>
                    <p>
                      <strong>Address:</strong>
                    </p>
                    <p>
                      <strong>Boarding time:</strong>
                    </p>
                    <p>
                      <strong>Contact number:</strong>
                    </p>
                  </div>
                  <div>
                    <p>
                      ${to?.BoardingPoint?.Location}
                    </p>
                    <p>
                      ${to?.BoardingPoint?.Landmark}
                    </p>
      
                    <p>
                      ${to?.BoardingPoint?.Address}
                    </p>
                    <p>
                      ${boardingTimeFormatted}
                    </p>
                    <p>
                      1234567890
                    </p>
                  </div>
                </div>
                <div>
                  <div>
                    Bus Help Line Numbers
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <div>
                      <p>
                        <strong>Ahmedabad</strong>
                      </p>
                      <p>
                        <strong>Bangalore</strong>
                      </p>
                      <p>
                        <strong>Chennai</strong>
                      </p>
                      <p>
                        <strong>Delhi</strong>
                      </p>
                      <p>
                        <strong>Hyderabad</strong>
                      </p>
                      <p>
                        <strong>Mumbai</strong>
                      </p>
                      <p>
                        <strong>Pune</strong>
                      </p>
                    </div>
                    <div>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
      
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                    </div>
                    <div>
                      <p>
                        079-39412345
                      </p>
                      <p>
                        080-39412345
                      </p>
      
                      <p>
                        044-39412345
                      </p>
                      <p>
                        011-39412345
                      </p>
                      <p>
                        040-39412345
                      </p>
                      <p>
                        022-39412345
                      </p>
                      <p>
                        020-39412345
                      </p>
                    </div>
                  </div>
                </div>
              </div>
      
            </div>
      
      
            <!-- End Boarding Detail -->
      
            <!-- Cancellation Details -->
      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 100%; float: left; margin-right: 0;">
                  Cancellation Details
                </div>
              </div>
      
              
              <div style="width: 100%; display: flex; justify-content: flex-start; gap: 35%; padding: 5px 0 0px 5px;">
                <div style="text-align: center;">
                  <p><strong>Cancellation time</strong></p>
                  ${to.CancelPolicy.map(
                    (policy) => `
                  <p>${policy.PolicyString}</p>`
                  ).join("")}
                </div>
                <div>
                  <p><strong>Cancellation charges</strong></p>
                  ${to.CancelPolicy.map(
                    (policy) =>
                      `<p>${policy.CancellationCharge.toFixed(2)}%</p>`
                  ).join("")}
                </div>
              </div>
            
            </div>
          </div>
      
      
          <!-- End Cancellation Details -->
      
          <!-- Booking Details -->
          <div>
            <div style="
                        margin-bottom: 0;                
                        background: white;
                        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                        border-radius: 12px;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        gap: 12px;
                        display: flex;
                        width: 100%;
                      ">
              <div style="
                          color: #e73c33;
                          font-size: 20px;
                          font-family: Montserrat;
                          font-weight: 700;
                          word-wrap: break-word;
                        ">
                The Skytrails Support
              </div>
              <div style="
                          width: 80%;
                          height: 48px;
                          justify-content: center;
                          align-items: center;
                          gap: 40px;
                          display: inline-flex;
                        ">
                <div style="
                            padding: 4px;
                            background-color: #b3b8bd;
                            border-radius: 12px;
                            justify-content: center;
                            align-items: center;
                            gap: 10px;
                            display: flex;
                          ">
                  <p style="
                              color: #e73c33;
                              font-size: 20px;
                              font-family: Montserrat;
                              font-weight: 700;
                              word-wrap: break-word;
                              margin: 0;
                            ">
                    +91 9209793097
                  </p>
                </div>
                <div style="
                            justify-content: flex-start;
                            align-items: flex-start;
                            gap: 8px;
                            display: flex;
                          ">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="
                                width: 20px;
                                height: 20px;
                                left: 0px;
                                top: 0px;
                                position: absolute;
                                background: #21325d;
                              "></div>
                    <div style="
                                width: 16.67px;
                                height: 13.33px;
                                left: 1.67px;
                                top: 3.33px;
                                position: absolute;
                                background: #e73c33;
                              "></div>
                  </div>
                  <div style="
                              color: #e73c33;
                              font-size: 16px;
                              font-family: Montserrat;
                              font-weight: 600;
                              word-wrap: break-word;
                            ">
                      Info@theskytrails.com
                  </div>
                </div>
              </div>
            </div>
          </div>
           <div style="float: left; width: 100%; margin:0px; padding:0px;">
            <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
              margin-top: 15px;
              border-radius: 15px;">
          </div>
        </div>
      </body>
      
      </html>`;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "Bus_Booking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });

    const passengerEmail = to.passenger[0]?.Email;
    // console.log("=================",passengerEmail,name)
    const mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: passengerEmail,
      subject: "Bus Booking Confirmation Mail",
      html: busMail(to),
      attachments: [{ filename: "Bus_Booking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await transporter.verify();

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);

      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  busBookingConfirmationMailWithNewEmail: async (to, email) => {
    // console.log(to,"data");

    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    // dateFormate

    function formatDate(dateString, format) {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleString("en-US", options);
    }

    const boardingTimeFormatted = formatDate(
      to.departureTime,
      "DD MMMM YYYY hh:mm A"
    );
    const journeyDateFormatted = formatDate(
      to.departureTime,
      "ddd, DD MMM YYYY"
    );
    const depTimeFormatted = formatDate(to.departureTime, "hh:mm A");

    // console.log("to================>>>>>>>",to)
    const name = `${to.passenger[0]?.title} ${to.passenger[0]?.firstName} ${to.passenger[0]?.lastName}`;
    // Define your HTML content with nested elements
    const htmlContent = `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet">
        <style>
          p {
            margin: 0 4px 0 0;
          }  
        </style>
        <title></title>
      </head>
      
      
      
      
      <body style="margin: 0; padding: 0; font-size: 16px; font-family: Montserrat, sans-serif; line-height: 1.6;">
      
        <div style=" background:#fff; overflow:hidden; padding: 10px; max-width: 800px; border:2px solid #000;font-size:12px; font-family:Montserrat, sans-serif; margin:10px auto;">
          <div>
            <div  style="justify-content: space-between; align-items: flex-start; display: flex; margin-top: 24px;">
              <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo"
                style="width: 25%; margin-top: -10px;" />
              <div style="color: black; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word;">
                Bus - Ticket
              </div>
              <div style="flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex;">
                <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                  <div
                    style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    Booking Id:
                  </div>
                  <div
                    style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    ${to.pnr}
                  </div>
                </div>
                <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                  <div
                    style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    PNR:
                  </div>
                  <div
                    style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    ${to.pnr}
                  </div>
                </div>
                <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                  <div
                    style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                    (Booked on ${formattedDate})
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 15px;">
              <b>Ticket Reservation</b> Please take a print of this ticket. A copy of the ticket has to be produced at the
              time of boarding. Please be present atleast 15 mins prior to time of departure at the boarding point
            </div>
            <div style="width: 100%; margin-top: 20px; border: 1px solid #D6D8E7;">
              <div
                style="width:100%; display: flex; background: #004684; font-weight: bold; padding: 5px;padding-right: 0; color: #fff; overflow: hidden;">
                <p style="width: 40%;">
                  Passenger Name
                </p>
                <p style="width: 20%; text-align: center;">
                  Ticket Number
                </p>
                <p style="width: 20%;text-align: center;">
                  Seat Number
                </p>
                <p style="width: 20%; text-align: center;">
                  Price
                </p>
              </div>
      
              ${to.passenger
                .map(
                  (item) => `
              <div style="width:100%; display: flex; padding: 5px 0 0 5px; overflow: hidden;">
                <p style="width: 40%">
                ${item?.title} ${item?.firstName} ${item?.lastName}
                </p>
                <p style="width: 20%; text-align: center;">
                  ${to.pnr}
                </p>
                <p style="width: 20%; text-align: center;">
                  ${item.seatNumber}
                </p>
                <p style="width: 20%; text-align: center;">
                  Rs. ${item.Price}
                </p>
              </div>
              `
                )
                .join("")}
      
      
      
      
      
      
      
      
            </div>
      
            <!-- Bus Detail start -->
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 100%; float: left; margin-right: 0;">
                  Bus Details
                </div>
              </div>
      
              <div style="width: 100%; display: flex; justify-content: flex-start; gap: 35%; padding: 5px 0 1px 5px;">
                <div style="display: flex; gap: 10px;">
                  <div>
                    <p>
                      <strong>From:</strong>
                    </p>
                    <p>
                      <strong>Travels:</strong>
                    </p>
                    <p>
                      <strong>Journey Date:</strong>
                    </p>
                    <p>
                      <strong>PNR:</strong>
                    </p>
                  </div>
                  <div>
                    <p>
                      ${to.origin}
                    </p>
                    <p>
                      ${to.travelName}
                    </p>
      
                    <p>
                      ${journeyDateFormatted}
                    </p>
                    <p>
                      ${to.pnr}
                    </p>
                  </div>
                </div>
                <div style="display: flex; gap: 10px;">
                  <div>
                    <p>
                      <strong>To:</strong>
                    </p>
                    <p>
                      <strong>Bus Type:</strong>
                    </p>
      
                    <p>
                      <strong>Dep time:</strong>
                    </p>
                    <p>
                      <strong>Price:</strong>
                    </p>
                  </div>
                  <div>
                    <p>
                      ${to.destination}
                    </p>
                    <p>
                      ${to.busType}
                    </p>
      
                    <p>
                      ${depTimeFormatted}
                    </p>
                    <p>
                    ₹ ${to.amount}.00
                    </p>
                  </div>
                </div>
              </div>
      
            </div>
      
            <!-- Bus Detail end -->
      
      
            <!-- Boarding Detail -->
      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background: #004684; display: flex; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 50%;  margin-right: 0;">
                  Boarding Address
                </div>
                <div style="width: 50%; margin-right: 0;">
                  Bus Support No: 080-30916657
                </div>
              </div>
      
              <div style="width: 100%; display: flex; justify-content: flex-start; gap: 20%; padding: 5px 0 0px 5px;">
                <div style="display: flex; gap: 10px;">
                  <div>
                    <p>
                      <strong>Location:</strong>
                    </p>
                    <p>
                      <strong>Landmark:</strong>
                    </p>
                    <p>
                      <strong>Address:</strong>
                    </p>
                    <p>
                      <strong>Boarding time:</strong>
                    </p>
                    <p>
                      <strong>Contact number:</strong>
                    </p>
                  </div>
                  <div>
                    <p>
                      ${to?.BoardingPoint?.Location}
                    </p>
                    <p>
                      ${to?.BoardingPoint?.Landmark}
                    </p>
      
                    <p>
                      ${to?.BoardingPoint?.Address}
                    </p>
                    <p>
                      ${boardingTimeFormatted}
                    </p>
                    <p>
                      1234567890
                    </p>
                  </div>
                </div>
                <div>
                  <div>
                    Bus Help Line Numbers
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <div>
                      <p>
                        <strong>Ahmedabad</strong>
                      </p>
                      <p>
                        <strong>Bangalore</strong>
                      </p>
                      <p>
                        <strong>Chennai</strong>
                      </p>
                      <p>
                        <strong>Delhi</strong>
                      </p>
                      <p>
                        <strong>Hyderabad</strong>
                      </p>
                      <p>
                        <strong>Mumbai</strong>
                      </p>
                      <p>
                        <strong>Pune</strong>
                      </p>
                    </div>
                    <div>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
      
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                      <p>
                        :
                      </p>
                    </div>
                    <div>
                      <p>
                        079-39412345
                      </p>
                      <p>
                        080-39412345
                      </p>
      
                      <p>
                        044-39412345
                      </p>
                      <p>
                        011-39412345
                      </p>
                      <p>
                        040-39412345
                      </p>
                      <p>
                        022-39412345
                      </p>
                      <p>
                        020-39412345
                      </p>
                    </div>
                  </div>
                </div>
              </div>
      
            </div>
      
      
            <!-- End Boarding Detail -->
      
            <!-- Cancellation Details -->
      
      
            <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
      
              <div
                style="width: 100%; background: #004684; float: left; font-weight: bold; padding: 5px;padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
                <div style="width: 100%; float: left; margin-right: 0;">
                  Cancellation Details
                </div>
              </div>
      
              
              <div style="width: 100%; display: flex; justify-content: flex-start; gap: 35%; padding: 5px 0 0px 5px;">
                <div style="text-align: center;">
                  <p><strong>Cancellation time</strong></p>
                  ${to.CancelPolicy.map(
                    (policy) => `
                  <p>${policy.PolicyString}</p>`
                  ).join("")}
                </div>
                <div>
                  <p><strong>Cancellation charges</strong></p>
                  ${to.CancelPolicy.map(
                    (policy) =>
                      `<p>${policy.CancellationCharge.toFixed(2)}%</p>`
                  ).join("")}
                </div>
              </div>
            
            </div>
          </div>
      
      
          <!-- End Cancellation Details -->
      
          <!-- Booking Details -->
          <div>
            <div style="
                        margin-bottom: 0;                
                        background: white;
                        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                        border-radius: 12px;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        gap: 12px;
                        display: flex;
                        width: 100%;
                      ">
              <div style="
                          color: #e73c33;
                          font-size: 20px;
                          font-family: Montserrat;
                          font-weight: 700;
                          word-wrap: break-word;
                        ">
                The Skytrails Support
              </div>
              <div style="
                          width: 80%;
                          height: 48px;
                          justify-content: center;
                          align-items: center;
                          gap: 40px;
                          display: inline-flex;
                        ">
                <div style="
                            padding: 4px;
                            background-color: #b3b8bd;
                            border-radius: 12px;
                            justify-content: center;
                            align-items: center;
                            gap: 10px;
                            display: flex;
                          ">
                  <p style="
                              color: #e73c33;
                              font-size: 20px;
                              font-family: Montserrat;
                              font-weight: 700;
                              word-wrap: break-word;
                              margin: 0;
                            ">
                    +91 9209793097
                  </p>
                </div>
                <div style="
                            justify-content: flex-start;
                            align-items: flex-start;
                            gap: 8px;
                            display: flex;
                          ">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="
                                width: 20px;
                                height: 20px;
                                left: 0px;
                                top: 0px;
                                position: absolute;
                                background: #21325d;
                              "></div>
                    <div style="
                                width: 16.67px;
                                height: 13.33px;
                                left: 1.67px;
                                top: 3.33px;
                                position: absolute;
                                background: #e73c33;
                              "></div>
                  </div>
                  <div style="
                              color: #e73c33;
                              font-size: 16px;
                              font-family: Montserrat;
                              font-weight: 600;
                              word-wrap: break-word;
                            ">
                            Info@theskytrails.com
                  </div>
                </div>
              </div>
            </div>
          </div>
           <div style="float: left; width: 100%; margin:0px; padding:0px;">
            <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
              margin-top: 15px;
              border-radius: 15px;">
          </div>
        </div>
      </body>
      
      </html>`;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "Bus_Booking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });

    const passengerEmail = email;
    // console.log("=================",passengerEmail,name)
    const mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: passengerEmail,
      subject: "Bus Booking Confirmation Mail",
      html: busMail(to),
      attachments: [{ filename: "Bus_Booking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await transporter.verify();

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);

      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Hotel Booking Confirmation Mail with pdf=======
  //==========================================================

  HotelBookingConfirmationMail: async (to) => {
    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const noOfNights = () => {
      const checkInDateOld = new Date(to.CheckInDate);
      const checkOutDateOld = new Date(to.CheckOutDate);
      const timeDifference =
        checkOutDateOld.getTime() - checkInDateOld.getTime();
      return timeDifference / (1000 * 60 * 60 * 24);
    };

    const checkInDate = () => {
      const date = new Date(to.CheckInDate);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };
    //Check Out Date formate
    const checkOutDate = () => {
      const date = new Date(to.CheckOutDate);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };

    let htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hotel booking pdf</title>
      </head>
      <body
        style="margin: 0; padding: 0; box-sizing: border-box; background: #f4f3f3"
      >
        <div style="width: 80vw; margin: 5% 10%">
          <div
            style="
              justify-content: space-between;
              align-items: center;
              display: flex;
              height: 156px;
            "
          >
            <img
              src="https://travvolt.s3.amazonaws.com/ST-Main-Logo.png"
              alt="logo"
              style="height: 100%"
            />
            <div
              style="
                color: black;
                font-size: 24px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
              "
            >
              Booking Voucher
            </div>
            <div
              style="
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 8px;
                display: flex;
              "
            >
              <div
                style="
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: #868686;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  Booking Id:
                </div>
                <div
                  style="
                    color: #071c2c;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  ${to.bookingId}
                </div>
              </div>
              <div
                style="
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: #868686;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  PNR:
                </div>
                <div
                  style="
                    color: #071c2c;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  ${to.bookingId}
                </div>
              </div>
              <div
                style="
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: #868686;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  (Booked on ${formattedDate})
                </div>
              </div>
            </div>
          </div>
          <div
            style="
              background: white;
              padding: 24px;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              border-radius: 12px;
              height: 700px;
            "
          >
            <!-- <div style="display: flex; justify-content: space-between">
              <div>
                <div
                  style="
                    color: black;
                    font-size: 20px;
                    font-family: Montserrat;
                    font-weight: 600;
                    word-wrap: break-word;
                  "
                >
                  ${to.hotelName}
                </div>
              </div>
              <div>
                <h2
                  style="
                    color: #e73c33;
                    font-size: 24px;
                    font-family: Montserrat;
                    font-weight: 600;
                    word-wrap: break-word;
                  "
                >
                  CONFIRM
                </h2>
                <p>THANK YOU</p>
              </div>
            </div> -->
           
            <!--  -->
            <div style="width: 100%; height: 53px; justify-content: space-between; align-items: flex-start; display: inline-flex">
              <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                <div style="color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${
                  to.hotelName
                }</div>
                <div style="height: 24px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                </div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-end; display: inline-flex">
                <div style="color: #E73C33; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">CONFIRMED </div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">THANK YOU</div>
              </div>
            </div>
    
    
            <div style="width: 100%; height: 84px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 12px; display: inline-flex">
              <div style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${
                to.address
              }</div>
              <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                  <div style="width: 15px; height: 15px; left: 2.50px; top: 2.50px; position: absolute; background: #21325D"></div>
                </div>
                <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">98173678181, 8912731729</div>
              </div>
              <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #21325D"></div>
                  <div style="width: 16.67px; height: 13.33px; left: 1.67px; top: 3.33px; position: absolute; background: #21325D"></div>
                </div>
                <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">HB374-RE@Skytrails.com</div>
              </div>
            </div>
           
    
            <!--  -->
            
            <div style="width: 100%; height: 428.67px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 36px; display: inline-flex">
              <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
              <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                  <div style="width: 20px; height: 20px; justify-content: center; align-items: center; gap: 10px; display: flex">
                    <div style="flex: 1 1 0; align-self: stretch"></div>
                    <div style="width: 15px; height: 16.67px; left: 2.50px; top: 1.66px; position: absolute; background: #E73C33"></div>
                  </div>
                  <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${noOfNights()}-Nights Stay</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-in</div>
                  <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${checkInDate()}</span></div>
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">After 03:00 PM</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-out</div>
                  <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${checkOutDate()} </span></div>
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Before 12:00 PM</div>
                </div>
              </div>
              <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
              <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: center; gap: 120px; display: inline-flex">
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #E73C33"></div>
                  </div>
                  <div><span style="color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                    to.noOfPeople
                  } Guests<br/></span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(${
      to.noOfPeople
    } Adults)</span></div>
                </div>
                <div style="align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; display: inline-flex">
                  <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                    to.name
                  } </span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(Primary Guest)</span></div>
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                    to.email
                  }, ${to.phone}</div>
                </div>
              </div>
              <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 136px; display: inline-flex">
                <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 16.67px; height: 11.67px; left: 1.67px; top: 4.17px; position: absolute; background: #E73C33"></div>
                  </div>
                  <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                    to.room
                  } Room</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
                  <div style="justify-content: center; align-items: center; gap: 8px; display: inline-flex">
                    <div style="width: 20px; height: 20px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 58px; display: inline-flex">
                      <div style="justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                        <div style="width: 12px; height: 16px; left: 6px; top: 4px; position: absolute; background: #071C2C"></div>
                      </div>
                    </div>
                    <div style="text-align: center; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Restaurant</div>
                  </div>
                  <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                    <div style="width: 20px; height: 20px; position: relative">
                      <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                      <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                      to.noOfPeople
                    } Adults</div>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
          <div style="width: 100%; margin-top: 5px; height: 200px; padding-top: 24px; padding-bottom: 24px; background: white; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 12px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
            <div style="align-self: stretch; justify-content: space-between; align-items: flex-start; display: inline-flex">
              <div style="flex-direction: column; justify-content: flex-start;  padding-left: 28px; padding-right: 28px; align-items: flex-start; gap: 12px; display: inline-flex">
                <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${
                  to.hotelName
                }</div>
                <div style="justify-content: center; align-items: center; gap: 24px; display: inline-flex">
                  <div style="width: 120px; justify-content: flex-start; align-items: flex-start; display: flex">
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                  </div>
                  <div style="padding: 4px; border-radius: 4px; border: 2px #E73C33 solid; justify-content: center; align-items: center; gap: 10px; display: flex">
                    <div style="color: #071C2C; font-size: 8px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Couple Friendly</div>
                  </div>
                </div>
              </div>
              <img style="width: 247px; height: 117px; background: linear-gradient(0deg, #D9D9D9 0%, #D9D9D9 100%); border-radius: 8px" src="https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/room-imgs/201610072207462380-180447-1ba3a1c68aaf11e898ae0a9df65c8753.jpg" />
            </div>
            <div style="align-self: stretch; padding-left: 28px; padding-right: 28px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
              <div style="flex: 1 1 0; color: #BBBBBB; font-size: 12px; font-family: Montserrat; font-weight: 700; letter-spacing: 0.48px; word-wrap: break-word">${checkInDate()} - ${checkOutDate()} | ${
      to.room
    } Room | ${to.noOfPeople} Adults (${to.name} + ${to.noOfPeople - 1})</div>
            </div>
          </div>
    
          <div style="width: 100%; margin-top: 5px; height: 422px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
            <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Room Type & Amenities </div>
            <div style="height: 369px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: flex">
              <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
              <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                  <div style="width: 12.50px; height: 16.67px; left: 3.33px; top: 1.66px; position: absolute; background: #071C2C"></div>
                </div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Breakfast</div>
              </div>
              <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                <div style="width: 24px; height: 24px; position: relative">
                  <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                  <div style="width: 22px; height: 16px; left: 1px; top: 4px; position: absolute; background: #071C2C"></div>
                </div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2 Guests</div>
              </div>
              <div style="align-self: stretch; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">TV, Telephone, Centre Table, Bathroom, Chair, Seating Area, Cupboards with Locks, Hot & Cold Water, Dining Table, Sofa, Blackout Curtains, Blanket, Electronic Safe, Living Area, Room Service, Western Toilet Seat, Bidet, Housekeeping, Dining Area, Shaving Mirror, Toiletries, Mineral Water, Wi-Fi, Bathroom Phone, Balcony, Hairdryer, Geyser/Water Heater, Shower Cap, Mini Fridge, Kettle, Air Conditioning, Dental Kit, Charging Points, Slippers, In-room Dining.</div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                <div style="text-align: center; color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">INCLUSIONS</div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                  <div style="justify-content: flex-start; align-items: center; gap: 21px; display: inline-flex">
                    <div style="width: 472px; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">All transfers on private basis to airport and sightseeing places.</div>
                  </div>
                  <div style="justify-content: flex-start; align-items: flex-start; gap: 21px; display: inline-flex">
                    <div style="color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Tickets to Miracle Garden</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <!-- cancel refund policy start -->
    
          <div style="width: 100%; height: 100px; margin-top: 5px; background: white; box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.25); border-radius: 12px; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
            <div style="align-self: stretch; height: 20px; padding-left: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 26px; display: flex">
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C;  font-size: 16px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Cancellation Refund Policy</div>
              </div>
            </div>
            <div style="align-self: stretch; padding-left: 24px; color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word"> Free Cancellation (100% refund) Before ${checkInDate()}.</div>
           
          </div>
    
          <!-- cancel refund policy end -->
    
          <!-- fare break-down start-->
    
          <div style="width: 100%; margin-top: 5px; height: 150px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px #868686 solid; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
            <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Booking Price Break-up</div>
            </div>
            <div style="flex-direction: column; width: 100%; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px;  justify-content: flex-start; align-items: flex-start; gap: 64px; display: inline-flex">
                <div style="width: 100%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Accommodation charges collected on behalf of hotel (incl. applicable hotel taxes)</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR ${
                  to.amount
                }</div>
              </div>
              <!--
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Skytrails Service Fee</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 254</div>
              </div>
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">HR-SGST @ 9%</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
              </div> 
              
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">CGST @ 9%</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
              </div>
              -->
              <div style="align-self: stretch; height: 0px; border: 1px #868686 solid"></div>
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="width: 80%; color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">TOTAL</div>
                <div style="color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR ${
                  to.amount
                }</div>
              </div>
            </div>
          </div>
    
    
          <!-- fare break-down end -->
    
          <!-- hotel Amenities start-->
    
          <div style="width: 100%; margin-top: 5px; height: 250px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
            <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Hotel Amenities</div>
            <div style="align-self: stretch; height: 640px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Common Area</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Lounge, Lawn, Reception, Library, Seating Area, Outdoor Furniture</div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Outdoor Activities and Sports</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Water Sports, Outdoor Sports</div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Business Center and Conferences</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Business Centre, Conference Room, Banquet</div>
              </div>
              
            </div>
          </div>
    
    
          <!-- hotel amenities end -->
    
          <!-- hotel rule start -->
    
    
          <div style="width: 100%; height: 300px; margin-top: 30px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
            <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Rules & Policies</div>
            <div style="align-self: stretch; height: 812px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Food Arrangement</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Non veg food is allowed<br/>Food delivery service is not available at the property<br/>Outside food is not allowed</div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Smoking/alcohol Consumption Rules</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">There are no restrictions on alcohol consumption.<br/>Smoking within the premises is not allowed</div>
              </div>
            </div>
          </div>
    
    
    
          <!-- hotel rule end -->
    
    
          <div
            style="
              padding-left: 28px;
              margin-top: 5px;
              padding-right: 28px;
              padding-top: 24px;
              padding-bottom: 24px;
              background: white;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              border-radius: 12px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 24px;
              display: flex;
            "
          >
            <div
              style="
                color: #e73c33;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
              "
            >
              The Skytrails Support
            </div>
            <div
              style="
                width: 456px;
                height: 48px;
                justify-content: flex-start;
                align-items: center;
                gap: 40px;
                display: inline-flex;
              "
            >
              <div
                style="
                  padding: 12px;
                  background: #e73c33;
                  border-radius: 12px;
                  justify-content: center;
                  align-items: center;
                  gap: 10px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: white;
                    font-size: 20px;
                    font-family: Montserrat;
                    font-weight: 700;
                    word-wrap: break-word;
                  "
                >
                  +91 9209793097
                </div>
              </div>
              <div
                style="
                  justify-content: flex-start;
                  align-items: flex-start;
                  gap: 8px;
                  display: flex;
                "
              >
                <div style="width: 20px; height: 20px; position: relative">
                  <div
                    style="
                      width: 20px;
                      height: 20px;
                      left: 0px;
                      top: 0px;
                      position: absolute;
                      background: #21325d;
                    "
                  ></div>
                  <div
                    style="
                      width: 16.67px;
                      height: 13.33px;
                      left: 1.67px;
                      top: 3.33px;
                      position: absolute;
                      background: #e73c33;
                    "
                  ></div>
                </div>
                <div
                  style="
                    color: #e73c33;
                    font-size: 16px;
                    font-family: Montserrat;
                    font-weight: 600;
                    word-wrap: break-word;
                  "
                >
                Info@theskytrails.com
                </div>
              </div>
            </div>
          </div>
          <div style="float: left; width: 100%; margin:0px; padding:0px;">
            <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
              margin-top: 15px;
              border-radius: 15px;">
          </div>
        </div>
      </body>
    </html>`;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "hotelBooking.pdf";

    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });
    const email = to.email;
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: email,
      subject: "Hotel Booking Confirmation Mail",
      html: hotelMail(to),
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);

      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  hotelBookingConfirmationMailWithNewEmail: async (to, emailTicket) => {
    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const noOfNights = () => {
      const checkInDateOld = new Date(to.CheckInDate);
      const checkOutDateOld = new Date(to.CheckOutDate);
      const timeDifference =
        checkOutDateOld.getTime() - checkInDateOld.getTime();
      return timeDifference / (1000 * 60 * 60 * 24);
    };

    const checkInDate = () => {
      const date = new Date(to.CheckInDate);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };
    //Check Out Date formate
    const checkOutDate = () => {
      const date = new Date(to.CheckOutDate);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };

    let htmlContent = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Hotel booking pdf</title>
        </head>
        <body
          style="margin: 0; padding: 0; box-sizing: border-box; background: #f4f3f3"
        >
          <div style="width: 80vw; margin: 5% 10%">
            <div
              style="
                justify-content: space-between;
                align-items: center;
                display: flex;
                height: 156px;
              "
            >
              <img
                src="https://travvolt.s3.amazonaws.com/ST-Main-Logo.png"
                alt="logo"
                style="height: 100%"
              />
              <div
                style="
                  color: black;
                  font-size: 24px;
                  font-family: Montserrat;
                  font-weight: 600;
                  word-wrap: break-word;
                "
              >
                Booking Voucher
              </div>
              <div
                style="
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  display: flex;
                "
              >
                <div
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: #868686;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    Booking Id:
                  </div>
                  <div
                    style="
                      color: #071c2c;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    ${to.bookingId}
                  </div>
                </div>
                <div
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: #868686;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    PNR:
                  </div>
                  <div
                    style="
                      color: #071c2c;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    ${to.bookingId}
                  </div>
                </div>
                <div
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: #868686;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    (Booked on ${formattedDate})
                  </div>
                </div>
              </div>
            </div>
            <div
              style="
                background: white;
                padding: 24px;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 12px;
                height: 700px;
              "
            >
              <!-- <div style="display: flex; justify-content: space-between">
                <div>
                  <div
                    style="
                      color: black;
                      font-size: 20px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    "
                  >
                    ${to.hotelName}
                  </div>
                </div>
                <div>
                  <h2
                    style="
                      color: #e73c33;
                      font-size: 24px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    "
                  >
                    CONFIRM
                  </h2>
                  <p>THANK YOU</p>
                </div>
              </div> -->
             
              <!--  -->
              <div style="width: 100%; height: 53px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                  <div style="color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${
                    to.hotelName
                  }</div>
                  <div style="height: 24px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                  </div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-end; display: inline-flex">
                  <div style="color: #E73C33; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">CONFIRMED </div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">THANK YOU</div>
                </div>
              </div>
      
      
              <div style="width: 100%; height: 84px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 12px; display: inline-flex">
                <div style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${
                  to.address
                }</div>
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 15px; height: 15px; left: 2.50px; top: 2.50px; position: absolute; background: #21325D"></div>
                  </div>
                  <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">98173678181, 8912731729</div>
                </div>
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #21325D"></div>
                    <div style="width: 16.67px; height: 13.33px; left: 1.67px; top: 3.33px; position: absolute; background: #21325D"></div>
                  </div>
                  <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">HB374-RE@Skytrails.com</div>
                </div>
              </div>
             
      
              <!--  -->
              
              <div style="width: 100%; height: 428.67px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 36px; display: inline-flex">
                <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
                <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                    <div style="width: 20px; height: 20px; justify-content: center; align-items: center; gap: 10px; display: flex">
                      <div style="flex: 1 1 0; align-self: stretch"></div>
                      <div style="width: 15px; height: 16.67px; left: 2.50px; top: 1.66px; position: absolute; background: #E73C33"></div>
                    </div>
                    <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${noOfNights()}-Nights Stay</div>
                  </div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-in</div>
                    <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${checkInDate()}</span></div>
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">After 03:00 PM</div>
                  </div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-out</div>
                    <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${checkOutDate()} </span></div>
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Before 12:00 PM</div>
                  </div>
                </div>
                <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
                <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: center; gap: 120px; display: inline-flex">
                  <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
                    <div style="width: 20px; height: 20px; position: relative">
                      <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                      <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #E73C33"></div>
                    </div>
                    <div><span style="color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                      to.noOfPeople
                    } Guests<br/></span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(${
      to.noOfPeople
    } Adults)</span></div>
                  </div>
                  <div style="align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; display: inline-flex">
                    <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                      to.name
                    } </span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(Primary Guest)</span></div>
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                      to.email
                    }, ${to.phone}</div>
                  </div>
                </div>
                <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 136px; display: inline-flex">
                  <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                    <div style="width: 20px; height: 20px; position: relative">
                      <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 16.67px; height: 11.67px; left: 1.67px; top: 4.17px; position: absolute; background: #E73C33"></div>
                    </div>
                    <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                      to.room
                    } Room</div>
                  </div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
                    <div style="justify-content: center; align-items: center; gap: 8px; display: inline-flex">
                      <div style="width: 20px; height: 20px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 58px; display: inline-flex">
                        <div style="justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                          <div style="width: 12px; height: 16px; left: 6px; top: 4px; position: absolute; background: #071C2C"></div>
                        </div>
                      </div>
                      <div style="text-align: center; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Restaurant</div>
                    </div>
                    <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                      <div style="width: 20px; height: 20px; position: relative">
                        <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                        <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${
                        to.noOfPeople
                      } Adults</div>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
            <div style="width: 100%; margin-top: 5px; height: 200px; padding-top: 24px; padding-bottom: 24px; background: white; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 12px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
              <div style="align-self: stretch; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="flex-direction: column; justify-content: flex-start;  padding-left: 28px; padding-right: 28px; align-items: flex-start; gap: 12px; display: inline-flex">
                  <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${
                    to.hotelName
                  }</div>
                  <div style="justify-content: center; align-items: center; gap: 24px; display: inline-flex">
                    <div style="width: 120px; justify-content: flex-start; align-items: flex-start; display: flex">
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                    </div>
                    <div style="padding: 4px; border-radius: 4px; border: 2px #E73C33 solid; justify-content: center; align-items: center; gap: 10px; display: flex">
                      <div style="color: #071C2C; font-size: 8px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Couple Friendly</div>
                    </div>
                  </div>
                </div>
                <img style="width: 247px; height: 117px; background: linear-gradient(0deg, #D9D9D9 0%, #D9D9D9 100%); border-radius: 8px" src="https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/room-imgs/201610072207462380-180447-1ba3a1c68aaf11e898ae0a9df65c8753.jpg" />
              </div>
              <div style="align-self: stretch; padding-left: 28px; padding-right: 28px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                <div style="flex: 1 1 0; color: #BBBBBB; font-size: 12px; font-family: Montserrat; font-weight: 700; letter-spacing: 0.48px; word-wrap: break-word">${checkInDate()} - ${checkOutDate()} | ${
      to.room
    } Room | ${to.noOfPeople} Adults (${to.name} + ${to.noOfPeople - 1})</div>
              </div>
            </div>
      
            <div style="width: 100%; margin-top: 5px; height: 422px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Room Type & Amenities </div>
              <div style="height: 369px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
                <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 12.50px; height: 16.67px; left: 3.33px; top: 1.66px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Breakfast</div>
                </div>
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 22px; height: 16px; left: 1px; top: 4px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2 Guests</div>
                </div>
                <div style="align-self: stretch; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">TV, Telephone, Centre Table, Bathroom, Chair, Seating Area, Cupboards with Locks, Hot & Cold Water, Dining Table, Sofa, Blackout Curtains, Blanket, Electronic Safe, Living Area, Room Service, Western Toilet Seat, Bidet, Housekeeping, Dining Area, Shaving Mirror, Toiletries, Mineral Water, Wi-Fi, Bathroom Phone, Balcony, Hairdryer, Geyser/Water Heater, Shower Cap, Mini Fridge, Kettle, Air Conditioning, Dental Kit, Charging Points, Slippers, In-room Dining.</div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                  <div style="text-align: center; color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">INCLUSIONS</div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                    <div style="justify-content: flex-start; align-items: center; gap: 21px; display: inline-flex">
                      <div style="width: 472px; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">All transfers on private basis to airport and sightseeing places.</div>
                    </div>
                    <div style="justify-content: flex-start; align-items: flex-start; gap: 21px; display: inline-flex">
                      <div style="color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Tickets to Miracle Garden</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
            <!-- cancel refund policy start -->
      
            <div style="width: 100%; height: 100px; margin-top: 5px; background: white; box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.25); border-radius: 12px; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
              <div style="align-self: stretch; height: 20px; padding-left: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 26px; display: flex">
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C;  font-size: 16px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Cancellation Refund Policy</div>
                </div>
              </div>
              <div style="align-self: stretch; padding-left: 24px; color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word"> Free Cancellation (100% refund) Before ${checkInDate()}.</div>
             
            </div>
      
            <!-- cancel refund policy end -->
      
            <!-- fare break-down start-->
      
            <div style="width: 100%; margin-top: 5px; height: 150px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px #868686 solid; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Booking Price Break-up</div>
              </div>
              <div style="flex-direction: column; width: 100%; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px;  justify-content: flex-start; align-items: flex-start; gap: 64px; display: inline-flex">
                  <div style="width: 100%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Accommodation charges collected on behalf of hotel (incl. applicable hotel taxes)</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR ${
                    to.amount
                  }</div>
                </div>
                <!--
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Skytrails Service Fee</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 254</div>
                </div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">HR-SGST @ 9%</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
                </div> 
                
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">CGST @ 9%</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
                </div>
                -->
                <div style="align-self: stretch; height: 0px; border: 1px #868686 solid"></div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="width: 80%; color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">TOTAL</div>
                  <div style="color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR ${
                    to.amount
                  }</div>
                </div>
              </div>
            </div>
      
      
            <!-- fare break-down end -->
      
            <!-- hotel Amenities start-->
      
            <div style="width: 100%; margin-top: 5px; height: 250px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Hotel Amenities</div>
              <div style="align-self: stretch; height: 640px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Common Area</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Lounge, Lawn, Reception, Library, Seating Area, Outdoor Furniture</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Outdoor Activities and Sports</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Water Sports, Outdoor Sports</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Business Center and Conferences</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Business Centre, Conference Room, Banquet</div>
                </div>
                
              </div>
            </div>
      
      
            <!-- hotel amenities end -->
      
            <!-- hotel rule start -->
      
      
            <div style="width: 100%; height: 300px; margin-top: 30px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Rules & Policies</div>
              <div style="align-self: stretch; height: 812px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Food Arrangement</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Non veg food is allowed<br/>Food delivery service is not available at the property<br/>Outside food is not allowed</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Smoking/alcohol Consumption Rules</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">There are no restrictions on alcohol consumption.<br/>Smoking within the premises is not allowed</div>
                </div>
              </div>
            </div>
      
      
      
            <!-- hotel rule end -->
      
      
            <div
              style="
                padding-left: 28px;
                margin-top: 5px;
                padding-right: 28px;
                padding-top: 24px;
                padding-bottom: 24px;
                background: white;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 12px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 24px;
                display: flex;
              "
            >
              <div
                style="
                  color: #e73c33;
                  font-size: 20px;
                  font-family: Montserrat;
                  font-weight: 700;
                  word-wrap: break-word;
                "
              >
                The Skytrails Support
              </div>
              <div
                style="
                  width: 456px;
                  height: 48px;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 40px;
                  display: inline-flex;
                "
              >
                <div
                  style="
                    padding: 12px;
                    background: #e73c33;
                    border-radius: 12px;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: white;
                      font-size: 20px;
                      font-family: Montserrat;
                      font-weight: 700;
                      word-wrap: break-word;
                    "
                  >
                    +91 9209793097
                  </div>
                </div>
                <div
                  style="
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 8px;
                    display: flex;
                  "
                >
                  <div style="width: 20px; height: 20px; position: relative">
                    <div
                      style="
                        width: 20px;
                        height: 20px;
                        left: 0px;
                        top: 0px;
                        position: absolute;
                        background: #21325d;
                      "
                    ></div>
                    <div
                      style="
                        width: 16.67px;
                        height: 13.33px;
                        left: 1.67px;
                        top: 3.33px;
                        position: absolute;
                        background: #e73c33;
                      "
                    ></div>
                  </div>
                  <div
                    style="
                      color: #e73c33;
                      font-size: 16px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    "
                  >
                    HB374-RE@Skytrails.com
                  </div>
                </div>
              </div>
            </div>
            <div style="float: left; width: 100%; margin:0px; padding:0px;">
              <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" style="width: 100%;
                margin-top: 15px;
                border-radius: 15px;">
            </div>
          </div>
        </body>
      </html>`;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "hotelBooking.pdf";

    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });
    const email = emailTicket;
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: email,
      subject: "Hotel Booking Confirmation Mail",
      html: hotelMail(to),
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);

      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },


  // Hotel booking Grn with pdf

  grnHotelBookingConfirmationMailWithPdf:  async (to) => {
    const currentDate = new Date(to.createdAt);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const noOfNights = () => {
      const checkInDateOld = new Date(to.CheckInDate);
      const checkOutDateOld = new Date(to.CheckOutDate);
      const timeDifference =
        checkOutDateOld.getTime() - checkInDateOld.getTime();
      return timeDifference / (1000 * 60 * 60 * 24);
    };

    const checkInDate = () => {
      const date = new Date(to.CheckInDate);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };
    //Check Out Date formate
    const checkOutDate = () => {
      const date = new Date(to.CheckOutDate);
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };

    let cancellationPolicy;

    if(to?.hotel?.non_refundable===false){
      cancellationPolicy=`
      <p><strong>Refundable:</strong>Yes</p>
      <p><strong>Cancel by Date:</strong>${to?.hotel?.cancellation_policy?.cancel_by_date}</p>
      `;
    }else{
      cancellationPolicy=`
       <p><strong>Refundable:</strong> No</p>      
      `;
    }

    let htmlContent = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
            }
    
            .skyLogo {
                width: 200px;
            }
    
            .container {
                /* max-width: 950px; */
                margin: 30px auto;
                /* padding: 20px; */
                background-color: #fff;
                /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
                border-radius: 10px;
            }
    
            h1,
            h2 {
                text-align: center;
                color: #333;
                margin-top: 0;
            }
    
            h2 {
                margin-bottom: 10px;
            }
    
            .section {
                margin-bottom: 37px;
            }
    
            .booking-pass {
                background-color: rgba(255, 0, 0, 0.1);
                /* Translucent red */
                border: 2px dashed #00838f;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 30px;
                /* display: flex; */
                /* flex-wrap: wrap; */
                align-items: center;
                position: relative;
            }
    
            .booking-pass:before,
            .booking-pass:after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: #fff;
                border-radius: 50%;
            }
    
            .booking-pass:before {
                top: -11px;
                left: 10px;
                border: 2px dashed #00838f;
            }
    
            .booking-pass:after {
                bottom: -11px;
                right: 10px;
                border: 2px dashed #00838f;
            }
    
            .booking-pass h2 {
                color: #333;
                width: 100%;
                margin-bottom: 20px;
                text-align: center;
            }
    
            .bookBox {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
    
            .booking-pass p {
                margin: 5px 0;
                font-size: 16px;
            }
    
            .booking-pass p strong {
                display: inline-block;
                width: 150px;
                color: #e73c34;
            }
    
            .section img {
                width: 100%;
                height: 50vh;
                /* 50% of the viewport height */
                object-fit: cover;
                /* Maintain aspect ratio */
                display: block;
                margin: 0 auto 20px;
                border-radius: 10px;
            }
    
            .section p {
                margin: 10px 0;
                line-height: 1.6;
            }
    
            .section p strong {
                display: inline-block;
                width: 150px;
                color: #e73c34;
            }
    
            .pax-info ul {
                list-style: none;
                padding: 0;
            }
    
            .pax-info ul li {
                background: #f1f1f1;
                margin-bottom: 10px;
                padding: 10px;
                border-radius: 5px;
            }
    
            .pax-info ul li span {
                display: inline-block;
                width: 120px;
                color: #e73c34;
            }
    
            .support-section {
                padding-left: 28px;
                margin-top: 5px;
                padding-right: 28px;
                padding-top: 24px;
                padding-bottom: 24px;
                background: white;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 12px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 24px;
                display: flex;
            }
    
            .support-title {
                color: #e73c33;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
            }
    
            .support-contact {
                width: 456px;
                height: 48px;
                justify-content: flex-start;
                align-items: center;
                gap: 40px;
                display: inline-flex;
            }
    
            .contact-box {
                padding: 12px;
                background: #e73c33;
                border-radius: 12px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                display: flex;
            }
    
            .contact-box div {
                color: white;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
            }
    
            .contact-email {
                justify-content: flex-start;
                align-items: flex-start;
                gap: 8px;
                display: flex;
            }
    
            .contact-email div {
                color: #e73c33;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
            }
    
            .footer-img {
                width: 100%;
                height: 60%;
                margin-top: 15px;
                border-radius: 15px;
            }
    
    
            .imgBox {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 35px;
                margin-bottom: 30px;
            }
    
            .imgBox .hotel-image {
                height: 200px;
                width: 300px;
            }
    
            .imgBox .hotel-image img {
                height: 100%;
                width: 100%;
                border-radius: 8px;
                object-fit: cover;
            }
    
    
            #customers {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }
    
            #customers td,
            #customers th {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
            }
    
    
    
    
            #customers th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: center;
                /* background-color: #04AA6D; */
                color: black;
            }
    
    
    
            .roomandcancel {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
    
            .roomandcancel h2 {
                text-align: left;
            }
        </style>
    </head>
    
    <body>
        <div style="width: 100vw;">
            <div style="justify-content: space-between; align-items: center; display: flex; height: 96px;">
                <img class="skyLogo"
                    src="https://raw.githubusercontent.com/The-SkyTrails/Images/5f36baf303400e9ebc6e907da08418b398d2b5b7/logoSky.svg"
                    alt="logo" style="height: 100%;" />
                <div
                    style="color: black; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word;">
                    Booking Voucher
                </div>
                <div style="flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex;">
                    <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                        <div
                            style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                            Booking Id:
                        </div>
                        <div
                            style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                            ${to.booking_id}
                        </div>
                    </div>
                    <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
                        <div
                            style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                            (Booked on ${formattedDate})
                        </div>
                    </div>
                </div>
            </div>
            <div
                style="background: white; padding: 24px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 12px;">
                <div class="container">
                    <!-- <h1>Booking Details</h1> -->
                    <div class="booking-pass section">
                        <h2>Booking Information</h2>
                        <div class="bookBox">
                            <div class="bookOne">
                                <p><strong>Booking ID:</strong>${to?.booking_id}</p>
                                <p><strong>Booking Reference:</strong>${to?.booking_reference}</p>
                                <p><strong>Total Price:</strong>₹ ${to.total}</p>
                            </div>
                            <div class="bookTwo">
                                <p><strong>Check-in Date:</strong>${to?.checkin}</p>
                                <p><strong>Check-out Date:</strong>${to?.checkout}</p>
                                
                                <p><strong>Status:</strong> BOOKED</p>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <h2 style="margin-bottom: 35px;">Hotel Information</h2>
                        <div class="imgBox">
                            <div class="hotel-image">
                                <img src=${to?.hotel?.imageUrl}
                                    alt="Hotel Image">
                            </div>
                            <div class="hotel-details">
                                <p><strong>Hotel Name:</strong>${to?.hotel?.name}</p>
                                <p><strong>Address:</strong>${to?.hotel?.address}</p>
                                <p><strong>Category:</strong>${to?.hotel?.category}</p>
                                
                            </div>
                        </div>
                    </div>
                    <div class="section holder-info">
                        <h2 style="margin-bottom: 40px;">Holder Information</h2>
                        <p><strong>Name:</strong>${to?.holder?.title} ${to?.holder?.name} ${to?.holder?.surname}</p>
                        <p><strong>Nationality:</strong>${to?.holder?.client_nationality}</p>
                        <p><strong>Email:</strong>${to?.holder?.email}</p>
                        <p><strong>PAN Number:</strong>${to?.holder?.pan_number}</p>
                    </div>
                    <div class="section pax-info">
                        <h2 style="margin-top: 45px;">Passengers</h2>
                        
                        <div>
                            <table id="customers">
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                </tr>


                              ${to.hotel.paxes.map((item)=>`
                              <tr>
                                    <td>${item?.title} ${item?.name} ${item?.surname}</td>
                                    <td>${item?.age ? `${item.age}` : 'Adult'}</td>
                                </tr>

                              `).join("")}
                                
                              
                            </table>
                        </div>
                    </div>
                    <!--
                    <div class="section room-info">
                        <h2>Room Details</h2>
                        <p><strong>Description:</strong> Apartment, 2 Bedrooms (1 King Bed)</p>
                        <p><strong>Number of Adults:</strong> 2</p>
                        <p><strong>Number of Children:</strong> 2</p>
                        <p><strong>Number of Rooms:</strong> 1</p>
                    </div>
                    -->
                    <div class="section room-info">
                        <h2>Room Details</h2>
                        <p><strong>Rooms:</strong>${to?.hotel?.rooms.length}</p>
                        <p><strong>Guest</strong>${to?.hotel?.paxes.length} </p>
                    </div>
                    <div class="section cancellation-policy">
                        <h2>Cancellation Policy</h2>
                        ${cancellationPolicy}                        
                    </div>    
                </div>
            </div>
            <div class="support-section">
                <div class="support-title">The Skytrails Support</div>
                <div class="support-contact">
                    <div class="contact-box">
                        <div>+91 9209793097</div>
                    </div>
                    <div class="contact-email">
                        <div>Info@theskytrails.com</div>
                    </div>
                </div>
            </div>
            <div style="float: left; width: 100%; margin: 0px; padding: 0px">
                <img src="https://travvolt.s3.amazonaws.com/app_banner.png" alt="SkyTrails_banner" class="footer-img" />
            </div>
        </div>
    </body>    
    </html>`;

    // Create a new PDF document
    const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const page = await browser.newPage();

    // Save the PDF to a temporary file
    await page.setContent(htmlContent);

    const pdfFilePath = "hotelBooking.pdf";

    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);

    console.log("PDF generation complete.");

    fs.writeFileSync(pdfFilePath, pdfBytes);

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
      connectionTimeout: 60000,
    });
    const email = to?.holder?.email;
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: email,
      subject: "Hotel Booking Confirmation Mail",
      html: hotelGrnMail(to),
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);

      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //upload image on cloudinary***************************************
  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    // console.log("result=============", result);
    return result.secure_url;
  },

  getImageUrl: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files.path, {
      resource_type: "auto",
    });
    return result.secure_url;
  },
  //===============================================================================================
  //===================== Send Email For Admin ====================================================
  //===============================================================================================

  // Send mail for hotel booking cencel Request user to admin ////////////////////

  hotelBookingCencelRequestForAdmin: async (to) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Hotel Booking Cancellation Request",
      text: to.message,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  // Send mail for flight Booking cencel Request user to admin =========

  flightBookingCencelRequestForAdmin: async (to) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Flight Booking Cancellation Request",
      text: to.message,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  sendHotelBookingCancelation: async (to, hotelName) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                    <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px;" />
    
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                            your hotel booking of hotel ${hotelName} is canceled successfully from skyTrails.
                            You get your refund with in 7 days as per our policy. 
                    </div>
                </div>
    
            </div>
        </div>
    
    </body>
    </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Hotel Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  sendVerificationMail: async (to, otp) => {
    // let html = `<!DOCTYPE html>
    // <html lang="en">

    // <head>
    //     <title>Reset Password</title>
    // </head>
    // <body>
    //     <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    //         transition: 0.3s;
    //         width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
    //         <div class="main" style="background-image: url('');">
    //             <div class="main-container" style="text-align: center;">
    //                 <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
    //                 <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px;" />
    //                 <div style="width: 90%;margin: auto; text-align: left;">
    //                     <br><br>
    //                     <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
    //                         ${otp} is your OTP for verify and reset your password.
    //                 </div>
    //             </div>

    //         </div>
    //     </div>

    // </body>
    // </html>`;
    var transporter = nodemailerConfig.createTransport({
      service: nodemailerConfig.service,
      auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Reset Password",
      html: otpMail(otp),
    };
    return await transporter.sendMail(mailOptions);
  },

  sendEmailOtp: async (email, otp) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: email,
      subject: "Otp for verication",
      html: otpMail(otp),
    };
    return await transporter.sendMail(mailOptions);
  },
  sendEmailResetPassword: async (email, token) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerConfigHawaiYatra.options.auth.userHawai,
        pass: nodemailerConfigHawaiYatra.options.auth.passHawai,
      },
    });
    var mailOptions = {
      from: nodemailerConfigHawaiYatra.userHawai,
      to: email,
      subject: "Reset Subadmin Password",
      html: SubAdminResetPassword(token),
    };
    return await transporter.sendMail(mailOptions);
  },

  sendSubAdmin: async (to, userName, pass) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Congratulations,you are become member of theSkyTrais, ",
      html: welcomeMail(to, userName, pass),
    };
    return await transporter.sendMail(mailOptions);
  },
  sendRMCredential: async (to, userName, password) => {
    // console.log("to, userName, password=============",to, userName, password)
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Congratulations,you are become member of theSkyTrais, ",
      html: welcomeMail(to, userName, password),
    };
    return await transporter.sendMail(mailOptions);
  },
  
  senConfirmationQuery: async (to) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Thank You for Your Query</title>
        <style>
        body {
          font-family: 'Open Sans', sans-serif;
          background: #f1f1f1; // Light gray background
          margin: 0;
          padding: 0;
        }
        
        .card {
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); // Subtle shadow
          transition: 0.5s;
          width: 80%;
          margin: auto;
          min-height: 20em;
          margin-top: 70px;
          background-color: #fff;
          border: 1px solid #ddd; // Subtle border
          border-radius: 20px;
          overflow: hidden;
        }
        
        .main {
          background-color: #e4e4e4; // Light gray background
          height: 200px;
        }
        
        .main-container {
          text-align: center;
          padding: 20px;
          color: #333; // Dark gray text
        }
        
        img {
          width: 25%;
          border-radius: 50%;
          margin-top: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); // Subtle drop shadow
        }
        
        .message-container {
          width: 90%;
          margin: auto;
          text-align: left;
          padding-top: 40px; // Increased padding
        }
        
        p {
          font-size: 22px; // Increased font size
          line-height: 1.6;
          margin-top: 0;
          color: #555;
        }
        
        h1 {
          font-family: Arial, sans-serif; // Sans-serif font
          font-size: 42px;
          color: #333; // Dark gray text
          margin-bottom: 15px; // Increased spacing
        }
        
        </style>
    </head>
    
    <body>
        <div class="card">
            <div class="main" style="background-image: url('');"></div>
            <div class="main-container">
                <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px; align="center" />
                <div class="message-container">
                    <p>Dear user, thank you for reaching out to The SkyTrails support team. Your query has been submitted, and we will get back to you as soon as possible.</p>
                </div>
            </div>
        </div>
    </body>
    
    </html>
    `;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Your query Submitted successfull, connect you soon",
      html: html,
    };
    return await transporter.sendMail(mailOptions);
  },


  ssdcConfirmationMail: async (to) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: nodemailerConfig.options.auth.user,
          pass: nodemailerConfig.options.auth.pass,
        },
        connectionTimeout: 60000,
      });

      const userEmail = to.email;
      const mailOptions = {
        from: nodemailerConfig.options.auth.user,
        to: userEmail,
        subject: "Interview successfully scheduled by SSDC.",
        html: ssdcMail(to),        
      };

      await transporter.verify();
      const info = await transporter.sendMail(mailOptions);
    

     
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //package enquiry mail b2c landing page

  packageLandingPageMail: async (to) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: nodemailerConfig.options.auth.user,
          pass: nodemailerConfig.options.auth.pass,
        },
        connectionTimeout: 60000,
      });

      const userEmail = to.email;
      const mailOptions = {
        from: nodemailerConfig.options.auth.user,
        to: userEmail,
        subject: "Confirmation of Your Packaging Booking Enquiry.",
        html: packageLandingMail(to),        
      };

      await transporter.verify();
      const info = await transporter.sendMail(mailOptions);
    

     
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },


//   packageBookingConfirmationMail: async (to) => {
//     try {
//       console.log("to==================",to)
//       const currentDate = new Date(to.createdAt);
//       const options = {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       };
//       const formattedDate = currentDate.toLocaleDateString("en-US", options);
// console.log("formattedDate==========>>>>",formattedDate)
//       function formatDate(dateString, format) {
//         const date = new Date(dateString);
//         const options = {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//         };
//         return date.toLocaleString("en-US", options);
//       }
//       const  getDepartureTime=moment(`${to.departureDate}`);
//       console.log("getDepartureTime=========",getDepartureTime);
//       const boardingTimeFormatted = formatDate(
//         to.departureTime,
//         "DD MMMM YYYY hh:mm A"
//       );
//       console.log("boardingTimeFormatted===============>>>>",boardingTimeFormatted);
//       const journeyDateFormatted = formatDate(
//         to.departureTime,
//         "ddd, DD MMM YYYY"
//       );
//       console.log("journeyDateFormatted==================>>>",journeyDateFormatted);
//       const depTimeFormatted = formatDate(to.departureTime, "hh:mm A");
// console.log("depTimeFormatted==============",depTimeFormatted);
//       const name = `${to.fullName}`;
//       const htmlContent = `
//       <!DOCTYPE html>
      
//       <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
//       <head>
//       <title></title>
//       <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
//       <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
//       <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/><!--<![endif]-->
//       <style>
//           * {
//             box-sizing: border-box;
//           }
      
//           body {
//             margin: 0;
//             padding: 0;
//           }
      
//           a[x-apple-data-detectors] {
//             color: inherit !important;
//             text-decoration: inherit !important;
//           }
      
//           #MessageViewBody a {
//             color: inherit;
//             text-decoration: none;
//           }
      
//           p {
//             line-height: inherit
//           }
      
//           .desktop_hide,
//           .desktop_hide table {
//             mso-hide: all;
//             display: none;
//             max-height: 0px;
//             overflow: hidden;
//           }
      
//           .image_block img+div {
//             display: none;
//           }
      
//           @media (max-width:620px) {
//             .social_block.desktop_hide .social-table {
//               display: inline-block !important;
//             }
      
//             .mobile_hide {
//               display: none;
//             }
      
//             .row-content {
//               width: 100% !important;
//             }
      
//             .stack .column {
//               width: 100%;
//               display: block;
//             }
      
//             .mobile_hide {
//               min-height: 0;
//               max-height: 0;
//               max-width: 0;
//               overflow: hidden;
//               font-size: 0px;
//             }
      
//             .desktop_hide,
//             .desktop_hide table {
//               display: table !important;
//               max-height: none !important;
//             }
//           }
//         </style>
//       </head>
//       <body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
//       <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efeded;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
//       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad" style="padding-top:10px;width:100%;">
//       <div align="center" class="alignment" style="line-height:10px">
//       <div style="max-width: 200px;"><img src="images/64bdbeb7-5f8d-4682-8b46-2c34e9c02103.png" style="display: block; height: auto; border: 0; width: 100%;" width="200"/></div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
//       <table border="0" cellpadding="10" cellspacing="0" class="social_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad">
//       <div align="right" class="alignment">
//       <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="108px">
//       <tr>
//       <td style="padding:0 0 0 4px;"><a href="https://www.instagram.com/theskytrails" target="_blank"><img alt="Instagram" height="32" src="images/instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
//       <td style="padding:0 0 0 4px;"><a href="https://www.facebook.com/theskytrailsofficials" target="_blank"><img alt="Facebook" height="32" src="images/facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"/></a></td>
//       <td style="padding:0 0 0 4px;"><a href="https://twitter.com/TheSkytrails" target="_blank"><img alt="Twitter" height="32" src="images/twitter2x.png" style="display: block; height: auto; border: 0;" title="twitter" width="32"/></a></td>
//       </tr>
//       </table>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efeded;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
//       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad" style="width:100%;">
//       <div align="center" class="alignment" style="line-height:10px">
//       <div style="max-width: 600px;"><img src="images/6fc76a40-1ed8-4ce6-9ee2-d99a3e9bbc2f.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="600"/></div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad" style="width:100%;">
//       <div align="center" class="alignment" style="line-height:10px">
//       <div style="max-width: 600px;"><img src="images/3ccc79d6-9d4a-4287-a4a1-23536556db6c.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="600"/></div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;">Package Reservation Please Take a note of your reservation details.</span></p>
//       <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;">If you have any questions, feel free to contact us.</span></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Package Name:</span>{to.packageId.pakage_title}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Departure City: </span>{to.departureCity}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Number of Adults:</span>{to.adults}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Number of Children:</span>{to.child}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Journey Details</span>{to}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Departure Date:</span>{to.departureDate}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Departure Time:</span>{}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table><!-- End -->
//       </body>
//       </html>`;
//       const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
//       // const browser = await puppeteer.launch({ headless: true, timeout: 0 });
//       const page = await browser.newPage();

//       // Set a longer timeout if needed
//       // await page.setDefaultNavigationTimeout(60000);

//       // Wait for some time to let dynamic content load (adjust the time as needed)
//       await page.waitForTimeout(2000);

//       await page.setContent(htmlContent);
//       const pdfFilePath = "Package_Booking.pdf";
//       const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
//       await browser.close();
//       fs.writeFileSync(pdfFilePath, pdfBytes);

//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//           user: nodemailerConfig.options.auth.user,
//           pass: nodemailerConfig.options.auth.pass,
//         },
//         connectionTimeout: 60000,
//       });

//       const passengerEmail = to.email;
//       const mailOptions = {
//         from: nodemailerConfig.options.auth.user,
//         to: passengerEmail,
//         subject: "Package Booking Confirmation Mail",
//         html: htmlContent,
//         attachments: [{ filename: "Package_Booking.pdf", path: pdfFilePath }],
//       };

//       await transporter.verify();
//       const info = await transporter.sendMail(mailOptions);
//       console.log("Email sent: " + info.response);

//       fs.unlinkSync(pdfFilePath);

//       return info;
//     } catch (error) {
//       console.error("Email sending failed:", error);
//       throw error;
//     }
//   },
  sendAgent: async (to, pass) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerConfigHawaiYatra.options.auth.userHawai,
        pass: nodemailerConfigHawaiYatra.options.auth.passHawai,
      },
    });
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: nodemailerConfig.options.auth.user,
    //     pass: nodemailerConfig.options.auth.pass,
    //   },
    // });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      html: welcomeAgentMail(to, pass),
      subject: "Congratulations, you are become member of Thehawaiyatra, ",
    };
    return await transporter.sendMail(mailOptions);
  },

  getImageUrlAWS: async (file) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, "")}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Assuming Location contains the S3 URL
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  },
  getSecureUrlAWS: async (file) => {
    if (!file || !file[0].originalname || !file[0].buffer) {
      throw new Error("Invalid file object");
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploadedFile_${Date.now()}_${file[0].originalname.replace(
        /\s/g,
        ""
      )}`,
      Body: file[0].buffer,
      ContentType: file[0].mimetype,
      ACL: "public-read",
    };

    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Assuming Location contains the S3 URL
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  },

//   packageBookingConfirmationMail1:async(to)=>{
//     try {
//       console.log("to==================",to)
//       const currentDate = new Date(to.createdAt);
//       const options = {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       };
//       const formattedDate = currentDate.toLocaleDateString("en-US", options);
// console.log("formattedDate==========>>>>",formattedDate)
//       function formatDate(dateString, format) {
//         const date = new Date(dateString);
//         const options = {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//         };
//         return date.toLocaleString("en-US", options);
//       }
//       const  getDepartureTime=moment(`${to.departureDate}`);
//       console.log("getDepartureTime=========",getDepartureTime);
//       const boardingTimeFormatted = formatDate(
//         to.departureTime,
//         "DD MMMM YYYY hh:mm A"
//       );
//       console.log("boardingTimeFormatted===============>>>>",boardingTimeFormatted);
//       const journeyDateFormatted = formatDate(
//         to.departureTime,
//         "ddd, DD MMM YYYY"
//       );
//       console.log("journeyDateFormatted==================>>>",journeyDateFormatted);
//       const depTimeFormatted = formatDate(to.departureTime, "hh:mm A");
// console.log("depTimeFormatted==============",depTimeFormatted);
//       const name = `${to.fullName}`;
//       const htmlContent = `
//       <!DOCTYPE html>
      
//       <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
//       <head>
//       <title></title>
//       <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
//       <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
//       <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/><!--<![endif]-->
//       <style>
//           * {
//             box-sizing: border-box;
//           }
      
//           body {
//             margin: 0;
//             padding: 0;
//           }
      
//           a[x-apple-data-detectors] {
//             color: inherit !important;
//             text-decoration: inherit !important;
//           }
      
//           #MessageViewBody a {
//             color: inherit;
//             text-decoration: none;
//           }
      
//           p {
//             line-height: inherit
//           }
      
//           .desktop_hide,
//           .desktop_hide table {
//             mso-hide: all;
//             display: none;
//             max-height: 0px;
//             overflow: hidden;
//           }
      
//           .image_block img+div {
//             display: none;
//           }
      
//           @media (max-width:620px) {
//             .social_block.desktop_hide .social-table {
//               display: inline-block !important;
//             }
      
//             .mobile_hide {
//               display: none;
//             }
      
//             .row-content {
//               width: 100% !important;
//             }
      
//             .stack .column {
//               width: 100%;
//               display: block;
//             }
      
//             .mobile_hide {
//               min-height: 0;
//               max-height: 0;
//               max-width: 0;
//               overflow: hidden;
//               font-size: 0px;
//             }
      
//             .desktop_hide,
//             .desktop_hide table {
//               display: table !important;
//               max-height: none !important;
//             }
//           }
//         </style>
//       </head>
//       <body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
//       <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efeded;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
//       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad" style="padding-top:10px;width:100%;">
//       <div align="center" class="alignment" style="line-height:10px">
//       <div style="max-width: 200px;"><img src="images/64bdbeb7-5f8d-4682-8b46-2c34e9c02103.png" style="display: block; height: auto; border: 0; width: 100%;" width="200"/></div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
//       <table border="0" cellpadding="10" cellspacing="0" class="social_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad">
//       <div align="right" class="alignment">
//       <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="108px">
//       <tr>
//       <td style="padding:0 0 0 4px;"><a href="https://www.instagram.com/theskytrails" target="_blank"><img alt="Instagram" height="32" src="images/instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
//       <td style="padding:0 0 0 4px;"><a href="https://www.facebook.com/theskytrailsofficials" target="_blank"><img alt="Facebook" height="32" src="images/facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"/></a></td>
//       <td style="padding:0 0 0 4px;"><a href="https://twitter.com/TheSkytrails" target="_blank"><img alt="Twitter" height="32" src="images/twitter2x.png" style="display: block; height: auto; border: 0;" title="twitter" width="32"/></a></td>
//       </tr>
//       </table>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efeded;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
//       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad" style="width:100%;">
//       <div align="center" class="alignment" style="line-height:10px">
//       <div style="max-width: 600px;"><img src="images/6fc76a40-1ed8-4ce6-9ee2-d99a3e9bbc2f.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="600"/></div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tr>
//       <td class="pad" style="width:100%;">
//       <div align="center" class="alignment" style="line-height:10px">
//       <div style="max-width: 600px;"><img src="images/3ccc79d6-9d4a-4287-a4a1-23536556db6c.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="600"/></div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;">Package Reservation Please Take a note of your reservation details.</span></p>
//       <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;">If you have any questions, feel free to contact us.</span></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//       <tbody>
//       <tr>
//       <td>
//       <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
//       <tbody>
//       <tr>
//       <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Package Name:</span>{to.packageId.pakage_title}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Departure City: </span>{to.departureCity}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Number of Adults:</span>{to.adults}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Number of Children:</span>{to.child}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Journey Details</span>{to}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Departure Date:</span>{to.departureDate}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       <table border="0" cellpadding="10" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
//       <tr>
//       <td class="pad">
//       <div style="font-family: sans-serif">
//       <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
//       <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:18px;">Departure Time:</span>{}</strong></p>
//       </div>
//       </div>
//       </td>
//       </tr>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table>
//       </td>
//       </tr>
//       </tbody>
//       </table><!-- End -->
//       </body>
//       </html>`;
//       const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
//       // const browser = await puppeteer.launch({ headless: true, timeout: 0 });
//       const page = await browser.newPage();

//       // Set a longer timeout if needed
//       // await page.setDefaultNavigationTimeout(60000);

//       // Wait for some time to let dynamic content load (adjust the time as needed)
//       await page.waitForTimeout(2000);

//       await page.setContent(htmlContent);
//       const pdfFilePath = "Package_Booking.pdf";
//       const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
//       await browser.close();
//       fs.writeFileSync(pdfFilePath, pdfBytes);

//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//           user: nodemailerConfig.options.auth.user,
//           pass: nodemailerConfig.options.auth.pass,
//         },
//         connectionTimeout: 60000,
//       });

//       const passengerEmail = to.email;
//       const mailOptions = {
//         from: nodemailerConfig.options.auth.user,
//         to: passengerEmail,
//         subject: "Package Booking Confirmation Mail",
//         html: htmlContent,
//         attachments: [{ filename: "Package_Booking.pdf", path: pdfFilePath }],
//       };

//       await transporter.verify();
//       const info = await transporter.sendMail(mailOptions);
//       console.log("Email sent: " + info.response);

//       fs.unlinkSync(pdfFilePath);

//       return info;
//     } catch (error) {
//       console.error("Email sending failed:", error);
//       throw error;
//     }
//   },
  packageBookingConfirmationMail: async (to) => {
    let htmlContent = `<!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
      <style>
        * {
          box-sizing: border-box;
        }
    
        body {
          margin: 0;
          padding: 0;
        }
    
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
    
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
    
        p {
          line-height: inherit
        }
    
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
    
        .image_block img+div {
          display: none;
        }
    
        @media (max-width:620px) {
          .mobile_hide {
            display: none;
          }
    
          .row-content {
            width: 100% !important;
          }
    
          .stack .column {
            width: 100%;
            display: block;
          }
    
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }
    
          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
      </style>
    </head>
    
    <body style="margin: 0; background-color: #ffffff; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
        <tbody>
          <tr>
            <td>
              <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6e2e2; background-size: auto;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #ffffff; color: #000000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad">
                                    <div class="alignment" align="right" style="line-height:10px;background:#fff">
                                      <div style="max-width: 210px; background:#fff"><img src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/logo.png" style="display: block; height: auto; border: 0; width: 100%;" width="210"></div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6e2e2;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-image: url('https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1140088_1125713/editor_images/91aa7b8a-e39c-47a0-9fa3-890ca6510d09.png'); background-repeat: no-repeat; background-size: cover; color: #000000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><span style="color:#ffffff;"><strong><span style="font-size:20px;">Package Reservation:</span></strong></span></p>
                                        <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><span style="font-size:18px;color:#ffffff;">Please Take a note of your reservation details.</span></p>
                                        <p style="margin: 0; font-size: 18px; mso-line-height-alt: 21.599999999999998px;"><span style="font-size:18px;color:#ffffff;">If you have any questions, feel free to contact us.</span></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:18px;color:#ffffff;">Package Name:${to.packageId.pakage_title}</span></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-3" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:18px;color:#ffffff;">Departure City:${to.departureCity}</span></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-4" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;font-size:18px;">Number of Adults:${to.adults}</span></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;font-size:18px;">Number of Child:${to.child}</span></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">&nbsp;</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">&nbsp;</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6e2e2;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 1px; color: #000000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 15px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="width:100%;">
                                    <div class="alignment" align="center" style="line-height:10px">
                                      <div style="max-width: 285px;"><img src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/packageCreate2.png " style="display: block; height: auto; border: 0; width: 100%;" width="285"></div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad">
                                    <div class="alignment" align="center" style="line-height:10px">
                                      <div style="max-width: 300px;"><img src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/whyus.jpeg" style="display: block; height: auto; border: 0; width: 100%;" width="300"></div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6e2e2;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="width:100%;">
                                    <div class="alignment" align="center" style="line-height:10px">
                                      <div style="max-width: 600px;"><img src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/contactus.jpeg " style="display: block; height: auto; border: 0; width: 100%;" width="600"></div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><!-- End -->
    </body>
    
    </html>`

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: nodemailerConfig.options.auth.user,
          pass: nodemailerConfig.options.auth.pass,
        },
        connectionTimeout: 60000,
    });
    const passengerEmail = to.email;
      const mailOptions = {
        from: nodemailerConfig.options.auth.user,
        to: passengerEmail,
        subject: "Package Booking Confirmation Mail",
        html: htmlContent
      };
      await transporter.verify();
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
  },

  sendResetPassMail: async (to, link) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <title></title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                    <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px; align="center" />
    
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                           please <a href='${link}'>click here</a> to reset your password.
                    </div>
                </div>
            </div>
        </div>
    
    </body>
    </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: nodemailerConfig.options.auth.user,
          pass: nodemailerConfig.options.auth.pass,
        },
        connectionTimeout: 60000,
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    return await transporter.sendMail(mailOptions);
  },
};
