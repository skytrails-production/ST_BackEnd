const db = require("../model");
const b2bUser = db.userb2b;
const Joi = require("joi");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const responseMessage = require("../utilities/responses");
const statusCode = require("../utilities/responceCode");
const staticType = require("../enums/staticContentType");
//************SERVICES*************** */

const { brbuserServices } = require("../services/btobagentServices");
const userType = require("../enums/userType");
const status = require("../enums/status");

const {
  createbrbuser,
  findbrbuser,
  getbrbuser,
  findbrbuserData,
  updatebrbuser,
  deletebrbuser,
  brbuserList,
  paginatebrbuserSearch,
  countTotalbrbUser,
} = brbuserServices;
const {
  agentStaticContentServices,
} = require("../services/agentStaticServices");
const { updateStaticContent } = require("./staticContentController");
const { responseMessages } = require("../common/const");
const {
  createAgentStaticContent,
  findAgentStaticContent,
  findAgentStaticContentData,
  deleteAgentStaticContentStatic,
  updateAgentStaticContentStatic,
} = agentStaticContentServices;

//***************************API's********************************************/
exports.updateAgentStaticContent = async (req, res, next) => {
  try {
    const {
      agentId,
      title,
      description,
      type,
      contactNumber,
      email,
      OperationalAddress,
      RegisteredAddress,
      latitude,
      longitude,
    } = req.body;
    const isAgentExist = await findbrbuser({ _id: agentId });
    if (!isAgentExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.AGENT_NOT_FOUND,
        });
    }
    const obj = {
      title,
      agentId,
      description,
      type,
      contactNumber,
      email,
      address: [
        {
          OperationalAddress,
          RegisteredAddress,
        },
      ],
      location: { type: "Point", coordinates: [longitude, latitude] },
    };
    const isContentExist = await findAgentStaticContent({
      title: title,
      agentId: agentId,
    });
    if (isContentExist) {
      const result = await updateAgentStaticContentStatic(
        { _id: isContentExist._id },
        obj
      );
      return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.UPDATE_SUCCESS,result: result });
    }
    const result = await createAgentStaticContent(obj);
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.UPDATE_SUCCESS,result: result, });
  } catch (error) {
    console.error("error while trying to update static content ", error);
    return next(error);
  }
};

exports.getAllAgentStaticContent = async (req, res, next) => {
  try {
    const result = await findAgentStaticContentData({});
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: result,
      });
  } catch (error) {
    console.error("error while trying to get static content ", error);
    return next(error);
  }
};

exports.getAgentStaticContent = async (req, res, next) => {
  const querySchema = Joi.object({
    type: Joi.valid(...Object.values(staticType)).required(),
  });
  try {
    const { error, value: validatedQueryData } = querySchema.validate(
      req.query
    );
    if (error) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.badRequest,
          responseMessage: responseMessage.BAD_REQUEST,
          result: error.details[0].message,
        });
    }
    const { type } = validatedQueryData;
    // Assuming findAgentStaticContent expects the type property directly, not the entire query object
    const result = await findAgentStaticContent({ type });
    if (!result) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_FOUND,
        });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    console.error("error while trying to get static content ", error);
    return next(error);
  }
};

