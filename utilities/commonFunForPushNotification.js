const axios = require("axios"); // Make sure to import axios if not already done.
const FCM = require("fcm-node");
const { initializeApp } = require("firebase-admin/app");
const app = initializeApp();
const fsmserverkey = process.env.FIREBASESERVERKEY;
// initializeApp();
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


// Initialize Firebase Admin SDK
// const serviceAccount = require("path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const pushNotificationIOS = async (deviceToken, title, body) => {
  try {
    const message = {
      token: deviceToken,
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    // console.log("Successfully sent push notification:", response);
    return response;
  } catch (error) {
    console.error("Error while trying to send a push notification:", error);
    throw error;
  }
};
// Import the FCM module

const pushNotification = async (deviceToken, title, body) => {
  try {
    const serverKey = fsmserverkey; // Replace with your actual server key
    const fcm = new FCM(serverKey);
    var message = {
      to: deviceToken,
      content_avilable: true,
      notification: {
        title: title,
        body: body,
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

const mediapushNotification = async (deviceToken, title, body) => {
  try {
    const serverKey = fsmserverkey; // Replace with your actual server key
    const fcm = new FCM(serverKey);
    const message = {
      to: deviceToken,
      content_avilable: true,
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          imageUrl: 'https://img.freepik.com/free-photo/adorable-illustration-kittens-playing-forest-generative-ai_260559-483.jpg?w=740&t=st=1707305553~exp=1707306153~hmac=74710f453b258d9ed94fb71d970751a717a75b57fef50bbbd3cb89d8775d0a2e' // Deprecated
        },
        image: 'https://img.freepik.com/free-photo/adorable-illustration-kittens-playing-forest-generative-ai_260559-483.jpg?w=740&t=st=1707305553~exp=1707306153~hmac=74710f453b258d9ed94fb71d970751a717a75b57fef50bbbd3cb89d8775d0a2e'
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1
          }
        },
        image: 'https://img.freepik.com/free-photo/adorable-illustration-kittens-playing-forest-generative-ai_260559-483.jpg?w=740&t=st=1707305553~exp=1707306153~hmac=74710f453b258d9ed94fb71d970751a717a75b57fef50bbbd3cb89d8775d0a2e'
      },
      webpush: {
        notification: {
          imageUrl: 'https://img.freepik.com/free-photo/adorable-illustration-kittens-playing-forest-generative-ai_260559-483.jpg?w=740&t=st=1707305553~exp=1707306153~hmac=74710f453b258d9ed94fb71d970751a717a75b57fef50bbbd3cb89d8775d0a2e' // Deprecated
        },
        image: 'https://img.freepik.com/free-photo/adorable-illustration-kittens-playing-forest-generative-ai_260559-483.jpg?w=740&t=st=1707305553~exp=1707306153~hmac=74710f453b258d9ed94fb71d970751a717a75b57fef50bbbd3cb89d8775d0a2e'
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

module.exports = { sendNotification, pushNotification,mediapushNotification,pushNotificationIOS };
