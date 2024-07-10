const notificationController = require("../controllers/notificationController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
    
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
app.post("/skyTrails/api/user/notification/createnotification",upload.single('image'),notificationController.createNotificationContent);
app.get("/skyTrails/api/user/notification/getallnotification",notificationController.getAllNotifications);
// app.get("/skyTrails/api/user/rating/getAllRating",notificationController.getAllRating);

};
