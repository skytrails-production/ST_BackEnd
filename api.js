require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const app = express();
const configs = require("./common/common");
const PORT = process.env.PORT || 8000;
const db = require("./model");
const Role = db.role;

// const initializeRoutes = require("./routes");
app.use(cors());
const cron=require('./controllers/btocController/cronNotification');
const WebSocket = require("websocket").server;
const http = require("http");
var admin = require("firebase-admin");

// require('./mongdbbackup');

// const {initializeApp, applicationDefault } =require ('firebase-admin/app');
// const { getMessaging } = require( "firebase-admin/messaging");
// // const adCharu=admin.initializeApp({credential:admin.credential.cert(serviceAccount)});

// initializeApp({
//   credential: applicationDefault(),
//   projectId: 'potion-for-creators',
// });
const server = http.createServer(app);
const commonFunction = require("./utilities/commonFunctions");

// $env:GOOGLE_APPLICATION_CREDENTIALS="D:\Desktop\TheSkyTrails\ST_BackEnd\firebase_google.json"
// Create a WebSocket server and attach it to the HTTP server
const wsServer = new WebSocket({
  httpServer: server,
  autoAcceptConnections: false,
  maxReceivedFrameSize: 64 * 1024 * 1024, // 64MiB
  maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
  fragmentOutgoingMessages: false,
  keepalive: false,
  disableNagleAlgorithm: false,
});

// WebSocket server request event handling
wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      const data = message.utf8Data;
      // Handle WebSocket messages here
      connection.sendUTF("Message received: " + data); // Example: Send a response
    }
  });

  connection.on("close", (reasonCode, description) => {
    console.log(
      `Connection closed with code ${reasonCode} and reason: ${description}`
    );
    // Handle disconnection
  });
});

// server.listen(7000, () => {
//   console.log('WebSocket server running on port 7000');
// });

/**
 * imports for routes
 */

// Set limit for JSON and URL-encoded data
app.use(bodyparser.json({ limit: "50mb" })); // increase the limit to 50mb or any desired value
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyparser.text({ type: "text/xml" }));
// app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

var corsOptions = {
  origin: "*",
};

// middlware for cache bust
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});
// app.use(cors(corsOptions));
// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200
// };

app.use(cors(corsOptions));
app.use(helmet());

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hellooo Production DB Updated",
    url: `${req.protocol}://${req.get("host")}`,
  });
});
// Initialize routes
// initializeRoutes(app);

// routes
require("./routes/kafila.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/flight.routes")(app);
require("./routes/hotel.routes")(app);
require("./routes/bus.routes")(app);
require("./routes/b2bauth.routes")(app);
require("./routes/international.routes")(app);
require("./routes/wallet.routes")(app);
require("./routes/flightBookingData.routes")(app);
require("./routes/forex.routes")(app);
require("./routes/city.routes")(app);
require("./routes/sightSeeting.routes")(app);
require("./routes/universalTransfer.routes")(app);
require("./routes/visa.routes")(app);
require("./routes/utility.routes")(app);
require("./routes/visaRoutes/visaRoutes")(app);
require("./routes/staticContentRoutes")(app);
//bus booking data
require("./routes/busBookingData.routes")(app);
//hotel booking data
require("./routes/hotelBookingData.routes")(app);
// Require and use the faqRoutes module
// const faqRoutes = require('./routes/faqRoutes');
// app.use('/faqs', faqRoutes);
require("./routes/faqRoutes")(app);

//Amadeus Api

require("./routes/amadeus.routes")(app);
//ssdc
require("./routes/ssdc.routes")(app);

//skyTrails packages

require("./routes/holidaypackage.routes")(app)

//mihuru api

require("./routes/mihuru.routes")(app);

//grn connect api
require("./routes/grnconnect.routes")(app);

//hotel inventory api

require("./routes/inventoryRoutes/inventoryLoginRoutes")(app);

require("./routes/career.routes")(app);
require("./routes/chatbotRoutes")(app)
//Require forum Routes*************
const forumQueRoutes = require("./routes/forumRoutes/forumQueRoutes");
forumQueRoutes(app);
const forumQueAnsCommRoutes = require("./routes/forumRoutes/forumQueAnsComm");
forumQueAnsCommRoutes(app);

require("./routes/offerRoutes/offer.routes")(app);
require("./routes/visaEnquiry.routes")(app);
const userRoutes = require("./routes/userRoutes");
userRoutes(app);
//Set Up a WebSocket Client:  handling
//import btoc userRoutes*********************************************
const btocUserRoutes = require("./routes/btocRoutes/btocRoutes");
btocUserRoutes(app);
const subAdminRoutes = require("./routes/subAdminRoutes");
subAdminRoutes(app);
require("./routes/offlinequeryRoutes")(app);
require("./routes/razorpayRoutes")(app);
require("./routes/btocRoutes/transactionRoutes")(app);
require("./routes/eventRoutes")(app);
require("./routes/btocRoutes/eventBookingRoutes")(app);
require("./routes/visaRoutes/documentCategory")(app);
require("./routes/visaRoutes/documentType")(app);
require("./routes/visaRoutes/visaCategoryRoutes")(app);
require("./routes/visaRoutes/createRequireDocumentRoutes")(app);
require("./routes/createCouponRoutes")(app);
require("./routes/packageBannerRoutes")(app);
const quizRoute = require("./routes/btocRoutes/quizRoutes");
quizRoute(app);
require("./routes/ratingRoutes")(app);
require("./routes/relationshipManagerRoutes")(app);
require("./routes/blogRoutes")(app);
require("./routes/amadeusRoutes/amadeusFlightBookingRoutes")(app);
require("./routes/grnRoutes/grnRoutes")(app);
require("./routes/Itinerary/ItineraryRoutes")(app);
require("./routes/btocRoutes/passportEnquiryRoutes")(app);
require("./routes/notificationRoutes")(app);
require("./routes/Flightinventory/flightinventoryRoutes")(app);
require("./routes/combineRoutes")(app);
require("./routes/kafilaBookingRoutes")(app);
require("./routes/btocRoutes/promotionalEmail")(app)
require("./routes/reviewRoutes/packagereviewRoutes")(app)
require("./routes/forumRoutes/forumReportRoutes")(app)
require("./routes/visaRoutes")(app);

//crm agent routes

require("./routes/crmAgentFlightBooking.routes")(app);
require("./routes/crmAgentBusBooking.routes")(app);
require("./routes/crmAgentHotelBooking.routes")(app);
require("./routes/crmAgentPackageEnquiry.routes")(app);

mongoose.connect(configs.mongoUrl.DEVELOPMENT, {useNewUrlParser: true,useUnifiedTopology: true,})
  .then(() => {
    initial();
    console.log("DB Connected!!!");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
//================================> handle uncaughtException errors <=====================================//

process.on("uncaughtException", (err) => {
  console.log(`server rejected ${err.message}`);
  console.log("server shutdown due to uncaught Exception ");
  process.exit(1);
});

//================================> handle  Unhandled Promise Rejection errors <=====================================//

process.on("unhandledRejection", (err) => {
  console.log(`server rejected ${err.message}`);
  console.log("server shutdown due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});
