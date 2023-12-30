const axios = require("axios");
const { api } = require("../common/const");
const db = require("../model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const {cityBusData} = require("../model/city.model");
exports.getBusCityList = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const response = await axios.post(`${api.busCityURL}`, data);
    msg = "Bus City List Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchBus = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busSearchURL}`, data);

    msg = "Bus Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchBusSeatLayout = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busSeatLayoutURL}`, data);

    msg = "Bus Layout Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.busBoardingPoint = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busBoardingPointURL}`, data);

    msg = "Bus Boarding Point Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.busBlock = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busBlockURL}`, data);

    msg = "Bus Block Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.busBook = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busBookURL}`, data);

    msg = "Bus Book Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.busBookingDetails = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busBookingDetailsURL}`, data);

    msg = "Bus Booking Details Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.busCancellation = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.busCancelURL}`, data);

    msg = "Bus Cancel Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};
