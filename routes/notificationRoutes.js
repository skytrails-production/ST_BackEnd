const { verifySignUp } = require("../middleware");
const notificationController = require("../controllers/notificationController");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
app.post("/skyTrails/api/user/notification/createnotification",notificationController.createNotificationContent);
app.get("/skyTrails/api/user/notification/getallnotification",notificationController.getAllNotifications);
// app.get("/skyTrails/api/user/rating/getAllRating",notificationController.getAllRating);

};
