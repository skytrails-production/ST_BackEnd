const axios = require("axios");
const { tokenGenerator, api } = require("../common/const");
const db = require("../model");
const Airport = db.airport;
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const { response } = require("express");
//**************************************COMMON SERVICES***************************************/


exports.getSearchAirportData = async (req, res) => {
  try {
    let data = await Airport.find({
      $or: [
        { DestinationCode: { $regex: req.params.key } },
        { AirportName: { $regex: req.params.key } },
        { AirportCode: { $regex: req.params.key } },
        { CityName: { $regex: req.params.key } },
        { CityCode: { $regex: req.params.key } },
        { CountryCode: { $regex: req.params.key } },
      ],
    });
    if (!data) {
      msg = "No Data Found";
      sendActionFailedResponse(res, {}, msg);
    } else {
      msg = "Data Fetched Successfully";
      actionCompleteResponse(res, data, msg);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.airportData = async (req, res) => {
  const airport = new Airport({
    DestinationCode: req.body.DestinationCode,
    AirportName: req.body.AirportName,
    AirportCode: req.body.AirportCode,
    CityName: req.body.CityName,
    CityCode: req.body.CityCode,
    CountryCode: req.body.CountryCode,
  });

  try {
    const response = await airport.save();
    msg = "Data Saved Successfully";

    actionCompleteResponse(res, response, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.tokenGenerator = async (req, res) => {
  try {
    const data = {
      ClientId: `${tokenGenerator.ClientId}`,
      UserName: `${tokenGenerator.UserName}`,
      Password: `${tokenGenerator.Password}`,
      EndUserIp: `${req.body.EndUserIp}`,
    };

    const response = await axios.post(`${api.tokenURL}`, data);

    msg = "Token Generated";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.logout = async (req, res) => {
  try {
    const data = {
      ClientId: `${tokenGenerator.ClientId}`,
      EndUserIp: `${req.body.EndUserIp}`,
      TokenAgencyId: `${tokenGenerator.TokenAgencyId}`,
      TokenMemberId: `${tokenGenerator.TokenMemberId}`,
      TokenId: `${req.body.TokenId}`,
    };

    const response = await axios.post(`${api.logoutURL}`, data);

    msg = "Token Generated";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchOneWay = async (req, res) => {
  try {
    let data = {
      ...req.body,
      JourneyType: "1",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);
    msg = "Flight Searched Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//easeMyTrip------------------START

exports.onewaySearch = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.emiflightSearch}`, data);

    msg = "Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//two way Search ---------------//

exports.twowaySearch = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.emiflightSearch}`, data);

    msg = " Two way Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

// Emt flight Discount------------//

exports.emtflightDiscount = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.emiflightSearch}`, data);

    msg = "  Flight Discount Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//--------------EMT---------END-----------//

exports.searchReturn = async (req, res) => {
  try {
    const data = {
      ...req.body,
      JourneyType: "2",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);

    msg = "Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchMultiCity = async (req, res) => {
  try {
    const data = {
      ...req.body,
      JourneyType: "3",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);

    msg = "Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchAdvance = async (req, res) => {
  try {
    const data = {
      ...req.body,
      JourneyType: "4",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);

    msg = "Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.searchSpecialReturn = async (req, res) => {
  try {
    const data = {
      ...req.body,
      JourneyType: "2",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);

    msg = "Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.fareRule = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightFareRuleURL}`, data);

    msg = "Fare Rule Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.fareQuote = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightFareQuoteURL}`, data);

    msg = "Fare Rule Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.bookingFLight = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightBookingURL}`, data);

    msg = "Booking Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//EMT flight booking -------------START---------------------

exports.emtbookingFLightRequest = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.emtflightBookingURL}`, data);

    msg = "Booking Flight Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getSeatMap = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.getSeatMapURL}`, data);

    msg = " getSeatMap Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.emtFlightPrice = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.airRePriceRQURL}`, data);

    msg = " flight price  Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.emtFlightBook = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.bookFlight}`, data);

    msg = " flight price  Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

//-------------------END--------------------------

exports.getTicketLCC = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightTicketLCCURL}`, data);

    msg = "Get Ticket LCC Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getTicketNonLCCpass = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightTicketNonLCCURL}`, data);

    msg = "Ticket Non LCC Passport Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getTicketNonLCC = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightTicketNonLCCURL}`, data);

    msg = "Ticket Non LCC Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.flightBookingDetailsURL}`, data);

    msg = "Booking Searched Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getReleasePNRRequest = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.releasePNRRequestURL}`, data);

    msg = "Get Release PNR Request Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getSendChangeRequest = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.getChangeRequestStatusURL}`, data);

    msg = "Get Send Change Request Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getChangeRequestStatus = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.getChangeRequestStatusURL}`, data);

    msg = "Get Change Request Status Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.getGetCancellationCharges = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const response = await axios.post(`${api.getCancellationChargesURL}`, data);

    msg = "Get Cancellation Charges Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

// exports.combinedApi = async (req, res) => {
//   try {
//     const data = {
//       ...req.body,
//     };
//     const token = "QVBJQWNjZXNzQVBJQDEyMw==";

//     const response1 = await axios.post(
//       "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
//       {
//         EndUserIp: "103.154.247.235",
//         TokenId: "c8452e79-51ef-42f8-a140-57904bb0eba5",
//         AdultCount: "1",
//         ChildCount: "1",
//         InfantCount: "1",
//         DirectFlight: "false",
//         OneStopFlight: "false",
//         JourneyType: "1",
//         PreferredAirlines: null,
//         Segments: [
//           {
//             Origin: "DEL",
//             Destination: "BOM",
//             FlightCabinClass: "1",
//             PreferredDepartureTime: "2023-09-14T00: 00: 00",
//             PreferredArrivalTime: "2023-09-14T00: 00: 00",
//           },
//         ],
//         Sources: null,
//       }
//     );

//     // Make requests to the second API
//     const response2 = await axios.post(
//       "https://stagingapi.easemytrip.com/Flight.svc/json/FlightSearch",
// {
//   Adults: 1,
//   Authentication: {
//     Password: "EMT@uytrFYTREt",
//     UserName: "EMTB2B",
//     IpAddress: "10.10.10.10",
//   },
//   Cabin: 0,
//   Childs: 1,
//   FlightSearchDetails: [
//     {
//       BeginDate: "2023-10-02",
//       Origin: "DEL",
//       Destination: "BOM",
//     },
//   ],
//   Infants: 1,
//   TraceId: "EMTB2B73fd0ca9fcf4436cbe8b59fded57e616",
//   TripType: 0,
// }
//     );

//     const response3 = await axios.post(
//       "https://utilitywebapi.bisplindia.in/api/Flight/SearchFlight",
//       {
//         DATA: {
//           AdultCount: "1",
//           ChildCount: "0",
//           DirectFlight: "false",
//           EndUserIp: "103.154.247.235",
//           GroupID: "0",
//           InfantCount: "0",
//           JourneyType: "1",
//           OneStopFlight: "false",
//           PreferredAirlines: "",
//           Segments: [
//             {
//               Destination: "DEL",
//               DestinationFull: "DEL (Delhi)",
//               FlightCabinClass: "1",
//               Origin: "JAI",
//               OriginFull: "JAI (Jaipur)",
//               PreferredArrivalTime: "2023-09-27",
//               PreferredDepartureTime: "2023-09-27",
//             },
//           ],
//           Sources: [
//             "GDS",
//             "FZ",
//             "G8",
//             "SG",
//             "G9",
//             "AK",
//             "IX",
//             "LB",
//             "TR",
//             "6E",
//             "B3",
//             "OP",
//             "2T",
//             "W5",
//             "LV",
//             "TZ",
//             "ZO",
//             "PY",
//           ],
//         },

//         HEADER: {
//           Password: "123456",
//           SponsorFormNo: "1003",
//           UserName: "Demo2",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//       {
//         headers: {
//           token: `${token}`,
//         },
//       }
//     );

//     // Combine the responses as needed
//     const mergedData = {
//       skyTrailsApi: response1.data,
//       emtApi: response2.data,
//       utilityData: response3.data,
//     };

//     msg = "Flight Searched Successfully!";
//     // Send the merged data as a response
//     actionCompleteResponse(res, mergedData, msg);
//     // res.json(mergedData);
//     // Extract "Results" array from the first API response
//     //const resultsArray = mergedData.skyTrailsApi;

//     // Extract "Journeys" array from the second API response
//     //const journeysArray = mergedData.emtApi;

//     //var newdata = [...resultsArray, ...journeysArray];

//     console.log("============================================");
//     const bothapiFareValue = [
//       response1?.data?.Response?.Results[0][0]?.Fare?.BaseFare,
//       response2?.data?.Journeys[0]?.Segments[0]?.Fare?.BasicFare,
//     ];
//     const utilityData = JSON.parse(response3?.data?.RESP_VALUE);
//     // console.log(bothapiFareValue);
//     const mergeApiArray = [
//       response1?.data?.Response?.Results[0][0],
//       response1?.data?.Response?.Results[0][1],
//       response1?.data?.Response?.Results[0][2],
//       response2?.data?.Journeys[0]?.Segments[0],
//       response2?.data?.Journeys[0]?.Segments[1],
//       response2?.data?.Journeys[0]?.Segments[2],
//       utilityData[0],
//       utilityData[1],
//       utilityData[2],
//     ];

//     // Now you can work with the array of objects
//     //console.log(utilityData[0]?.grossAmount);

//     // console.log(mergeApiArray);
//     const customSort = (a, b) => {
//       const aBaseFare1 = a?.Fare?.BaseFare || 0;
//       const bBaseFare1 = b?.Fare?.BaseFare || 0;

//       const aBaseFare2 = a?.Fare?.BasicFare || 0;
//       const bBaseFare2 = b?.Fare?.BasicFare || 0;
//       const aGrossAmount = a?.grossAmount || 0;
//       const bGrossAmount = b?.grossAmount || 0;

//       return (
//         aBaseFare1 - bBaseFare1 ||
//         aBaseFare2 - bBaseFare2 ||
//         aGrossAmount - bGrossAmount
//       );
//     };

//     // Sort the mergeApiArray using the custom sorting function
//     mergeApiArray.sort(customSort);

//     console.log(mergeApiArray);

//     // console.log(response2?.data?.Journeys[0]?.Segments[0]?.Fare.BasicFare);
//   } catch (err) {
//     console.log(err);
//     sendActionFailedResponse(res, {}, err.message);
//   }
// };

exports.combinedApi = async (req, res) => {
  try {
    // Destructure data from the request body
    const { travoltPayload, emtPayload } = req.body;
    const token = "QVBJQWNjZXNzQVBJQDEyMw==";

    // Function to handle API requests and return data
    const makeRequest = async (url, data) => {
      const response = await axios.post(url, data);
      return response.data;
    };

    // Define URLs for the three APIs
    const api1Url =
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search";
    const api2Url =
      "https://stagingapi.easemytrip.com/Flight.svc/json/FlightSearch";

    // Create promises for each API request
    const api1Promise = makeRequest(api1Url, travoltPayload);
    const api2Promise = makeRequest(api2Url, emtPayload);

    // Wait for all API requests to complete
    const [response1, response2] = await Promise.all([
      api1Promise,
      api2Promise,
    ]);

    msg = "Flight Searched Successfully!";
    // Combine the responses as needed
    const mergedData = {
      skyTrailsApi: response1,
      emtApi: response2,
    };

    // const bothapiFareValue = [
    //   response1?.data?.Response?.Results[0][0]?.Fare?.BaseFare,
    //   response2?.data?.Journeys[0]?.Segments[0]?.Fare?.BasicFare,
    // ];
    // console.log(mergedData);
    // const mergeApiArray = [
    //   response1?.Response?.Results[0][0],
    //   response1?.Response?.Results[0][1],
    //   response1?.Response?.Results[0][2],
    //   response2?.Journeys[0]?.Segments[0],
    //   response2?.Journeys[0]?.Segments[1],
    //   response2?.Journeys[0]?.Segments[2],
    // ];

    let mergeApiArray = [
      ...(response1?.Response?.Results[0] || []),
      ...(response2?.Journeys[0]?.Segments || []),
    ];

    console.log("hello");

    // sort data according to BaseFare or Basic Fare

    // Sort the mergeApiArray using the custom sorting function

    const uniqueData = [];

    const getSelectedData = (currObj) => {
      let currFlightName;
      let currFlightDepartureTime;
      let price;

      if (currObj.BondType) {
        currFlightName = currObj.Bonds[0].Legs[0].FlightName;
        currFlightDepartureTime = currObj.Bonds[0].Legs[0].DepartureTime;
        price = currObj.Fare.BasicFare;
      } else {
        currFlightName = currObj.Segments[0][0].Airline.AirlineName;
        const dateTimeString = currObj.Segments[0][0].Origin.DepTime;
        const dateTime = new Date(dateTimeString);
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        currFlightDepartureTime = `${hours}:${minutes < 10 ? "0" : ""
          }${minutes}`;
        price = currObj.Fare.BaseFare;
      }

      return { currFlightName, currFlightDepartureTime, price };
    };

    for (let i = 0; i < mergeApiArray.length; i++) {
      let currObj = mergeApiArray[i];
      if (!currObj.BondType && !currObj.Fare) {
        continue;
      }
      let { currFlightName, currFlightDepartureTime, price } =
        getSelectedData(currObj);

      for (let j = i + 1; j < mergeApiArray.length; j++) {
        if (mergeApiArray[j] === -1) continue;
        const {
          currFlightName: currFlightName1,
          currFlightDepartureTime: currFlightDepartureTime1,
          price: price1,
        } = getSelectedData(mergeApiArray[j]);

        if (
          currFlightName === currFlightName1 &&
          currFlightDepartureTime === currFlightDepartureTime1
        ) {
          if (price > price1) {
            currObj = mergeApiArray[j];
            currFlightName = currFlightName1;
            currFlightDepartureTime = currFlightDepartureTime1;
            price = price1;
          }
          mergeApiArray[j] = -1;
        }
      }
      uniqueData.push(currObj);
    }

    const customSort = (a, b) => {
      const aFare = a.Fare.BasicFare || a.Fare.BaseFare;
      const bFare = b.Fare.BasicFare || b.Fare.BaseFare;
      return aFare - bFare;
    };

    uniqueData.sort(customSort);
    // let TraceId = {"TraceId":response1?.Response?.TraceId};
    // let modifiedData = [TraceId, ...uniqueData];
    actionCompleteResponse(res, uniqueData, msg);

    // console.log(mergeApiArray);
    //skyTrails flightNumber
    // console.log("tbo flightNumber",response1?.Response?.Results[0][0]?.Segments[0][0]?.Airline?.FlightNumber);
    // const tboFlightNo =
    //   response1?.Response?.Results[0][0]?.Segments[0][0]?.Airline?.FlightNumber;
    // const emtFlightNo =
    //   response2?.Journeys[0]?.Segments[0]?.Bonds[0]?.Legs[0]?.FlightNumber;
    //tbo depr time
    // console.log(
    //   "tbo deprt time",
    //   response1?.Response?.Results[0][0]?.Segments[0][0]?.Origin?.DepTime
    // );
    // const datetimeString =
    //   response1?.Response?.Results[0][0]?.Segments[0][0]?.Origin?.DepTime;
    // const dateObject = new Date(datetimeString);

    // Get hours and minutes
    // const hours = dateObject.getHours();
    // const minutes = dateObject.getMinutes();

    // Format as "hh:mm"
    // const tboFlightDepTime = `${hours.toString().padStart(2, "0")}:${minutes
    //   .toString()
    //   .padStart(2, "0")}`;
    //  console.log(tboFlightDepTime);
    // console.log(
    //   "emt deprt time",
    //   response2?.Journeys[0]?.Segments[0]?.Bonds[0]?.Legs[0]?.DepartureTime
    // );
    // const emtFlightDepTime =
    //   response2?.Journeys[0]?.Segments[0]?.Bonds[0]?.Legs[0]?.DepartureTime;
    //   console.log(emtFlightDepTime);
    //emt flightNumber
    // console.log('emt flight number',response2?.Journeys[0]?.Segments[0]?.Bonds[0]?.Legs[0]?.FlightNumber);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.sortedData = async (req, res) => {
  try {
    const data = {
      ...req.body,
      JourneyType: "1",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);

    msg = "Flight Searched Successfully!";
    const results = response?.data?.Response?.Results[0];

    const keysToCopyInFare = ["Currency", "BaseFare", "Tax", "Discount"];
    const keysToCopyInSegment = ["Airline", "Duration"];
    const Results = results.map((result) => {
      const { IsHoldAllowedWithSSR, Segments, ResultIndex, IsLCC } = result;
      const formattedSegments = Segments.flat().map((segment) => {
        const copiedSegment = {};
        keysToCopyInSegment.forEach((key) => {
          if (segment[key]) {
            copiedSegment[key] = segment[key];
          }
        });
        return copiedSegment;
      });

      const { Currency, BaseFare, Tax, Discount } = result.Fare;
      const copiedFare = { Currency, BaseFare, Tax, Discount }; // Extract specific keys from Fare object

      const copiedObject = {
        IsHoldAllowedWithSSR,
        IsLCC,
        Fare: copiedFare,
        Segments: formattedSegments,
        ResultIndex,
      };
      return copiedObject;
    });
    const TraceId = response?.data?.Response?.TraceId;
    console.log(TraceId);
    const Origin = response?.data?.Response?.Origin;
    const Destination = response?.data?.Response?.Destination;

    const sortedflightData = { TraceId, Origin, Destination, Results };

    actionCompleteResponse(res, sortedflightData, msg);
  } catch (error) {
    console.log(error);
    sendActionFailedResponse(res, {}, error.message);
  }
};

//===========================================
//========== Return flight Sort ===========
//===========================================

exports.returnFlightSort = async (req, res) => {
  try {
    const data = {
      ...req.body,
      JourneyType: "2",
    };

    const response = await axios.post(`${api.flightSearchURL}`, data);

    msg = "Flight Searched Successfully!";

    const sortlist = response.data.Response.Results;
    const combinedResults = sortlist.reduce((acc, result) => {
      if (result[0].Segments[0].length === 1) {
        console.log(result[0].Segments[0].length, 'one')
        acc[0].push(result);
      } else if (result[0].Segments[0].length === 2) {
        console.log(result[0].Segments[0].length, "two")
        acc[1].push(result);
      }
      return acc;
    }, [[], []]);

    const filteBysegment = combinedResults;
    const flattenedArray = filteBysegment.flat(1);
    function sortByPublishedFareAscending(data) {
      return data.map(innerArray => {
        return innerArray.sort((a, b) => a.Fare.PublishedFare - b.Fare.PublishedFare);
      });
    }

    // Call the sorting function
    const sortedDataAscending = sortByPublishedFareAscending(flattenedArray);

    actionCompleteResponse(res, sortedDataAscending, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};








//**************************************COMMON SERVICES************************************************/

const addImageToResults = (results) => {
  const imagesPath = '../utilities/FlightImages/';
console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>REsults",results);
  results.forEach(result => {
    result.Segments.forEach(segment => {
      segment.forEach(subSegment => {
        const airlineCode = subSegment.Airline.AirlineCode;
console.log("-========================22222222222222222",subSegment)
        // Check if the image for the airline code exists
        const imagePath = imagesPath + airlineCode + '.png';
        console.log("imagePath-----------",imagePath)
console.log("=-==============================>??????",imagesPath.includes(imagePath))
        // If the image exists, add it to the response
        if (imagesPath.includes(imagePath)) {
          console.log("imagePath: "+imagePath);
          subSegment.Airline.image = imagePath;
          console.log("subSegment.Airline.image:::::::::::::",subSegment.Airline.image)
        } else {
          // If the image doesn't exist, provide a default image path
          subSegment.Airline.image = '../utilities/FlightImages/0B.png';
        }
      });
    });
  });

  return results;
};

// const addImageToResults = (result) => {
//   // const flightImageMap = 
//   const images = `../utilities/FlightImages`
//   console.log("Images: ", images);
//   const segment = result[0].Segments[0];
//   console.log("=0=0=====================", segment);
//   // for (let index of result) {
//   //   const data1 = addImageToResults(dat);
//   //           if (data1) {
//   //               index._doc.image = data1
//   //               console.log("restaurantData=============",index._doc.image);
//   //           }
//   //         }
//   segment.forEach(subSegment => {
//     const airLineCode = segment[0].Airline.AirlineCode;
//     if (images.hasOwnProperty(airLineCode)) {
//       subSegment[0].Airline.image = images[airLineCode];
//       console.log("IF============================>>>>>>>>>>>",subSegment[0].Airline.image);
//     } else {
//       subSegment[0].Airline.images = "../utilities/FlightImages/0B.png"
//       console.log("Else============================>>>>>>>>>>>",subSegment[0].Airline.image);
//     }
//   })
// console.log(result);
//   return result;
// };