const { authJwt } = require("../middleware");
const controller = require("../controllers/faqController");
const schemas = require('../utilities/schema.utilities');
const SchemaValidator = require("../utilities/validations.utilities");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post('/skyTrails/faqs/createfaqs',SchemaValidator(schemas.faqSchema), controller.createfaqs)
  app.get('/skyTrails/faqs/listfaqs', controller.listfaqs)
  app.put('/skyTrails/faqs/updatefaqs', controller.updatefaqs)
  app.delete('/skyTrails/faqs/deletefaqs', controller.deletefaqs);
};
