const axios = require("axios");
const { tokenGenerator, api } = require("../common/const");
const db = require("../model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");


exports.staticData = async (req, res) => {    
    try {
      const data ={
        "TokenId": req.body.TokenId,
        "ClientId": tokenGenerator.ClientId,
        "EndUserIp": req.body.EndUserIp
       };
       
      const response = await axios.post(`${api.staticData}`, data);
      msg = "static Data get Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };


  exports.GetDestinationSearchStaticDatacitywise = async (req, res) => {    
    try {
      const data ={
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "CountryCode" : req.body.CountryCode || "GB",
        "SearchType" :"1"
        };
       
      const response = await axios.post(`${api.GetDestinationSearchStaticData}`, data);
      msg = "Get Destination Search Static Data (citywise) Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  exports.GetDestinationSearchStaticDataHotelwise = async (req, res) => {    
    try {
      const data ={
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "CountryCode" : req.body.CountryCode || "GB",
        "SearchType" :"2"
        } ;
       
      const response = await axios.post(`${api.GetDestinationSearchStaticData}`, data);
      msg = "Get Transfer Static Data (Hotelwise) Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  exports.GetTransferStaticData = async (req, res) => {    
    try {
      const data ={
        "CityId": req.body.CityId || "126632",
        "ClientId": tokenGenerator.ClientId,
        "EndUserIp":req.body.EndUserIp,
        "TransferCategoryType":"2",
        "TokenId": req.body.TokenId,
        };
            
      const response = await axios.post(`${api.GetTransferStaticData}`, data);
      msg = "Get Transfer Static Data Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };


// not working
  exports.transfersearch = async (req, res) => {    
    try {
      const data ={
        "TransferTime": req.body.TransferTime,
        "TransferDate": req.body.TransferDate || "2021-01-07",
        "AdultCount": req.body.AdultCount || 1,
        "PreferredLanguage":req.body.PreferredLanguage || 4,
        "AlternateLanguage": req.body.AlternateLanguage|| 4,
        "PreferredCurrency": req.body.PreferredCurrency || "INR",
        "IsBaseCurrencyRequired":req.body.IsBaseCurrencyRequired || false,
        "PickUpCode": req.body.PickUpCode || 1,
        "PickUpPointCode": req.body.PickUpPointCode || "LGW",
        "CityId": req.body.CityId || "126632",
        "DropOffCode": req.body.DropOffCode || 1,
        "DropOffPointCode":req.body.DropOffPointCode || "LHR",
        "CountryCode": req.body.CountryCode || "IN",
        "EndUserIp": req.body.EndUserIp,
        "TokenId":req.body.TokenId,
     } 
//  Mandatory                                            
// -PickUpCode should be a blow number or
// 0 = Accommodation
// 1 = Airport
// 2 = Train Station
// 3 = Sea Port
// 4 = Other

// ========================> <============================//
// Mandatory
// -DropOffCode should be a blow number 
// 0 = Accommodation
// 1 = Airport
// 2 = Train Station
// 3 = Sea Port
// 4 = Other
            

// =============================><==========================//

// Mandatory
// -PreferredLanguage should be a blow number
// NotSpecified = 0,
// Arabic = 1,
// Cantinese = 2,
// Danish = 3,
// English = 4,
// French = 5,
// German = 6,
// Hebrew = 7,
// Italian = 8,
// Japanese = 9,
// Korean = 10,
// Mandrain = 11,
// Portuguese = 12,
// Russian = 13,
// Spanish = 14

      const response = await axios.post(`${api.transfersearch}`, data);
      msg = "transfer search  Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };


  exports.GetCancellationPolicy = async (req, res) => {    
    try {
      const data ={
        "ResultIndex": req.body.ResultIndex || 1,
        "TransferCode": req.body.TransferCode || "0|0|0",
        "VehicleIndex": [
        ...req.body.VehicleIndex
        ],
        "BookingMode": 5,
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "AgencyId": req.body.AgencyId,
        "TraceId": req.body.TraceId,
       };
            
      const response = await axios.post(`${api.GetCancellationPolicy}`, data);
      msg = "Get Transfer Static Data Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };


  //=======================================================> Booking <===========================================/

  exports.booking = async (req, res) => {    
    try {
      const data = {
        "IsVoucherBooking": false,
        "NumOfPax": 1,
       
        "PaxInfo": [
        {
        "PaxId": 0,
        "Title": "Mr.",
        "FirstName": "ABC",
        "LastName": "DEF",
        "PaxType": 0,
        "Age": 0,
        "ContactNumber": "919874563210",
        "PAN": null
        }
        ],
        "PickUp": {
        "PickUpDetailName": "London Gatwick Airport",
        "PickUpDetailCode": "LGW",
        "Description": "6E-123",
        "Remarks": "",
        "Time": "1030",                                       // format:(hhmm)
        "PickUpDate": "07/01/2021",
        "AddressLine1": null,
        "City": null,
        "Country": null,
        "ZipCode": null,
        "AddressLine2": null
        },
        "DropOff": {
        "DropOffDetailName": "London Heathrow Airport",
        "DropOffDetailCode": "LHR",
        "Description": "SG-456",
        "Remarks": "",
        "Time": "0000",                                       //format:(hhmm)

        "PickUpDate": null,
        "AddressLine1": null,
        "City": null,
        "Country": null,
        "ZipCode": null,
        "AddressLine2": null
        },
        "Vehicles": [
        {
        "VehicleIndex": 1,
        "Vehicle": "Car",
        "VehicleCode": "CR",
        "VehicleMaximumPassengers": 1,
        "VehicleMaximumLuggage": 1,
        "Language": "NotSpecified",
        "LanguageCode": 0,
        "TransferPrice": {
        "CurrencyCode": "INR",
        "BasePrice": 10086.22,
        "Tax": 0.0,
        "Discount": 0.0,
        "PublishedPrice": 11094.84,
        "PublishedPriceRoundedOff": 11095.0,
        "OfferedPrice": 11094.84,
        "OfferedPriceRoundedOff": 11095.0,
        "AgentCommission": 0.0,
        "AgentMarkUp": 0.0,
        "ServiceTax": 0.0,
        "TDS": 0.0,
        "TCS": 563.82,
        "PriceType": 0,
        "SubagentCommissionInPriceDetailResponse": 0.0,
        "SubagentCommissionTypeInPriceDetailResponse": 0,
        "DistributorCommissionInPriceDetailResponse": 0.0,
        "DistributorCommissionTypeInPriceDetailResponse": 0,
        "ServiceCharge": 0.0,
        "TotalGSTAmount": 0.0
        }
        }
        ],
        "ResultIndex": 1,
        "TransferCode": "0|0|0",
        "VehicleIndex": [
        1
        ],
        "BookingMode": 5,
        "OccupiedPax": [
        {
        "AdultCount":  1,
        }
        ],
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "TraceId": req.body.TraceId
       };
 
      const response = await axios.post(`${api.booking}`, data);
      msg = "booking Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  exports.GenerateVoucher = async (req, res) => {    
    try {
      const data ={
        "BookingId": req.body.BookingId,
        "AgencyId": req.body.AgencyId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
 
      const response = await axios.post(`${api.GenerateVoucher}`, data);
      msg = "Voucher Generated Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };
  

  exports.retrieveBookingDetails = async (req, res) => {    
    try {
      const data ={
        "BookingId": req.body.BookingId,
        "AgencyId": req.body.AgencyId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
 
      const response = await axios.post(`${api.retrieveBookingDetails}`, data);
      msg = " Successfully get booking details";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };
  
  exports.SendChangeRequest = async (req, res) => {    
    try {
      const data ={
        "RequestType": 4,
        "Remarks": "cancelling confirmed from service",
        "BookingId": req.body.BookingId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
 
      const response = await axios.post(`${api.sendcancleRequest}`, data);
      msg = " Successfully send cancle request";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };

  exports.getcancleRequeststatus = async (req, res) => {    
    try {
      const data ={
        "ChangeRequestId": req.body.changeRequestId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
     
      const response = await axios.post(`${api.getcancleRequeststatus}`, data);
      msg = " Successfully get  cancle request status";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };
 