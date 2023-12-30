const controller = require("../controllers/international.controller");
// const controller = require("../controller/international.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post(
    "/skyTrails/international/create",
    upload.single("file"),
    controller.internationalCreate
  );
  app.get("/skyTrails/international/getone/:id", controller.internationalFind);
  app.put(
    "/skyTrails/international/update/:id",
    upload.single("file"),
    controller.internationalupdate
  );
  app.delete(
    "/skyTrails/international/deleteone/:id",
    controller.internationalDelete
  );
  app.get("/skyTrails/international/getAll", controller.internationalgetAll);
  app.post(
    "/skyTrails/international/setactive",
    controller.internationalSetActive
  );
  app.post(
    "/skyTrails/international/pakageBookingrequest",
    controller.pakageBookingrequest
  );
  app.get(
    "/skyTrails/international/getALLpakageBookingrequest",
    controller.getALLpakageBookingrequest
  );
  app.post("/skyTrails/international/pakageBooking", controller.pakageBooking);
};
