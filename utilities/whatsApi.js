const axios = require("axios");
const sdk = require("api")("@doubletick/v2.0#19ixm2gblq0ov4vn");
const { v4: uuidv4 } = require("uuid");
sdk.auth(process.env.DOUBLE_TICK_API_KEY);
async function sendWhatsAppMessage(number, msg) {
  try {
    const whatsappAPIUrl = process.env.WHATSAPP_URL;
    const apiKey = process.env.WHATSAPP_API_KEY;
    const mobileNumbers = number;
    const message = msg;
    const response = await axios.get(
      `${whatsappAPIUrl}?apikey=${apiKey}&mobile=${mobileNumbers}&msg=${message}`
    );
    if (!response) {
      console.log("response===========Error in uploading image");
    }
    return response.data;
  } catch (error) {
    console.error("Error in WhatsApp API:", error);
    throw error;
  }
}
async function sendMessageWhatsApp(number, msg) {
  const messageId = uuidv4();
  console.log("Template Message ID:", messageId);
  // const url = 'https://public.doubletick.io/whatsapp/message/text';
  // const authorizationKey = 'key_IqTwUC2O8n';

  // const messageData = {
  //   content: {
  //     template: true,
  //     templateName: 'hello_test',
  //     language: 'en',
  //     content: {
  //       text: "Welcome to TheSkyTrails. Now you are a sub admin.",
  //     },
  //   },
  //   from: '+919056768815',
  //   to: '+918115199076',
  //   messageId: '6e3d79c7-ca3d-456c-8694-c0a16ad9f6b5',
  // };
  // console.log('Request Payload:', JSON.stringify(messageData));

  // console.log('Message Data:', messageData);
  // console.log('Text Value:', messageData.content.content.text);

  // try {
  //   const response = await axios.post(url, messageData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: authorizationKey,
  //     },
  //   });

  //   console.log('Success:', response.data);
  // } catch (error) {
  //   console.error('Error:', error.message, error.response?.data);
  // }

  const options = {
    method: "POST",
    url: "https://public.doubletick.io/whatsapp/message/text",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: "key_IqTwUC2O8n",
    },
    data: {
      content: {language: "en",templateName: "hello_test",template: true, text: "welcome to TheSkyTrails. Now you are a sub admin." },
      from: "+919056768815",
      to: "+918115199076",
      messageId: messageId,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

module.exports = { sendWhatsAppMessage, sendMessageWhatsApp };

// const axios = require('axios');

// const options = {
//   method: 'POST',
//   url: 'https://public.doubletick.io/whatsapp/message/text',
//   headers: {
//     accept: 'application/json',
//     'content-type': 'application/json',
//     Authorization: 'key_IqTwUC2O8n'
//   },
//   data: {
//     content: {
//       text: 'could you please provide your 𝐂𝐕, a copy of your 𝐩𝐚𝐬𝐬𝐩𝐨𝐫𝐭, and a brief, 𝟏-𝐦𝐢𝐧𝐮𝐭𝐞 𝐢𝐧𝐭𝐫𝐨𝐝𝐮𝐜𝐭𝐢𝐨𝐧 𝐯𝐢𝐝𝐞𝐨 at your earliest convenience? Your cooperation is highly appreciated, and this information will help us ensure a smooth and efficient process.  To unsubscribe, please reply STOP',
//       previewUrl: true
//     },
//     from: '8800517859',
//     to: '918287850111',
//     messageId: '49d06b4b-6804-4e11-a4dc-598d69ad7cc5'
//   }
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
