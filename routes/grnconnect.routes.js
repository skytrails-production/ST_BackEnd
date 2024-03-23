const controller = require("../controllers/grnconnect.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
    
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });



    app.get("/skyTrails/grnconnect/getcityList", controller.getCityListData);
    app.get('/skyTrails/updateCities', controller.updateCityListWithCountryNames);

    app.post("/skyTrails/grnconnect/hotelSearch",controller.hotelSearch);
    app.get("/skyTrails/grnconnect/refetchHotel", controller.refetchHotel);
    app.post("/skyTrails/grnconnect/rateRefetchHotel", controller.rateRefetchHotel);
    
}
