
const nodemailer = require('nodemailer');
const openapiKey="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";

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

const nodemailerConfig = nodemailer.createTransport({
  host: 'smtppro.zoho.in',
  port: 465, // 465 or 587 for TLS
  secure:true, 
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  }
});

const nodemailerConfigHawaiYatra=nodemailer.createTransport({
  // service: 'smtp.zoho.com',
  host: 'smtppro.zoho.com',
  port: 465, // 465 or 587 for TLS
  secure: true,  
  auth: {
    userHawai: process.env.ZOHO_EMAIL,
    passHawai: process.env.ZOHO_PASSWORD,   
  }
});

module.exports = {nodemailerConfig,nodemailerConfigHawaiYatra};
