const axios = require("axios");
const nodeCrypto = require("crypto");
const xml2js = require("xml2js");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { tokenGenerator, api } = require("../common/const");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const { response } = require("express");
const responseMessage = require("../utilities/responses");
const statusCode = require("../utilities/responceCode");
const moment = require("moment");


exports.changeOrCancelByTbo = async (req, res,next) => {
    try {
      const data = {
        ...req.body,
      };
  
      const response = await axios.post(`${api.sendChangeRequestURL}`, data);
  
      res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: response.data,
      });
    } catch (err) {
      console.log(err);
      return next(err)
    }
  };