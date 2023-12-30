const axios = require("axios");
const { tokenGenerator, api } = require("../common/const");
const db = require("../model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");



exports.sightSettingSearch = async (req, res) => {
    // This method gives the list of available sightseeing for the specified destination city on a specified date.
    // Client need to pass the Destination city and date in request in response will get the available Sightseeing
    // option 
    
    try {
      const data = {
        "CityId": req.body.CityId,
        "CountryCode": req.body.CountryCode,
        "FromDate":  req.body.FromDate,
        "AdultCount":req.body.AdultCount || 1,
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId
      }
      const response = await axios.post(`${api.sightsettingSearch}`, data);
  
      msg = "sightsetting search Successfully!";
  
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  exports.sightSettingGetavailability = async (req, res) => {
    // GetAvailability method is called to get all the tour plan corresponding to selected result index.
    // This method gives all the available tour plan corresponding to selected result index 
    
    try {
      const data ={
        "ResultIndex": req.body.resultIndex,
       "EndUserIp": req.body.EndUserIp,
        "TraceId": req.body.TraceId,
        "TokenId": req.body.TokenId
      };
      const response = await axios.post(`${api.sightsettingGetavailability}`, data);
      msg = "sightsetting get avaibility Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

exports.sightSettingBlock = async (req, res) => {
    // BlockRoom method is used to get the updated prices and cancellation policies for the selected result
    // before proceeding with the sightseeing booking 
    try {
      const data ={
        "AgeBands": [
          {
            "AgeBandIndex": req.body.AgeBands.AgeBandIndex || 1,
            "BandDescription": req.body.AgeBands.BandDescription || "Adult",
            "BandQuantity": req.body.AgeBands.BandQuantity || 1,
            "IsAgeRequired":req.body.AgeBands.IsAgeRequired || false
          }
        ],
        "Price": {
          ...req.body.Price
      },
        "TourIndex":req.body.TourIndex || 1,
        "ResultIndex":req.body.ResultIndex || 62,
        "EndUserIp": req.body.EndUserIp,
        "TraceId": req.body.TraceId,
        "TokenId": req.body.TokenId
      };
     
      const response = await axios.post(`${api.sightsettingBlock}`, data);
  
      msg = "sightsetting Block Successfully!";
  
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };
  

  exports.sightSettingBook = async (req, res) => {
    // Book method is called to either confirm/ voucher a booking based on the selected sightseeing and guest
    // information. We strongly recommend checking the updated price for the selected sightseeing through
    // BlockRoom method before proceeding with the sightseeing booking to reduce the probability of booking
    // failure
    try {
      const data ={
        "SightseeingCode": req.body.SightseeingCode,
        "Passenger": [
          {
            "Title": req.body.Passenger.Title,
            "FirstName": req.body.Passenger.FirstName,
            "LastName":req.body.Passenger.LastName,
            "PaxType": req.body.Passenger.PaxType || 0,
            "Age": req.body.Passenger.Age || null,
            "LeadPassenger": req.body.Passenger.LeadPassenger || true,
            "Phoneno": req.body.Passenger.Phoneno,
            "PassportNo": req.body.Passenger.PassportNo || "",
            "Email": req.body.Passenger.Email,
            "AgeBandIndex": req.body.Passenger.AgeBandIndex || 1,
            "PAN": req.body.Passenger.PAN,
            "PaxId": req.body.Passenger.PaxId ||0,
            "DateOfBirth": req.body.Passenger.DateOfBirth ||""
          }
        ],
        "Price": {
          ...req.body.Price
      },
        "GuestNationality": req.body.GuestNationality || "IN",
        "IsVoucherBooking": req.body.IsVoucherBooking || true,
        "ResultIndex": req.body.ResultIndex,
        "TourIndex": req.body.TourIndex  || 1,
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "TraceId": req.body.TraceId
      };
  
      
      const response = await axios.post(`${api.sightsettingBook}`, data);
  
      msg = "sightsetting Book Successfully!";
  
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };




  exports.sightSettingBookingDetail = async (req, res) => {
    // This section covers the method used for retrieving booking details and booking status based on Booking ID
    // or Confirmation No or Trace ID 
    
    try {
      const data ={
        "ConfirmationNo": req.body.ConfirmationNo,
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "TraceId": req.body.TraceId
      };
  
      const response = await axios.post(`${api.sightsettingBlockingDetails}`, data);
  
      msg = "sightsetting Booking Detail get Successfully!";
  
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  exports.sightSettingBookingChangeRequest = async (req, res) => {
    // This method are to be called to send cancellation or change requests and to check the cancellation status 
    try {
      const data ={
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "TraceId": req.body.TraceId,
        "BookingId": req.body.BookingId,
        "RequestType": req.body.RequestType,
        "Remarks": "Booking Created for testing purpose"
      };
  
      const response = await axios.post(`${api.sightsettingSendChangeRequest}`, data);
  
      msg = "sightsetting Booking SIGHTSEEING CANCELLATION Successfully!";
  
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  