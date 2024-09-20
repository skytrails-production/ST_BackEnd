const axios = require("axios");
const sdk = require("api")("@doubletick/v2.0#19ixm2gblq0ov4vn");
const { v4: uuidv4 } = require("uuid");
const apiKey=process.env.DOUBLE_TICK_API_KEY;
const doubleTickNumber=process.env.DOUBLE_TICK_NUMBER;
const doubleTick=process.env.DOUBLETICK_URL;
sdk.auth(process.env.DOUBLE_TICK_API_KEY);
// async function sendWhatsAppMessage(number, msg) {
//   try {
//     const whatsappAPIUrl = process.env.WHATSAPP_URL;
//     const apiKey = process.env.WHATSAPP_API_KEY;
//     const mobileNumbers = number;
//     const message = msg;
//     const response = await axios.get(
//       `${whatsappAPIUrl}?apikey=${apiKey}&mobile=${mobileNumbers}&msg=${message}`
//     );
//     if (!response) {
//       console.log("response===========Error in uploading image");
//     }
//     return response.data;
//   } catch (error) {
//     console.error("Error in WhatsApp API:", error);
//   }
// }
async function sendMessageWhatsApp(number, var1,var2,temName) {
  try{ 
    const options = {
      method: 'POST',
      url: doubleTick,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: apiKey
      },
      data: {
        messages: [
          {
            content: {
              language: 'en',
              templateData: {
                header: {
                  type: 'TEXT',
                  placeholder: 'Header text',
                  mediaUrl: 'https://example.com/image.png',
                  filename: 'Document caption'
                },
                body: {placeholders: [var1,var2]}
              },
              templateName: temName
            },
            from: doubleTickNumber,
            to: number,
          }
        ]
      }
    };
    const response= await axios.request(options);
    // console.log("response======",response.data.messages);
    if(response.data.messages[0]){
      return response.data.messages[0];
    }
  }
  catch(err){
    console.log("erorr while send whatsapp=====>>>>>>",err.response)
  }
}
async function sendWhatsAppMsgAdmin(number,temName) {
  try{
    const options = {
      method: 'POST',
      url: doubleTick,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: apiKey
      },
      data: {
        messages: [
          {
            content: {
              language: 'en',
              templateData: {
                header: {
                  type: 'TEXT',
                  placeholder: 'Header text',
                  mediaUrl: 'https://example.com/image.png',
                  filename: 'Document caption'
                },
              },
              templateName: temName
            },
            from: doubleTickNumber,
            to: number,
          }
        ]
      }
    };
    const response= await axios.request(options);
    if(response.data.messages[0]){
      return response.data.messages[0];
    }
  }
  catch(err){
    console.log("erorr while send whatsapp=====>>>>>>",err.response)
  }
}
async function sendWhatsAppMsgAdminPackage(number,var1,temName) {
  try{
    const options = {
      method: 'POST',
      url: doubleTick,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: apiKey
      },
      data: {
        messages: [
          {
            content: {
              language: 'en',
              templateData: {
                header: {
                  type: 'TEXT',
                  placeholder: 'Header text',
                  mediaUrl: 'https://example.com/image.png',
                  filename: 'Document caption'
                },
                body: {placeholders: [var1]}
              },
              templateName: temName
            },
            from: doubleTickNumber,
            to: number,
          }
        ]
      }
    };
    const response= await axios.request(options);
    if(response.data.messages[0]){
      return response.data.messages[0];
    }
  }
  catch(err){
    console.log("erorr while send whatsapp=====>>>>>>",err.response)
  }
}
async function sendWhatsAppMsgRM(number,to,email,pass,temName) {
  try{
    const options = {
      method: 'POST',
      url: doubleTick,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: apiKey
      },
      data: {
        messages: [
          {
            content: {
              language: 'en',
              templateData: {
                header: {
                  type: 'TEXT',
                  placeholder: 'Header text',
                  mediaUrl: 'https://example.com/image.png',
                  filename: 'Document caption'
                },
                body: {placeholders: [to,email,pass]}
              },
              templateName: temName
            },
            from: doubleTickNumber,
            to: number,
          }
        ]
      }
    };
    const response= await axios.request(options);
    // console.log("response=============",response);
    if(response.data.messages[0]){
      return response.data.messages[0];
    }
  }
  catch(err){
    console.log("erorr while send whatsapp=====>>>>>>",err.response)
  }
}

async function sendWhtsAppAISensy(to,var1,var2,var3,compaignName){
  try {
let data = {  "apiKey": process.env.AISENSYAPIKEY,    
"campaignName": compaignName,    
"destination": to,    
"userName":  process.env.AISENSYUSERNAME,   
"templateParams" : [String(var1),String(var2),String(var3)],
"source": "new-landing-page form",
  "media": {},
  "buttons": [],
  "carouselCards": [],
  // "location": {}
};

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://backend.aisensy.com/campaign/t1/api/v2',
  headers: {},
  data : data
};

const response=await axios.request(config)
  // console.log("=======================",JSON.stringify(response.data),response);
  return response.data;

  } catch (error) {
    console.log("erorr while send whatsapp=====>>>>>>",error.response)
  }
}

async function sendWhtsAppOTPAISensy(to,templateParams,compaignName){
  try {
let data = {  "apiKey": process.env.AISENSYAPIKEY,    
"campaignName": compaignName,    
"destination": to,    
"userName":  process.env.AISENSYUSERNAME,   
"templateParams" : templateParams,
"source": "new-landing-page form",
  "media": {},
  "buttons": [],
  "carouselCards": [],
  // "location": {}
};

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://backend.aisensy.com/campaign/t1/api/v2',
  headers: {},
  data : data
};

const response=await axios.request(config)
  return response.data;

  } catch (error) {
    console.log("erorr while send whatsapp=====>>>>>>",error.response)
  }
}

async function sendWhtsAppAISensyMultiUSer(destinations, templateParams, campaignName) {
  try {
    // Ensure destinations are in the proper format
    if (destinations.length === 0) {
      throw new Error('Destinations should be a non-empty array');
    }
    // Construct the base data object
    let data = {
      "apiKey": process.env.AISENSYAPIKEY,
      "campaignName": campaignName,
      "userName": process.env.AISENSYUSERNAME,
      "templateParams": templateParams,
      "source": "new-landing-page form",
      "media": {},
      "buttons": [],
      "carouselCards": [],
      "location": {}
    };

    // Add each destination individually
    destinations.forEach(destination => {
      data = { ...data, "destination": destination };

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://backend.aisensy.com/campaign/t1/api/v2',
        headers: {},
        data: data
      };

      // Make the request for each destination
      axios.request(config)
        .then(response => {
          // console.log(`Response for ${destination}:`, response.data);
        })
        .catch(error => {
          console.error(`Error for ${destination}:`, error.response ? error.response.data : error.message);
        });
    });

  } catch (error) {
    console.error("Error while sending WhatsApp message:", error.response ? error.response.data : error.message);
  }
}
module.exports = {sendMessageWhatsApp,sendWhatsAppMsgAdmin,sendWhatsAppMsgAdminPackage,sendWhatsAppMsgRM,sendWhtsAppAISensy,sendWhtsAppOTPAISensy,sendWhtsAppAISensyMultiUSer };

