exports.tokenGenerator = {
  ClientId: process.env.TBO_CLIENT_ID,
  UserName: process.env.TBO_USERNAME,
  Password: process.env.TBO_PASSWORD,
  TokenAgencyId: process.env.TBO_TOKEN_AGENCY_ID,
  TokenMemberId: process.env.TBO_TOKEN_MEMBER_ID,
};



exports.kafilaTokenGenerator={
  P_TYPE: "API",
  R_TYPE: "FLIGHT",
  R_NAME: "GetToken",
  AID: process.env.KAFILA_AGENT_ID,
  UID: process.env.KAFILA_UID,
  PWD: process.env.KAFILA_PWD,
  Version: "1.0.0.0.0.0"
}



exports.api = {
  //Common Token ,Agencybalance and Logout API's
  // tokenURL:
  //   "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
//   logoutURL:
//   "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Logout",
// agencyBalanceURL:
//   "http://api.tektravels.com/SharedServices/SharedData.svc/rest/GetAgencyBalance",
  tokenURL:
    "https://api.travelboutiqueonline.com/SharedAPI/SharedData.svc/rest/Authenticate",
  logoutURL:
    "https://api.travelboutiqueonline.com/SharedAPI/SharedData.svc/rest/Logout",
  agencyBalanceURL:
    "https://api.travelboutiqueonline.com/SharedAPI/SharedData.svc/rest/GetAgencyBalance",

  //Flight API's
  // flightSearchURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
  flightSearchURL:
  "https://tboapi.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/Search",

  //easemyTrip Api----------------START------------------//
  emiflightSearch:
    "https://stagingapi.easemytrip.com/Flight.svc/json/FlightSearch",

  //easemyTrip Api----------------END------------------//

  // flightFareRuleURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule",
  // flightFareQuoteURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",
  // flightSSR:
  // "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR",
  // flightBookingURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book",

    flightFareRuleURL:
    "https://tboapi.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/FareRule",
  flightFareQuoteURL:
    "https://tboapi.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/FareQuote",
    flightSSR:
  "https://tboapi.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/SSR",
  flightBookingURL:
    "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/Book",

  //----------------EMT-----------------

  emtflightBookingURL:
    "https://stagingapi.easemytrip.com/Flight.svc/json/AirBookRQ",

  getSeatMapURL: "https://stagingapi.easemytrip.com/Flight.svc/json/GetSeatMap",

  airRePriceRQURL:
    "https://stagingapi.easemytrip.com/Flight.svc/json/AirRePriceRQ",

  bookFlight: "https://stagingapi.easemytrip.com/Flight.svc/json/BookFlight",

  //---------------------END----------

  // flightTicketLCCURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",
  flightTicketLCCURL:
  "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/Ticket",
   
  // flightTicketNonLCCURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",
    flightTicketNonLCCURL:
    "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/Ticket",
  flightBookingDetailsURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails",
  //   releasePNRRequestURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest",
  // sendChangeRequestURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest",
  // getChangeRequestStatusURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus",
  // getCancellationChargesURL:
  //   "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges",

  // flightBookingDetailsURL:
  // "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/GetBookingDetails",
  releasePNRRequestURL:
    "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/ReleasePNRRequest",
  sendChangeRequestURL:
    "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/SendChangeRequest",
  getChangeRequestStatusURL:
    "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/GetChangeRequestStatus",
  getCancellationChargesURL:
    "https://booking.travelboutiqueonline.com/AirAPI_V10/AirService.svc/rest/GetCancellationCharges",

  //Hotel API's
  // hotelSearchURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelResult/",
  // hotelInfoSearchURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo",
  // hotelRoomURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelRoom",
  // hotelBlockRoomURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/BlockRoom",
  // hotelBookRoomURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Book",
  // hotelBookingDetailsURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/HotelService.svc/rest/GetBookingDetail",
  // hotelCancelURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest",
  // hotelCancelStatusURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetChangeRequestStatus/",
  // hotelGetCountryListURL:
  //   "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",
  // hotelGetDestinationCityListURL:
  //   "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
  // hotelGetTopDestinationListURL:
  //   "http://api.tektravels.com/SharedServices/SharedData.svc/rest/TopDestinationList",
  // hotelGetVoucherURL:
  //   "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher",


  //Hotel API's
  hotelSearchURL:
    "https://api.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/GetHotelResult",
  hotelInfoSearchURL:
    "https://api.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/GetHotelInfo",
  hotelRoomURL:
    "https://api.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/GetHotelRoom",
  hotelBlockRoomURL:
    "https://api.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/BlockRoom",
  hotelBookRoomURL:
    "https://booking.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/Book",
  hotelBookingDetailsURL:
    "https://booking.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/GetBookingDetail",
  hotelCancelURL:
    "https://booking.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/SendChangeRequest",
  hotelCancelStatusURL:
    "https://booking.travelboutiqueonline.com/HotelAPI_V10/HotelService.svc/rest/GetChangeRequestStatus/",
  hotelGetCountryListURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",
  hotelGetDestinationCityListURL:
    "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
  hotelGetTopDestinationListURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/TopDestinationList",
  hotelGetVoucherURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher",

  //Bus API's
  // busCityURL:
  //   "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetBusCityList",
  // busSearchURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/Search",
  // busSeatLayoutURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/GetBusSeatLayOut",
  // busBoardingPointURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/GetBoardingPointDetails",
  // busBlockURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/Block",
  // busBookURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/Book",
  // busBookingDetailsURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/GetBookingDetail",
  // busCancelURL:
  //   "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/SendChangeRequest",



    //Bus production API's
  busCityURL:
  "https://api.travelboutiqueonline.com/SharedAPI/StaticData.svc/rest/GetBusCityList",
busSearchURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/Search/",
busSeatLayoutURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/GetBusSeatLayOut/",
busBoardingPointURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/GetBoardingPointDetails/",
busBlockURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/Block",
busBookURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/Book",
busBookingDetailsURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/GetBookingDetail",
busCancelURL:
  "https://api.travelboutiqueonline.com/BusAPI_V10/BusService.svc/rest/SendChangeRequest/",

  //===================================>  Sightsettings API <===============================================//

  // Sightseeing Search Request
  sightsettingSearch:
    "http://api.tektravels.com/BookingEngineService_SightSeeing/SightseeingService.svc/rest/Search",

  // SIGHTSEEING GETAVAILABILITY METHOD
  sightsettingGetavailability:
    "http://api.tektravels.com/BookingEngineService_SightSeeing/SightseeingService.svc/rest/GetAvailability",

  // SIGHTSEEING BLOCK METHOD
  sightsettingBlock:
    "http://api.tektravels.com/BookingEngineService_SightSeeing/SightseeingService.svc/rest/Block",

  // SIGHTSEEING BOOK METHOD
  sightsettingBook:
    "http://api.tektravels.com/BookingEngineService_SightSeeingBook/SightseeingService.svc/rest/Book",

  // Get Booking details
  sightsettingBlockingDetails:
    " http://api.tektravels.com/BookingEngineService_SightSeeingBook/SightseeingService.svc/rest/GetBookingDetail",

  // SIGHTSEEING CANCELLATION
  sightsettingSendChangeRequest:
    " http://api.tektravels.com/BookingEngineService_SightSeeingBook/SightseeingService.svc/rest/SendChangeRequest",

  

      // ==============================================> TRANSFER api start <===================================================//

  // Transfer static data

  //country list

  staticData:
    // "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",
    "https://sharedapi.tektravels.com/SharedData.svc/rest/CountryList",

  // GetDestinationSearchStaticData citywise or hotelwise

  getDestinationSearchStaticData:
    // "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
    "http://sharedapi.tektravels.com/staticdata.svc/rest/GetDestinationSearchStaticData",

  // getTransferStaticData

  getTransferStaticData:
    "http://sharedapi.tektravels.com/staticdata.svc/rest/GetTransferStaticData",

  // Transfer search
  transferSearch:
    // "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/Search",
    "https://TransferBE.tektravels.com/TransferService.svc/rest/Search",

  // get Cancellation Policy
  getCancellationPolicy:
    // "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GetCancellationPolicy/",
    "https://TransferBE.tektravels.com/TransferService.svc/rest/GetCancellationPolicy",

  //Booking
    transferBooking:
    // "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/Book/",
    "https://TransferBE.tektravels.com/TransferService.svc/rest/Book",

  // Generate Voucher
  generateVoucher:
    // "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GenerateVoucher/",
    "https://TransferBE.tektravels.com/TransferService.svc/rest/GenerateVoucher/",

  //Retrieve Booking  Transfer
  retrieveBookingDetails:
    // "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GetBookingDetail/",
    "https://TransferBE.tektravels.com/TransferService.svc/rest/GetBookingDetail",

  //Send Cancel Request

  sendCancelRequest:
    "http://b2b.tektravels.com/BETransferService/InternalTransferService.svc/rest/SendChangeRequest/",

  // get cancle request status Get Cancel Request Status
  getCancelRequeststatus:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GetChangeRequestStatus/",


   // ==============================================> TRANSFER api end <===================================================//

 //-------------------------- Start  Utility------------------------


 
  utilityloginwebapiURL:
    "http://utilitywebapi.bisplindia.in/api/Login/UserLogin",

  getServiceRechegeURL:
    "http://utilitywebapi.bisplindia.in/api/Recharge/GetService",

  getRechargePlanULR:
    "https://utilitywebapi.bisplindia.in/api/Recharge/GetRechargePlanDetailNew",

  getPlanDetailURL:
    "https://utilitywebapi.bisplindia.in/api/Recharge/GetRechargePlanDetail",

  rechageRequestURL:
    " https://utilitywebapi.bisplindia.in/api/Recharge/Recharge",

  getUserBalanceRequest:
    "https://utilitywebapi.bisplindia.in/api/Admin/GetUserBalance",

  getPromoServicesRequest:
    "https://utilitywebapi.bisplindia.in/api/PromoCode/GetPromoServices",

  getPromoCodeRequest:
    "https://utilitywebapi.bisplindia.in/api/PromoCode/GetPromoCode",
  getOTPRequest: "https://utilitywebapi.bisplindia.in/api/Admin/OTP",
  getVerifyOTPRequest:
    "https://utilitywebapi.bisplindia.in/api/Admin/VerifyOTP",



     //bill api url

     getBillServiceURL:"https://utilitywebapi.bisplindia.in/api/Bill/GetBillService",
     getBillServiceParamemterURL:"https://utilitywebapi.bisplindia.in/api/Bill/GetBillServiceParamemter",
     saveBillPaymentURL:"https://utilitywebapi.bisplindia.in/api/Bill/SaveBillPayment",
 
 
      //-------------------------- End  Utility------------------------


    //---------------------------------------Start Mihuru Api's -------------------------


    //Mihuru api url 
    partnerAuthentication:
    "https://uat.partners.mihuru.com/api/assistmodule/v2/login/apiuser",
    customerSignUp:
    "https://uat.partners.mihuru.com/api/assistmodule/v2/signup",
    submitOtp:
    "https://uat.partners.mihuru.com/api/assistmodule/v2/submitotp",
    travelPlanGenerator:
    "https://uat.partners.mihuru.com/api/assistmodule/v2/confirmpersonaldetails",
    resendOtp:
    "https://uat.partners.mihuru.com/api/assistmodule/v2/resendotp",
    applicationStatus:
    "https://uat.partners.mihuru.com/api/application/status",
    emiTravelPlan:
    "https://uat.partners.mihuru.com/api/TravelEMI/v2/TravelPlanEMI",
    initiateFlightBooking:
    "https://uat.partners.mihuru.com/api/booking/v2/initiate/flight",
    initiateHotelBooking:
    "https://uat.partners.mihuru.com/api/booking/v2/initiate/hotel",
    initiateHolidayPackageBooking:
    "https://uat.partners.mihuru.com/api/booking/v2/initiate/holidaypackage",
    initiateBookingCancel:
    "https://uat.partners.mihuru.com/api/assistmodule/booking/v2/cancellation/initiate",
    bookingCancelProcess:
    "https://uat.partners.mihuru.com/api/assistmodule/booking/v2/cancellation/process",
    genrateCustomerToken:
    "https://uat.partners.mihuru.com/api/applicationtoken/v2/currentapplicationtoken",




    // --------------------------------------- End Mihuru Api's ----------------------------
    
//******************************* Start KAFILA API***************************************/


//testing url


// kafilatokenURL:
// "http://stage1.ksofttechnology.com/api/Freport",
// kafilaGetFlight:"http://stage1.ksofttechnology.com/api/FSearch",
// kafilaRoundTripGetFlight:"http://stage1.ksofttechnology.com/api/FSearch",
// kafilaFareCheck:"http://stage1.ksofttechnology.com/api/FFareCheck",
// kafilaSSR:" http://stage1.ksofttechnology.com/api/FAncl",
// kafilaPnrCreation:"http://stage1.ksofttechnology.com/api/FPNR",
// kafilaGetBookingDetails:" http://stage1.ksofttechnology.com/api/Freport",
// kafilaCncelCharges:"http://stage1.ksofttechnology.com/api/FCancel",
// kafilaCancelSubmit:"http://stage1.ksofttechnology.com/api/Freport",



//live url


kafilatokenURL:"https://fhapip.ksofttechnology.com/api/Freport",
kafilaGetFlight:"https://fhapip.ksofttechnology.com/api/FSearch",
kafilaRoundTripGetFlight:"https://fhapip.ksofttechnology.com/api/FSearch",
kafilaFareCheck:"https://fhapip.ksofttechnology.com/api/FFareCheck",
kafilaSSR:"https://fhapip.ksofttechnology.com/api/FAncl",
kafilaPnrCreation:"https://fhapip.ksofttechnology.com/api/FPNR",
kafilaGetBookingDetails:"https://fhapip.ksofttechnology.com/api/Freport",
kafilaCncelCharges:"https://fhapip.ksofttechnology.com/api/FCancel",
kafilaCancelSubmit:"https://fhapip.ksofttechnology.com/api/Freport",



// --------------------------------------- End Kafila Api's ----------------------------

};
exports.responseFlags = {
  ACTION_COMPLETE: 200,
  ACTION_FAILED: 500,
};

exports.responseMessages = {
  ACTION_COMPLETE: "Successful",
  ACTION_FAILED: "Something went wrong.Please try again",
};

exports.activeStatus = {
  IN_ACTIVE: 0,
  ACTIVE: 1,
  ARCHIVE:2
};