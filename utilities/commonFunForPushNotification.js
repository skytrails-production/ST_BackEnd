const axios = require("axios"); // Make sure to import axios if not already done.
const FCM = require('fcm-node'); 
const { initializeApp } = require('firebase-admin/app');
const app = initializeApp();
const sendNotification = async (notifDetails) => {
  try {
    const formData = {
      notification: {
        title: notifDetails.title,
        body: notifDetails.description,
      },
      data: {
        sound: "default",
        status: "done",
      },
      registration_ids: tocken,
    };

    const headers = {
      Authorization: "key=" + process.env.Firebase_Server_key,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      formData,
      { headers }
    );

    if (response.status === 200) {
      console.log("Notification sent successfully:", response.data);
      return 1;
    } else {
      console.log(
        "Failed to send notification. Response status:",
        response.status
      );
      return 0;
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    return 0;
  }
};

// Import the FCM module

const pushNotification = async (deviceToken, title, body) => {
    try {
      const serverKey = 'AAAACwqCjLY:APA91bF6qvz3u7mDWYqy3up1wOSCzyw7JjcTwy4zDybyYO4bzeExKxv_aYmCmMB_Co_BFDlDoBB4Fs1W4A4XLKw351l9VL6aoFwd8yPbJcAWhu_daIZkdKlBzLCoSWrV_6r1WE8iABJM'; // Replace with your actual server key
      const fcm = new FCM(serverKey);

        var message = {
            to: deviceToken,
            "content_avilable": true,
            notification: {
                title: title,
                body: body
            },
        };

        const response = await new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    console.log("Error while push notification:", err);
                    reject(err);
                } else {
                    console.log("Success while push notification:", response);
                    resolve(response);
                }
            });
        });

        return response;
    } catch (error) {
        console.error("Error while trying to send a push notification", error);
        throw error;
    }
};


module.exports = { sendNotification ,pushNotification};