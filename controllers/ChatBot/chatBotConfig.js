const OpenAI = require("openai");
const fs = require('fs'); 
const path =require("path") ;
const commonFunction=require("../../utilities/commonFunctions")
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRETKEY,
});
const {
  staticContentServices,
} = require("../../services/staticContentServices");
const {
  createstaticContent,
  findstaticContent,
  findstaticContentData,
  deletestaticContentStatic,
  updatestaticContentStatic,
} = staticContentServices;
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model");
const getAiResponse = async (prompt, formattedPackages) => {
  try {
    const aboutOurApp = await findstaticContent({ type: "CONTACTUS" });
    const data = await SkyTrailsPackageModel.find({});
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: `You are a customer support assistant for The Sky Trails, a travel app that helps users book flights, buses, hotels, and holiday packages. Your role is to assist users with their inquiries, provide accurate information about bookings, and offer recommendations when asked.

            - **Product Overview:**
            - **List of Holiday Packages:**
  Packages are available on our website, and you should match user queries with the following conditions:
  - Search for keywords in the **title** of the package or in its **special tags** where 'specialTag.word' is "true".
  - The search should:
    - Be **case-insensitive**.
    - Match keywords if they exist as **whole words** in the title or within the 'specialTag.word'.
    - Return relevant packages if at least one word matches.
    - all list of packages are ${data}.
    response format is  ${formattedPackages}
  - If no matching package is found, inform the user politely and offer to provide further assistance.
              - The Sky Trails specializes in travel solutions, including flight tickets, bus reservations, hotel bookings, and customizable holiday packages.
              - Users can explore and book affordable travel options through the app or website: https://theskytrails.com.
            
            - **Features and Services:**
              - **Flights:** Book domestic and international flights at competitive rates.
              - **Buses:** Reserve intercity and intracity bus tickets.
              - **Hotels:** Find and book accommodations ranging from budget to luxury.
              - **Holiday Packages:** Choose from curated holiday packages or customize your own to suit your preferences.
            
            - **Booking and Payment Policies:**
              - Tickets and bookings are confirmed upon successful payment.
              - Users can modify or cancel bookings through the app, subject to terms and conditions.
              - Refunds, if applicable, are processed within 7 business days.
            
            - **Common User Questions:**
              - "How do I book a flight ticket?"
              - "What are the cancellation charges for a hotel booking?"
              - "Can I reschedule my bus reservation?"
              - "Do you offer discounts on holiday packages?"
              - "Suggest some honeymoon packages"
            
            - **Support Contact Information:**
              - Email: ${aboutOurApp.email}
              - Phone: ${aboutOurApp.contactNumber}
              - Address: ${aboutOurApp.address[0].RegisteredAddress}
              - Chat: Available on the website and app.
            
            - **Common Issues and Solutions:**
              - **Issue:** Payment failed during booking.
                **Solution:** Guide the user to retry the payment or check their bank/card details.
              - **Issue:** User cannot find their booking confirmation.
                **Solution:** Direct them to the "My Bookings" section in the app or website.
              - **Issue:** Refund not received.
                **Solution:** Advise the user to check their email for refund status or contact support.
            
            - **Tone and Style:**
              - Be polite, friendly, and professional.
              - Provide concise and actionable answers.
              - Offer additional help or resources when necessary.
            



            - **Important Note:**
              Always prioritize user satisfaction and aim to resolve issues promptly. If you cannot assist with a specific query, guide the user to contact live support for further help.
            
            `,
        },
        { role: "user", content: prompt || "Theskytrails pvt ltd" },
      ],
      max_tokens: 1000,
      // stream:true
    });
    //   console.log("completion===",completion.choices[0].message);

    return completion.choices[0].message.content;
  } catch (error) {
    // console.error("Error communicating with OpenAI API:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
const getAiResponseCustomPackage = async (prompt,data) => {
  try {
    const start = performance.now(); 
    const aboutOurApp = await findstaticContent({ type: "CONTACTUS" });

    // const data = await SkyTrailsPackageModel.find({});
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: `You are a customer support assistant for The Sky Trails.,suggest some packages which we have
          `,
        },
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: `
            Here are the available holiday packages based on your query:
            ${data}
          `,
        },
      ],
      // max_tokens: 16384,
      // stream:true
    });
      // console.log("completion===",completion.id,completion.created,completion.system_fingerprint);
    let aiResp=completion.choices[0].message.content;
    const response={
      aiResp,data
    }
    const end = performance.now(); // End time
    console.log(`Bot response time: ${((end - start) / 1000).toFixed(2)} seconds`);
    createThread(data,aboutOurApp,prompt,response);
    // console.log("response===",response);
    
    return response;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

const createFileInOpenAi=async()=>{
  try {
    const allPackages = await SkyTrailsPackageModel.find({})
    .select("_id title packageAmount specialTag").sort({ "packageAmount.amount": -1, title: 1 });
    const lengthofArray=allPackages.length;
    // console.log("lengthofArray====",lengthofArray)
    const packagesFile = JSON.stringify(allPackages);
    // const myAssistantFile = await openai.files.create(
    //   // "chatcmpl-ApCnv1zjKZEkqPF0xYxamdDE96t1X",
    //   {
    //     // file_id: packagesFile,
    //     file: packagesFile,  
    //     purpose: 'answers', 
    //   }
    // );
    const myAssistantFile = await openai.files.create({
      file: fs.createReadStream(packagesFile),
      purpose: "fine-tune",
    });
    // console.log("myAssistantFile=========",myAssistantFile);
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
  }
}

const createThread=async(data,aboutOurApp,prompt,response)=>{
try {
  const newThread = await openai.beta.threads.create();
// console.log("newThread============",newThread);

const assistant = await openai.beta.assistants.create({
  name: "SkyBot",
  instructions: `You are a customer support assistant for The Sky Trails.,suggest some packages which we have,${data} suggest ur like ,which is dynamic and our address is ${aboutOurApp} `,
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4o-mini"
});
// console.log("assistant====",assistant.id,assistant.name)
const message = await openai.beta.threads.messages.create(
  newThread.id,
  {
    role: "user",
    content: prompt
  }
  );
  // console.log("message=================>>>>>>>>",message.content);

  let run = await openai.beta.threads.runs.createAndPoll(
    newThread.id,
    { 
      assistant_id: assistant.id,
      instructions: `Please address the user  Here are the available holiday packages based on your query:
            ${data}`
    }
    );
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      // for (const message of messages.data.reverse()) {
      //   console.log(`${message.role} > ${message.content[0].text.value}`);
      // }
      // } else {
      // console.log(run.status);
      }
    // console.log("run====",run)
} catch (error) {
  console.log(error);
  
}
}

// createFileInnnOpenAi()

// const streamResp=async() =>{
//   const stream = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [{ role: 'user', content: 'You are a customer support assistant for The Sky Trails.' }],
//     stream: true,
//   });
//   for await (const chunk of stream) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || '');
//   }
// }
// const chatCompletion=async () =>{
//   const stream = await openai.beta.chat.completions.stream({
//     model: 'gpt-4o-mini',
//     messages: [{ role: 'user', content: 'You are a customer support assistant for The Sky Trails.' }],
//     stream: true,
//   });

//   stream.on('content', (delta, snapshot) => {
//     process.stdout.write(delta);
//   });

//   // or, equivalently:
//   for await (const chunk of stream) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || '');
//   }

//   const chatCompletion = await stream.finalChatCompletion();
//   console.log(chatCompletion.choices[0]); // {id: "…", choices: […], …}
// }
// chatCompletion()
// streamResp()

const transcribeAudio = async (audioBuffer, tempFilePath) => {
  try {
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, audioBuffer);

    // Call the OpenAI Whisper API
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
    });

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Return the transcription text
    return response.text;
  } catch (error) {
    console.error("Error in OpenAI transcription:", error);
    // throw new Error("Failed to transcribe audio. Please try again.");
  }
};

const convertTextToSpeech =async(text)=>{
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // You can change to "nova" or "echo" or "alloy"
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return await commonFunction.getAudioUrlAWS(buffer, "audio/mpeg");
  } catch (error) {
    console.error("TTS Error:", error);
    // throw new Error("Failed to generate audio");
  }
}

const askOpenAI = async (query, context) => {
  try {
    const formattedContext = context
    .map(
      (pkg, index) =>
        `${index + 1}. ${pkg.title} - Price: ₹${pkg.price}\nDetails: ${pkg.details}`
    )
    .join('\n\n');
      const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
              { role: 'system', content: `You are a customer support assistant for The Sky Trails.,suggest some packages  that works with a specific database.` },
              { role: 'user', content: query },
              { role: 'assistant', content: `Here are some packages available:\n\n${formattedContext}`},
          ],
      });
      return response.choices[0].message.content;
  } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return 'I encountered an issue. Please try again later.';
  }
};

const askOpenAIGeneralQuery = async (query, context) => {
  try {
      const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
              { role: 'system', content: `You are a customer support assistant for The Sky Trails.Thank you for contacting us. To get an instant resolution related to your booking, please visit the My Bookings section on the App or Website by tapping on url https://theskytrails.com/.` },
              { role: 'user', content: query },
              { role: 'assistant', content: `Thank you for contacting us. To get an instant resolution related to your booking, please visit the My Bookings section on the App or Website by tapping on url(https://theskytrails.com/)`},
          ],
      });
      return response.choices[0].message.content;
  } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return 'I encountered an issue. Please try again later.';
  }
};
module.exports = {getAiResponse,getAiResponseCustomPackage,transcribeAudio,convertTextToSpeech,askOpenAI,askOpenAIGeneralQuery};
