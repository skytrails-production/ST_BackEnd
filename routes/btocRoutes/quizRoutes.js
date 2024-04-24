// const {upload} = require('../../utilities/uploadHandler');
const quizController=require('../../controllers/btocController/quizController')

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
    app.get('/skyTrails/api/user/quiz/getDailyQuiz',quizController.getDailyQuiz);
    app.post('/skyTrails/api/user/quiz/submitQuizResponse',[authJwt.verifcationToken],quizController.submitDailyQuizResponse)
    // app.put('/skyTrails/api/user/event/sendPassesUpdate',eventBookingControler.sendUpdatePasses);
    // app.get('/skyTrails/api/user/event/getPromoBanner',eventPromoBannerControler.getPromotionalBanner);
}