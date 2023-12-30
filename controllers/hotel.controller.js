const axios = require("axios");
const { api } = require("../common/const");
const db = require("../model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

exports.searchHotelDeDup = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelSearchURL}`, data);

    msg = "Hotel De Dup Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotel = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelSearchURL}`, data);

    msg = "Hotel Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelInfoDeDup = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelInfoSearchURL}`, data);
    msg = "Hotel Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelInfo = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelInfoSearchURL}`, data);
    msg = "Hotel Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelRoom = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelRoomURL}`, data);
    msg = "Hotel Room Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelRoomDeDup = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelRoomURL}`, data);
    msg = "Hotel Room Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelBlockRoom = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelBlockRoomURL}`, data);
    msg = "Hotel Block Room Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelBlockRoomDeDup = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelBlockRoomURL}`, data);
    msg = "Hotel Block Room Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelBookRoom = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelBookRoomURL}`, data);
    msg = "Hotel Book Room Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelBookRoomDeDup = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelBookRoomURL}`, data);
    msg = "Hotel Book Room Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchHotelBookingDetails = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelBookingDetailsURL}`, data);
    
    msg = "Hotel Booking Details Searched Successfully!";
    
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelSendCancel = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelCancelURL}`, data);
    msg = "Hotel Cancel Request Send Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelGetCancelStatus = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelCancelStatusURL}`, data);
    msg = "Hotel Cancel Request Get Status Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelGetAgencyBalance = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.agencyBalanceURL}`, data);
    msg = "Hotel Cancel Request Get Status Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelGetCountryList = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelGetCountryListURL}`, data);
    msg = "Hotel Country List Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelGetDestinationCityList = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(
      `${api.hotelGetDestinationCityListURL}`,
      data
    );
    msg = "Hotel Destination City List Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelGetTopDestinationList = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(
      `${api.hotelGetTopDestinationListURL}`,
      data
    );
    msg = "Hotel Top Destination List Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.hotelGetVoucher = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.hotelGetVoucherURL}`, data);
    msg = "Hotel Voucher Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};
