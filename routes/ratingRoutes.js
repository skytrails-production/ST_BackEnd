const { verifySignUp } = require("../middleware");
const ratingController = require("../controllers/ratingController");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
app.post("/skyTrails/api/user/rating/rateOurApp",[authJwt.verifcationToken],SchemaValidator(schemas.ratingSchema),ratingController.rateOurApp);
app.get("/skyTrails/api/user/rating/getRating",[authJwt.verifcationToken],ratingController.getRating);
app.get("/skyTrails/api/user/rating/getAllRating",ratingController.getAllRating);

};
