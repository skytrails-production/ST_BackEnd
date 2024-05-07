const controller = require("../controllers/mihuru.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
    
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.get("/skyTrails/mihuru/partnerauthentication",controller.partnerAuthentication);
    app.post("/skyTrails/mihuru/signup",controller.signUp);
    app.post("/skyTrails/mihuru/submitotp",controller.submitOtp);
    app.post("/skyTrails/mihuru/travelplangenerator", controller.travelPlanGenerator);
    
}
