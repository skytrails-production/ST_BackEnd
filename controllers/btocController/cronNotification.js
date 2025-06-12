const cron = require("node-cron");
const status = require("../../enums/status");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const sendSMS = require("../../utilities/sendSms");
const moment = require('moment');
const client=require("../../utilities/client");
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

const { forumQueServices } = require("../../services/forumQueServices");
const {
  createforumQue,
  findforumQue,
  findforumQueData,
  deleteforumQue,
  updateforumQue,
  forumQueListLookUpAdmin,
  forumQueListLookUp,
  forumQueListLookUp1,
  getTopSTories,
  forumQueListLookUpOfUser,
} = forumQueServices;
const notifications = [
    {
    message: `Travel ka mood hai par doston ka nahi?😩`,
    body: `Solo Trip ka plan banayein?🧳😎`,
  },
  {
    message: `Garmi se pareshaan ho?🔥`,
    body: `Hill Station chalein?⛄🏞️❄️`,
  },

  {
    message: `Office ki chhutti approve nahi ho rahi?😤`,
    body: `Weekend Getaway ka idea kaisa rahega?⛱️🍹`,
  },
 
  {
    message: `Long distance bestie se milna hai??🫂`,
    body:`Bus Ticket book Kar du?🚌🤩✨`
  },
  {
    message: `Tarikh pe Tarikh📆 
`,
    body: 'Ghumne chalna bhi hai ya Tarikh hi deni hai??😡'
  },

];

const lastNotificationSent = new Map();

// var taskPromotionalNotification = cron.schedule("45 09 * * *",async () => {
//   try {
//     // 'phone.mobile_number':'8115199076'
//     const users = await userList({
//     // 'phone.mobile_number':{ $in: ['8115199076','7830130697'] },
//       status: status.ACTIVE,
//       deviceToken: { $exists: true, $ne: "" },
//     });
//     for (const user of users) {
//       try { 
//         const notificationMessage = `Bollywood ka maza, Punjab di shaan!🔥`;
//         const messageBody = `CGC Landran is set for PEFA 2025! Book your Free Passes Now! 🎭`;
//       const imageurl=`https://skytrails.s3.amazonaws.com/randomImages/uploadedFile_1738845021257_ArtboardPefa2025.jpg`;
//         const lastSent = lastNotificationSent.get(user._id);
//         if (lastSent && Date.now() - lastSent < 3600000) {
         
//           continue; // Skip sending notification
//         }
//         await pushNotificationAfterDepricate(
//           user.deviceToken,
//           notificationMessage,
//           messageBody,
//           // imageurl
//         );

//         // Update the last notification sent time for this user
//         lastNotificationSent.set(user._id, Date.now());
//       } catch (pushError) {
//         // Handle if any user is not registered
       
//         // continue to the next user even if one fails
//         continue;
//       }
//       // Stop the cron job after execution
//       taskPromotionalNotification.stop();
//     }
//   } catch (error) {
//     // console.log("error when running task2", error);
//   }
// },
// {
//   scheduled: true,
//   timezone: "Asia/Kolkata", // Timezone setting
// }
// );
// taskPromotionalNotification.start(); // Start the task2

// Define and schedule task2 separately
var taskPlatformNotification = cron.schedule("55 17 * * *",
  async () => {
    try {  
      // 'contactNo.mobile_number': { $in: ['8115199076', '9135219071'] },
      const users = await userList({
        // 'phone.mobile_number': { $in: ['9135211234','8115199076','9135219071','9801540172'] },
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
        //  console.log("sent===>>",sent)
        } catch (pushError) {
          // Handle if any user is not registered
          // console.log("pushError===",pushError)
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

const redisUpdate = cron.schedule(
  "*/30 * * * *",
  async () => {
    try {
      // Fetch all current data from the database
      const dataToUpdate = await findforumQueData({});

      // Cache all existing records
      for (const item of dataToUpdate) {
        const cacheKey = JSON.stringify({ id: item._id });
        const dat = await client.set(cacheKey, JSON.stringify(item), { EX: 3600 });
      }

      // Identify deleted records by comparing existing cache keys with database IDs
      const cachedKeys = await client.keys('*'); // Get all cache keys
      const validKeys = dataToUpdate.map((item) => JSON.stringify({ id: item._id }));
      
      // Find keys to delete
      const keysToDelete = cachedKeys.filter((key) => !validKeys.includes(key));
      if (keysToDelete.length > 0) {
        console.log("Keys to Delete:", keysToDelete);

        // Remove invalid cache entries
        for (const key of keysToDelete) {
          await client.del(key);
          console.log(`Deleted Cache Key: ${key}`);
        }
      }
    } catch (error) {
      console.log("Error in Redis Update Job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);

redisUpdate.start();
