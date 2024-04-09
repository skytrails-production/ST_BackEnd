const controller=require('../controllers/packageBannerControlelr');
// const popularDestinationControlelr=require('../controllers/')
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
   app.get("/skyTrails/api/user/getPackageBanner",controller.getPackageBanner);
   app.get("/skyTrails/api/user/getPopularDestination",controller.getPopularDestination);

  };
  