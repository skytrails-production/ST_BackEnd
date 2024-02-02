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

const pushNotification = async (deviceToken, title, body, data1) => {
    try {
        var serverKey = 'BOPPSLM-ymczT_49aZG98nhLCUu7GBWpNpDT0RZr01NNYbWsGNKw1GMeSYhkDvW4xFH-1rweEqaJdn7KGKNlrtI'; // Replace with your FCM server key
        var fcm = new FCM(serverKey);

        var message = {
            to: deviceToken,
            "content_avilable": true,
            notification: {
                title: title,
                body: body
            },
            data: data1
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