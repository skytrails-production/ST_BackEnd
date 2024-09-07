const combineApiController= require("../controllers/combinedApiResponse");
const multer = require("multer");
// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });


  app.post("/skyTrails/api/combine/combineApiRes", combineApiController.combineTvoKafila);//get category
 
  
};