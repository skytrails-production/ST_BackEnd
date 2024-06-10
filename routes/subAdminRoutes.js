const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const agentChangeReqController = require("../controllers/b2bauth.controller");
const subAdminController = require("../controllers/subAdminController");
const rmController=require("../controllers/relationshipManagerController")
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // app.post(
  //   "/api/auth/signup",
  //   [
  //     verifySignUp.checkDuplicateUsernameOrEmail,
  //     verifySignUp.checkRolesExisted,
  //   ],
  //   controller.signup
  // );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.post(
    "/skytrails/api/subAdmin/approveAgent",
    SchemaValidator(schemas.approveAgentSchema),
    controller.approveAgent
  );
  app.post(
    "/skytrails/api/user/socialLogin",
    SchemaValidator(schemas.socialLoginSchema),
    controller.socialLogin
  );
  app.post(
    "/skytrails/api/subAdmin/createSubAdmin",
    SchemaValidator(schemas.subAdminSchema),
    subAdminController.createSubAdmin
  );
  app.put(
    "/skytrails/api/subAdmin/updateSubAdmin",
    SchemaValidator(schemas.updateSubAdmin),
    [authJwt.verifcationToken],
    subAdminController.updateSubAdmin
  );
  app.delete(
    "/skytrails/subAdmin/admin/deleteSubAdmin",
    SchemaValidator(schemas.updateSubAdmin),
    [authJwt.verifcationToken],
    subAdminController.deleteSubAdmin
  );
  app.get(
    "/skytrails/api/subAdmin/getSubAdmin",
    subAdminController.getSubAdmin
  );
  app.post(
    "/skytrails/api/subAdmin/adminLogin",
    SchemaValidator(schemas.adminLoginSchema),
    controller.adminLogin
  );
  app.post(
    "/skytrails/api/subAdmin/subAdminLogin",
    SchemaValidator(schemas.subAdminLogin),
    subAdminController.subAdminLogin
  );
  app.post("/skytrails/api/subAdmin/forgetPassword",subAdminController.forgetPassword);
  app.put("/skytrails/api/subAdmin/resetPassword",[authJwt.verifcationSubAdminToken],subAdminController.passwordReset);
  // app.put("/skytrails/api/subAdmin/editprofile",[authJwt.verifcationToken],subAdminController.editProfile)
  app.get("/skytrails/api/subAdmin/getAgents", controller.getAgents);
  app.get(
    "/skytrails/api/subAdmin/getAllHotelBookingList",
    controller.getAllHotelBookingList
  );
  app.get(
    "/skytrails/api/subAdmin/getAllFlightBookingList",
    controller.getAllFlightBookingList
  );
  app.get("/skytrails/api/subAdmin/adminDashBoard", controller.adminDashBoard);
  app.get(
    "/skytrails/api/subAdmin/getAllBusBookingList",
    controller.getAllBusBookingList
  );
  app.get(
    "/skytrails/api/subAdmin/getDataById",
    [authJwt.verifcationToken],
    controller.getDataById
  );
  app.put(
    "/skytrails/api/subAdmin/approveAgent",
    SchemaValidator(schemas.approveAgentSchema),
    controller.approveAgent
  );
  app.get(
    "/skytrails/api/subAdmin/getAllHotelBookingListAgent",
    controller.getAllHotelBookingListAgent
  );
  app.get(
    "/skytrails/api/subAdmin/getAllFlightBookingListAgent",
    controller.getAllFlightBookingListAgent
  );
  app.get(
    "/skytrails/api/subAdmin/getAllBusBookingListAgent",
    controller.getAllBusBookingListAgent
  );

  app.get(
    "/skytrails/api/subAdmin/getAllFixDepartureBooking",
    controller.getAllFixDepartureBooking
  );

  app.get(
    "/skyTrails/api/subAdmin/getchangeHotelRequestAgent",
    controller.getAgentchangeHotelRequest
  );
  app.get(
    "/skyTrails/api/subAdmin/getchangeFlightRequestAgent",
    controller.getAgentchangeFlightRequest
  );
  app.get(
    "/skyTrails/api/subAdmin/getchangeBusRequestAgent",
    controller.getAgentchangeBusRequest
  );
  app.get("/skyTrails/api/subAdmin/getMarkup", controller.getMarkup);
  app.post(
    "/skytrails/api/subAdmin/createMarkup",
    SchemaValidator(schemas.markupSchema),
    controller.createMarkup
  );
  app.get(
    "/skyTrails/api/subAdmin/getCancelUserFlightBooking",
    controller.getCancelUserFlightBooking
  );
  app.get(
    "/skyTrails/api/subAdmin/getCancelUserHotelBooking",
    controller.getCancelUserHotelBooking
  );
  app.get(
    "/skyTrails/api/subAdmin/getCancelUserBusBooking",
    controller.getCancelUserBusBooking
  );
  app.get(
    "/skyTrails/api/subAdmin/subAdminDashboard",
    [authJwt.verifcationSubAdminToken],
    subAdminController.subAdminDashboard
  );
  app.put("/skyTrails/api/admin/updateSubAdminTask",subAdminController.updateTaskOfSubAdmin);
  app.get('/skyTrails/api/admin/getAllEventBookings',controller.getAllEventBookings);
  app.delete('/skyTrails/api/admin/deletePost/:id',subAdminController.deletePost);
  app.put('/skyTrails/api/admin/approvePost',subAdminController.approveStory);
  app.get('/skyTrails/api/admin/forumPost/getPost', subAdminController.getPost);
  app.put('/skyTrails/api/admin/addOnTrending',subAdminController.addTrending);
  app.post(
    "/skyTrails/api/subAdmin/createRM",
    [authJwt.verifcationSubAdminToken],
    SchemaValidator(schemas.rmSchema),
    rmController.createRelationShipManage
  );
  app.get("/skyTrails/api/subAdmin/getAllRM",
  [authJwt.verifcationSubAdminToken],
  rmController.getRelationShipManagers);
  app.get(
    "/skyTrails/api/subAdmin/getAgenList",
    [authJwt.verifcationSubAdminToken],
    subAdminController.getAgentsIdName
  );
  app.post(
    "/skyTrails/api/subAdmin/getBookingAgentWise",
    [authJwt.verifcationSubAdminToken],
    subAdminController.getBookingAgentWise
  );
  app.post(
    "/skyTrails/api/subAdmin/getChangeRequestAgentWise",
    [authJwt.verifcationSubAdminToken],
    SchemaValidator(schemas.rmgetAgentCancelReq),
    subAdminController.getAgentChangeRequest
  );
  app.post(
    "/skyTrails/api/subAdmin/getCancelRequestAgentWise",
    [authJwt.verifcationSubAdminToken],
    SchemaValidator(schemas.rmgetAgentCancelReq),
    subAdminController.getAgentCancelRequest
  );
  app.get(
    "/skyTrails/api/subAdmin/getRMAgentList",
    [authJwt.verifcationSubAdminToken],
    subAdminController.findRMAgentList
  );
  app.get(
    "/skyTrails/api/subAdmin/getAgnetReferralsCount",
    [authJwt.verifcationSubAdminToken],
    subAdminController.getAgnetReferralsCount
  );
};
