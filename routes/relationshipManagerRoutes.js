const { verifySignUp } = require("../middleware");
const relationshipManagerController = require("../controllers/relationshipManagerController");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
app.post("/skyTrails/api/relationShipManager/login",SchemaValidator(schemas.rmLoginSchema),relationshipManagerController.loginRM);
app.get("/skyTrails/api/relationShipManager/getAllRMOfAGENT",[authJwt.verificationTokenOfRM],relationshipManagerController.getAgentListOfRM);
app.get("/skyTrails/api/relationShipManager/getRelationShipManagerById",relationshipManagerController.getRelationShipManagerById);

};
