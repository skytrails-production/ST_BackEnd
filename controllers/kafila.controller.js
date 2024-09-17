const axios = require("axios");
const {
    kafilaTokenGenerator,
  api
} = require("../common/const");
const db = require("../model");
const Airport = db.airport;
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const { response } = require("express");

const requestIp = require("request-ip");
const { userIPDetail } = require("../model/city.model");
//**************************************COMMON SERVICES***************************************/

exports.kafilaTokenGenerator = async (req, res) => {
  try {
    const data = {
      P_TYPE: `${kafilaTokenGenerator.P_TYPE}`,
      R_TYPE: `${kafilaTokenGenerator.R_TYPE}`,
      R_NAME: `${kafilaTokenGenerator.R_NAME}`,
      AID: `${kafilaTokenGenerator.AID}`,
      UID: `${kafilaTokenGenerator.UID}`,
      PWD: `${kafilaTokenGenerator.PWD}`,
      Version: `${kafilaTokenGenerator.Version}`,
    };

    const response = await axios.post(`${api.kafilatokenURL}`, data);
    msg = "Token Generated";
    // const TokenId=response?.data?.TokenId
    const result = {
      TokenId: response?.data?.Result,
      Error: response?.data?.ErrorMessage,
      Status: response?.data?.Status,
    };
    

    actionCompleteResponse(res, result, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};
