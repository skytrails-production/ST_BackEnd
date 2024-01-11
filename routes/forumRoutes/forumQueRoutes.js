const controller = require('../../controllers/forumController/forumQueController');
// const postLikeControler=require('../../controllers/forumController/forumQueController')
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const { authJwt } = require("../../middleware");
const {handleFileUpload} = require('../../utilities/uploadHandler');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { uploadOffer } = require("../../middleware/uploadFileS3");




module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // [authJwt.verifcationToken],
    app.post('/skyTrails/forumPost/createPost',upload.single("images"), [authJwt.verifcationToken], controller.createPost);
    // app.post('/skyTrails/forumPost/uploadPost',handleFileUpload, [authJwt.verifcationToken], controller.createPost)
    app.post('/skyTrails/forumPost/addBookmark',controller.addBookmark)
    app.get('/skyTrails/forumPost/getPost', controller.getPost);
    app.put('/skyTrails/forumPost/updatePost', controller.updatePost);
    app.delete('/skyTrails/forumPost/deletePost', controller.deletePost);
    app.get('/skyTrails/forumPost/getTopStories',controller.getTopStories);
    app.get('/skyTrails/forumPost/getPostOfUser',[authJwt.verifcationToken],controller.getPostOfUser);
    app.get('/skyTrails/forumPost/getComments',controller.getComments);
    app.get('/skyTrails/forumPost/getPostByID',controller.getPostByID);
    app.post('/skyTrails/forumPost/postLikes',[authJwt.verifcationToken],controller.likePost)
}
