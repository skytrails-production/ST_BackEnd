const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
const openAIBot=require("../controllers/ChatBot/chatBotController")
// const userController = require("../controllers/btocController/controller");
const { handleFileUpload } = require("../utilities/uploadHandler");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
   app.get("/chat",openAIBot.initialiseBot);
   app.get("/chatinitialiseBot2",openAIBot.initialiseBot2);
  };
  