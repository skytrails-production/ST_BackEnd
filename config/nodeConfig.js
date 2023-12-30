
const nodemailer = require('nodemailer');
const openapiKey="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";

const nodemailerConfig = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: "theskytrails@gmail.com",
    pass: "whewbkjroqyiirsw",
  }
});

module.exports = nodemailerConfig;
