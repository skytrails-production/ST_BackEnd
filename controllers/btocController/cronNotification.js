const cron = require("node-cron");
const status = require("../../enums/status");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const sendSMS = require("../../utilities/sendSms");
const moment = require('moment');


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
const lastNotificationSent = new Map();
// Define your cron job schedule. This example runs the job every day at 9:00 AM.

// var task =cron.schedule('0 * * * *', async () => {
//   try {
//     // Fetch all users from the database
//     const users = await eventBookingList({
//       // 'contactNo.mobile_number': { $in: ['8115199076', '9354416602','9810704352'] },
//       status: status.ACTIVE,
//       deviceToken: { $exists: true, $ne: "" }
//     });
//     // const usereTokenExist=await userList({'contactNo.mobile_number': { $in: ['8115199076', '9354416602','9810704352'] },status: status.ACTIVE,deviceToken: { $exists: true, $ne: ""}});
//     const current_Date=new Date();
//      // Iterate through each user and send a notification
//        // Merge the two arrays
//     // const allUsers = [...users, ...usereTokenExist];
//     for (const user of users) {
//       if(user.createdAt.getTime()>=current_Date.getTime()){
//           const notifications= `🎉Excited for PEFA 2024,${user.name}😎?`;
//           const messageBody1=`📅 Time: 5 PM 😅 Date: Mar. 2, 2024
//             📍 Location: CGC Mohali,Punjab
//             📱Check to make sure you get the most out of TheSkyTrails app! Special deals are on the way. Don't pass this up! ✨
//             See you there!
//             TheSkyTrails Team`
//             await pushNotification(user.deviceToken, notifications,messageBody1);
//             console.log('Notification cron job executed successfully.messageBody1');
//       }
//       var task2=cron.schedule('0 8 * * *', async () => {
//         try {
//            const notificationMessage = "🚀एक सफ़र पे यूँ ही कभी चल दो तुम,✈️";
//            const messageBody=`✨Check out our latest promotion! We're offering deals so good, even your coffee will do a double-take! ☕️✨`
//            await mediapushNotification(user.deviceToken, notificationMessage,messageBody);
//            console.log('Notification cron job executed successfully.TASK 2');
//      // Stop the cron job after execution
//             task2.stop();
//          console.log('Notification cron job stopped.');
//         } catch (error) {
//           console.log("error when run second task",error);
//         }
//       });
//       task2.start();

//     }
//     console.log('Notification cron job executed successfully.');
//      // Stop the cron job after execution
//      task.stop();
//      console.log('Notification cron job stopped.');
//   } catch (error) {
//     console.error('Error occurred during notification cron job:', error);
//   }
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata' // Adjust timezone as per your requirement
// });
// task.start();

// Define and schedule task2 separately
var taskPromotionalNotification = cron.schedule("0 9 * * *",async () => {
  try {
    // 'phone.mobile_number':'8115199076'
    const users = await userList({
    // 'phone.mobile_number':{ $in: ['8115199076', '9135219071','8847301811'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" },
    });
    // Task 2 logic
    // const notificationMessage = "🚀एक सफ़र पे यूँ ही कभी चल दो तुम,✈️";
    // const messageBody = `✨Check out our latest promotion! We're offering deals so good, even your coffee will do a double-take! ☕️ Explore your journey with TheSkyTrails pvt ltd✨`;
    for (const user of users) {
      try { 
        const notificationMessage = `O to thehre pardeshi,sath qa nibhaynege❔`;
        const messageBody = `Kal ki pehli flight✈️ se , ༺🍃☞ 𝓑𝓐𝓛𝓘 ☪ツ chale jayenge....`;
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
var taskPlatformNotification = cron.schedule("14 14 * * *",
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
          const notificationMessage = `Hey ${user.username}, bag pack kiya? 🎒`;
      const messageBody = `SkyTrails pe book karo aur chalo duniya ghoomne! 🌍✨`;
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
          const notificationMessage = `Uda do stress ko, ${user.username}! ✈️`;
      const messageBody = `SkyTrails pe abhi book karo aur le aao zindagi mein thoda adventure! 🌟🗺️`;
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

const notifications = [
  {
    message: `Uda do stress ko,username✈️`,
    body: `SkyTrails pe abhi book karo aur le aao zindagi mein thoda adventure username! 🌟🗺️`,
  },
  {
    message: `Hey username, bag pack kiya ? 🎒`,
    body: `SkyTrails pe book karo aur chalo duniya ghoomne! 🌍✨`,
  },
  {
    message: `username,nayi destinations ka pata laga! 🌏`,
    body: `SkyTrails ke sath apni next trip plan karo aur maza lo! 😄🛫`,
  },
  {
    message: `Travel ka time aa gaya,🏃‍♂️✈️`,
    body: `SkyTrails pe abhi book karo aur pao amazing deals! 💸🌟`,
  },
  {
    message: `duniya bula rahi hai! 🌍`,
    body: `SkyTrails se book karo aur jee lo zindagi! 🎉🛩️`,
  },
  {
    message: `Wanderlust activated,!🌟`,
    body: `SkyTrails pe book karo aur apni travel list complete karo! 🗺️🎒`,
  },
  {
    message: `80 Missed call from The Skytrails! 📞🗺️`,
    body: `Get the best deals and skyCoins too on flights, hotels and bus booking.📲💰`,
  },
  {
    message: `username,sapno ki yatra shuru ho gayi! 🚀`,
    body: `SkyTrails pe tickets book karo aur travel ka maza lo! 😎🌍`,
  },
  {
    message: `Naye safar ki shuruaat! 🌅`,
    body: `SkyTrails pe book karo aur apne dosto ko saath le jao! 👫✈️`,
  },
  {
    message: `Trip ki planning ho gayi? 📅`,
    body: `SkyTrails ke sath apni next vacation plan karo aur enjoy karo! 🏖️✨`,
  },
  {
    message: `Boss ne chutti approve kar di?🥳`,
    body: `"Dil Chahta Hai" a road trip to Goa?🏖😍,Checkout the Goa packages on our app📲`,
  },
  {
    message: `Knock-Knock! The Skytrails ✈`,
    body: `Don't miss the latest offers and discounts on Hotel Bookings!🎉🤩`,
  },
  {
    message: `New deals just landed! 🛬 `,
    body: `Check out the hottest travel offers now on the Skytrails App.✈📲`,
  },
];

const taskRandomNotification = cron.schedule(
  "0 10 * * *",
  async () => {
    try {
      const users = await userList({
        status: status.ACTIVE,
        // 'phone.mobile_number':{ $in: ['8115199076', '9135219071','8847301811'] },
        deviceToken: { $exists: true, $ne: "" },

      });

      const imageurl = `https://skytrails.s3.amazonaws.com/notification.jpg`;

      for (const user of users) {
        try {
          const notification = notifications[Math.floor(Math.random() * notifications.length)];
          const notificationMessage = notification.message.replace('username', user.username);
          const messageBody = notification.body.replace('username', user.username);

          await pushSimpleNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            // imageurl
          );
          console.log(
            "Notification cron job executed successfully. User:",
            user.username
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