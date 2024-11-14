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
  pushNotification1,
  pushNotificationAfterDepricate,
  pushNotAfterDepricateImage
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
    message: `Like Jolly LLB, we'll make you laugh and save you money!`,
    body: `Amazing offers are available. Book now!`,
  },
  {
    message: `Your bus is ready to roll! 🚌💨`,
    body: `Pack your bags, the adventure starts soon!`,
  },
  // {
  //   message: `Feel the Tum Jo Aaye Magic!`,
  //   body: `Just like Tum Jo Aaye in Once Upon A Time in Mumbaai, make this Karwachauth special with a dreamy trip! Save ₹500 on your next booking`,
  // },
  // {
  //   message: `Time to pack your bags for a Diwali getaway!Don't miss the bus! 🚏`,
  //   body: `But don't worry, we’ve got your seat reserved. 🏖" 🍬✈️`,
  // },
 
  {
    message: `New Year’s resolution: Travel more!`,
    body:`Just remember to save the ‘overpacking’ for your suitcase, not your plans!" 🧳✨`
  },
  {
    message: `Great news! 🎉Enjoy 20% OFF on your next bus booking! `,
    body: `Time to hit the road and save some cash! 🚌💸`,
  },
//   {
//     message: `Thara Paisa 💸💵`,
//     body: `Thari Daulat 🤑
// Thara Hotel 🏟️
// Thari Flight ✈️
// Thara Deal 🤗`,
//   },
 
  {
    message: `Fly with TheSkyTrails`,
    body: `Travel smart, fly affordable. Only with TheSkyTrails!`,
  },
 
  // {
  //   message: `Suna Kya?`,
  //   body: `TheSkyTrails is offering festive seasons deals.`,
  // },
];

const lastNotificationSent = new Map();

var taskPromotionalNotification = cron.schedule("45 09 * * *",async () => {
  try {
    // 'phone.mobile_number':'8115199076'
    const users = await userList({
    // 'phone.mobile_number':{ $in: ['8115199076'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" },
    });
    for (const user of users) {
      try { 
        const notificationMessage = `Fly with TheSkyTrails!`;
        const messageBody = `Travel smart, fly affordable. Only with TheSkyTrails`;
      const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
        const lastSent = lastNotificationSent.get(user._id);
        if (lastSent && Date.now() - lastSent < 3600000) {
         
          continue; // Skip sending notification
        }
        await pushNotificationAfterDepricate(
          user.deviceToken,
          notificationMessage,
          messageBody,
          // imageurl
        );

        // Update the last notification sent time for this user
        lastNotificationSent.set(user._id, Date.now());
      } catch (pushError) {
        // Handle if any user is not registered
       
        // continue to the next user even if one fails
        continue;
      }
      // Stop the cron job after execution
      taskPromotionalNotification.stop();
    }
  } catch (error) {
    // console.log("error when running task2", error);
  }
},
{
  scheduled: true,
  timezone: "Asia/Kolkata", // Timezone setting
}
);
taskPromotionalNotification.start(); // Start the task2

// Define and schedule task2 separately
var taskPlatformNotification = cron.schedule("33 13 * * *",
  async () => {
    try {  
      // 'contactNo.mobile_number': { $in: ['8115199076', '9135219071'] },
      const users = await userList({
        // 'phone.mobile_number': { $in: ['8802737860','8115199076'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      
    const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      for (const user of users) {
        try {
          const notificationMessage = `Koi bhi safar ho, hum hain saath! 🌟`;
          // Book with TheSkyTrails – your wallet-friendly flight expert!🌟
      const messageBody = `Har musafir ki khwahish puri karne ka waqt aa gaya! 🚀`;
          await pushNotificationAfterDepricate(
            user.deviceToken,
            notificationMessage,
            messageBody,
            // imageurl
          );
         
        } catch (pushError) {
          // Handle if any user is not registered
          
          // continue to the next user even if one fails
          continue;
        }
      }
      // Stop the cron job after execution
      taskPlatformNotification.stop();
    } catch (error) {
      // console.log("error when running task2", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);
taskPlatformNotification.start();

var sendNotificationTask=cron.schedule("58 23 * * *",async()=>{
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

        await pushNotificationAfterDepricate(
          user.deviceToken,
          notificationMessage,
          messageBody,
          // imageurl
        );      
        await updateNotification({_id:notification._id},{isSend:true})  ;
      } catch (pushError) {
         // Handle if any user is not registered
       
        // continue to the next user even if one fails
        continue;
      }
    }
    // Stop the cron job after execution
    sendNotificationTask.stop();
  } catch (error) {
    // console.log("error when running task2", error);
  }
})
sendNotificationTask.start();

const taskRandomNotification = cron.schedule("10 16 * * *",async () => {
    try {
      const users = await userList({
        status: status.ACTIVE,
        // 'phone.mobile_number':{ $in: ['8115199076','9801540172'] },
        deviceToken: { $exists: true, $ne: "" },

      });
      const imageurl = `https://travvolt.s3.amazonaws.com/notification/uploadedFile_1727351077557_Artboard2festivesale.jpg`;
      for (const user of users) {
        const randomIndex = Math.floor(Math.random() * notifications.length);
        const notification = notifications[randomIndex];
          const notificationMessage = notification.message.replace('username', user.username);
          const messageBody = notification.body.replace(/username/g, user.username);

          await pushNotAfterDepricateImage(
            user.deviceToken,
            notificationMessage,
            messageBody,
            imageurl
          );
          // notifications.splice(randomIndex, 1);

        }
       

      // Stop the cron job after execution
      taskPlatformNotification.stop();
    } catch (error) {
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);
taskRandomNotification.start();

const taskRandomNotification1 = cron.schedule("03 19 * * *",async () => {
  try {
    const users = await userList({
      status: status.ACTIVE,
      // 'phone.mobile_number':{ $in: ['8115199076','8847301811' ] },
      deviceToken: { $exists: true, $ne: "" },

    });
    const imageurl = `https://skytrails.s3.amazonaws.com/notification.jpg`;
    const notification = notifications[Math.floor(Math.random() * notifications.length)];
    for (const user of users) {
        const notificationMessage = notification.message.replace('username', user.username);
        const messageBody = notification.body.replace(/username/g, user.username);

        await pushNotificationAfterDepricate(
          user.deviceToken,
          notificationMessage,
          messageBody,
          // imageurl
        );
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
taskRandomNotification1.start();

const taskRandomNotification2 = cron.schedule("30 12 * * *",async () => {
  try {
    const users = await userList({
      status: status.ACTIVE,
      // 'phone.mobile_number':{ $in: ['8115199076','9801540172'] },
      deviceToken: { $exists: true, $ne: "" },

    });
    const imageurl = `https://travvolt.s3.amazonaws.com/notification/uploadedFile_1727351077557_Artboard2festivesale.jpg`;
    for (const user of users) {
      const randomIndex = Math.floor(Math.random() * notifications.length);
      const notification = notifications[randomIndex];
        const notificationMessage = notification.message.replace('username', user.username);
        const messageBody = notification.body.replace(/username/g, user.username);

        await pushNotAfterDepricateImage(
          user.deviceToken,
          notificationMessage,
          messageBody,
          imageurl
        );
        // notifications.splice(randomIndex, 1);

      }
     

    // Stop the cron job after execution
    taskPlatformNotification.stop();
  } catch (error) {
  }
},
{
  scheduled: true,
  timezone: "Asia/Kolkata", // Timezone setting
}
);
taskRandomNotification2.start();
