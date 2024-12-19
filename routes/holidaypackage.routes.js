const controller = require("../controllers/holidaypackage.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authJwt } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });


    //skyTrailspackages 

    //only for package initial filed
    app.post("/skyTrails/holidaypackage/create", upload.single("coverImage"),controller.createHolidayPackage);
    
    //for holiday pacakge images
    app.post("/skyTrails/holidaypackage/addimages",upload.array("files", { minCount: 1, maxCount: 5 }),controller.createPackageAddImages);

    //for add itinerary
    
    app.post("/skyTrails/holidaypackage/additinerary", controller.createPackageAddItinerary);

    app.post("/skytrails/holidaypackage/additinerary/images", upload.array("files", { minCount: 1, maxCount: 5 }), controller.createPackageAddItineraryImages);

    //packagecity list

    app.get("/skytrails/holidaypackage/packagecitylist", controller.getPackageCityAndCountryList);

    app.get("/skyTrails/holidaypackage/getallpackagebyuser/:userId", controller.getAllPackageByUser)



    //get all domestic and international packages route

    app.get("/skyTrails/holidaypackage/getdomesticorinternational/:packageType", controller.getDomesticorInternationPackages);
    

    //get all package countrywise or destinations wise

    app.get("/skyTrails/holidaypackage/getallpackages", controller.getAllPackageDestinationOrCountryWise);

    //add or remove userId in wishlist
    app.get("/skytrails/holidaypackage/wishlist/addorremove/:packageId", [authJwt.verifcationToken], controller.addOrRemoveUserIdWishlist);


    app.get("/skytrails/holidaypackage/singlepackage/:packageId", controller.getSingleHolidayPackage);


    

    //package set Active for Admin only

    app.post("/skytrails/holidaypackage/setactive", controller.holidayPackageSetActive);


    app.get("/skytrails/holidaypackage/filterbyamount", controller.holidayPackageFilterByAmount);

    app.get("/skytrails/holidaypackage/categoryfilter", controller.getHolidayPackageFilterByCategory);

    app.get("/skytrails/holidaypackage/latestpackages", controller.getLatestHolidayPackages);

    


}