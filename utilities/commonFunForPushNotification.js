const axios = require("axios"); // Make sure to import axios if not already done.
const FCM = require("fcm-node");
// const { initializeApp } = require("firebase-admin/app");
// const app = initializeApp();
const admin = require('../config/googleServices'); // Update with the correct path


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
      return 1;
    } else {
      
      return 0;
    }
  } catch (error) {
    return 0;
  }
};

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
    return response;
  } catch (error) {
    throw error;
  }
};
// Import the FCM module

const pushNotification = async (deviceToken, title, body,imageUrl) => {

    const serverKey = fsmserverkey; // Replace with your actual server key
    const fcm = new FCM(serverKey);
    var message = {
      to: deviceToken,
      // content_avilable: true,
      notification: {
        title: title,
        body: body,
        imageUrl: imageUrl, // Include the image URL in the notification payload
        image: imageUrl,
      },
      data: {
        imageUrl: imageUrl, // Include the image URL in the data payload
      },
      android: {
        notification: {
          style: 'bigPicture', // Use Big Picture Style
          bigPicture: imageUrl, // Specify the Big Picture URL
        },
      }
    };
    const response = await new Promise((resolve, reject) => {
      fcm.send(message, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    return response;
  
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
            alert: {
              title: title,
              body: body,
            },
          },
        },
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
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    return response;
  } catch (error) {
    throw error;
  }
};


const pushSimpleNotification = async (deviceToken, title, body) => {

  const serverKey = fsmserverkey; // Replace with your actual server key
  const fcm = new FCM(serverKey);
  var message = {
    token: deviceToken,
    content_avilable: true,
    notification: {
      title: title,
      body: body,
    },
  };
  const response = await new Promise((resolve, reject) => {
    fcm.send(message, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });

  return response;

};

const pushNotification1 = async (deviceToken, title, body, imageUrl) => {
  const serverKey = fsmserverkey; // Replace with your actual server key
  const fcm = new FCM(serverKey);
  var message = {
      to: deviceToken,
      notification: {
          title: title,
          body: body,
          imageUrl: imageUrl, // Include the image URL in the notification payload
          image: imageUrl,
      },
      data: {
        imageUrl: imageUrl, // Include the image URL in the data payload
      },
      android: {
          priority: 'high',
          notification: {
            style: 'bigPicture', // Use Big Picture Style
            bigPicture: imageUrl, // Specify the Big Picture URL
          },
      }
  };

  const response = await new Promise((resolve, reject) => {
      fcm.send(message, (err, response) => {
          if (err) {
              reject(err);
          } else {
              resolve(response);
          }
      });
  });

  return response;

};

const customSoundPushNotification = async (deviceToken, title, body, imageUrl, sound) => {
  const serverKey = fsmserverkey; // Replace with your actual server key
  const fcm = new FCM(serverKey);

  var message = {
      to: deviceToken,
      notification: {
          title: title,
          body: body,
          imageUrl: imageUrl, // Include the image URL in the notification payload
          image: imageUrl,
          sound: sound, // Custom sound
      },
      data: {
          imageUrl: imageUrl, // Include the image URL in the data payload
      },
      android: {
          notification: {
              style: 'bigPicture', // Use Big Picture Style
              bigPicture: imageUrl, // Specify the Big Picture URL
              sound: sound, // Custom sound for Android
          },
      },
      apns: {
          payload: {
              aps: {
                  sound: sound // Custom sound for iOS
              }
          }
      }
  };

  const response = await new Promise((resolve, reject) => {
      fcm.send(message, (err, response) => {
          if (err) {
              reject(err);
          } else {
              resolve(response);
          }
      });
  });

  return response;
};

const pushNotificationAfterDepricate=async(deviceToken,title,body)=>{
    var message = {
      token: deviceToken,
      notification: {
          title: title,
          body: body,
          // sound: sound, // Custom sound
        // imageUrl: imageurl
      },
      // data: {
      //   imageUrl: imageurl, // Include the image URL in the data payload
      // },
  };
  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
   return error.message;
  }

};

const pushNotAfterDepricateImage=async(deviceToken,title,body,imageurl)=>{
  var message = {
    token: deviceToken,
    notification: {
        title: title,
        body: body,
        // sound: sound, // Custom sound
      imageUrl: imageurl
    },
    data: {
      imageUrl: imageurl, // Include the image URL in the data payload
      deepLink: 'https://theskytrails.com/app/OneWayFlight/test2',
      navigationId:'OneWayFlight'
    },
};
try {
  const response = await admin.messaging().send(message);
  return response;
} catch (error) {
 return error.message;
}

}
module.exports = { sendNotification, pushNotAfterDepricateImage,pushNotification,mediapushNotification,pushNotificationIOS,pushSimpleNotification,pushNotification1 ,customSoundPushNotification,pushNotificationAfterDepricate};
