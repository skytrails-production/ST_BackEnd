const controller = require("../../controllers/offerController/offer.controller");
const auth = require("../../middleware/authJwt");
const { uploadOffer } = require("../../middleware/uploadFileS3");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/skyTrails/offers/add", uploadOffer.array("media", 1),controller.createOffer);


  // app.get("/skyTrails/offers/getAllOffer", controller.getOffer);
  app.put(
    "/skyTrails/offers/updateOffer",
    controller.updateOffer
  );
  app.delete(
    "/skyTrails/offers/deleteOffer",
    controller.deleteOffer
  );

  app.get("/skyTrails/offers/getAllOffer", controller.getOffer);
  app.put("/skyTrails/offers/updateOffer", controller.updateOffer);
  app.delete("/skyTrails/offers/deleteOffer", controller.deleteOffer);
};
