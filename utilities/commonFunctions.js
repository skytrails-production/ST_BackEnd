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
  SubAdminResetPassword,
  RelationShipManagerResetPassword,
  InventoryPartnerResetPassword,
  offerUpdateSubscription
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


const puppeteerTimeOut=120000;

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
  getResetToken: async (payload) => {
    var token = await jwt.sign(payload, config.secret, { expiresIn: "5m" });
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
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    return await nodemailerConfig.sendMail(mailOptions);
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
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    try {
      const info = await nodemailerConfig.sendMail(mailOptions);
      return info;
    } catch (error) {
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
  
  //   var mailOptions = {
  //     from: process.env.DEFAULT_ZOHO_EMAIL,
  //     to: to.email,
  //     subject: "Hotel Booking Confirmation",
  //     html: html,
  //   };
  //   try {
  //     // Verify the connection
      // nodemailerConfig.verify(function (error, success) {
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
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to.email,
      subject: "Bus Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      return info;
    } catch (error) {
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
    

    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to.email,
      subject: "Visa Apply Confirmation Mail",
      html: html,
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Flight Booking Confirmation Mail with pdf=======
  //==========================================================

  FlightBookingConfirmationMail: async (to) => {
    const currentDate = new Date(to?.createdAt);
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
				  <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
            
			
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
                  ${to?.bookingId}
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
                  ${to?.pnr}
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
      

              ${to?.passengerDetails
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
              ${to?.airlineDetails
                .map(
                  (item) => `      
              <div style="width: 100%; float: left; padding: 5px;">
                <div style="width: 23%; float: left; margin-right: 0;">
                  <span style="margin-top: 5px; width: 18%; height: 75px; float: left;">
                    
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-takeoff"><path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"/></svg>
					
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


            ${to && to?.baggage && to?.baggage?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Extra Baggage
            </div>
                  ${to?.baggage?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  Weight: ${item?.Weight}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  Code: ${item?.Code}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }

            ${to && to?.mealDynamic && to?.mealDynamic?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Meal
            </div>
                  ${to?.mealDynamic?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  Menu Item: ${item?.AirlineDescription}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  Code: ${item?.Code}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }


             ${to && to?.seatDynamic && to?.seatDynamic?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Seat
            </div>
                  ${to?.seatDynamic?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  RowNo: ${item?.RowNo}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  SeatNo: ${item?.SeatNo}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }


          
      
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
                    ₹ ${to.totalAmount}
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
		  
		  <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

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
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
  
    // await page.goto('https://developer.chrome.com/');
   await page.setDefaultNavigationTimeout(timeOutTime); // Set a 60-second timeout
   await page.setDefaultTimeout(puppeteerTimeOut)

    // Save the PDF to a temporary file
    await page.setContent(htmlContent,{
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "flightbooking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Use pdfFilePath in the email sending part of your code
    // ...

    

    const passengerEmail = to.passengerDetails[0].email;
    const mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: passengerEmail,
      subject: "Flight Booking Confirmation Mail",
      html: flightMail(to),
      attachments: [{ filename: "flightBooking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await nodemailerConfig.verify();

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
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
    const currentDate = new Date(to?.createdAt);
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
            
			<svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
			
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
                   
				   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-takeoff"><path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"/></svg>
				
				   
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






             ${to && to?.baggage && to?.baggage?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Extra Baggage
            </div>
                  ${to?.baggage?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  Weight: ${item?.Weight}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  Code: ${item?.Code}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }

            ${to && to?.mealDynamic && to?.mealDynamic?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Meal
            </div>
                  ${to?.mealDynamic?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  Menu Item: ${item?.AirlineDescription}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  Code: ${item?.Code}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }


             ${to && to?.seatDynamic && to?.seatDynamic?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Seat
            </div>
                  ${to?.seatDynamic?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  RowNo: ${item?.RowNo}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  SeatNo: ${item?.SeatNo}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }


      
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
                    ₹ ${to.totalAmount}
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
          
		  <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

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
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    // Navigate the page to a URL.
    //  await page.goto('https://developer.chrome.com/');
    // Save the PDF to a temporary file

    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut);
    await page.setContent(htmlContent,{
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "flightbooking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Use pdfFilePath in the email sending part of your code
    // ...

    

    const passengerEmail = email;
    const mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Flight Booking Confirmation Mail",
      html: flightMail(to),
      attachments: [{ filename: "flightBooking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await nodemailerConfig.verify();

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Flight Booking Confirmation Mail pdf with agent Markup=======
  //==========================================================

  FlightBookingConfirmationMailwithAgentMarkup: async (to, markup) => {
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
            
			<svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
			
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
                   
				   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-takeoff"><path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"/></svg>
					
				   
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






             ${to && to?.baggage && to?.baggage?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Extra Baggage
            </div>
                  ${to?.baggage?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  Weight: ${item?.Weight}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  Code: ${item?.Code}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }

            ${to && to?.mealDynamic && to?.mealDynamic?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Meal
            </div>
                  ${to?.mealDynamic?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  Menu Item: ${item?.AirlineDescription}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  Code: ${item?.Code}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }


             ${to && to?.seatDynamic && to?.seatDynamic?.length > 0
              ? `<div>
                  <div
              style="
                width: 100%;
                background-color: #004684;
                float: left;
                font-weight: bold;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
                color: #fff;
                margin-top: 8px;
              "
            >
              Seat
            </div>
                  ${to?.seatDynamic?.map(
                    (item) => `
                      <div
              style="
                width: 100%;
                float: left;
                margin-top: 8px;
                padding: 5px;
                border-bottom: 1px solid #d6d8e7;
              "
            >
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: left; font-weight: bold">
                  RowNo: ${item?.RowNo}
                </div>
              </div>
              <div style="margin-top: 5px; float: left; width: 300px">
                <div style="float: left; width: 100%; text-align: right; font-weight: bold">
                  SeatNo: ${item?.SeatNo}
                </div>
              </div>
            </div>
                    `
                  ).join("")}
                </div>`
              : ""
            }


      
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
                    ₹ ${Number(to.totalAmount) + Number(markup.price)}
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
		  
		  
		  <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

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
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');
    // Save the PDF to a temporary file
    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)
    await page.setContent(htmlContent,{
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "flightbooking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

    // Use pdfFilePath in the email sending part of your code
    // ...

    

    const passengerEmail = markup.email;
    const mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: passengerEmail,
      subject: "Flight Booking Confirmation Mail",
      html: flightMail(to),
      attachments: [{ filename: "flightBooking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await nodemailerConfig.verify();

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Bus Booking Confirmation Mail with pdf=======
  //==========================================================

  BusBookingConfirmationMail: async (to) => {

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
            
			<svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
			
			
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
    <div style="width: 100%; max-width: 200px; box-sizing: border-box;">
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
    <div style="width: 100%; max-width: 400px; box-sizing: border-box;">
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
    <div style="width: 100%; max-width: 200px; box-sizing: border-box;">
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
    <div style="width: 100%; max-width: 400px; box-sizing: border-box;">
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
        ₹ ${to.amount}
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
                      ${to?.BoardingPoint?.Contactnumber ||'.'}
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
		  
		  
		  <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

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
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');
    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)

    // Save the PDF to a temporary file
    await page.setContent(htmlContent,{
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "Bus_Booking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

    

    const passengerEmail = to.passenger[0]?.Email;
    const mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: passengerEmail,
      subject: "Bus Booking Confirmation Mail",
      html: busMail(to),
      attachments: [{ filename: "Bus_Booking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await nodemailerConfig.verify();

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);

      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  busBookingConfirmationMailWithNewEmail: async (to, email) => {

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

    const arrTimeFormatted=formatDate(to.arrivalTime, "ddd, DD MMM YYYY");

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
              
			  <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
			  
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
                      <strong>Departure Date:</strong>
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
                      <strong>Arrival Time:</strong>
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
                      ${arrTimeFormatted}
                    </p>
                    <p>
                    ₹ ${to.amount}
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
		  
		  
		   <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

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
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');
    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)

    // Save the PDF to a temporary file
    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "Bus_Booking.pdf";

    const pdfBytes = await page.pdf({ path: pdfFilePath, format: "A4" });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

   

    const passengerEmail = email;
    const mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: passengerEmail,
      subject: "Bus Booking Confirmation Mail",
      html: busMail(to),
      attachments: [{ filename: "Bus_Booking.pdf", path: pdfFilePath }],
    };

    try {
      // Verify the connection
      await nodemailerConfig.verify();

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);

      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
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


    

    let htmlContent =`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Details</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f4f6;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
      }
      .container {
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        width: 100%;
        max-width: 1200px;
        padding: 24px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f1f1f1;
        color: #111;
        padding: 16px;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        font-size: 24px;
        font-weight: bold;
        color: #4f46e5;
      }
      .header p {
        font-size: 16px;
      }
      .booking-info {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
      .hotel-info {
        flex: 1;
        padding-right: 20px;
      }
      .hotel-info h2 {
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }
      .hotel-info p {
        color: #666;
        font-size: 14px;
      }
      .hotel-info .stars {
        color: #ffd700;
      }
      .hotel-info .amount {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .hotel-image {
        width: 400px;
        height: 250px;
        object-fit: cover;
        border-radius: 8px;
      }

      .room-info {
        margin-top: 30px;
        border-top: 1px solid #ddd;
        padding-top: 20px;
      }
      .room-info h2 {
        font-size: 20px;
        font-weight: bold;
      }
      .board-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 20px;
        border-top: 1px solid #ddd;
      }

      .board-infoInner {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .board-infoInner > div {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }

      .guest {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 50px;
      }
      .guest p {
        flex-grow: 1;
      }
      .guest-info {
        margin-top: 20px;
        border-top: 1px solid #ddd;
      }
      .guest-info h2 {
        font-size: 20px;
        font-weight: bold;
      }
      .guest-info .guest {
        margin-top: 10px;
        font-size: 16px;
      }
      .map-container {
        margin-top: 30px;
      }
      iframe {
        width: 100%;
        height: 300px;
        border: none;
        border-radius: 8px;
      }

      .mt-40 {
        margin-top: 80px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
        <div>
          <h1>Booking Details</h1>
          <!-- <p>Thank you for your booking!</p> -->
        </div>
        <div>
          <p><strong>Status:</strong> Confirmed</p>
          <p><strong>Booking ID:</strong>${to.bookingId}</p>
          <p><strong>Booking Date:</strong> ${formattedDate}</p>
        </div>
      </div>

      <!-- Hotel Information Section -->
      <div class="booking-info">
        <div class="hotel-info">
          <h2>Hotel Name</h2>         
          ${to.rating && (
            `<div class="stars">
              ${Array.from({ length: 5 }, (_, i) => i < to.rating ? '<span>★</span>' : '<span>☆</span>').join('')}
            </div>`
          )}          
          <p>Hotel Address: ${to.address}</p>
          <p>Room: ${to.room} Room</p>
          <p>Guest: ${to.paxes.length} (Including Child)</p>
          <div class="amount">Total Amount: ₹${to.amount}</div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            width="400"
            height="250"
            viewBox="0 0 295.238 295.238"
            xml:space="preserve"
            width="800px"
            height="800px"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <polygon
                    style="fill: #333333"
                    points="0,295.238 71.429,295.238 71.429,285.714 9.524,285.714 9.524,128.571 71.429,128.571 71.429,119.048 0,119.048 "
                  />
                  <polygon
                    style="fill: #333333"
                    points="223.809,119.048 223.809,128.571 285.714,128.571 285.714,285.714 223.809,285.714 223.809,295.238 295.238,295.238 295.238,119.048 "
                  />
                  <path
                    style="fill: #333333"
                    d="M52.381,142.857H23.81v28.571h28.571C52.381,171.428,52.381,142.857,52.381,142.857z M42.857,161.905h-9.524v-9.524h9.524C42.857,152.381,42.857,161.905,42.857,161.905z"
                  />
                  <path
                    style="fill: #333333"
                    d="M52.381,185.714H23.81v28.571h28.571C52.381,214.285,52.381,185.714,52.381,185.714z M42.857,204.762h-9.524v-9.524h9.524C42.857,195.238,42.857,204.762,42.857,204.762z"
                  />
                  <path
                    style="fill: #333333"
                    d="M23.81,257.143h28.571v-28.571H23.81V257.143z M33.333,238.095h9.524v9.524h-9.524V238.095z"
                  />
                  <path
                    style="fill: #333333"
                    d="M271.428,142.857h-28.571v28.571h28.571V142.857z M261.905,161.905h-9.524v-9.524h9.524V161.905z"
                  />
                  <path
                    style="fill: #333333"
                    d="M242.857,214.286h28.571v-28.571h-28.571L242.857,214.286L242.857,214.286z M252.381,195.238h9.524 v9.524h-9.524V195.238z"
                  />
                  <path
                    style="fill: #333333"
                    d="M242.857,257.143h28.571v-28.571h-28.571L242.857,257.143L242.857,257.143z M252.381,238.095h9.524 v9.524h-9.524V238.095z"
                  />
                  <path
                    style="fill: #486bf9"
                    d="M228.571,295.238H66.667V38.095h161.905L228.571,295.238L228.571,295.238z"
                  />
                  <polygon
                    style="fill: #333333"
                    points="223.809,9.524 223.809,0 214.286,0 209.524,0 85.714,0 80.952,0 71.429,0 71.429,9.524 80.952,9.524 80.952,42.857 90.476,42.857 90.476,9.524 204.762,9.524 204.762,42.857 214.286,42.857 214.286,9.524 "
                  />
                  <path
                    style="fill: #333333"
                    d="M119.048,61.905H90.476v28.571h28.571L119.048,61.905L119.048,61.905z M109.524,80.952H100v-9.524 h9.524V80.952z"
                  />
                  <path
                    style="fill: #333333"
                    d="M161.905,61.905h-28.571v28.571h28.571V61.905z M152.381,80.952h-9.524v-9.524h9.524V80.952z"
                  />
                  <path
                    style="fill: #333333"
                    d="M204.762,61.905H176.19v28.571h28.571L204.762,61.905L204.762,61.905z M195.238,80.952h-9.524 v-9.524h9.524V80.952z"
                  />
                  <path
                    style="fill: #333333"
                    d="M195.238,209.524H100h-4.762h-9.524v9.524h9.524v76.19H200v-76.19h9.524v-9.524H200H195.238z M104.762,219.048h38.095v19.048h-4.762c-7.876,0-14.286,6.41-14.286,14.286s6.41,14.286,14.286,14.286h4.762v19.048h-38.095 C104.762,285.716,104.762,219.048,104.762,219.048z M142.857,257.143h-4.762c-2.624,0-4.762-2.133-4.762-4.762 s2.138-4.762,4.762-4.762h4.762V257.143z M152.381,247.619h4.762c2.624,0,4.762,2.133,4.762,4.762s-2.138,4.762-4.762,4.762 h-4.762V247.619z M190.476,285.714h-38.095v-19.048h4.762c7.876,0,14.286-6.41,14.286-14.286s-6.41-14.286-14.286-14.286h-4.762 v-19.048h38.095V285.714z"
                  />
                  <path
                    style="fill: #333333"
                    d="M90.476,133.333h28.571v-28.571H90.476V133.333z M100,114.286h9.524v9.524H100V114.286z"
                  />
                  <path
                    style="fill: #333333"
                    d="M133.333,133.333h28.571v-28.571h-28.571V133.333z M142.857,114.286h9.524v9.524h-9.524V114.286z"
                  />
                  <path
                    style="fill: #333333"
                    d="M176.19,133.333h28.571v-28.571H176.19V133.333z M185.714,114.286h9.524v9.524h-9.524V114.286z"
                  />
                  <path
                    style="fill: #333333"
                    d="M90.476,176.19h28.571v-28.571H90.476V176.19z M100,157.143h9.524v9.524H100V157.143z"
                  />
                  <path
                    style="fill: #333333"
                    d="M133.333,176.19h28.571v-28.571h-28.571V176.19z M142.857,157.143h9.524v9.524h-9.524V157.143z"
                  />
                  <path
                    style="fill: #333333"
                    d="M176.19,176.19h28.571v-28.571H176.19V176.19z M185.714,157.143h9.524v9.524h-9.524V157.143z"
                  />
                  <rect
                    x="85.714"
                    y="190.476"
                    style="fill: #333333"
                    width="104.762"
                    height="9.524"
                  />
                  <rect
                    x="200"
                    y="190.476"
                    style="fill: #333333"
                    width="9.524"
                    height="9.524"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- Room Information Section -->
      <div class="room-info">
        <h2>Room Type: ${to.roomName}</h2>
        <p>Pan Required: Yes</p>
        <p>Refundable: ${to?.refundable} </p>
      </div>

      <!-- Boarding Information Section -->
      <div class="board-info">
        <h3>Boarding Details</h3>
        <div class="board-infoInner">
          <div>
            <p><strong>Check In:</strong> ${checkInDate()}</p>
          </div>
          <div>
            <p><strong>Check Out:</strong> ${checkOutDate()}</p>
          </div>
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="guest-info">
        <h2>Your Booking Details will be sent to</h2>
        <div class="guest">
          <p><strong>Phone No:</strong> ${to.paxes[0].phoneNo}</p>
          <p><strong>Email:</strong> ${to.paxes[0].email}</p>
        </div>
      </div>

      <!-- Guest Details Section -->
      <div class="guest-info mt-40">
        <h2>Guest Details</h2>
        ${to?.paxes.map(
                  (item) => `
        <div class="guest">
          <p><strong>Name:</strong> ${item.title} ${item.firstName} ${item.lastName}</p>
          ${item.panNo!==null?`<p><strong>PAN:</strong> ${item.panNo===null?'':item.panNo}</p>`:''}
        </div>
        `).join("")}
      </div>

      <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

              Info@theskytrails.com
            </div>
          </div>
        </div>
      </div>
      <div style="float: left; width: 100%; margin: 0px; padding: 0px">
        <img
          src="https://travvolt.s3.amazonaws.com/app_banner.png"
          alt="SkyTrails_banner"
          style="width: 100%; margin-top: 15px; border-radius: 15px"
        />
      </div>
    </div>
  </body>
</html>`
    // Create a new PDF document
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');
    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)

    // Save the PDF to a temporary file
    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

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

    
    // const email = "qamarali205@gmail.com";
    const email =to.paxes[0].email;
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Hotel Booking Confirmation Mail",
      html: hotelMail(to),
      // html:"hi",
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);

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
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');

    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)

    // Save the PDF to a temporary file
    await page.setContent(htmlContent,{
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "hotelBooking.pdf";

    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

   
    const email = emailTicket;
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Hotel Booking Confirmation Mail",
      html: hotelMail(to),
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);

      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
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
        font-family: "Arial", sans-serif;
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
        content: "";
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
    <div style="width: 100vw">
      <div
        style="
          justify-content: space-between;
          align-items: center;
          display: flex;
          height: 96px;
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="250"
          viewBox="0 0 998.1 218.9"
          style="enable-background: new 0 0 998.1 218.9"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ef433d;
            }
            .st1 {
              fill: #ffffff;
            }
            .st2 {
              fill: #061a28;
            }
          </style>
          <g>
            <path
              class="st0"
              d="M85.8,16h116.3c16.1,0,29.1,13,29.1,29.1v116.3c0,16.1-13,29.1-29.1,29.1H85.8c-16.1,0-29.1-13-29.1-29.1V45.1   C56.8,29,69.8,16,85.8,16z"
            />
            <path
              class="st1"
              d="M231.2,117.4l0,45.1c0,8.5,0.8,13.5-6.8,21.1c-7.4,7.5-15.8,6.7-23.2,6.8c4-1,7.2-3.8,8.1-7.6   c0-0.1,0.1-0.2,0.1-0.4c0,0,0,0,0-0.1c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.8c0.1-0.3,0.1-0.6,0.2-0.8   c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.8c0-0.3,0.1-0.6,0.1-0.9c0-0.3,0.1-0.6,0.1-0.9   c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6-0.1-0.9   c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-0.9c0-0.3-0.1-0.6-0.1-1c0-0.3-0.1-0.6-0.1-1c-0.1-0.3-0.1-0.7-0.2-1   c-0.1-0.3-0.1-0.6-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.2-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1   c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.3-0.2-0.7-0.3-1c-0.1-0.4-0.3-0.7-0.4-1.1c-0.1-0.3-0.3-0.7-0.4-1c-0.1-0.4-0.3-0.7-0.5-1.1   c-0.2-0.4-0.3-0.7-0.5-1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.3-0.7-0.5-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.4-0.7-0.6-1.1   c-0.2-0.4-0.4-0.8-0.7-1.1c-0.2-0.4-0.4-0.7-0.6-1.1c-0.2-0.4-0.5-0.8-0.7-1.2c-0.2-0.4-0.5-0.7-0.7-1.1c-0.3-0.4-0.5-0.8-0.8-1.2   c-0.2-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-0.9-1.2c-0.3-0.4-0.5-0.7-0.8-1.1c-0.3-0.4-0.6-0.8-1-1.2c-0.3-0.4-0.6-0.8-0.9-1.1   c-0.3-0.4-0.7-0.8-1-1.3c-0.3-0.4-0.6-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.1-1.3c-0.3-0.4-0.7-0.8-1-1.1c-0.4-0.4-0.8-0.9-1.2-1.3   c-0.4-0.4-0.7-0.8-1.1-1.1c-0.4-0.4-0.9-0.9-1.3-1.3c-0.4-0.4-0.7-0.8-1.1-1.2c-0.5-0.5-0.9-0.9-1.4-1.4c-0.4-0.4-0.8-0.8-1.2-1.2   c-0.5-0.5-1-0.9-1.6-1.4c-0.4-0.4-0.8-0.8-1.2-1.1c-0.6-0.5-1.1-1-1.7-1.5c-0.4-0.4-0.8-0.7-1.3-1.1c-0.6-0.5-1.2-1-1.9-1.5   c-0.4-0.4-0.9-0.7-1.3-1.1c-0.7-0.6-1.5-1.2-2.3-1.8c-0.4-0.3-0.7-0.6-1-0.8c-1.1-0.9-2.3-1.8-3.5-2.7c-2.4-1.8-6-1-7.3,1.6   l-16.8,34.9l-11.2-10.1l4-49c0,0-28-23.7-21.5-29.7c6.5-6,35,12.7,35,12.7l52.5-13.8l13,8.3l-35.1,23.4c-1.4,1-1.1,3,0.6,3.5   c18.5,5.5,34.6,13.1,48.5,22C230.6,117.2,230.9,117.3,231.2,117.4L231.2,117.4z"
            />
            <path
              class="st2"
              d="M346.6,55.3c0,0.6-0.3,0.9-0.8,0.9c-0.9,0-1.6-1.5-2.3-4.5c-1.4-6-3.3-10-5.8-12.2c-2.5-2.2-6.4-3.3-11.9-3.3   c-2.1,0-3.9,0.1-5.5,0.2l0.1,70.7c0.1,1.9,0.6,3.2,1.6,3.7c1,0.5,3.7,1,8.1,1.4c0.9,0.1,1.3,0.4,1.3,1c0,0.8-0.6,1.2-1.9,1.2   c-0.2,0-0.8,0-1.7-0.1c-1.2-0.1-2.1-0.1-2.9-0.1l-12-0.3l-19.8,0.3c-1.1,0-1.6-0.3-1.6-0.9c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.6-0.2,3.8-0.2c4.3-0.2,6.6-1.2,6.9-3c0.2-1,0.2-8.9,0.2-23.6V36.5c-0.9-0.1-1.9-0.1-3-0.1c-6.2,0-10.7,1.2-13.6,3.5   c-2.8,2.2-4.6,6.3-5.5,12.1c-0.5,3.4-1.2,5.1-2.1,5.1c-0.7,0-1-0.5-1-1.4c0-0.6,0.2-2.8,0.5-6.4c0.6-7.6,1-12.8,1.2-15.6h1.7   l8.5-0.1c0.2,0,2.9,0.1,8,0.2c5.2,0.2,11.8,0.2,19.8,0.2c4.4,0,8.4,0,11.9-0.1c3.5-0.1,6.7-0.1,9.5-0.1c2.6,0,4.5-0.1,5.8-0.2   c0.2,5,0.8,11.5,1.7,19.3C346.5,54.2,346.6,55,346.6,55.3z M413.7,113.8c0,0.5-0.3,0.7-1,0.7c0.1,0-0.7,0-2.3,0   c-1.6-0.1-3-0.1-4.1-0.1h-2.9c-6.7,0-10.8-0.1-12.3-0.2h-1.9l-2.8,0.1c-1,0.1-1.5-0.2-1.5-0.8c0-0.5,0.2-0.7,0.6-0.7l2.7,0.1   c1.7,0.1,2.7-0.4,2.9-1.4c0.2-0.6,0.2-4.5,0.2-11.6V82.5c0-7.2-0.3-11.5-1-12.8c-1-2-2.9-3-5.8-3c-3,0-5.3,1.4-7,4.1   c-0.8,1.3-1.2,4.1-1.2,8.5v18.3c0,5.7,0,8.8,0.1,9.3v1.4l-0.1,2.8c-0.1,1.2,1.6,1.7,4.9,1.7c0.7,0,1,0.2,1,0.7   c0,0.5-0.5,0.8-1.5,0.8c0,0-0.3,0-0.9,0c-0.6-0.1-1.6-0.1-2.8-0.1h-5.1l-6.5,0.1l-6.9,0.2h-3.5c-1.2,0-1.7-0.2-1.7-0.7   c0-0.2,0.1-0.4,0.2-0.5s0.5-0.1,1-0.1c2.9,0,4.7-0.1,5.2-0.3c0.5-0.2,0.9-1.1,1-2.7c0.1-0.9,0.1-5.6,0.1-14V53.5   c0-8.4-0.2-13.2-0.6-14.4c-0.3-1.3-1.9-2-4.9-2c-2.2,0-3.4-0.2-3.4-0.7c0-0.5,1.3-0.8,4-0.9c6-0.4,11.6-1.4,16.9-3   c1-0.3,1.7-0.5,2.2-0.5c0.6,0,0.9,2.2,0.9,6.5v2.3c0,1.6,0,3.6,0,6.2c-0.1,2.5-0.1,4.2-0.1,5.1v18.5c2.2-3.2,4.4-5.3,6.5-6.5   c2.2-1.2,5.1-1.7,8.7-1.7c7.7,0,12.5,3.1,14.4,9.3c0.7,2,1,5.3,1,9.8v27.1c0,2,0.3,3.3,0.9,3.7c0.7,0.5,2.4,0.7,5,0.7   C413.3,113,413.7,113.2,413.7,113.8z M469.5,100c0,1.7-1,4-3,6.7c-4.3,6-10,9-17,9c-7.8,0-14.3-2.5-19.3-7.4   c-5-5-7.6-11.3-7.6-19.1c0-7.6,2.4-13.9,7.3-19c4.9-5.1,11-7.7,18.3-7.7c5,0,9.2,1.1,12.7,3.3c3.9,2.4,6.4,5.9,7.6,10.4   c0.3,1.4,0.5,3.1,0.7,5c-1.8,0.2-9,0.3-21.5,0.3c-1.9,0-4.4,0.1-7.3,0.2c-0.2,2.8-0.3,5.2-0.3,7.1c0,9.1,1.9,15.5,5.7,19.3   c2.2,2.2,5,3.4,8.3,3.4c2.7,0,5.3-0.9,7.8-2.8c2.6-1.9,4.5-4.3,5.8-7.2c0.6-1.5,1.1-2.2,1.5-2.2C469.3,99.3,469.5,99.5,469.5,100z    M454.8,79.7c0.1-6-0.3-10.1-1.3-12.4c-0.9-2.3-2.6-3.5-4.9-3.5c-4.7,0-7.4,5.3-8.1,15.9c1.6-0.1,5-0.1,10.2-0.1   C452.3,79.6,453.7,79.6,454.8,79.7z M555.1,91.2c0,7.1-2.5,12.9-7.6,17.6c-5,4.6-11.3,6.9-19.1,6.9c-4.7,0-11.2-1.6-19.5-4.8   c-0.6-0.2-1.2-0.3-1.6-0.3c-1.3,0-2.3,1.4-3,4.2c-0.2,0.9-0.5,1.3-0.9,1.3c-0.6,0-0.9-0.5-0.9-1.6c0-1,0.2-2.8,0.6-5.3   c0.3-2.1,0.5-4.5,0.5-7.3c0-2.2,0-4-0.1-5.3c-0.2-2.6-0.2-4.2-0.2-4.7c0-1.2,0.4-1.9,1.2-1.9c0.8,0,1.5,1.7,2.1,5   c1.1,5.7,3.5,10.2,7.3,13.4c4.1,3.4,8.5,5.1,13.3,5.1c4.2,0,7.7-1.3,10.6-4c2.9-2.6,4.3-5.9,4.3-9.7c0-3.3-0.9-5.9-2.8-7.8   c-1.4-1.4-5.9-4.1-13.5-8.3c-8.5-4.5-14.2-9-17.2-13.5c-2.8-4.1-4.2-9-4.2-14.7c0-6.7,2.4-12.2,7.1-16.5c4.7-4.4,10.7-6.6,17.9-6.6   c3.9,0,8,0.9,12.4,2.8c1.5,0.6,2.5,0.9,3.1,0.9c1.2,0,1.9-1,2.3-3c0.2-0.7,0.5-1,1-1c0.8,0,1.2,0.5,1.2,1.5c0,0.4-0.1,1.5-0.2,3.3   c-0.2,1.8-0.2,3.3-0.2,4.4c0,4,0.2,7.4,0.5,10.2c0.1,0.2,0.1,0.5,0.1,0.9c0,0.7-0.3,1-0.9,1c-0.7,0-1.4-1.2-2.1-3.7   c-0.7-2.5-1.9-4.9-3.7-7.3c-1.7-2.5-3.5-4.3-5.2-5.3c-2.3-1.4-5-2.1-8.1-2.1c-4.3,0-7.8,1-10.4,3.1c-2.6,2.1-3.8,5-3.8,8.6   c0,3.2,1.2,6,3.6,8.5c2.4,2.4,7,5.5,13.8,9.3c8.4,4.7,13.9,8.4,16.6,11.2C553.1,79.8,555.1,84.9,555.1,91.2z M628.3,113.4   c0,0.5-1.4,0.8-4.3,0.8h-2c-1.5,0-3.5,0-6-0.1c-2.5-0.1-4.9-0.1-7.2-0.1c-2.9,0-5,0-6.5,0.1c-1.5,0.1-2.5,0.1-3.1,0.1   c-1.1,0-1.6-0.3-1.6-0.8c0-0.5,1-0.9,3.1-0.9c1.3-0.1,2-0.5,2-1.3s-1.6-3.8-4.9-9.1c-0.9-1.4-2.3-3.6-4.1-6.5c-1.2-2.2-3-5-5.3-8.5   v17.2c0,4.1,0.1,6.5,0.3,7.2c0.3,0.7,1.2,1,2.7,1c0.5,0,0.9,0,1.2-0.1h0.9c0.8,0,1.2,0.3,1.2,0.9c0,0.6-0.4,0.9-1.3,0.9h-0.5   l-3-0.1H586l-7.2-0.1h-11.3c-0.4,0.1-0.8,0.1-1.3,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,1-0.9,3-0.9c2.6-0.1,4-0.3,4.3-0.7   c0.4-0.4,0.6-2.3,0.6-5.8l-0.1-61.3c0-3-0.3-4.9-1-5.6c-0.6-0.7-2.4-1-5.2-0.9c-1.5,0-2.2-0.3-2.2-0.8c0-0.5,0.2-0.7,0.5-0.8   c0.3-0.1,1.4-0.2,3.4-0.2c7.8-0.3,13.3-1.3,16.5-3c1.1-0.6,2-1,2.8-1c0.3,1.1,0.5,3.2,0.6,6.3l0.2,12.4c0.1,4.2,0.1,10,0.1,17.6v17   c1.2-1,3.3-3.1,6-6.2c1.2-1.3,2.9-3.3,5.2-5.9c3.7-4.2,5.6-6.4,5.6-6.7c0-0.4-0.2-0.6-0.7-0.7c-0.5-0.1-2-0.2-4.7-0.2   c-1.8,0-2.7-0.3-2.7-1c0-0.6,0.5-0.9,1.4-0.9l8.8,0.2l9.1-0.2c1.4,0,2.1,0.2,2.1,0.7c0,0.5-1.6,0.8-4.8,0.9   c-2.1,0.1-3.8,0.8-5.1,2.1c-2.4,2.3-5.5,5.6-9.2,9.8l13.4,20.2c0.7,1.2,1.8,2.9,3.4,5.2c0.2,0.3,0.8,1.2,1.7,2.6l2,2.8l0.9,1.4   c0.9,1.3,1.6,2.2,2.1,2.6c0.5,0.3,1.6,0.5,3,0.5C627.6,112.5,628.3,112.8,628.3,113.4z M681.7,64.6c0,0.5-0.2,0.9-0.5,1   c-0.3,0.1-1.4,0.1-3.3,0.1c-2.1,0-3.3,0.1-3.7,0.3l-0.7,1.3l-1.4,4.1c-0.6,1.9-2,5.6-4.2,11.3c-0.2,0.5-1.9,5.2-5.1,14.3   c-7.7,21.5-12.6,34.5-14.9,39c-2.8,5.6-6.4,8.4-10.7,8.4c-2.5,0-4.5-0.7-6-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-3.8,2.1-5.7,6.3-5.7   c1.4,0,2.5,0.5,3.4,1.4c0.4,0.4,1,1.5,2,3.3c0.5,0.8,1.3,1.2,2.2,1.2c1.6,0,3-1.3,4.4-4c1.5-2.6,3.5-7.4,5.9-14.7   c-0.6-1.2-1.8-4-3.6-8.3c-2.3-5.9-5.4-13.6-9.3-23.1c-0.9-2.3-3-7.4-6.3-15.2c-1.1-2.6-2-4.2-2.8-4.7c-0.8-0.5-2.6-0.9-5.3-0.9   c-0.9,0-1.4-0.3-1.4-0.9c0-0.6,0.5-0.9,1.4-0.9h2.1c1.2,0,2.9,0,5.2,0.1s4.1,0.1,5.3,0.1l14.2-0.1c0.5-0.1,1-0.1,1.6-0.1   c0.9,0,1.3,0.3,1.3,0.8c0,0.7-1.2,1-3.5,0.9s-3.5,0.4-3.5,1.5c0,0.8,0.3,2,0.9,3.6c0.9,2.2,1.3,3.5,1.4,3.8   c3.8,10.5,6.9,18.6,9.3,24.1c7.2-18.4,10.8-28.8,10.8-31.4c0-0.9-0.9-1.3-2.7-1.3c-3.7,0-5.6-0.3-5.6-1s0.5-1,1.4-1   c0.8,0,1.6,0,2.3,0.1c1.5,0.2,3.5,0.2,6,0.2c0.3,0,1.4,0,3.4-0.1c2-0.2,3.3-0.2,4-0.2h0.7C681.3,63.8,681.7,64.1,681.7,64.6z    M721.4,106.7c0,0.9-0.7,2-2.2,3.4c-3.8,3.6-9,5.5-15.7,5.5c-6.1,0-10.2-1.5-12.1-4.5c-0.8-1.2-1.2-2.2-1.4-3.3   c-0.1-1-0.1-3.6-0.1-7.8v-5.6c0-1.5,0-3,0-4.7c-0.1-1.6-0.1-2.4-0.1-2.4V76.8l-0.1-8.4c0-1.4-0.2-2.2-0.6-2.4   c-0.4-0.2-1.6-0.3-3.5-0.3c-2.3,0-3.5-0.3-3.5-0.9c0-0.5,0.4-0.8,1.3-0.9c7.3-0.2,13.6-4.2,18.8-11.9c0.7-1.1,1.2-1.6,1.6-1.6   c0.5,0,0.7,0.5,0.7,1.6c-0.1,6.7,0.2,10.3,0.8,10.9c0.6,0.6,2.5,0.9,5.7,0.9c3.3,0,5.5-0.2,6.9-0.5c0.2-0.1,0.3-0.1,0.5-0.1   c0.3,0,0.5,0.2,0.5,0.7c0,1.1-0.5,1.6-1.5,1.6c-3.2,0.1-6.7,0.1-10.6,0.1c-0.3,0-0.9,0-1.6-0.1V68c0,20.8,0.3,32.9,0.8,36.5   c0.7,4.5,2.9,6.7,6.5,6.7c1.6,0,3.7-1.2,6.3-3.5c1.2-1.1,2-1.6,2.3-1.6C721.3,106.1,721.4,106.3,721.4,106.7z M769.5,71   c0,2.2-0.7,4.1-2,5.6c-1.3,1.4-3,2.1-5.1,2.1c-4.2,0-6.3-1.9-6.3-5.8c0-1.3,0.5-2.6,1.5-4c0.2-0.3,0.3-0.6,0.3-0.8   c0-0.7-0.5-1-1.5-1c-2.6,0-4.7,2.1-6,6.2c-0.8,2.3-1.2,8-1.2,17.1v8.5l0.1,10.2c0,2.1,1,3.2,3.1,3.4c1.2,0.1,2.7,0.1,4.4,0.1   c0.9,0.1,1.3,0.3,1.3,0.8c0,0.6-0.3,0.9-1,0.9h-2.3c-0.7-0.1-4.1-0.1-10.1-0.1c0.3,0-1.4,0-5.2,0.1l-5.7,0.1h-4.4   c-0.8,0.1-1.7,0.1-2.7,0.1c-0.9,0-1.3-0.3-1.3-0.8c0-0.5,0.5-0.8,1.6-0.8c3.2-0.1,5.1-0.4,5.7-0.9c0.7-0.6,1-2.4,1-5.2l-0.1-31.4   c0-2.6-0.4-4.5-1.2-5.5c-0.7-1-2.3-1.6-4.9-1.9c-2-0.2-3.2-0.3-3.5-0.3c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.3-0.7,0.9-0.7   c0.7,0,1.4,0,2,0.1h2.3c6,0,12.4-1.2,19.3-3.7c0.4,1.6,0.6,3.3,0.6,5.3v4.9c1.5-3.8,3.1-6.5,4.8-8c1.8-1.6,4.1-2.3,6.9-2.3   c2.6,0,4.8,0.8,6.4,2.4C768.6,66.5,769.5,68.5,769.5,71z M830,108c0,0.6-0.6,1.5-1.9,2.6c-3.3,3-7.4,4.5-12.3,4.5   c-3.2,0-5.5-0.7-7-2c-1.4-1.3-2.3-3.7-2.8-7.1c-3.5,6.4-8.3,9.5-14.3,9.5c-3.3,0-6-1-8.1-3.1c-2-2.1-3-4.8-3-8.1   c0-9.8,8.4-15.5,25.1-17.3v-2.4c0-7.8-0.3-12.5-0.8-14.3l-0.1-0.6c-1.1-3.9-3.8-5.8-8.3-5.8c-2.6,0-4.6,0.7-6.2,2.2   c-1.5,1.5-2.3,2.9-2.3,4.3c0,0.8,0.9,1.2,2.8,1.4c2.8,0.2,4.2,1.9,4.2,5.1c0,1.7-0.6,3.1-1.7,4.3c-1.1,1.1-2.5,1.6-4.3,1.6   c-2.2,0-4.1-0.7-5.6-2c-1.4-1.4-2.1-3.1-2.1-5.2c0-3.3,1.7-6.4,5-9.1c3.3-2.7,7.7-4.1,13.1-4.1c8.1,0,13.7,1.4,16.9,4.3   c2.6,2.4,3.8,6.6,3.8,12.6v19.9c0,3.9,0,6.1,0.1,6.7c0.4,3.3,1.5,4.9,3.4,4.9c1.3,0,3-0.9,4.9-2.8c0.4-0.4,0.7-0.6,0.9-0.6   C829.8,107.4,830,107.6,830,108z M805.7,94.1v-5.7c-7.5,1.5-11.3,5.7-11.3,12.8c0,5.4,1.9,8.1,5.6,8.1c2.1,0,3.6-1.2,4.4-3.5   C805.3,103.6,805.7,99.6,805.7,94.1z M859,39.7c0,2.2-0.7,4-2.2,5.6c-1.5,1.6-3.3,2.3-5.3,2.3c-2.2,0-4-0.7-5.5-2.2   c-1.5-1.5-2.2-3.3-2.2-5.6c0-2.2,0.7-4,2.2-5.3c1.5-1.4,3.4-2.1,5.7-2.1c2.1,0,3.8,0.7,5.2,2.1C858.3,35.9,859,37.6,859,39.7z    M867.4,113.4c0,0.5-0.3,0.8-1,0.8l-15.5-0.2l-11.2,0.2c-0.5,0-1,0-1.7,0.1c-0.6,0-1,0-1,0c-0.9,0-1.4-0.3-1.4-0.9   c0-0.5,0.9-0.7,2.7-0.8c2.6-0.1,4.2-0.3,4.7-0.8c0.5-0.5,0.7-2.1,0.7-4.7V73.8c0-2.9-0.3-4.7-0.8-5.2c-0.5-0.6-2-0.9-4.5-0.9   c-1.6,0-2.6,0-2.9-0.1c-0.2-0.1-0.3-0.3-0.3-0.8c0-0.5,0.6-0.8,1.7-0.8c8.5-0.1,15.8-1.4,21.9-4c0.2,0.9,0.3,3.5,0.6,7.7l0.1,14.8   v21.9c0,3.2,0.3,5,0.8,5.6c0.6,0.5,2.6,0.8,6,0.8C866.9,112.6,867.4,112.9,867.4,113.4z M906.3,113.3c0,0.6-1.5,0.9-4.4,0.9   c-0.7,0-2.9-0.1-6.5-0.2c-1.9-0.1-3.7-0.1-5.5-0.1c-1.7,0-4.9,0.1-9.5,0.2l-3.5,0.1c-1.7,0.1-2.6-0.2-2.6-0.8   c0-0.6,0.9-0.9,2.7-0.8c2.7,0.1,4.3-0.2,4.7-0.8c0.5-0.6,0.7-2.9,0.7-7V43.5c0-2.6-0.3-4.2-0.8-4.7c-0.5-0.5-2.1-0.8-4.8-0.8   c-1.9,0-2.9-0.3-2.9-0.8c0-0.6,1-1,3-1c8.7-0.3,15.8-1.6,21.3-4c-0.1,2.3-0.1,15.9-0.1,40.8v29c0,5.3,0.1,8.4,0.3,9.3   c0.3,0.9,1.3,1.2,2.9,1.2l3.5-0.1C905.8,112.4,906.3,112.7,906.3,113.3z M951.6,98.1c0,5.2-1.6,9.4-4.8,12.7   c-3.2,3.2-7.3,4.8-12.3,4.8c-2.5,0-5.4-0.6-8.8-1.9c-2.8-1-4.6-1.5-5.5-1.5c-1.5,0-2.4,0.5-2.9,1.6c-0.5,1.1-0.8,1.6-1,1.6   c-0.5,0-0.7-0.3-0.7-0.8c0-0.5,0.1-1.2,0.2-2.2c0.2-1.5,0.3-4,0.3-7.7c0-0.2,0-0.5,0-1.2c-0.1-0.6-0.1-1.5-0.1-2.6v-2   c0-0.9,0.2-1.3,0.6-1.3c0.5,0,0.8,0.6,1,1.7c0.7,4.1,2.7,7.6,5.9,10.4c3.3,2.7,6.9,4.1,10.9,4.1c2.6,0,4.6-0.8,6.2-2.3   c1.6-1.6,2.4-3.7,2.4-6.3c0-2-0.7-3.7-2.2-5.1c-1.1-1-4-2.3-8.7-3.8c-5.8-1.9-10-4.3-12.7-7c-2.6-2.8-3.8-6.3-3.8-10.6   c0-4.6,1.6-8.5,4.7-11.6c3.1-3.2,6.9-4.8,11.4-4.8c1.7,0,4.7,0.5,8.8,1.6c0.6,0.2,1.1,0.2,1.4,0.2c1.7,0,3-1,3.8-3.1   c0.2-0.4,0.3-0.6,0.6-0.6c0.5,0,0.8,0.5,0.8,1.4c0,0,0,0.7-0.1,2.2c-0.1,0.3-0.1,0.9-0.1,1.6c0,3.2,0.2,6.4,0.6,9.8v0.6   c0,0.6-0.2,0.9-0.7,0.9c-0.4,0-0.7-0.3-0.9-1c-2.2-7.9-6.8-11.9-13.7-11.9c-2.6,0-4.7,0.7-6.4,2.1c-1.6,1.4-2.4,3.2-2.4,5.3   c0,2,0.7,3.6,2.1,4.8s4.1,2.5,8.1,4c7.1,2.5,11.8,5,14.3,7.4C950.3,90.2,951.6,93.7,951.6,98.1z"
            />
            <path
              class="st2"
              d="M529,191.5c-2.5,0-4.6-0.4-6.3-1.3c-1.7-0.9-3.1-2.1-4-3.7c-0.9-1.6-1.4-3.4-1.4-5.4c0-2.1,0.3-4,1-5.8   c0.7-1.8,1.7-3.3,3-4.7c1.3-1.3,2.9-2.4,4.7-3.1c1.8-0.8,3.9-1.2,6.1-1.2c2.4,0,4.5,0.4,6.3,1.3c1.7,0.9,3.1,2.1,4,3.7   c0.9,1.6,1.4,3.4,1.4,5.4c0,2.1-0.4,4-1.1,5.8c-0.7,1.8-1.7,3.3-3,4.6c-1.3,1.3-2.9,2.4-4.7,3.1C533.3,191.2,531.3,191.5,529,191.5   z M529.4,187.6c1.5,0,2.9-0.3,4.2-0.8c1.2-0.6,2.3-1.3,3.1-2.3c0.9-1,1.6-2.1,2-3.3c0.5-1.3,0.7-2.6,0.7-4c0-1.3-0.3-2.5-0.9-3.5   c-0.6-1-1.4-1.8-2.5-2.4c-1.1-0.6-2.5-0.8-4.1-0.8c-1.5,0-2.9,0.3-4.2,0.8c-1.2,0.5-2.3,1.3-3.2,2.3c-0.9,1-1.5,2.1-2,3.3   c-0.4,1.3-0.7,2.6-0.7,4c0,1.3,0.3,2.5,0.8,3.5c0.6,1,1.4,1.8,2.5,2.4S527.8,187.6,529.4,187.6z M561.4,172.3c1.6,0,3,0.3,4.1,1   c1.1,0.7,1.9,1.6,2.3,2.9c0.5,1.3,0.5,2.8,0.1,4.6l-2.1,10.3h-4.4l2-10.2c0.3-1.5,0.2-2.7-0.4-3.5c-0.6-0.9-1.6-1.3-3.2-1.3   c-1.6,0-2.9,0.4-4,1.3s-1.8,2.2-2.1,4l-2,9.7h-4.4l3.7-18.6h4.2l-1,5.3l-0.7-1.7c0.9-1.3,2-2.3,3.3-2.9   C558.3,172.7,559.8,172.3,561.4,172.3z M573.1,191.2l5.2-25.9h4.4l-2.3,11.6l-1.4,4.8l-0.7,4.4l-1,5.1H573.1z M584.4,191.4   c-1.5,0-2.9-0.3-4-0.8c-1.1-0.6-2-1.4-2.6-2.4c-0.6-1.1-0.9-2.4-0.9-4c0-1.7,0.2-3.3,0.6-4.8c0.4-1.5,1.1-2.7,1.9-3.8   c0.9-1.1,1.9-1.9,3.1-2.4c1.2-0.6,2.6-0.9,4.1-0.9c1.5,0,2.9,0.3,4.2,1c1.2,0.6,2.2,1.6,2.9,2.8c0.7,1.2,1.1,2.7,1.1,4.4   c0,1.6-0.3,3-0.8,4.4c-0.5,1.3-1.2,2.5-2.2,3.5c-1,1-2.1,1.7-3.3,2.3C587.3,191.2,585.9,191.4,584.4,191.4z M584.1,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4   C581.3,187.3,582.5,187.7,584.1,187.7z M608,191.4c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3   c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8   c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6c-1,1.7-2.3,3-3.9,3.9C612.1,190.9,610.2,191.4,608,191.4z M608.3,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5   C605.5,187.3,606.7,187.7,608.3,187.7z M631.4,191.4c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4   c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5   c0.6,1.1,0.8,2.5,0.8,4.2c0,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C635.1,190.9,633.4,191.4,631.4,191.4z M632.5,187.7   c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3   c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C629.8,187.3,631,187.7,632.5,187.7z    M637.1,191.2l0.8-4.3l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H637.1z M648.7,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1   c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3   l-1.8,9.2H648.7z M673.2,191.4c-1.5,0-2.9-0.3-4.2-1c-1.3-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4   c0.5-1.3,1.3-2.5,2.2-3.5s2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.5,0,2.9,0.3,4,0.8c1.1,0.5,2,1.3,2.6,2.4   c0.6,1.1,0.9,2.4,0.9,4c0,1.7-0.2,3.3-0.7,4.8c-0.4,1.4-1.1,2.7-1.9,3.8c-0.8,1-1.9,1.9-3.1,2.4   C676.1,191.1,674.7,191.4,673.2,191.4z M674.3,187.7c1.2,0,2.3-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6   c0-1.4-0.4-2.6-1.3-3.4c-0.8-0.8-2-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4c-0.5,1-0.8,2.3-0.8,3.6   c0,1.4,0.4,2.6,1.3,3.4C671.5,187.3,672.7,187.7,674.3,187.7z M678.8,191.2l0.9-4.3l1.2-5l0.6-5l2.3-11.7h4.4l-5.2,25.9H678.8z    M708.2,191.2l1.9-9.7l0.5,2.9l-7.1-17.6h4.5l5.7,14.1l-2.7,0l11.4-14.1h4.7l-14.1,17.7l1.5-3l-2,9.7H708.2z M733.8,191.4   c-1.8,0-3.4-0.3-4.8-1c-1.3-0.7-2.4-1.7-3.1-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c1-1.7,2.3-2.9,3.9-3.9   c1.7-1,3.6-1.4,5.7-1.4c1.8,0,3.4,0.3,4.8,1c1.4,0.7,2.4,1.6,3.2,2.8c0.7,1.2,1.1,2.7,1.1,4.3c0,2.1-0.5,3.9-1.4,5.6   c-1,1.7-2.3,3-3.9,3.9C737.8,190.9,735.9,191.4,733.8,191.4z M734.1,187.7c1.3,0,2.4-0.3,3.3-0.9c1-0.6,1.7-1.4,2.3-2.5   c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9c-1,0.6-1.7,1.4-2.3,2.4   c-0.6,1-0.8,2.3-0.8,3.6c0,1.5,0.4,2.6,1.3,3.5C731.3,187.3,732.5,187.7,734.1,187.7z M756.8,191.4c-1.6,0-2.9-0.3-4-1   c-1.1-0.7-1.9-1.6-2.3-2.9c-0.5-1.3-0.5-2.8-0.1-4.7l2.1-10.3h4.4l-2.1,10.2c-0.3,1.5-0.1,2.7,0.4,3.6c0.6,0.8,1.6,1.3,3.1,1.3   c1.6,0,2.9-0.4,3.9-1.3c1.1-0.9,1.8-2.2,2.1-4l2-9.7h4.3l-3.7,18.6h-4.2l1-5.3l0.7,1.7c-0.9,1.3-2,2.3-3.4,2.9   C759.8,191.1,758.3,191.4,756.8,191.4z M774.3,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9   l-0.8,4.2c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H774.3z    M802.5,191.2l4.9-24.4h9.9c2.5,0,4.6,0.4,6.4,1.3c1.8,0.8,3.1,2,4,3.5c1,1.5,1.4,3.3,1.4,5.3c0,2.2-0.4,4.1-1.1,5.9   c-0.7,1.8-1.8,3.3-3.1,4.5c-1.3,1.2-2.9,2.2-4.8,2.9c-1.9,0.7-3.9,1-6.2,1H802.5z M807.8,187.3h6.2c2.2,0,4.1-0.4,5.6-1.3   c1.6-0.9,2.8-2.1,3.6-3.7c0.8-1.5,1.3-3.3,1.3-5.2c0-1.3-0.3-2.5-0.9-3.5c-0.6-1-1.5-1.7-2.6-2.3c-1.1-0.5-2.6-0.8-4.3-0.8h-5.6   L807.8,187.3z M832.6,191.2l3.7-18.6h4.2l-1,5.3l-0.4-1.5c0.9-1.5,2-2.5,3.3-3.1c1.3-0.6,2.9-0.9,4.8-0.9l-0.8,4.2   c-0.2,0-0.4-0.1-0.5-0.1c-0.2,0-0.3,0-0.6,0c-1.7,0-3.1,0.5-4.2,1.4c-1.1,0.9-1.9,2.3-2.2,4.3l-1.8,9.2H832.6z M858,191.4   c-1.9,0-3.5-0.3-4.8-1c-1.4-0.7-2.4-1.7-3.2-2.9c-0.7-1.2-1.1-2.7-1.1-4.3c0-2.1,0.5-4,1.4-5.6c0.9-1.6,2.2-2.9,3.8-3.8   c1.6-1,3.5-1.4,5.5-1.4c1.7,0,3.3,0.3,4.5,1c1.3,0.7,2.3,1.6,3,2.8c0.7,1.2,1.1,2.7,1.1,4.4c0,0.4,0,0.9-0.1,1.4   c0,0.5-0.1,0.9-0.2,1.3h-15.8l0.5-2.9h13.3l-1.8,1c0.2-1.2,0.1-2.2-0.2-3s-0.9-1.4-1.7-1.8c-0.8-0.4-1.7-0.6-2.8-0.6   c-1.3,0-2.4,0.3-3.4,0.9c-0.9,0.6-1.6,1.4-2.2,2.5c-0.5,1.1-0.8,2.3-0.8,3.8c0,1.5,0.4,2.7,1.3,3.5c0.9,0.8,2.2,1.2,4.1,1.2   c1,0,2-0.2,3-0.5c1-0.3,1.7-0.8,2.4-1.4l1.8,3c-1,0.9-2.1,1.5-3.5,2C860.9,191.2,859.5,191.4,858,191.4z M880.4,191.4   c-1.5,0-2.9-0.3-4.2-1c-1.2-0.7-2.2-1.6-3-2.8c-0.7-1.2-1.1-2.7-1.1-4.4c0-1.6,0.3-3,0.8-4.4c0.5-1.3,1.3-2.5,2.2-3.5   c1-1,2.1-1.7,3.3-2.3c1.3-0.5,2.7-0.8,4.2-0.8c1.6,0,2.9,0.3,4,0.8c1.1,0.6,2,1.4,2.6,2.5c0.6,1.1,0.9,2.5,0.8,4.2   c-0.1,2.3-0.5,4.3-1.3,6.1c-0.8,1.7-1.9,3.1-3.3,4C884.1,190.9,882.4,191.4,880.4,191.4z M881.5,187.7c1.3,0,2.4-0.3,3.3-0.9   c1-0.6,1.7-1.4,2.3-2.5c0.6-1,0.8-2.3,0.8-3.6c0-1.4-0.4-2.6-1.3-3.4c-0.9-0.8-2.1-1.3-3.6-1.3c-1.2,0-2.3,0.3-3.3,0.9   c-1,0.6-1.7,1.4-2.3,2.4c-0.6,1-0.8,2.3-0.8,3.6c0,1.4,0.4,2.6,1.3,3.4C878.8,187.3,880,187.7,881.5,187.7z M886.1,191.2l0.8-4.3   l1.2-5l0.6-5l0.9-4.4h4.4l-3.7,18.6H886.1z M924.4,172.3c1.6,0,3,0.3,4.1,1c1.1,0.7,1.9,1.6,2.3,2.9c0.4,1.3,0.5,2.8,0.1,4.6   l-2.1,10.3h-4.4l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4   l2.1-10.2c0.3-1.5,0.2-2.7-0.4-3.6c-0.6-0.8-1.6-1.3-3-1.3c-1.5,0-2.8,0.4-3.7,1.3c-1,0.9-1.6,2.2-2,4l-2,9.7h-4.4l3.7-18.6h4.2   l-1,5.1l-0.7-1.5c0.9-1.3,1.9-2.3,3.2-2.9c1.3-0.6,2.7-0.9,4.3-0.9c1.2,0,2.3,0.2,3.2,0.6c0.9,0.4,1.7,1,2.2,1.8   c0.6,0.8,0.9,1.8,1,3l-2.1-0.5c1-1.7,2.2-2.9,3.7-3.8C920.8,172.8,922.5,172.3,924.4,172.3z M942.5,191.4c-1.6,0-3.2-0.2-4.6-0.6   s-2.5-0.9-3.3-1.4l1.8-3.3c0.8,0.5,1.7,1,2.9,1.3c1.2,0.3,2.4,0.5,3.6,0.5c1.4,0,2.5-0.2,3.2-0.6c0.7-0.4,1-0.9,1-1.6   c0-0.5-0.2-0.9-0.7-1.2c-0.5-0.3-1.1-0.5-1.9-0.6c-0.7-0.2-1.6-0.3-2.4-0.5c-0.9-0.2-1.7-0.4-2.4-0.8c-0.7-0.3-1.4-0.8-1.9-1.4   c-0.5-0.6-0.7-1.5-0.7-2.5c0-1.3,0.4-2.5,1.1-3.4c0.7-0.9,1.8-1.6,3.1-2.1c1.4-0.5,2.9-0.8,4.6-0.8c1.3,0,2.5,0.1,3.7,0.4   c1.2,0.3,2.2,0.7,3,1.2l-1.6,3.3c-0.8-0.5-1.7-0.9-2.7-1.1c-1-0.2-1.9-0.3-2.8-0.3c-1.4,0-2.5,0.2-3.2,0.7c-0.7,0.4-1,1-1,1.6   c0,0.5,0.2,0.9,0.7,1.2c0.5,0.3,1.1,0.5,1.8,0.7c0.8,0.2,1.6,0.3,2.4,0.5c0.9,0.2,1.7,0.4,2.4,0.7c0.8,0.3,1.4,0.8,1.9,1.4   c0.5,0.6,0.7,1.4,0.7,2.4c0,1.3-0.4,2.5-1.1,3.5c-0.7,0.9-1.8,1.6-3.1,2.1C945.8,191.2,944.3,191.4,942.5,191.4z"
            />
          </g>
        </svg>
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
              ${to.booking_id}
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
        "
      >
        <div class="container">
          <!-- <h1>Booking Details</h1> -->
          <div class="booking-pass section">
            <h2>Booking Information</h2>
            <div class="bookBox">
              <div class="bookOne">
                <p><strong>Booking ID:</strong>${to?.booking_id}</p>
                <p>
                  <strong>Booking Reference:</strong>${to?.booking_reference}
                </p>
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
            <h2 style="margin-bottom: 35px">Hotel Information</h2>
            <div class="imgBox">
              <div class="hotel-image">
                <img src="${to?.hotel?.imageUrl}" alt="Hotel Image" />
              </div>
              <div class="hotel-details">
                <p><strong>Hotel Name:</strong>${to?.hotel?.name}</p>
                <p><strong>Address:</strong>${to?.hotel?.address}</p>
                <p><strong>Category:</strong>${to?.hotel?.category}</p>
              </div>
            </div>
          </div>
          <div class="section holder-info">
            <h2 style="margin-bottom: 40px">Holder Information</h2>
            <p>
              <strong>Name:</strong>${to?.holder?.title} ${to?.holder?.name}
              ${to?.holder?.surname}
            </p>
            <p>
              <strong>Nationality:</strong>${to?.holder?.client_nationality}
            </p>
            <p><strong>Email:</strong>${to?.holder?.email}</p>
            <p><strong>PAN Number:</strong>${to?.holder?.pan_number}</p>
          </div>
          <div class="section pax-info">
            <h2 style="margin-top: 45px">Passengers</h2>

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
            <p><strong>Guest</strong>${to?.hotel?.paxes.length}</p>
          </div>
          <div class="section cancellation-policy">
            <h2>Cancellation Policy</h2>
            ${cancellationPolicy}
          </div>
        </div>
      </div>

      <div
        style="
          padding-left: 28px;
          margin-top: 5px;
          padding-right: 28px;
          padding-top: 24px;
          padding-bottom: 24px;
          background: white;
          border: 1px solid lightgray;
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
            color: #4f46e5;
            font-size: 23px;
            font-family: Montserrat;
            font-weight: 700;
            word-wrap: break-word;
          "
        >
          The Skytrails Support
        </div>
        <div
          style="
            width: 100%;
            height: 48px;
            justify-content: center;
            align-items: center;
            gap: 40px;
            display: inline-flex;
          "
        >
          <div
            style="
              justify-content: center;
              align-items: center;
              gap: 10px;
              display: flex;
            "
          >
            <div
              style="
                color: #4f46e5;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 7px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 28.314 28.323"
                style="enable-background: new 0 0 28.314 28.323"
                xml:space="preserve"
              >
                <path
                  d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
                  fill="#4f46e5"
                />
              </svg>

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
            <div
              style="
                color: #4f46e5;
                font-size: 16px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                gap: 5px;
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-mail"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <polyline points="3 6 12 13 21 6"></polyline>
              </svg>

              Info@theskytrails.com
            </div>
          </div>
        </div>
      </div>

      <div style="float: left; width: 100%; margin: 0px; padding: 0px">
        <img
          src="https://travvolt.s3.amazonaws.com/app_banner.png"
          alt="SkyTrails_banner"
          class="footer-img"
        />
      </div>
    </div>
  </body>
</html>`;

    // Create a new PDF document
    // const browser = await puppeteer.launch({ headless: "new", timeout: 0 });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');
    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)

    // Save the PDF to a temporary file
    await page.setContent(htmlContent,{
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut,
    });

    const pdfFilePath = "hotelBooking.pdf";

    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    // const pdfBytes= await pdf.saveAs(pdfFilePath);


    fs.writeFileSync(pdfFilePath, pdfBytes);

    
    const email = to?.holder?.email;
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Hotel Booking Confirmation Mail",
      html: hotelGrnMail(to),
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);

      fs.unlinkSync(pdfFilePath);

      return info;
    } catch (error) {
      throw error;
    }
  },

  //upload image on cloudinary***************************************
  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
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
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to.email,
      subject: "Hotel Booking Cancellation Request",
      text: to.message,
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  },

  // Send mail for flight Booking cencel Request user to admin =========

  flightBookingCencelRequestForAdmin: async (to) => {
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to.email,
      subject: "Flight Booking Cancellation Request",
      text: to.message,
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });
      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      return info;
    } catch (error) {
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
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to.email,
      subject: "Hotel Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      nodemailerConfig.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await nodemailerConfig.sendMail(mailOptions);
      return info;
    } catch (error) {
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
    // var transporter = nodemailerConfig.createTransport({
    //   service: nodemailerConfig.service,
    //   auth: {
    //     user: nodemailerConfig.user,
    //     pass: nodemailerConfig.pass,
    //   },
    // });
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Reset Password",
      html: otpMail(otp),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },

  sendEmailOtp: async (email, otp) => {
    // var transporter = nodemailer.createTransport({
    //   host: 'smtppro.zoho.in',
    //   port: 465, // 465 or Use 587 for TLS if you prefer
    //   secure: true, // Set to true if using port 465, false if using port 587
    //   auth: {
    //     user: process.env.ZOHO_EMAIL, // Use environment variables for sensitive info
    //     pass: process.env.ZOHO_PASSWORD, // Use an app password if 2FA is enabled
    //   },
      
    // });
  
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Your OTP for Email Verification",
      html: otpMail(otp),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },

  sendAgentEmailResetPassword: async (email, token) => {
   
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Reset Subadmin Password",
      html: ResetPassword(token),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },

  sendEmailResetPassword: async (email, token) => {
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: email,
      subject: "Reset Subadmin Password",
      html: SubAdminResetPassword(token),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },

  sendSubAdmin: async (to, userName, pass) => {
    
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Congratulations,you are become member of theSkyTrais, ",
      html: welcomeMail(to, userName, pass),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },
  sendRMCredential: async (to, userName, password) => {
    
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Congratulations,you are become member of theSkyTrais, ",
      html: welcomeMail(to, userName, password),
    };
    return await nodemailerConfig.sendMail(mailOptions);
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
    

    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Your query Submitted successfull, connect you soon",
      html: html,
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },


  ssdcConfirmationMail: async (to) => {
    try {
      

      const userEmail = to.email;
      const mailOptions = {
        from: process.env.DEFAULT_ZOHO_EMAIL,
        to: userEmail,
        subject: "Interview successfully scheduled by SSDC.",
        html: ssdcMail(to),        
      };

      await transporter.verify();
      const info = await nodemailerConfig.sendMail(mailOptions);
    

     
    } catch (error) {
      throw error;
    }
  },

  //package enquiry mail b2c landing page

  packageLandingPageMail: async (to) => {
    try {
      

      const userEmail = to.email;
      const mailOptions = {
        from: process.env.DEFAULT_ZOHO_EMAIL,
        to: userEmail,
        subject: "Confirmation of Your Packaging Booking Enquiry.",
        html: packageLandingMail(to),        
      };

      await nodemailerConfig.verify();
      const info = await nodemailerConfig.sendMail(mailOptions);
    

     
    } catch (error) {
      throw error;
    }
  },


//   packageBookingConfirmationMail: async (to) => {
//     try {
//       const currentDate = new Date(to.createdAt);
//       const options = {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       };
//       const formattedDate = currentDate.toLocaleDateString("en-US", options);
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
//       const boardingTimeFormatted = formatDate(
//         to.departureTime,
//         "DD MMMM YYYY hh:mm A"
//       );
//       const journeyDateFormatted = formatDate(
//         to.departureTime,
//         "ddd, DD MMM YYYY"
//       );
//       const depTimeFormatted = formatDate(to.departureTime, "hh:mm A");
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
// const browser = await puppeteer.launch({
//   headless: true,
//   args: ["--no-sandbox", "--disable-setuid-sandbox"],
// });
//       const page = await browser.newPage();
        // await page.goto('https://developer.chrome.com/');

//       // Set a longer timeout if needed
//       await page.setDefaultNavigationTimeout(puppeteerTimeOut);
// await page.setDefaultTimeout(puppeteerTimeOut)

//       // Wait for some time to let dynamic content load (adjust the time as needed)
//       await page.waitForTimeout(2000);

//       await page.setContent(htmlContent,{ waitUntil: ["domcontentloaded"],  timeout: puppeteerTimeOut });
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

//       fs.unlinkSync(pdfFilePath);

//       return info;
//     } catch (error) {
//       throw error;
//     }
//   },
  sendAgent: async (to, pass) => {
    
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
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      html: welcomeAgentMail(to, pass),
      subject: "Congratulations, you are become member of Thehawaiyatra, ",
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },

  getImageUrlAWS: async (file) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `randomImages/uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, "")}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Assuming Location contains the S3 URL
    } catch (error) {
      throw error;
    }
  },

  getPassPortImageUrlAWS: async (file) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `PassPortDocument/uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, "")}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Assuming Location contains the S3 URL
    } catch (error) {
      throw error;
    }
  },
  getInventoryImageUrlAWS: async (file) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `inventory/hotel/uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, "")}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    try {
      const result = await s3.upload(params).promise();
      return result.Location; // Assuming Location contains the S3 URL
    } catch (error) {
      throw error;
    }
  },

  getImageUrlAWSByFolder: async (file,folderName) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderName}/uploadedFile_${Date.now()}_${file[0].originalname.replace(/\s/g, "")}`,
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
  getImageUrlAWSByFolderSingle: async (file,folderName) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderName}/uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, "")}`,
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
  getNotificationImageUrlAWS: async (file) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `notification/uploadedFile_${Date.now()}_${file.originalname.replace(/\s/g, "")}`,
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
      Key: `randomImages/uploadedFile_${Date.now()}_${file[0].originalname.replace(
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
                                        <p style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;"><span style="font-size:18px;color:#ffffff;">Package Name:${to.packageId.title}</span></p>
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

   
    const passengerEmail = to.email;
      const mailOptions = {
        from: process.env.DEFAULT_ZOHO_EMAIL,
        to: passengerEmail,
        subject: "Package Booking Confirmation Mail",
        html: htmlContent
      };
      await nodemailerConfig.verify();
      const info = await nodemailerConfig.sendMail(mailOptions);
      // console.log("Email sent: " + info.response);
      return info;
  },

  sendResetPassMailInvetoryPartner: async (to, token) => {   
    
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Verification Mail",
      html: InventoryPartnerResetPassword(token),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },

  FlightBookingConfirmationMail1: async (to) => {
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

    // const name = `${to?.passengerDetails[0]?.firstName} ${to?.passengerDetails[0]?.lastName}`;
    const passengerDetailsHtml = to.passengerDetails.map(item => `
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
    `).join("");

    const airlineDetailsHtml = to.airlineDetails.map(item => `
        <div style="width: 100%; float: left; padding: 5px;">
          <div style="width: 23%; float: left; margin-right: 0;">
            <span style="margin-top: 5px; width: 18%; height: 75px; float: left;">
              <img id="airlineLogo" src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.Airline?.AirlineCode}.png" height="27px" width="30px" alt="UK">
            </span>
            <span style="margin-top: 5px; width: 70%; float: left;">
              ${item.Airline.AirlineName} ${item.Airline.AirlineCode} ${item.Airline.FlightNumber}<br>
              ${item.Airline.FareClass} Class
              <br>      
              Operating Carrier:${item.Airline.AirlineCode}
              <label>Cabin:Economy</label>
            </span>
          </div>
          <div style="width: 25%; float: left; margin-right: 10px;">
            <span style="margin-top: 5px; width: 100%; float: left;">
              ${item.Origin.AirportCode} (${item.Origin.AirportName}, ${item.Origin.CityName}) </span>
            <span style="margin-top: 5px; width: 100%; float: left;">Terminal: 3</span>
            <span style="margin-top: 5px; width: 100%; float: left;">${formatDate(item.Origin.DepTime)}</span>
          </div>
          <div style="width: 25%; float: left; margin-right: 10px;">
            <span style="margin-top: 5px; width: 100%; float: left;">
              ${item.Destination.AirportCode} (${item.Destination.AirportName}, ${item.Destination.CityName})</span>
            <span style="margin-top: 5px; width: 100%; float: left;">Terminal: 1</span>
            <span style="margin-top: 5px; width: 100%; float: left;">${formatDate(item.Destination.ArrTime)}</span>
          </div>
          <div style="width: 20%; float: right; margin-right: 10px;">
            <span style="margin-top: 5px; width: 100%; float: left;"> Confirmed </span>
          </div>
          <div align="center" class="alignment" style="line-height:10px">
        </div>
    `).join("");

    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
      <title>Flight booking pdf</title>
    </head>
    <body>
      <div style="background:#fff; overflow:hidden; padding: 9px; width: 750px; border:1px solid #D6D8E7;font-size:12px; font-family:arial, sans-serif; margin:10px auto;">
        <div style="justify-content: space-between; align-items: flex-start; display: flex; margin-top: 24px;">
          <img src="https://travvolt.s3.amazonaws.com/ST-Main-LogoPdf.png" alt="logo" style="width:25%;margin-top: -10px;" />
          <div style="color: black; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word;">
            E - Ticket
          </div>
          <div style="flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex;">
            <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
              <div style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                Booking Id:
              </div>
              <div style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                ${to.bookingId}
              </div>
            </div>
            <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
              <div style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                PNR:
              </div>
              <div style="color: #071c2c; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                ${to.pnr}
              </div>
            </div>
            <div style="justify-content: center; align-items: center; gap: 4px; display: flex;">
              <div style="color: #868686; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word;">
                (Booked on ${formattedDate})
              </div>
            </div>
          </div>
        </div>
        <div style="background: white; padding: 24px; border-radius: 12px;">
          <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
            <div style="width:100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
              <div style="width: 40%; float: left; margin-right: 0;">
                Passenger Name
              </div>
              <div style="width: 30%; float: left; margin-right: 0;">
                Ticket Number
              </div>
              <div style="width: 21%; float: right; text-align: left; margin-right: 0;">
                Frequent flyer no.
              </div>
            </div>
            ${passengerDetailsHtml}
          </div>
          <div style="width: 100%; float: left; margin-top: 15px; border: 1px solid #D6D8E7;">
            <div style="width: 100%; background-color: #004684; float: left; font-weight: bold; padding: 5px; padding-right: 0px; border-bottom: 1px solid #D6D8E7; color: #fff;">
              <div style="width: 23%; float: left; margin-right: 0;">
                Flights
              </div>
              <div style="width: 24%; float: left; margin-right: 10px;">
                Departing
              </div>
              <div style="width: 23%; float: left; margin-right: 10px;">
                Arriving
              </div>
              <div style="width: 20%; float: right; margin-right: 10px;">
                Status
              </div>
            </div>
            ${airlineDetailsHtml}
          </div>
        </div>
        <div class="important-info" style="margin-top:100px; padding:10px; margin 10px;">
      <p><span style="color: red;">Important:</span> This is an Electronic Ticket. Passengers must carry a valid photo ID for check-in at the airport.</p>
      <p>Carriage and other services provided by the carrier are subject to conditions of carriage which hereby incorporated by reference. These conditions may be obtained from the issuing carrier. If the passenger's journey involves an ultimate destination or stop in a country other than country of departure the Warsaw convention may be applicable and the convention governs and in most cases limits the liability of carriers for death or personal injury and in respect of loss of or damage to baggage.</p>
      <p><span style="color: red;">Note:</span> We recommend purchasing travel insurance for your trip. Please contact your travel advisor to purchase travel insurance.</p>
    </div>
      </div>
   <div class="footer" style="width: 80%; text-align: center;">
      <img src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/skyTrails-banner.png" alt="SkyTrails Banner">
    </div>
    </body>
    </html>`;

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
        headless: true, // Run in non-headless mode for debugging
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    // await page.goto('https://developer.chrome.com/');
    await page.setDefaultNavigationTimeout(puppeteerTimeOut); // Set a 60-second timeout for navigation
    await page.setDefaultTimeout(puppeteerTimeOut)

    // Increase the timeout for setContent
    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded"],
      timeout: puppeteerTimeOut
    });

    // Optionally, disable loading of external resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font') {
            request.abort();
        } else {
            request.continue();
        }
    });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Define nodemailer transporter
    

    // Define email options
    const passengerEmail = to.passengerDetails[0].email;
    const mailOptions = {
        from: process.env.DEFAULT_ZOHO_EMAIL,
        to: passengerEmail,
        subject: 'Flight Booking Confirmation',
       html: flightMail(to),
        attachments: [
            {
                filename: 'booking-confirmation.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    // Send email
    try {
        await nodemailerConfig.sendMail(mailOptions);
        // console.log('Email sent successfully.',pdfBuffer);
    } catch (error) {
        console.error('Error sending email:', error);
    }
},

 sendPromotionalEmailCofirmationMail: async (to, userName) => {
  const personalizedGreeting = userName
  ? `Dear ${userName},`
  : `Dear Subscriber,`;
    var mailOptions = {
      from: process.env.DEFAULT_ZOHO_EMAIL,
      to: to,
      subject: "Exclusive Access to TheSkyTrails' Latest Offers!",
      html: offerUpdateSubscription(personalizedGreeting,to),
    };
    return await nodemailerConfig.sendMail(mailOptions);
  },
};


