const cron = require("node-cron");
const status = require("../../enums/status");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const sendSMS = require("../../utilities/sendSms");




const {
  pushNotification,
  mediapushNotification,
  pushSimpleNotification
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
var taskPromotionalNotification = cron.schedule("15 10 * * *",async () => {
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
        const notificationMessage = `The wait is nearly over!💕`;
        const messageBody = `✨PEFA event passes are on the way, so prepare for an unforgettable experience.✨`;
        // const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
        const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`
          // Check if a notification has been sent to this user recently
          const lastSent = lastNotificationSent.get(user._id);
          if (lastSent && Date.now() - lastSent < 3600000) {
            // One hour interval
            console.log(
              "Notification already sent to user within the last hour. Skipping."
            );
            continue; // Skip sending notification
          }
          await pushNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            imageurl
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
const taskEventNotification = cron.schedule("*/3 * * * *",
  async () => {
    try {
      // Fetch all users from the database
      const users = await eventBookingList({
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      // Get the current date and time
      const current_Date = new Date();
      // Define the time window for notifications (in minutes)
      const notificationWindow = 5; // Adjust as needed
      // Iterate through each user and send a notification if the registration time is within the defined window
      for (const user of users) {
        // Get the registration timestamp of the user
        const createdAtUser = user.createdAt.getTime();
        // Calculate the earliest time for notifications
        
        const earliestNotificationTime = new Date(
        current_Date.getTime() - notificationWindow * 60000
        );
        // Check if the registration time is within the notification window
        if (
          createdAtUser >= earliestNotificationTime.getTime() &&
          createdAtUser <= current_Date.getTime()
        ) {
          // Send the notification to the user
          const notifications = `🎉 Excited for PEFA2024, Dear ${user.name} 😎?`;
          const messageBody1 = `We are pleased to inform you that your booking for PEFA 2024, an extraordinary night, is confirmed with TheSkytrails PVT LTD. We will be sharing more details soon, so stay tuned for regular updates on our app.Looking forward to seeing you there!.
              ✈️ TheSkyTrails Team,✈️`;
              const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`
          await pushNotification(user.deviceToken, notifications, messageBody1,imageurl);
          console.log("send notification======user=====================",user.name);
        }
      }

      console.log("Notification cron job executed successfully.");
      // taskEventNotification.stop();
    } catch (error) {
      console.error("Error occurred during notification cron job:", error);
      
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Adjust timezone as per your requirement
  }
);

taskEventNotification.start(); // Start the task

// Define and schedule task2 separately
// Define a map to store the timestamp of the last notification sent to each user

// Modify your cron job logic
var taskEventNotification1 = cron.schedule("20 17 * * *",
  async () => {
    try {
      const users = await eventBookingList({
        // 'contactNo.mobile_number':'8115199076',
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      console.log("=======================", users.length);
      const notificationMessage = "✨Kho gaye hum kahan…!!🎊✨";
      const messageBody = `✨Plan your journey with The Skytrails and get the best deals!✨`;
      const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      for (const user of users) {
        try {
          // Check if a notification has been sent to this user recently
          const lastSent = lastNotificationSent.get(user._id);
          if (lastSent && Date.now() - lastSent < 3600000) {
            // One hour interval
            console.log(
              "Notification already sent to user within the last hour. Skipping."
            );
            continue; // Skip sending notification
          }

          await pushNotification(user.deviceToken,notificationMessage,messageBody,imageurl);
          console.log(
            "Notification cron job executed successfully. TASK 2",
            user.name
          );

          // Update the last notification sent time for this user
          lastNotificationSent.set(user._id, Date.now());
        } catch (pushError) {
          console.error(
            "Error while sending push notification to user:",
            pushError
          );
          continue; // Continue to the next user even if one fails
        }
      }
      // Stop the cron job after execution
      taskEventNotification1.stop();
    } catch (error) {
      console.log("Error when running task2", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);

taskEventNotification1.start(); // Start the task2

// Define and schedule task2 separately
var taskPlatformNotification = cron.schedule("20 16 * * *",
  async () => {
    try {
      // 'contactNo.mobile_number': { $in: ['8115199076', '9135219071'] },
      const users = await userList({
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      
    const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`;
      for (const user of users) {
        try {
          // Task 2 logic
          const notificationMessage = "✨Kho gaye hum kahan…!!🎊✨";
          const messageBody = `✨Plan your journey with The Skytrails and get the best deals!✨`;
          await pushNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            imageurl
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
var taskEventNotification1 = cron.schedule("58 22 * * *",
  async () => {
    try {
      const users = await userList({
        'phone.mobile_number':'8115199076',
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" },
      });
      console.log("=======================", users.length);
      // const imageurl=`https://skytrails.s3.amazonaws.com/notification.jpg`;
      const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`;
      for (const user of users) {
        try {
          const notificationMessage = `Hello ${user.username}`;
          const messageBody = `✨Your Passes generate regarding PEFA2024,enjoy your night with PEFA stars✨`;
          // Check if a notification has been sent to this user recently
          const lastSent = lastNotificationSent.get(user._id);
          if (lastSent && Date.now() - lastSent < 3600000) {
            // One hour interval
            console.log(
              "Notification already sent to user within the last hour. Skipping."
            );
            continue; // Skip sending notification
          }

          await pushNotification(
            user.deviceToken,
            notificationMessage,
            messageBody,
            imageurl
          );
          console.log(
            "Notification cron job executed successfully. TASK 2",
            user.username
          );

          // Update the last notification sent time for this user
          lastNotificationSent.set(user._id, Date.now());
        } catch (pushError) {
          console.error(
            "Error while sending push notification to user:",
            pushError
          );
          continue; // Continue to the next user even if one fails
        }
      }
      // Stop the cron job after execution
      taskEventNotification1.stop();
    } catch (error) {
      console.log("Error when running task2", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Timezone setting
  }
);

taskEventNotification1.start(); // Start the task2
