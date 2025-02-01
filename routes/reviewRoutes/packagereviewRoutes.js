const reviewController=require("../../controllers/review/packageReview")
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/admin/review/createPackageReview',upload.array("images"),reviewController.createPackageReview);
    app.get('/skyTrails/api/admin/review/getPackageReview',reviewController.getPackageReview);
    app.get('/skyTrails/api/user/review/getPackageReview/:packageId',reviewController.getPackageReviewById)
    
}