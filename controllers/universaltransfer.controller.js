const axios = require("axios");
const { tokenGenerator, api } = require("../common/const");
const xml2js = require('xml2js');

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");



//get static country data 

exports.staticData = async (req, res) => {    
    try {
      const data ={
        "TokenId": req.body.TokenId,
        "ClientId": tokenGenerator.ClientId,
        "EndUserIp": req.body.EndUserIp
       };
       
      const response = await axios.post(`${api.staticData}`, data);
      msg = "Get static data successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };



  //get destination search static data

  exports.getDestinationSearchStaticData = async (req, res) => {    
    try {
      const data ={
        "ClientId":tokenGenerator.ClientId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "CountryCode" : req.body.CountryCode,
        "SearchType" :req.body.SearchType
        };
       
      const response = await axios.post(`${api.getDestinationSearchStaticData}`, data);
      msg = "Get destination search static data Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };

 

//get transfer data

  // exports.getTransferStaticData = async (req, res) => {    
  //   try {
  //     const data ={
  //       "CityId": req.body.CityId,
  //       "ClientId": tokenGenerator.ClientId,
  //       "EndUserIp":req.body.EndUserIp,
  //       "TransferCategoryType":req.body.TransferCategoryType,
  //       "TokenId": req.body.TokenId,
  //       };
            
  //     const response = await axios.post(`${api.getTransferStaticData}`, data);
  //     msg = "Get transfer static data successfully!";
  //     actionCompleteResponse(res, response.data, msg);
  //   } catch (err) {
  //     sendActionFailedResponse(res, {}, err.message);
  //   }
  // };



  exports.getTransferStaticData = async (req, res) => {    
    try {
      const data = {
        CityId: req.body.CityId,
        ClientId: tokenGenerator.ClientId,
        EndUserIp: req.body.EndUserIp,
        TransferCategoryType: req.body.TransferCategoryType,
        TokenId: req.body.TokenId,
      };
    
      // Fetch the XML data from the API
      const response = await axios.post(`${api.getTransferStaticData}`, data);
      const xmlData = response?.data?.TransferStaticData;
  
      // Create an XML parser instance
      const parser = new xml2js.Parser({ explicitArray: false });
  
      // Parse the XML data to JSON
      parser.parseString(xmlData, (err, result) => {
        if (err) {
          throw new Error('Error parsing XML');
        }
  
        // Transform the parsed XML into the desired JSON format
        const transformedData = {
              ArrayOfBasicAirportPropertyInfo: result.ArrayOfBasicAirportPropertyInfo.BasicAirportPropertyInfo.map(info => ({
                AirportCode: info.$.AirportCode,
                AirportName: info.$.AirportName,
                CityCode: info.$.CityCode,
                cityName: info.$.cityName,
                TBOCityId: info.$.TBOCityId,
                CountryCode: info.$.CountryCode
              }))          
        };

        const modifiedData={
          Error:response?.data?.Error,
          Status:response?.data?.Status,
          TokenId:response?.data?.TokenId,
          TransferStaticData:transformedData
        }


        // Send the transformed JSON data as the response
      actionCompleteResponse(res, modifiedData, "Get transfer static data successfully!");
    });
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};


// Transfer Searching

  exports.transferSearch = async (req, res) => {    
    try {
      const data ={
        "TransferTime": req.body.TransferTime,
        "TransferDate": req.body.TransferDate,
        "AdultCount": req.body.AdultCount,
        "PreferredLanguage":req.body.PreferredLanguage,
        "AlternateLanguage": req.body.AlternateLanguage,
        "PreferredCurrency": req.body.PreferredCurrency,
        "IsBaseCurrencyRequired":req.body.IsBaseCurrencyRequired,
        "PickUpCode": req.body.PickUpCode,
        "PickUpPointCode": req.body.PickUpPointCode,
        "CityId": req.body.CityId,
        "DropOffCode": req.body.DropOffCode,
        "DropOffPointCode":req.body.DropOffPointCode,
        "CountryCode": req.body.CountryCode,
        "EndUserIp": req.body.EndUserIp,
        "TokenId":req.body.TokenId,
     } 

    //  return;
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

      const response = await axios.post(`${api.transferSearch}`, data);
      msg = "Transfer search  successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };



  //get cancellation Policy


  exports.getCancellationPolicy = async (req, res) => {    
    try {
      const data ={
        "ResultIndex": req.body.ResultIndex,
        "TransferCode": req.body.TransferCode,
        "VehicleIndex":req.body.VehicleIndex,
        "BookingMode": req.body.BookingMode,
        "EndUserIp": req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        "AgencyId": tokenGenerator?.TokenAgencyId,
        "TraceId": req.body.TraceId,
       };
            
      //  return;
      const response = await axios.post(`${api.getCancellationPolicy}`, data);
      msg = "Get Transfer Static Data Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };


  //=======================================================> Booking <===========================================/

//booking 



  exports.transferBooking = async (req, res) => {    
    try {
      const data = req.body;
      // return;
 
      const response = await axios.post(`${api.transferBooking}`, data);
      msg = "Booking successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };



  //generate Voucher

  exports.generateVoucher = async (req, res) => {    
    try {
      const data ={
        "BookingId": req.body.BookingId,
        "AgencyId": tokenGenerator?.TokenAgencyId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
 
      const response = await axios.post(`${api.generateVoucher}`, data);
      msg = "Voucher Generated Successfully!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };
  


  //retrieve booking details


  exports.retrieveBookingDetails = async (req, res) => {    
    try {
      const data ={
        "BookingId": req.body.BookingId,
        "AgencyId": tokenGenerator?.TokenAgencyId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };

        // return;
 
      const response = await axios.post(`${api.retrieveBookingDetails}`, data);
      msg = " Successfully get booking details!";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };


  //send change request

  
  exports.sendChangeRequest = async (req, res) => {    
    try {
      const data ={
        "RequestType": req.body.RequestType,
        "Remarks": req.body.Remarks,
        "BookingId": req.body.BookingId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
 
      const response = await axios.post(`${api.sendCancelRequest}`, data);
      msg = " Successfully send cancle request";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };


  //get cancel request status

  exports.getcancelRequeststatus = async (req, res) => {    
    try {
      const data ={
        "ChangeRequestId": req.body.ChangeRequestId,
        "EndUserIp":req.body.EndUserIp,
        "TokenId": req.body.TokenId,
        };
     
      const response = await axios.post(`${api.getCancelRequeststatus}`, data);
      msg = " Successfully get  cancle request status";
      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
  };
 
  