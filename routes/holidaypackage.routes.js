const controller = require("../controllers/holidaypackage.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    app.post("/skyTrails/holidaypackage/additinerary", controller.createPackageAddItinerary)

}