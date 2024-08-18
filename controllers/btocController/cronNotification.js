const cron = require("node-cron");
const status = require("../../enums/status");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const sendSMS = require("../../utilities/sendSms");
const moment = require('moment');
//******************************SERVICES********************************************/
const { quizServices } = require("../../services/btocServices/quizServices");
const {
  createQuizContent,
  findQuizContent,
  findQuizData,
  deleteQuiz,
  updateQuiz,
  createQuizResponseContent,
  findQuizResponseContent,
  findQuizResponseData,
  deleteQuizResponse,
  updateQuizResponse,
} = quizServices;

const {
  pushNotification,
  mediapushNotification,
  pushSimpleNotification,
  pushNotification1
} = require("../../utilities/commonFunForPushNotification"); // Assuming you have a controller to send notifications
const {
  eventBookingServices,
} = require("../../services/btocServices/eventBookingServices");
const {
  createBookingEvent,
  findBookingEventData,
  deleteBookingEvent,
  eventBookingList,
  updateBookingEvent,
  countTotalBookingEvent,
  getBookingEvent,
} = eventBookingServices;

const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  userList,
  findUserData,
  updateUser,
  deleteUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const {notificationServices}=require("../../services/notificationServices");
const {createNotification,findNotification,findNotificationData,deleteNotification,updateNotification,countNotification}=notificationServices;

const notifications = [
  {
    message: `Travel Now, Pay Later`,
    body: `Book your dream trip today and pay at your convenience!🌟🗺️`,
  },
  {
    message: `Perfect Raksha Bandhan gift for your sister`,
    body: `Surprise her with the gift of Adventure!
Book now and make this Raksha Bandhan truly special!
🌍✨`,
  },
  {
    message: `Raksha Bandhan Special: Gift a memorable trip! ✈`,
    body: `Unlock travel deals and craft unforgettable memories!
Book now for a special Raksha Bandhan!`,
  },
  {
    message: `Raksha Bandhan par, boring gifts ko bye-bye bolo!`,
    body: `Behen ko do "love aur adventure" ka gift 
Book now—because your couch isn't a vacation!`,
  },
  {
    message: `Congratulations! username`,
    body: `Just for you! Exclusive Offer get upto 20% off with TheSkyTrails pvt ltd `,
  },
  // {
  //   message: `🤔 Soch kya rhe ho neeche daikho `,
  //   body: `The skytrails pr apko millega har services par 20% ka offer`,
  // },
  // {
  //   message: `🌊 Take your partner to a beach getaway!`,
  //   body: `Enjoy 20% off on your travel packages! Book now`,
  // },
  // {
  //   message: `Last Chance Alert! `,
  //   body: `Don't miss out on our flash sale - book now before it's gone! ⏰✈`,
  // },
  // {
  //   message: `Escape the ordinary!`,
  //   body: `Explore our curated list of off-the-beaten-path destinations for your next adventure! 🗺🌟`,
  // },
  {
    message: `Rakhi Deals for Long-Distance Siblings!`,
    body: `Celebrate Rakhi despite the distance with special travel discounts. Plan your visit or dream trip now!`,
  },
//   {
//     message: `Thara Paisa 💸💵`,
//     body: `Thari Daulat 🤑
// Thara Hotel 🏟️
// Thari Flight ✈️
// Thara Deal 🤗`,
//   },
  {
    message: `बहना ने भाई की कलाई से प्यार बाँधा है 🧿`,
    body: `"Celebrate the loving bond of Rakhi with exclusive travel offers. Plan your trip and create beautiful memories together. Book now!`,
  },
//   {
//     message: `Two things we love ❤️`,
//     body: `1. username
// 2. Giving 20% OFF* to username on all Bookings
// CLAIM NOW`,
//   },
  {
    message: `Behanon Ke Liye: Rakhi Travel Sale!`,
    body: `Special discounts for sisters on Rakhi. Plan your trip!`,
  },
];



const lastNotificationSent = new Map();


var taskPromotionalNotification = cron.schedule("46 12 * * *",async () => {
  try {
    // 'phone.mobile_number':'8115199076'
    const users = await userList({
    // 'phone.mobile_number':{ $in: ['8115199076', '9135219071','8847301811','9810704352','9870249076','9354527010'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" },
    });
    // Task 2 logic
    // const notificationMessage = "🚀एक सफ़र पे यूँ ही कभी चल दो तुम,✈️";
    // const messageBody = `✨Check out our latest promotion! We're offering deals so good, even your coffee will do a double-take! ☕️ Explore your journey with TheSkyTrails pvt ltd✨`;
    for (const user of users) {
      try { 
        const notificationMessage = `🚨 You Can't Ignore This!`;
        const messageBody = `Book now and get 20% off on your holiday packages! 🏖🌟`;
      const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      // const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`
        // Check if a notification has been sent to this user recently
        const lastSent = lastNotificationSent.get(user._id);
        if (lastSent && Date.now() - lastSent < 3600000) {
          // One hour interval
          console.log(
            "Notification already sent to user within the last hour. Skipping."
          );
          continue; // Skip sending notification
        }
        await pushSimpleNotification(
          user.deviceToken,
          notificationMessage,
          messageBody,
          // imageurl
        );

        // Update the last notification sent time for this user
        lastNotificationSent.set(user._id, Date.now());
      } catch (pushError) {
        // Handle if any user is not registered
        console.error(
          "Error while sending push notification to user:",
          pushError
        );
        // continue to the next user even if one fails
        continue;
      }
      // Stop the cron job after execution
      taskPromotionalNotification.stop();
    }
  } catch (error) {
    console.log("error when running task2", error);
  }
},
{
  scheduled: true,
  timezone: "Asia/Kolkata", // Timezone setting
}
);
taskPromotionalNotification.start(); // Start the task2

// Main task
// const taskEventNotification = cron.schedule("30 15 * * *",
//   async () => {
//     try {
//       // Fetch all users from the database
//       // const users = await eventBookingList({
//       //   status: status.ACTIVE,
//       //   deviceToken: { $exists: true, $ne: "" },
//       // });
//       const users = await userList({
//         // 'phone.mobile_number':{ $in: ['8115199076', ] },
//           status: status.ACTIVE,
//           deviceToken: { $exists: true, $ne: "" },
//         });
//         console.log('users.',users.length);
//       // Iterate through each user and send a notification if the registration time is within the defined window
//       for (const user of users) {
//           const notifications = `Manager ke taano se pareshn ho? Aur dhoond rahe relaxation?`;
//           const messageBody1 = `No worries! Skytrails is here! 
// Book your package with us and find relaxation.`;
//          const data= await pushSimpleNotification(user.deviceToken, notifications, messageBody1);
//          console.log("data===========",data);
//           console.log("send notification======user=====================",user.username);
//         // }
//       }

//       console.log("Notification cron job executed successfully.");
//       // taskEventNotification.stop();
//     } catch (error) {
//       console.error("Error occurred during notification cron job:", error);
      
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Adjust timezone as per your requirement
//   }
// );

// taskEventNotification.start(); // Start the task

// Define and schedule task2 separately
// Define a map to store the timestamp of the last notification sent to each user

// Modify your cron job logic


// var taskEventNotification1 = cron.schedule("0 18 * * *",
//   async () => {
//     try {
//       const users = await eventBookingList({
//         // 'contactNo.mobile_number':'8115199076',
//         status: status.ACTIVE,
//         deviceToken: { $exists: true, $ne: "" },
//       });
//       console.log("=======================", users.length);
//       const notificationMessage = `Missing out!`;
//       const messageBody = `Checkout the Skytrails app and claim your best offer before it's too late.`;
//       const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
//       for (const user of users) {
//         try {
//           // Check if a notification has been sent to this user recently
//           const lastSent = lastNotificationSent.get(user._id);
//           if (lastSent && Date.now() - lastSent < 3600000) {
//             // One hour interval
//             console.log(
//               "Notification already sent to user within the last hour. Skipping."
//             );
//             continue; // Skip sending notification
//           }

//           await pushNotification(user.deviceToken,notificationMessage,messageBody,imageurl);
//           console.log(
//             "Notification cron job executed successfully. TASK 2",
//             user.name
//           );

//           // Update the last notification sent time for this user
//           lastNotificationSent.set(user._id, Date.now());
//         } catch (pushError) {
//           console.error(
//             "Error while sending push notification to user:",
//             pushError
//           );
//           continue; // Continue to the next user even if one fails
//         }
//       }
//       // Stop the cron job after execution
//       taskEventNotification1.stop();
//     } catch (error) {
//       console.log("Error when running task2", error);
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Timezone setting
//   }
// );

// taskEventNotification1.start(); // Start the task2

// Define and schedule task2 separately
var taskPlatformNotification = cron.schedule("0 20 * * *",
  async () => {
    try {
      console.log("===========================");
      
      // 'contactNo.mobile_number': { $in: ['8115199076', '9135219071'] },
      const users = await userList({
        'phone.mobile_number': { $in: ['8115199076','9135219071','8384082560'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      
    const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      for (const user of users) {
        try {
          // Task 2 logic

          // const notificationMessage = `Hey ${user.username}, Great news! 🆕📱`;
          // const messageBody = `We just updated the Skytrails app, and it's amazing🤩! 
          // Now you can find super cool deals on flights✈ and hotels🏨📱 
          
          // Update your app now and let's get your wanderlust fix!`;
          const notificationMessage = `CODE:SKY500`;
      const messageBody = `A proposal For ${user.username},Would you love to save on your Bookings.✈️🏖️🚎🏩..`;
          await pushSimpleNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            // imageurl
          );
          console.log(
            "Notification cron job executed successfully.TASK 2",
            user.username
          );
        } catch (pushError) {
          // Handle if any user is not registered
          console.error(
            "Error while sending push notification to user:",
            pushError
          );
          // continue to the next user even if one fails
          continue;
        }
      }
      // Stop the cron job after execution
      taskPlatformNotification.stop();
    } catch (error) {
      console.log("error when running task2", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);
taskPlatformNotification.start();

// const title='📅 Attention: Venue Change! 🏢'
//             const msg=`Dear ${user.name}😎,
//             We wanted to inform you that there has been a change in the venue for the upcoming PEFA 2024 event. The new venue details are as follows:
//            📍New Location: Rayat Bahra University,V.P.O. Sahauran, Tehsil Kharar Distt, Kharar, Punjab
//             We apologize for any inconvenience this change may cause. Please make a note of the updated venue to ensure you don't miss out on the excitement!
//             Looking forward to seeing you there!
//             Best regards,
//             TheSkyTrails Team ✨
//             `
// Modify your cron job logic


// var taskEventNotification1 = cron.schedule("30 11 * * *",
//   async () => {
//     try {
//       const users = await eventBookingList({
//         // 'phone.mobile_number': { $in: ['8115199076','9135219071','7607879891','8384082560'] },
//         status: status.ACTIVE,
//         deviceToken: { $exists: true, $ne: "" },
//       });
//       console.log("=======================", users.length);
//       // const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
//       const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`;
//       for (const user of users) {
//         try {
//           const notificationMessage = `Travel Made Easy! 🥰👩🏻‍❤️‍💋‍👨🏻`;
//           const messageBody=`Checkout the latest deals and offers for the upcoming Looong Weekend.`
// //           const messageBody = `FLY
// //    STAY
// //       ENJOY   
// //    WITH    
// // US
// // Skytrails😊
// // Skytrails pe aisi deals hain jo na kar sako ignore!`;
//           // Check if a notification has been sent to this user recently
//           const lastSent = lastNotificationSent.get(user._id);
//           if (lastSent && Date.now() - lastSent < 3600000) {
//             // One hour interval
//             console.log(
//               "Notification already sent to user within the last hour. Skipping."
//             );
//             continue; // Skip sending notification
//           }

//           await pushSimpleNotification(
//             user.deviceToken,
//             notificationMessage,
//             messageBody,
//             imageurl
//           );
//           console.log(
//             "Notification cron job executed successfully. TASK 2",
//             user.name
//           );

//           // Update the last notification sent time for this user
//           lastNotificationSent.set(user._id, Date.now());
//         } catch (pushError) {
//           console.error(
//             "Error while sending push notification to user:",
//             pushError
//           );
//           continue; // Continue to the next user even if one fails
//         }
//       }
//       // Stop the cron job after execution
//       taskEventNotification1.stop();
//     } catch (error) {
//       console.log("Error when running task2", error);
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata", // Timezone setting
//   }
// );

// taskEventNotification1.start(); // Start the task2



// const expireQuiz = cron.schedule("34 18 * * *", async () => {
//   try {
//     const currentDate = moment().startOf('day'); // Get the current date with time set to 00:00:00
//     console.log("currentDate", currentDate.format("YYYY-MM-DD"),currentDate);
// const curr1=currentDate.format("YYYY-MM-DD")
//     const getQuizQue = await findQuizData({ status: status.ACTIVE });
//     // console.log("getQuizQue", getQuizQue);

//     for (const que of getQuizQue) {
//       const quizDate = moment(que.quizDate).startOf('day'); // Get the date part of quizDate with time set to 00:00:00
//       console.log("quizDate", quizDate.format("YYYY-MM-DD"),quizDate.isBefore(currentDate),quizDate);
// const a=quizDate.format("YYYY-MM-DD")
//       if (a.isBefore(curr1)) {
//         const updateData = await updateQuiz({ _id: que._id }, { status: status.BLOCK });
//         console.log("updateData====", updateData);
//       }
//     }

//     // Stop the cron job after execution
//     expireQuiz.stop();
//   } catch (error) {
//     console.log("error when running task expireQuiz", error);
//   }
// });


var taskPlatformNotification = cron.schedule("0 18 * * *",
  async () => {
    try {
      // 'contactNo.mobile_number': { $in: ['8115199076', '9135219071'] },
      const users = await userList({
        // 'phone.mobile_number': { $in: ['8115199076','9135219071','8384082560'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      
    const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      for (const user of users) {
        try {
          // Task 2 logic

          // const notificationMessage = `Hey ${user.username}, Great news! 🆕📱`;
          // const messageBody = `We just updated the Skytrails app, and it's amazing🤩! 
          // Now you can find super cool deals on flights✈ and hotels🏨📱 
          
          // Update your app now and let's get your wanderlust fix!`;
          const notificationMessage = `✈ Are you ready for takeoff?`;
      const messageBody = `Get upto 50% Off on your Flight. Just for 2 hours. Hurry! ⏳`;
          await pushSimpleNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            // imageurl
          );
          
        } catch (pushError) {
          // Handle if any user is not registered
          console.error(
            "Error while sending push notification to user:",
            pushError
          );
          // continue to the next user even if one fails
          continue;
        }
      }
      // Stop the cron job after execution
      taskPlatformNotification.stop();
    } catch (error) {
      console.log("error when running task2", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);
taskPlatformNotification.start();

var sendNotificationTask=cron.schedule("23 10 * * *",async()=>{
  try {
    const users = await userList({
      // 'phone.mobile_number': { $in: ['8115199076','9135219071','8384082560','9870249076'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" },
    });
    const findAllNotification=await findNotificationData({notificationType:'promotion'});
    const notification=findAllNotification[Math.floor(Math.random() * findAllNotification.length)]
    for (const user of users) {
      try {
        const notificationMessage = notification.title.replace('username', user.username);
        const messageBody = notification.description.replace(/username/g, user.username);

        await pushSimpleNotification(
          user.deviceToken,
          notificationMessage,
          messageBody,
          // imageurl
        );
      } catch (pushError) {
         // Handle if any user is not registered
         console.error(
          "Error while sending push notification to user:",
          pushError
        );
        // continue to the next user even if one fails
        continue;
      }
    }
    // Stop the cron job after execution
    sendNotificationTask.stop();
  } catch (error) {
    console.log("error when running task2", error);
  }
})
sendNotificationTask.start();

const taskRandomNotification = cron.schedule(
  "15 14 * * *",
  async () => {
    try {
      const users = await userList({
        status: status.ACTIVE,
        // 'phone.mobile_number':{ $in: ['8115199076','8384082560','8847301811' ] },
        deviceToken: { $exists: true, $ne: "" },

      });

      const imageurl = `https://skytrails.s3.amazonaws.com/notification.jpg`;
      const notification = notifications[Math.floor(Math.random() * notifications.length)];
      console.log("notification==========",notification);
      for (const user of users) {
        try {
          const notificationMessage = notification.message.replace('username', user.username);
          const messageBody = notification.body.replace(/username/g, user.username);

          await pushSimpleNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            // imageurl
          );
         
        } catch (pushError) {
          console.error(
            "Error while sending push notification to user:",
            pushError
          );
          continue;
        }
      }
      // Stop the cron job after execution
      taskPlatformNotification.stop();
    } catch (error) {
      console.log("Error when running task:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);

taskRandomNotification.start();