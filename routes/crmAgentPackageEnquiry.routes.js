const controller = require('../controllers/crmAgentPackageEnquiry.controller');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.post('/skytrails/crmagent/packageenquiry/create', controller.createCrmAgentPackageEnquiry);

    app.get('/skytrails/crmagent/packageenquiry/single/:id', controller.getAgentSinglePackageEnquiry);


    app.get('/skytrails/crmagent/packageenquirys', controller.getAgentPackageEnquiryDataWithPagination);


}