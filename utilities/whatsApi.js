const axios = require('axios');
const sdk = require('api')('@doubletick/v2.0#19ixm2gblq0ov4vn');
const { v4: uuidv4 } = require('uuid');
sdk.auth('key_IqTwUC2O8n');
async function sendWhatsAppMessage( number, msg) {
    try {
        const whatsappAPIUrl = process.env.WHATSAPP_URL
        const apiKey = process.env.WHATSAPP_API_KEY;
        const mobileNumbers = number;
        const message = msg;
        const response = await axios.get(`${whatsappAPIUrl}?apikey=${apiKey}&mobile=${mobileNumbers}&msg=${message}`);
        if(!response){
            console.log("response===========Error in uploading image");
        }
        return response.data;
    } catch (error) {
        console.error('Error in WhatsApp API:', error);
        throw error;
    }
}
async function sendMessageWhatsApp(number, msg) {
    try {
      const messageId = uuidv4();
      console.log("Template Message ID:", messageId);
    
      const data = await sdk.outgoingMessagesWhatsappText({
        from: '+918800517859',
        to: number,
        messageId: messageId,
        content: { templateName:"hello_test",text: "welcome to TheSkyTrails. Now you are a sub admin.", previewUrl: true }
      });
    
      console.log("WhatsApp message sent successfully:", data);
      return data;
    } catch (error) {
      console.error('Error on sending WhatsApp:', error);
      // Log the entire error object for further investigation
      console.error('Complete Error Object:', error);
  
      console.log('Template Content:', "welcome to TheSkyTrails. Now you are a sub admin.");
      console.log('Recipient Number:', number);
    
      if (error.status === 422 && error.data && error.data.message === 'Chat window is closed. To send a message to a closed window, please send a template message') {
        console.error('Chat window is closed. Sending a template message is required.');
        // Handle the case of a closed window
        // You may want to send a template message here
        // Note: Sending a template message requires pre-approval by WhatsApp.
      }
    
      throw error;
    }
  }
  
  
  
  
module.exports = { sendWhatsAppMessage,sendMessageWhatsApp };
