const dayWiseController=require('../../controllers/Itinerary/createDayWiseItinerary');
const ourProposalController=require('../../controllers/Itinerary/ItineraryController');
const itineraryMarkupController=require('../../controllers/Itinerary/itinearyMarkup')
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
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/itinerary/proposal/createProposal',ourProposalController.ourProposal);
    app.get('/skyTrails/api/itinerary/getProposalById',ourProposalController.getProposalById);
    app.get('/skyTrails/api/itinerary/getAllProposal',ourProposalController.getAllProposal);
    app.get('/skyTrails/api/itinerary/dayWise/getAllCItyWiseItinerary',dayWiseController.getDayWiseActivity);
    app.post('/skyTrails/api/itinerary/dayWise/createDayWise',dayWiseController.createDayWiseActivity);
    app.post('/skyTrails/api/itinerary/craeteMarkup',itineraryMarkupController.createItinearyMarkup)
    app.get('/skyTrails/api/itinerary/getOneMarkupOfPackg',itineraryMarkupController.finOneItinearyMarkup);
    app.get('/skyTrails/api/itinerary/getAllMarkupList',itineraryMarkupController.findAllItinearyMarkup);
    app.delete('/skyTrails/api/itinerary/deleteItineraryMarkup',itineraryMarkupController.deleteItinearyMarkup)
    
}
