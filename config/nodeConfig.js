
const nodemailer = require('nodemailer');
// const openapiKey="sBlbkFJxDNGxZgW2VC8Csv3yzJJ";

// const nodemailerConfig = nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//     user: process.env.GMAILID,
//     pass: process.env.GMAILPASS,
//   }
// });

// const nodemailerConfigHawaiYatra=nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//     userHawai: process.env.GMAILIDHAWAIYATRA,
//     passHawai: process.env.GMAILPASSHAWAIYATRA,   
//   }
// });

//Zoho mailing

// const nodemailerConfig = nodemailer.createTransport({
//   host: 'smtppro.zoho.in',
//   port: 465, // 465 or 587 for TLS
//   secure:true, 
//   auth: {
//     user: process.env.ZOHO_EMAIL,
//     pass: process.env.ZOHO_PASSWORD,
//   }
// });

// const nodemailerConfigHawaiYatra=nodemailer.createTransport({
//   // service: 'smtp.zoho.com',
//   host: 'smtppro.zoho.com',
//   port: 465, // 465 or 587 for TLS
//   secure: true,  
//   auth: {
//     userHawai: process.env.ZOHO_EMAIL,
//     passHawai: process.env.ZOHO_PASSWORD,   
//   }
// });




//ZohoZeptoMailing 

const nodemailerConfig = nodemailer.createTransport({
  host: 'smtp.zeptomail.in',
  port: 465, // 465 or 587 for TLS
  secure:true, 
  auth: {
    user: process.env.ZEPTO_MAIL_USERNAME,
    pass: process.env.ZEPTO_MAIL_PASSWORD,
  }
});

const nodemailerConfigHawaiYatra=nodemailer.createTransport({
  // service: 'smtp.zoho.com',
  host: 'smtp.zeptomail.in',
  port: 465, // 465 or 587 for TLS
  secure: true,  
  auth: {
    user: process.env.ZEPTO_MAIL_USERNAME,
    pass: process.env.ZEPTO_MAIL_PASSWORD,
     }
});

module.exports = {nodemailerConfig,nodemailerConfigHawaiYatra};
