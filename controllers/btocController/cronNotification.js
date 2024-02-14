const cron = require('node-cron');
const status=require('../../enums/status')
const { pushNotification,mediapushNotification } = require('../../utilities/commonFunForPushNotification'); // Assuming you have a controller to send notifications
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
// cron.schedule('*/23 * * *', async () => {
//   try {
//     // 'contactNo.mobile_number':'8115199076',
//     // 'contactNo.mobile_number':'9354416602',
//     // Fetch all users from the database
//   const users = await eventBookingList({status:status.ACTIVE,deviceToken: { $exists: true, $ne: "" } });
//     // Iterate through each user and send a notification
//     for (const user of users) {
//       // Customize your notification message based on your requirements
//       const notificationMessage1 = `Hi ${user.name}, this is your daily notification!`;
//       const messageBody1=`Dear ${user.name} 😎,
//       We're delighted to confirm your booking for the upcoming PEFA 2024—get ready for an unforgettable experience! 🎉
//       Event Details:
//       📅 Date:2 Mar 2024 5pm
//       🕒 Time: 5 PM sharp
//       📍 Venue: CGC Mohali
//       But wait, there's more! 😍🌟 You're one of our lucky users.! ✨😍Thank you for choosing us. We can't wait to elevate your event experience!
//       Best Regards
//       TheSkyTrails pvt ltd`
//       const msg="Dear ${user.name} 😎,https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/whyus.jpeg"

//       const notificationMessage = `🎉 Excited for PEFA 2024, ${user.name} 😎?`;
//             const messageBody=`
//             📅 Time: 5 PM 😅 Date: Mar. 2, 2024
//             📍 Location: CGC Mohali
//             📱 Check to make sure you get the most out of TheSkyTrails app! Special deals are on the way. Don't pass this up! ✨
//             See you there!
//             TheSkyTrails Team`
//      const response= await mediapushNotification(user.deviceToken, notificationMessage,messageBody);
//      console.log("response===============",response,user.name);
//     }

//     console.log('Notification cron job executed successfully.');
//   } catch (error) {
//     console.error('Error occurred during notification cron job:', error);
//   }
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata' // Adjust timezone as per your requirement
// });

 // Iterate through each user
//  for (const user of users) {
//   // Send offer notification
//   const offerNotification = "🎉 New offer alert! Check out our latest deals!";
//   await sendNotification(user.deviceToken, offerNotification);

//   // Send general promotion notification
//   const generalNotification = "🚀एक सफ़र पे यूँ ही कभी चल दो तुम,✈️";
//   await sendNotification(user.deviceToken, generalNotification);

//   // Send specific promotion notification
//   const specificNotification = "✨Check out our latest promotion! We're offering deals so good, even your coffee will do a double-take! ☕️✨";
//   await sendNotification(user.deviceToken, specificNotification);
// }


var task =cron.schedule('0 * * * *', async () => {
  try {
    // Fetch all users from the database
    const users = await eventBookingList({
      'contactNo.mobile_number': { $in: ['8115199076', '9354416602','9810704352'] },
      status: status.ACTIVE,
      deviceToken: { $exists: true, $ne: "" }
    });
    // const usereTokenExist=await userList({'contactNo.mobile_number': { $in: ['8115199076', '9354416602','9810704352'] },status: status.ACTIVE,deviceToken: { $exists: true, $ne: ""}});
    const current_Date=new Date();
     // Iterate through each user and send a notification
       // Merge the two arrays
    // const allUsers = [...users, ...usereTokenExist];
    for (const user of users) {
      if(user.createdAt.getTime()>=current_Date.getTime()){
          const notifications= `🎉Excited for PEFA 2024,${user.name}😎?`;
          const messageBody1=`📅 Time: 5 PM 😅 Date: Mar. 2, 2024
            📍 Location: CGC Mohali,Punjab
            📱Check to make sure you get the most out of TheSkyTrails app! Special deals are on the way. Don't pass this up! ✨
            See you there!
            TheSkyTrails Team`
            await pushNotification(user.deviceToken, notifications,messageBody1);
            // console.log('Notification cron job executed successfully.messageBody1');
      }
      var task2=cron.schedule('0 8 * * *', async () => {
        try {
           const notificationMessage = "🚀एक सफ़र पे यूँ ही कभी चल दो तुम,✈️";
           const messageBody=`✨Check out our latest promotion! We're offering deals so good, even your coffee will do a double-take! ☕️✨`
           await mediapushNotification(user.deviceToken, notificationMessage,messageBody);
          //  console.log('Notification cron job executed successfully.TASK 2');
     // Stop the cron job after execution
            task2.stop();
        //  console.log('Notification cron job stopped.');
        } catch (error) {
          console.log("error when run second task",error);
        }
      });
      task2.start();
   
    }
    // console.log('Notification cron job executed successfully.');
     // Stop the cron job after execution
     task.stop();
    //  console.log('Notification cron job stopped.');
  } catch (error) {
    console.error('Error occurred during notification cron job:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata' // Adjust timezone as per your requirement
});
task.start();
//   try {
//     // 'contactNo.mobile_number':'8115199076',
//     // Fetch all users from the database
//     const users = await eventBookingList({status:status.ACTIVE});
//     // Iterate through each user and send a notification
//     for (const user of users) {
//       // Customize your notification message based on your requirements
//       const notificationMessage = `🎉 Excited for PEFA 2024, ${user.name} 😎?`;
//       const messageBody=`
//       📅 Time: 5 PM 😅 Date: Mar. 2, 2024
//       📍 Location: CGC Mohali
//       📱 Check to make sure you get the most out of TheSkyTrails app! Special deals are on the way. Don't pass this up! ✨
//       See you there!
//       TheSkyTrails Team`
//     //   const messageBody = {
//     //     android: {
//     //       notification: {
//     //         imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fhand-drawn-message-bell-sticker-notification-doodle-style-social-media-element-new-message-symbol-isolated-white-image222050959&psig=AOvVaw1kN9hVkkChqJT9HmNFc4Vc&ust=1707388089715000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKjOibWCmYQDFQAAAAAdAAAAABAE'
//     //       }
//     //     },
//     //     apns: {
//     //       payload: {
//     //         aps: {
//     //           'mutable-content': 1
//     //         }
//     //       },
//     //       fcm_options: {
//     //         image: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/693d4621034171.562fa9bb0e181.gif'
//     //       }
//     //     },
//     //     webpush: {
//     //       headers: {
//     //         image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgiphy.com%2Fexplore%2Fwindows-notification%3Fsort%3Drelevant&psig=AOvVaw2S_dv4p8qQQcY4beJPfg5g&ust=1707388134403000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOjmqsqCmYQDFQAAAAAdAAAAABAE'
//     //       }
//     //     },
//     //   };
//       // Send the notification to the user
//       await pushNotification(user.deviceToken, notificationMessage,messageBody);
//     }

//     console.log('Notification cron job executed successfully.');
//   } catch (error) {
//     console.error('Error occurred during notification cron job:', error);
//   }
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata' // Adjust timezone as per your requirement
// });