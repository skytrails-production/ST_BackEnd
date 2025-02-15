const controller = require('../../controllers/forumController/forumReportControlelr');
const SchemaValidator = require('../../utilities/validations.utilities');
const { authJwt } = require("../../middleware");
const schemas = require("../../utilities/schema.utilities");



module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.post('/skyTrails/forumReport/createReport/:postId',[authJwt.verifcationToken], SchemaValidator(schemas.reportSchema), controller.reportPost);
    // app.post('/skyTrails/forumPost/uploadPost',handleFileUpload, [authJwt.verifcationToken], controller.createPost)
    // app.post('/skyTrails/forumReport/addBookmark',controller.addBookmark)
    app.get('/skyTrails/forumReport/getPostReport/:postId', controller.getReportedPosts);
}
