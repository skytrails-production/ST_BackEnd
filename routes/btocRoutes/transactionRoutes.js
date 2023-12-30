const userTransactionsController=require('../../controllers/btocController/userTransactionController');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const upload=require('../../utilities/uploadHandler')
const { authJwt } = require("../../middleware");
const { Schemas } = require('aws-sdk');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/user/makePhonePayPayment',[authJwt.verifcationToken], userTransactionsController.makePhonePayPayment);
    app.post('/skyTrails/api/user/makePhonePayPayment1', userTransactionsController.makePhonePayPayment1);
    app.post('/skyTrails/api/transaction/easebussPayment',[authJwt.verifcationToken],SchemaValidator(schemas.transactionSchema),userTransactionsController.easebussPayment)
    app.post('/skyTrails/api/transaction/paymentSuccess',userTransactionsController.paymentSuccess);
    app.post('/skyTrails/api/transaction/paymentFailure',userTransactionsController.paymentFailure);
    app.get('/skyTrails/api/transaction/paymentSuccessPhonePe',userTransactionsController.paymentSuccessPhonePe);
    app.get('/skyTrails/api/transaction/paymentFailurePhonePe',userTransactionsController.paymentFailurePhonePe);
    app.get('/skyTrails/api/transaction/checkPaymentStatus',userTransactionsController.checkPaymentStatus)
    
}