const status = require("../enums/status");
const responseMessage = require("../utilities/responses");
const statusCode = require("../utilities/responceCode");
//********************************SERVICES***************************************************/
const { staticContentServices } = require("../services/staticContentServices");
const {
  createstaticContent,
  findstaticContent,
  findstaticContentData,
  deletestaticContentStatic,
  updatestaticContentStatic,
} = staticContentServices;
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
// const status = require("../enums/status");
const staticContentType = require("../enums/staticContentType");
exports.createStaticContent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      contactNumber,
      email,
      address,
      latitude,
      longitude,
      regAddress,
      optAddress,
    } = req.body;
    // const isAdmin = await findUser({ _id: req.userId });
    // if(!isAdmin){
    //     sendActionFailedResponse(res,{},'Unauthorised user')
    // }
    const obj = {
      title: title,
      description: description,
      type: type,
      contactNumber: contactNumber,
      email: email,
      address: address,
      location: { coordinates: [longitude, latitude] },
    };
    const existingData = await findstaticContent({ type: type });
    if (existingData) {
      const updatedData = await updatestaticContentStatic(
        { _id: existingData._id },
        req.body
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.UPDATE_SUCCESS,
        result: updatedData,
      });
    } else {
      const result = await createstaticContent(req.body);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.STATIC_CREATED,
        result: result,
      });
    }
  } catch (error) {
    // sendActionFailedResponse(res, {}, error.message);
    return next(error);
  }
};

exports.listStaticContent = async (req, res, next) => {
  try {
    const { type } = req.query;

    const result = await findstaticContentData({
      type: type,
      status: status.ACTIVE,
    });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_FOUND,
        result: result,
      });
    } else {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.updateStaticContent = async (req, res, next) => {
  const staticContentId = req.body.staticContentId;
  try {
    // const isAdmin = await findUser({ _id: req.userId });
    // if(!isAdmin){
    //     sendActionFailedResponse(res,{},'Unauthorised user')
    // }
    const result = await updatestaticContentStatic(
      { _id: isDataExist._id },
      req.body
    );
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    // sendActionFailedResponse(res,{},error.message);
    return next(error);
  }
};

exports.deleteStaticContent = async (req, res, next) => {
  const staticContentId = req.body.staticContentId;
  try {
    // const isAdmin = await findUser({ _id: req.userId });
    // if(!isAdmin){
    //     sendActionFailedResponse(res,{},'Unauthorised user')
    // }
    const isDataExist = await findstaticContent({
      _id: staticContentId,
      status: status.ACTIVE,
    });
    if (!isDataExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    const result = await updatestaticContentStatic(
      { _id: isDataExist._id },
      { status: status.DELETE }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.STATIC_DELETED,
      result: result,
    });
  } catch (error) {
    // sendActionFailedResponse(res,{},error.message);
    return next(error);
  }
};



exports.isLoginEssential = async (req, res, next) => {
  try {
    const isEnable = await findstaticContent({ type: staticContentType.LOGINTNC });
    let userName = null; 
    if (isEnable?.loginEnable === false) {
      userName = "SkyUser";
    }
  
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.DATA_FOUND,
      result: {
        loginEnable: isEnable.loginEnable,
        username: userName,
      },
    });
  } catch (error) {
    return next(error);
  }
};
