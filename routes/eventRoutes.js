const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
const controller = require("../controllers/eventController");
// const userController = require("../controllers/btocController/controller");
const { handleFileUpload } = require("../utilities/uploadHandler");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
    app.post(
      "/skyTrails/api/admin/events/createEvents",upload.single("images"),SchemaValidator(schemas.eventSchema),controller.createEvent
    );
    app.get(
        "/skyTrails/api/user/getEvents",
        controller.getAllEvents
      );
      app.get("/skyTrails/api/user/getEventById",controller.getEventById)
app.get('/skyTrails/api/events/getTopEvents',controller.getTopEvents);
app.post("/skyTrails/api/admin/events/createskyTrailsEvents",upload.single("images"),SchemaValidator(schemas.eventSchemaNew),controller.createskyTrailsEvent);
  };
  