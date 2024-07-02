const Controller = require("../../controllers/inventoryController/inventoryController.js");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/skytrails/login/inventory/api", Controller.loginUser);
  app.post("/skytrails/register/inventory/api", Controller.registerUser);

  // app.post(
  //   "/skytrails/hotelform/inventory/api",
  //   upload.array("hotelImages", 1), // Adjust field name and file limit as needed
  //   Controller.createHotelForm
  // );
  app.post(
    "/skytrails/hotelform/inventory/api",
    upload.fields([
      { name: "hotelImages", maxCount: 10 },
      { name: "roomsImages", maxCount: 10 },
    ]),
    Controller.createHotelForm
  );
  // app.post('/skyTrails/api/inventory/createInventory',upload.fields([{name: "hotelImages"},{name: "roomsImages"}]),Controller.createhotelinventory)
  app.post('/skyTrails/api/inventory/createInventory',
    upload.fields([
      { name: 'hotelImages', maxCount: 5 },
      { name: 'roomsImages', maxCount: 10 }
    ]), Controller.createhotelinventory);
  app.get("/skyTrails/api/inventory/getAllInventoryData",Controller.getAllHotelInventory);
  app.get("/skyTrails/api/inventory/getInventoryDataById",Controller.getHotelInventoryById);
};
