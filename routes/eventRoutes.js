const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
const controller = require("../controllers/eventController");
// const userController = require("../controllers/btocController/controller");
const { handleFileUpload } = require("../utilities/uploadHandler");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
    app.post(
      "/skyTrails/api/admin/events/createEvents",handleFileUpload,SchemaValidator(schemas.eventSchema),controller.createEvent
    );
    app.get(
        "/skyTrails/api/user/getEvents",
        controller.getAllEvents
      );
      app.get("/skyTrails/api/user/getEventById",controller.getEventById)

  };
  