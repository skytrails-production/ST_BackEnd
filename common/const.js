exports.tokenGenerator = {
  ClientId: "ApiIntegrationNew",
  UserName: "Theskytrails12",
  Password: "Skytrails@1234",
  TokenAgencyId: 57537,
  TokenMemberId: 57679,
};

exports.api = {
  //Common Token ,Agencybalance and Logout API's
  tokenURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
  logoutURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Logout",
  agencyBalanceURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/GetAgencyBalance",

  //Flight API's
  flightSearchURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",

  //easemyTrip Api----------------START------------------//
  emiflightSearch:
    "https://stagingapi.easemytrip.com/Flight.svc/json/FlightSearch",

  //easemyTrip Api----------------END------------------//

  flightFareRuleURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule",
  flightFareQuoteURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",
  flightBookingURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book",

  //----------------EMT-----------------

  emtflightBookingURL:
    "https://stagingapi.easemytrip.com/Flight.svc/json/AirBookRQ",

  getSeatMapURL: "https://stagingapi.easemytrip.com/Flight.svc/json/GetSeatMap",

  airRePriceRQURL:
    "https://stagingapi.easemytrip.com/Flight.svc/json/AirRePriceRQ",

  bookFlight: "https://stagingapi.easemytrip.com/Flight.svc/json/BookFlight",

  //---------------------END----------

  flightTicketLCCURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",
  flightTicketNonLCCURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket",
  flightBookingDetailsURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails",
  releasePNRRequestURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest",
  sendChangeRequestURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest",
  getChangeRequestStatusURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus",
  getCancellationChargesURL:
    "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges",

  //Hotel API's
  hotelSearchURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelResult/",
  hotelInfoSearchURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo",
  hotelRoomURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelRoom",
  hotelBlockRoomURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/BlockRoom",
  hotelBookRoomURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Book",
  hotelBookingDetailsURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/HotelService.svc/rest/GetBookingDetail",
  hotelCancelURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest",
  hotelCancelStatusURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetChangeRequestStatus/",
  hotelGetCountryListURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",
  hotelGetDestinationCityListURL:
    "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
  hotelGetTopDestinationListURL:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/TopDestinationList",
  hotelGetVoucherURL:
    "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher",

  //Bus API's
  busCityURL:
    "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetBusCityList",
  busSearchURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/Search",
  busSeatLayoutURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/GetBusSeatLayOut",
  busBoardingPointURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/GetBoardingPointDetails",
  busBlockURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/Block",
  busBookURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/Book",
  busBookingDetailsURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/GetBookingDetail",
  busCancelURL:
    "http://api.tektravels.com/BookingEngineService_Bus/Busservice.svc/rest/SendChangeRequest",

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

  // ==============================================> UNIVERSAL TRANSFER <===================================================//

  // STATIC DATA

  staticData:
    "http://api.tektravels.com/SharedServices/SharedData.svc/rest/CountryList",

  // GetDestinationSearchStaticData(CityWise)

  GetDestinationSearchStaticData:
    "http://api.tektravels.com/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",

  // GetTransferStaticData(Hotelwise)

  GetTransferStaticData:
    "http://sharedapi.tektravels.com/staticdata.svc/rest/GetTransferStaticData",

  // TRANSFERSEARCH
  transfersearch:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/Search",

  // GetCancellationPolicy
  GetCancellationPolicy:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GetCancellationPolicy/",

  //BOOKING
  booking:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/Book/",

  // GenerateVoucher
  GenerateVoucher:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GenerateVoucher/",

  // RETRIEVE BOOKING DETAIL
  retrieveBookingDetails:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GetBookingDetail/",

  //  send cancle request

  sendcancleRequest:
    "http://b2b.tektravels.com/BETransferService/InternalTransferService.svc/rest/SendChangeRequest/",

  // get cancle request status
  getcancleRequeststatus:
    "http://api.tektravels.com/BookingEngineService_Transfer/TransferService.svc/rest/GetChangeRequestStatus/",

  //utility--------------------------//start---------
  utilityloginwebapiURL:
    "http://utilitywebapi.bisplindia.in/api/Login/UserLogin",

  getServiceRechegeURL:
    "http://utilitywebapi.bisplindia.in/api/Recharge/GetService",

  getRechargePlanULR:
    "https://utilitywebapi.bisplindia.in/api/Recharge/GetRechargePlan",

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
};
