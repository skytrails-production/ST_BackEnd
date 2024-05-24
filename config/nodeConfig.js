
const nodemailer = require('nodemailer');
const openapiKey="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";

const nodemailerConfig = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.GMAILID,
    pass: process.env.GMAILPASS,
  }
});

const nodemailerConfigHawaiYatra=nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    userHawai: process.env.GMAILIDHAWAIYATRA,
    passHawai: process.env.GMAILPASSHAWAIYATRA,   
  }
});

module.exports = {nodemailerConfig,nodemailerConfigHawaiYatra};
