// const {upload} = require('../../utilities/uploadHandler');
const promotionalEmailController=require('../../controllers/btocController/promotionalEmailController')
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
// const upload=require('../../utilities/uploadHandler')
const { authJwt } = require("../../middleware");
const { Schemas } = require('aws-sdk');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    app.post('/skyTrails/api/user/promotionalEmails/createEntry',promotionalEmailController.createPromotionalEmail);
    app.get('/skyTrails/api/user/promotionalEmails/getAllPromotionalEmail',promotionalEmailController.getAllPromotionalEmail);
    // app.get('/skyTrails/api/user/quiz/getAllQuiz',quizController.getAllQuizQustion);
    // app.get('/skyTrails/api/user/quiz/getQuizWinnerToday',quizController.getWinnerOfQuiz);
    app.post('/skyTrails/api/user/callBackRequests/createCallBackRequest',promotionalEmailController.createCallBackRequest);
    app.get('/skyTrails/api/user/callBackRequests/getAllCallBackRequests',promotionalEmailController.getAllCallBackRequest);
}