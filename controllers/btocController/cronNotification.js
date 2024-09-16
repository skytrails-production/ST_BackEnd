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
  pushNotificationAfterDepricate
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
    body: `Don't let payments hold you back. Travel now, pay at your convenience!✈️`,
  },
  {
    message: `Like Jolly LLB, we'll make you laugh and save you money!`,
    body: `Amazing offers are available. Book now!`,
  },
  {
    message: `Yeh Dosti Hum Nahi Todenge! 🤝`,
    body: `Plan a group trip with your besties and create lifelong memories together.`,
  },
  {
    message: `Kuch Kuch Hota Hai! 💘`,
    body: `Find your perfect travel companion and embark on a romantic getaway.`,
  },
  {
    message: `Book Now, Pay When You Can!`,
    body: `No need to delay your travels. Book now.`,
  },
  {
    message: `username,Dil Chahta Hai Travel! 🎶`,
    body: `Explore new horizons and create unforgettable memories. Your next adventure awaits!`,
  },
  {
    message: `Trust me! Traveling is not expensive💰`,
    body:`Missing Out is😟`
  },
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
    message: `Bamsi Bamsi Bing Bing Bo😯`,
    body: `Ladakh🗻 Ghoom kar aayenge maze🤩`,
  },
  {
    message: `Cheen Tapak Dam Dam!👌`,
    body: `Goa Pahunch Jaye hum🏖
Rhyme Chhodo, Trip Book Karo✈`,
  },
  {
    message: `Isi din ke liye Savings ki thi🤩`,
    body: `Ab jaldi se Bag Pack Karo, Baki sab Done Hai✅`,
  }
//   {
//     message: `Two things we love ❤️`,
//     body: `1. username
// 2. Giving 20% OFF* to username on all Bookings
// CLAIM NOW`,
//   },
];

const lastNotificationSent = new Map();

var taskPromotionalNotification = cron.schedule("30 8 * * *",async () => {
  try {
    // 'phone.mobile_number':'8115199076'
    const users = await userList({
    // 'phone.mobile_number':{ $in: ['8115199076', '9135219071','8847301811','9810704352','9870249076','9354527010'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" },
    });
    for (const user of users) {
      try { 
        const notificationMessage = `Book Now, Pay When You Can!`;
        const messageBody = `No need to delay your travels. Book now.✈️✨`;
      const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
        const lastSent = lastNotificationSent.get(user._id);
        if (lastSent && Date.now() - lastSent < 3600000) {
          console.log(
            "Notification already sent to user within the last hour. Skipping."
          );
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

// Define and schedule task2 separately
var taskPlatformNotification = cron.schedule("42 14 * * *",
  async () => {
    try {  
      // 'contactNo.mobile_number': { $in: ['8115199076', '9135219071'] },
      const users = await userList({
        'phone.mobile_number': { $in: ['7017757907','8115199076'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      
    const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      for (const user of users) {
        try {
          const notificationMessage = `CODE:Sky500`;
      const messageBody = `Hey ${user.username}! 🎬✨ Get ready to be the hero of your travel story! Use CODE: SKY500 and save big on your bookings. Let your adventure begin, superstar! ✈️🏖️🚎🏩🌟`;
          await pushNotificationAfterDepricate(
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

var sendNotificationTask=cron.schedule("1 */9 * * *",async()=>{
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

const taskRandomNotification = cron.schedule("36 17 * * *",async () => {
    try {
      const users = await userList({
        status: status.ACTIVE,
        'phone.mobile_number':{ $in: ['8115199076','8847301811' ] },
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
taskRandomNotification.start();