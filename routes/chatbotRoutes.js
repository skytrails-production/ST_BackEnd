const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const openAIBot=require("../controllers/ChatBot/chatBotController");
const chatBotTrainController = require("../controllers/ChatBot/chatBotTrainControlelr");
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
   app.post("/api/skyTrails/suggestedPrompt",chatBotTrainController.suggestPrompt);
   app.post("/api/skyTrails/chatBotPromptCreate",chatBotTrainController.crateChatBotPrompt);
   app.get("/api/skyTrails/listChatBotPrompt",chatBotTrainController.listChatBotPrompt);
  };
  