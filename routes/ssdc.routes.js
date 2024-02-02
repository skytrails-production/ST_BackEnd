const controller = require("../controllers/ssdc.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.post("/skyTrails/ssdc/registration",controller.ssdcRegistration);
    app.get("/skyTrails/ssdc/leads", controller.ssdcLeads)

    //ssdc jons

    app.post("/skyTrails/ssdc/ssdcJobs", controller.ssdcJobs);
}