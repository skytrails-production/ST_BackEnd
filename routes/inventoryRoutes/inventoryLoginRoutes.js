const Controller = require("../../controllers/inventoryController/inventoryController.js");
const becomePartnerController=require("../../controllers/inventoryController/authController.js");
const cityListController=require("../../controllers/inventoryController/cityListController.js")
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 50 * 1024 * 1024 } });
const { authJwt } = require("../../middleware");
const SchemaValidator = require("../../utilities/validations.utilities");
const schemas = require("../../utilities/schema.utilities");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  
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
  app.put("/skyTrails/api/inventory/uploadInventoryImage",upload.fields([{ name: 'hotelImages', maxCount: 50 },{ name: 'roomsImages', maxCount: 50 }]),[authJwt.verifyTokenOfInvenPartner], Controller.uploadImagesOfInventory);
  app.put("/skyTrails/api/inventory/uploadRoomImages",upload.array('roomsImages'),Controller.uploadImagesOfRoom);
  app.get("/skyTrails/api/inventory/getStateList/:countryName",cityListController.getStateList);
  app.get("/skyTrails/api/inventory/getCountryList",cityListController.getCountryList);
  app.get("/skyTrails/api/inventory/getCityList/:stateName",cityListController.getCityList);
  app.get("/skyTrails/api/inventory/getStateList1/:countryName",cityListController.getStateAggregateList);
};
