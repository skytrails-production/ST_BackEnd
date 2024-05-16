const controller = require("../controllers/blogController");
const multer = require("multer");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/skyTrails/api/blog/createBlog",upload.array("images"),controller.createBlog);
  app.get("/skyTrails/api/blog/getAllBlogs",controller.getBlogList);
  app.get("/skyTrails/api/blog/getBlogById",controller.getBlogById);
//   app.post("/skyTrails/api/blog/createBlog",controller.randomPaymentFailure);
app.put("/skyTrails/api/blog/deleteBlog",controller.deleteBlog);
app.put("/skyTrails/api/blog/hideBlog",controller.hideBlog);
app.put("/skyTrails/api/blog/updateBlog",controller.updateBlog);
app.get("/skyTrails/api/blog/getAllBlogsAdmin",controller.getBlogListAdmin);
app.put("/skyTrails/api/blog/activeStatus",controller.activeStatus)
};
