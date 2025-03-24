const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const openAIBot=require("../controllers/ChatBot/chatBotController");
const chatBotTrainController = require("../controllers/ChatBot/chatBotTrainController");
const chatHistoryController = require("../controllers/ChatBot/chathistory");
const { handleFileUpload } = require("../utilities/uploadHandler");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const allowedFormats = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg"];
// Middleware to validate audio format
const validateAudioFormat = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileType = req.file.mimetype;
  if (!allowedFormats.includes(fileType)) {
    return res.status(400).json({ error: "Invalid file format. Please upload an MP3, WAV, or OGG file." });
  }

  next();
};



module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
  //  app.get("/api/skyTrails/chat",openAIBot.initialiseBot1);
   app.post("/api/skyTrails/chatinitialiseBot",openAIBot.initialiseBot);
   app.post("/api/skyTrails/suggestedPrompt",chatBotTrainController.suggestPrompt);
   app.post("/api/skyTrails/chatBotPromptCreate",chatBotTrainController.crateChatBotPrompt);
   app.get("/api/skyTrails/listChatBotPrompt",chatBotTrainController.listChatBotPrompt);
   app.post("/api/skyTrails/chatbot/creatChatHistory",chatHistoryController.createChatHistory);
  //  app.post("/api/skyTrails/ask",openAIBot.ask);
  app.post("/api/skyTrails/uploadAudio",upload.single("audio"),openAIBot.transcribeAudioHandler);
  };
  