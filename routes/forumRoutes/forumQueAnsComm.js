const controller = require('../../controllers/forumController/forumQueAnsComm');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const { authJwt } = require("../../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
  
    app.post('/skyTrails/forumPost/createComment', SchemaValidator(schemas.forumQueAnsComm), controller.createComment);
    app.get('/skyTrails/forumPost/getPostComment', controller.getPostComment);
    app.put('/skyTrails/forumPost/updatePostComment', controller.updatePostComment);
    app.delete('/skyTrails/forumPost/deletePostComment', controller.deletePostComment);
    app.get('/skyTrails/forumPost/getPostCommentsOfUser',[authJwt.verifcationToken],controller.getPostCommentsOfUser);
    app.post('/skyTrails/forumPost/likeComments',controller.likeComments);
}
