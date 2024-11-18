const { authJwt } = require("../middleware");
const controller = require("../controllers/staticContentController");
const flightStaticPayloadControler=require("../controllers/flightStaticPayloadController")
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 50 * 1024 * 1024 } });
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post('/skyTrails/staticContent/createStaticContent', SchemaValidator(schemas.staticContentSchema), controller.createStaticContent)
  app.get('/skyTrails/staticContent/listStaticContent', controller.listStaticContent);
  app.put('/skyTrails/staticContent/updatestaticContent', controller.updateStaticContent);
  app.delete('/skyTrails/staticContent/deletestaticContent', controller.deleteStaticContent);
  app.post('/skyTrails/staticContent/flightPayload/createStaticFlightPayload',upload.single("images"), flightStaticPayloadControler.createStaticFlightPayload)
  app.get('/skyTrails/staticContent/flightPayload/listStaticFlightPayload', flightStaticPayloadControler.getListOfStaticFlightPayload)
};
