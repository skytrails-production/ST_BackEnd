const Controller = require("../../controllers/inventoryController/inventoryController.js");
const becomePartnerController=require("../../controllers/inventoryController/authController.js")
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authJwt } = require("../../middleware");
const SchemaValidator = require("../../utilities/validations.utilities");
const schemas = require("../../utilities/schema.utilities");
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
  app.post(
    "/skyTrails/api/inventory/createInventory",
    upload.fields([
      { name: 'hotelImages', maxCount: 5 },
      { name: 'roomsImages', maxCount: 10 }
    ]),[authJwt.verifyTokenOfInvenPartner], Controller.createhotelinventory);
  app.get("/skyTrails/api/inventory/getAllInventoryData",Controller.getAllHotelInventory);
  app.get("/skyTrails/api/inventory/getInventoryDataById",Controller.getHotelInventoryById);
  app.delete("/skyTrails/api/inventory/deleteInventoryData",Controller.deleteInventoryData);
  app.put("/skyTrails/api/inventory/changeHotelPrice",Controller.changeHotelPrice);
  app.put("/skyTrails/api/inventory/updatePartnerHotel",Controller.updatePartnerHotel);
  app.post("/skyTrails/api/inventory/becomePartner",becomePartnerController.signUp);
  app.post("/skyTrails/api/inventory/partnerLogin",becomePartnerController.login);
  app.put("/skyTrails/api/inventory/partnerForgetPassword",becomePartnerController.forgetPassword);
  app.put("/skyTrails/api/inventory/partnerresetPassword",[authJwt.verifyTokenOfInvenPartner],becomePartnerController.resetPassword);
  app.get("/skyTrails/api/inventory/partnergetPartnerList",becomePartnerController.getPartnerList);
  app.get("/skyTrails/api/inventory/partnergetPartnerById",becomePartnerController.getPartnerById);
  app.put("/skyTrails/api/inventory/deletPartnerData",[authJwt.verifyTokenOfInvenPartner],becomePartnerController.deleteAccount);
  app.put("/skyTrails/api/inventory/changePassword",[authJwt.verifyTokenOfInvenPartner],becomePartnerController.changePassword);
  app.get("/skyTrails/api/inventory/getAllHotelInventoryofPartner",[authJwt.verifyTokenOfInvenPartner],Controller.getAllHotelInventoryofPartner);
  app.put(
    "/skyTrails/api/inventory/uploadInventoryImage",
    upload.fields([
      { name: 'hotelImages', maxCount: 50 },
      { name: 'roomsImages', maxCount: 50 }
    ]),[authJwt.verifyTokenOfInvenPartner], Controller.uploadImagesOfInventory);
};
