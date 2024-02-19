const cron = require("node-cron");
const status = require("../../enums/status");
const {
  pushNotification,
  mediapushNotification,
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
var taskPromotionalNotification = cron.schedule("30 10 * * *",async () => {
    try {
      const users = await userList({
        // 'contactNo.mobile_number': { $in: ['8115199076', '9354416602','9810704352'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      // Task 2 logic
      const notificationMessage = "🚀एक सफ़र पे यूँ ही कभी चल दो तुम,✈️";
      const messageBody = `✨Check out our latest promotion! We're offering deals so good, even your coffee will do a double-take! ☕️ Explore your journey with TheSkyTrails pvt ltd✨`;
      for (const user of users) {
        try {
          await pushNotification(
            user.deviceToken,
            notificationMessage,
            messageBody
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
      taskPromotionalNotification.stop();
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
var taskEventNotification = cron.schedule("59 * * * * *",async () => {
    try {
      // Fetch all users from the database
      const users = await eventBookingList({
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      const current_Date = new Date();
      // Iterate through each user and send a notification
      for (const user of users) {
        if (user.createdAt.getTime() >= current_Date.getTime()) {
          try {
            const notifications = `🎉Excited for PEFA 2024,${user.name}😎?`;
            const messageBody1 = `📅 Time: 5 PM 😅 Date: Mar. 2, 2024
            📍 Location: Rayat Bahra University,V.P.O. Sahauran, Tehsil Kharar Distt, Kharar, Punjab 
            📱Check to make sure you get the most out of TheSkyTrails app! Special deals are on the way. Don't pass this up! ✨
            See you there!
            TheSkyTrails Team`;
            await pushNotification(
              user.deviceToken,
              notifications,
              messageBody1
            );
          } catch (error) {
            console.log("error when running task2", error);
          }
        }
      }
      console.log("Notification cron job executed successfully.");
      taskEventNotification.stop();
    } catch (error) {
      console.error("Error occurred during notification cron job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Adjust timezone as per your requirement
  }
);
taskEventNotification.start(); // Start the task1

// Define and schedule task2 separately
var taskEventNotification1 = cron.schedule("41 17 * * *",async () => {
    try {
      const users = await eventBookingList({
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      // Task 2 logic
      const notificationMessage ="✨Reminder: PEFA2024 Event !✨";
      const messageBody =`✨Just a reminder that PEFA2024,is happening on 2 March 2024!We look forward to seeing you at PEFA2024!
      Best regards,
      TheSkyTrails pvt ltd✨`; 
      for (const user of users) {
        try {
          await pushNotification(
            user.deviceToken,
            notificationMessage,
            messageBody
          );
          // console.log(
          //   "Notification cron job executed successfully.TASK 2",
          //   user.name
          // );
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
      taskEventNotification1.stop();
    } catch (error) {
      console.log("error when running task2", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);
taskEventNotification1.start(); // Start the task2






// const title='📅 Attention: Venue Change! 🏢'
//             const msg=`Dear ${user.name}😎,
//             We wanted to inform you that there has been a change in the venue for the upcoming PEFA 2024 event. The new venue details are as follows:
//            📍New Location: Rayat Bahra University,V.P.O. Sahauran, Tehsil Kharar Distt, Kharar, Punjab 
//             We apologize for any inconvenience this change may cause. Please make a note of the updated venue to ensure you don't miss out on the excitement!
//             Looking forward to seeing you there!
//             Best regards,
//             TheSkyTrails Team ✨
//             `