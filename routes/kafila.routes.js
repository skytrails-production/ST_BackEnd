const controller = require("../controllers/kafila.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  
  //Token Generator
  app.get("/skyTrails/api/kafila/token", controller.kafilaTokenGenerator);

};


