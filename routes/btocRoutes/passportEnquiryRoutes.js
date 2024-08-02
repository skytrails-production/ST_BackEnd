const passportEnquiryControler=require('../../controllers/btocController/passportEnquiry');
// const eventPromoBannerControler=require('../../controllers/btocController/eventPromoBannerController');
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
    app.post('/skyTrails/api/user/passport/createEnquiry',[authJwt.verifcationToken],upload.array("images"), passportEnquiryControler.createEnquiry);
    app.get('/skyTrails/api/user/passport/getAllPassportEnquiry',passportEnquiryControler.getAllPassportEnquiry);
    // ,[authJwt.verifcationToken]
    app.get('/skyTrails/api/user/passport/getPassportEnquiry',passportEnquiryControler.getPassportEnquiry);
    app.put('/skyTrails/api/user/passport/updateStatus',passportEnquiryControler.updateResolveStatus);
    app.delete('/skyTrails/app/passport/deletePassportEnquiry',passportEnquiryControler.deletePassportEnquiry);
    app.post('/skyTrails/api/agent/passport/createPassportEnquiry',upload.array("images"),passportEnquiryControler.createPasportEnquiry);
    app.put('/skyTrails/api/agent/passport/updatePassportEnquiry',passportEnquiryControler.updatePassportEnquiry);
  }