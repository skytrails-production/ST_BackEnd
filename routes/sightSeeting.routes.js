const controller = require("../controllers/sightsetting.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
 
  app.post("/skyTrails/sightSetting/sightSettingSearch", controller.sightSettingSearch);
  app.post("/skyTrails/sightSetting/sightSettingGetavailability", controller.sightSettingGetavailability);
  app.post("/skyTrails/sightSetting/sightSettingBlock", controller.sightSettingBlock);
  app.post("/skyTrails/sightSetting/sightSettingBook", controller.sightSettingBook);
  app.post("/skyTrails/sightSetting/sightSettingBookingDetail", controller.sightSettingBookingDetail);
  app.post("/skyTrails/sightSetting/sightSettingBookingChangeRequest", controller.sightSettingBookingChangeRequest);
  
};
