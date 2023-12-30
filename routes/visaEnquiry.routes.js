const controller = require("../controllers/visaEnquiry.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/skyTrails/visa/createVisaEnquiry", controller.createVisaEnquiry);
  app.get("/skyTrails/visa/getAllVisaEnquiry", controller.getAllVisaEnquiry);

  //delete  by id
  app.delete("/skyTrails/deleteVisaEnquiry/:id", controller.deleteVisaEnquiry);
};
