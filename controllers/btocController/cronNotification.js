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
  

// Define your cron job schedule. This example runs the job every day at 9:00 AM.
cron.schedule('* * */23 * * *', async () => {
  try {
    // Fetch all users from the database
    const users = await eventBookingList({'contactNo.mobile_number':'8115199076',status:status.ACTIVE});
    // Iterate through each user and send a notification
    for (const user of users) {
      // Customize your notification message based on your requirements
      const notificationMessage = `Hi ${user.name}, this is your daily notification!`;
      const messageBody=`Dear ${user.name} 😎,
      We're delighted to confirm your booking for the upcoming PEFA 2024—get ready for an unforgettable experience! 🎉
      Event Details:
      📅 Date:2 Mar 2024 5pm
      🕒 Time: 5 PM sharp
      📍 Venue: CGC Mohali
      But wait, there's more! 😍🌟 You're one of our lucky users.! ✨😍Thank you for choosing us. We can't wait to elevate your event experience!
      Best Regards
      TheSkyTrails pvt ltd`
      const msg="Dear ${user.name} 😎,https://raw.githubusercontent.com/The-SkyTrails/Images/main/mailingImages/whyus.jpeg"
    //   const messageBody = {
    //     android: {
    //       notification: {
    //         imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fhand-drawn-message-bell-sticker-notification-doodle-style-social-media-element-new-message-symbol-isolated-white-image222050959&psig=AOvVaw1kN9hVkkChqJT9HmNFc4Vc&ust=1707388089715000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKjOibWCmYQDFQAAAAAdAAAAABAE'
    //       }
    //     },
    //     apns: {
    //       payload: {
    //         aps: {
    //           'mutable-content': 1
    //         }
    //       },
    //       fcm_options: {
    //         image: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/693d4621034171.562fa9bb0e181.gif'
    //       }
    //     },
    //     webpush: {
    //       headers: {
    //         image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgiphy.com%2Fexplore%2Fwindows-notification%3Fsort%3Drelevant&psig=AOvVaw2S_dv4p8qQQcY4beJPfg5g&ust=1707388134403000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOjmqsqCmYQDFQAAAAAdAAAAABAE'
    //       }
    //     },
    //   };
      // Send the notification to the user
      await mediapushNotification(user.deviceToken, notificationMessage,msg);
    }

    console.log('Notification cron job executed successfully.');
  } catch (error) {
    console.error('Error occurred during notification cron job:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata' // Adjust timezone as per your requirement
});
