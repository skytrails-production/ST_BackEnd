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
    message: `Go Now, Pay Later!`,
    body: `Don’t let payments hold you back. Travel now, pay at your convenience!✈️`,
  },
  {
    message: `Your ₹500 Discount Awaits!`,
    body: `SFirst booking? Get upto ₹500 off and start your journey right!🌍✨`,
  },
  {
    message: `Booking Just Got Easier!`,
    body: `Smooth and hassle-free bookings await you. Start your journey in just a few clicks!`,
  },
  {
    message: `Adventure First, Payments Later!`,
    body: `Explore new destinations without upfront costs. Pay later, travel now!`,
  },
  {
    message: `Book Now, Pay When You Can!`,
    body: `No need to delay your travels. Book now and choose a payment plan that works for you!`,
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
    message: `Aaj Phir ₹500 Bachane Ki Tamanna Hai!`,
    body: `Save upto ₹500 on your first booking. Make your travel dreams come true!`,
  },
//   {
//     message: `Thara Paisa 💸💵`,
//     body: `Thari Daulat 🤑
// Thara Hotel 🏟️
// Thari Flight ✈️
// Thara Deal 🤗`,
//   },
  {
    message: `Mere Haath Mein…Tera Booking Confirmation!`,
    body: `ravel now, pay later. Hold onto your booking and let the journey begin!`,
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
        const notificationMessage = `Senorita, Bade Bade Deshon Mein…Koi Bhi Pal!`;
        const messageBody = `In the grand realm of travel, book now and pay later. The adventure of a lifetime awaits! 🏞️💫`;
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
          const notificationMessage = `CODE:Sky500`;
      const messageBody = `Hey ${user.username}! 🎬✨ Get ready to be the hero of your travel story! Use CODE: SKY500 and save big on your bookings. Let your adventure begin, superstar! ✈️🏖️🚎🏩🌟`;
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


var taskPlatformNotification = cron.schedule("0 13 * * *",
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
          const notificationMessage = `Aaj Phir ₹500 Bachane Ki Tamanna Hai!`;
      const messageBody = `Save ₹500 on your first booking. Make your travel dreams come true!`;
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

var sendNotificationTask=cron.schedule("*/1 * * * *",async()=>{
  try {
    const users = await userList({
      // 'phone.mobile_number': { $in: ['8115199076','9135219071','8384082560'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" },
    });
    const findAllNotification=await findNotificationData({notificationType:'promotion',isSend:false});
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
        await updateNotification({_id:notification._id},{isSend:true})  ;
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

const taskRandomNotification = cron.schedule("15 14 * * *",async () => {
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