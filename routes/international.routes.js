const controller = require("../controllers/international.controller");
// const controller = require("../controller/international.controller");
const handleFileUpload = require('../utilities/fileUpload');

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post(
  //   "/skyTrails/international/create",
  //   upload.single("file"),
  //   controller.internationalCreate
  // );

  // multiImage 

  app.post(
    "/skyTrails/international/create",
    upload.array("files", { minCount: 1, maxCount: 5 }),
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
  app.get("/skyTrails/packages/getAllcrm",controller.crmPackage);
  app.get("/skyTrails/packagecitylist",controller.packageCityList);
  app.post(
    "/skyTrails/international/setactive",
    controller.internationalSetActive
  );

  //inactive pacakge
  app.get("/skyTrails/packages/inactive",controller.inactivePackages);
  
  app.post(
    "/skyTrails/international/pakageBookingrequest",
    controller.pakageBookingrequest
  );
  app.get(
    "/skyTrails/international/getALLpakageBookingrequest",
    controller.getALLpakageBookingrequest
  );
  app.post("/skyTrails/international/pakageBooking", controller.pakageBooking);


  //get latest packages

  app.get("/skyTrails/latestPackages",controller.latestPackages);
  app.get("/skyTrails/beachesPackages", controller.beachesPackages);
  app.get("/skyTrails/domesticAndInternationalPackages", controller.domesticAndInternational);
  app.get("/skyTrails/packages/domesticandinternational",controller.domesticAndInternationalWithPagination)
   app.get("/skyTrails/countryPackage",controller.countryPackage);

  app.put('/skyTrails/international/editPackage',upload.single("images"),controller.editPackage);


  //Agent Packages list active or inactive

  app.get('/skyTrails/agent/packages/:userId/:isActive',controller.agentPackages);
  app.get('/skyTrails/agent/packages/:userId',controller.agentAllPackage);
  app.get('/skyTrails/agent/leads/:userId',controller.agentLeads);
  app.get("/skyTrails/international/getAllAdminPackage", controller.internationalgetAdminAll);



  //package city Data
  app.post("/skyTrails/package/packageCityData",upload.single("file"), controller.packageCityData);
  app.get("/skyTrails/package/getPackageCityData",controller.getPackageCityData);

  //get filter packages based on the amount

  app.get("/skyTrails/package/packagefilterAmount", controller.packageFilterAmount);
  app.get("/skyTrails/api/packages/categoriesPackages", controller.beachesPackagesCategory);
  app.get("/skyTrails/api/packages/packagesCategory", controller.beachesPackagesCategoryArr);
  app.get("/skyTrails/api/package/searchPackageByCategory", controller.getPackageByCategory);
  app.get("/skyTrails/api/package/getPackageByLocation",controller.getPackageByLocation);
  app.get("/skyTrails/api/packages/packagesCategory1", controller.beachesPackagesCategoryArr1);

  app.post("/skyTrails/api/packagesenquiry",controller.packagesEnquiry);
  // app.put("/skyTrails/api/admin/package/approveMultiplePackages",controller.approveMultiplePackages);


  app.get("/skyTrails/api/packages/locationwise", controller.getLocationWisePackages);

  app.post("/skyTrails/api/packages/createspecialcity",upload.single("file"), controller.createPackageSpecialCity);

  app.get("/skyTrails/api/packages/specialcity", controller.getPackageSpecialCity);

  app.get("/skyTrails/api/packages/specialcity/:id", controller.getPackageSpecialCityById);

  app.put("/skyTrails/api/packages/specialcity/:id", controller.updatePackageSpecialCityById);

  app.delete("/skyTrails/api/packages/specialcity/:id", controller.deletePackageSpecialCity);
};
