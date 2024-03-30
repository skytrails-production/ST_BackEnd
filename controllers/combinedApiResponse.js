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
const uuid = uuidv4();

const messageId = uuid;
const uniqueId = uuidv4();
// Function to generate random bytes
function generateRandomBytes(length) {
  return crypto.randomBytes(length);
}
const responseMessage = require("../utilities/responses");
const statusCode = require("../utilities/responceCode");
const moment = require("moment");
const { values } = require("pdf-lib");
const streamLength = 8;
const randomBytes = generateRandomBytes(streamLength);

// Function to convert bytes to base64
function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}
const commonUrl=require('../common/const')
const NONCE = bytesToBase64(randomBytes);
const TIMESTAMP = new Date().toISOString(); // Current timestamp in seconds
const CLEARPASSWORD = process.env.AMADAPASS;

const buffer = Buffer.concat([
  Buffer.from(NONCE, "base64"),
  Buffer.from(TIMESTAMP),
  nodeCrypto.createHash("sha1").update(Buffer.from(CLEARPASSWORD)).digest(),
]);

// Compute SHA-1 hash of the concatenated buffer and encode in base64
const hashedPassword = nodeCrypto
  .createHash("sha1")
  .update(buffer)
  .digest("base64");

//***********************************Combine response api******************************************/
async function xmlToJson(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

exports.combinedAPI1 = async (req, res, next) => {
  try {
    const data = req.body;
    const api1Url =
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search";
    const result = {};
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const response = await axios.post(api1Url, data);
    result.tvoResponse = response.data;
    const tvoArray = response.data.Response.Results[0];
    const tvo = [];
    for (const tvoflightNo of tvoArray) {
      const tvoObject = {};
      tvoObject.flightNo = tvoflightNo.Segments[0][0].Airline.FlightNumber;
      tvoObject.AirlineName = tvoflightNo.Segments[0][0].Airline.AirlineName;
      tvoObject.AirportName =
        tvoflightNo.Segments[0][0].Origin.Airport.AirportName;
      const depTime = tvoflightNo.Segments[0][0].Origin.DepTime;
      tvoObject.depDate = moment(depTime).format("YYYY-MM-DD");
      tvoObject.depTime = moment(depTime).format("HH:mm");
      tvoObject.ArrAirportName =
        tvoflightNo.Segments[0][0].Destination.Airport.AirportName;
      const arrTime = tvoflightNo.Segments[0][0].Destination.ArrTime;
      tvoObject.arrDate = moment(arrTime).format("YYYY-MM-DD");
      tvoObject.arrTime = moment(arrTime).format("HH:mm");
      tvo.push(tvoObject);
    }
    msg = "Flight Searched Successfully!";
    let amadeusData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
    xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
    xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
    xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
    xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
            <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FMPTBQ_23_4_1A</add:Action>
            <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
            <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
                <link:Consumer>
                    <link:UniqueID>${uniqueId}</link:UniqueID>
                </link:Consumer>
            </link:TransactionFlowLink>
            <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">
                    <oas:Username>WSSP0THE</oas:Username>
                    <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${NONCE}</oas:Nonce>
                    <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${hashedPassword}</oas:Password>
                    <oas1:Created>${TIMESTAMP}</oas1:Created>
                </oas:UsernameToken>
            </oas:Security>
            <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">
                <UserID POS_Type="1" PseudoCityCode="DELVS38UE" AgentDutyCode="SU" RequestorType="U" />
            </AMA_SecurityHostedUser>
        </soap:Header>        ​
        <soapenv:Body>
        <Fare_MasterPricerTravelBoardSearch xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance&quot; xmlns:xsd="http://www.w3.org/2001/XMLSchema&quot;>
        <numberOfUnit xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
            <unitNumberDetail>
                <numberOfUnits>1</numberOfUnits>
                <typeOfUnit>PX</typeOfUnit>
            </unitNumberDetail>
            <unitNumberDetail>
                <numberOfUnits>250</numberOfUnits>
                <typeOfUnit>RC</typeOfUnit>
            </unitNumberDetail>
        </numberOfUnit>
        <paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
            <ptc>ADT</ptc>
            <traveller>
                <ref>${req.body.px}</ref>
            </traveller>
        </paxReference>
        <fareOptions xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
            <pricingTickInfo>
                <pricingTicketing>
                    <priceType>RP</priceType>
                    <priceType>ET</priceType>
                    <priceType>RU</priceType>
                    <priceType>TAC</priceType>
                </pricingTicketing>
            </pricingTickInfo>
        </fareOptions>
        <itinerary xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
            <requestedSegmentRef>
                <segRef>1</segRef>
            </requestedSegmentRef>
            <departureLocalization>
                <departurePoint>
                    <locationId>${req.body.from}</locationId>
                </departurePoint>
            </departureLocalization>
            <arrivalLocalization>
                <arrivalPointDetails>
                    <locationId>${req.body.to}</locationId>
                </arrivalPointDetails>
            </arrivalLocalization>
            <timeDetails>
                <firstDateTimeDetail>
                    <date>${req.body.date}</date>
                </firstDateTimeDetail>
            </timeDetails>
        </itinerary>
    </Fare_MasterPricerTravelBoardSearch>
        </soapenv:Body>
    </soapenv:Envelope>`;
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const amadeusResponse = await axios.post(url, amadeusData, { headers });
    const jsonResult = await xmlToJson(amadeusResponse.data);
    const obj = jsonResult["soapenv:Envelope"]["soapenv:Body"]["Fare_MasterPricerTravelBoardSearchReply"];
    const recommendationObject = obj.recommendation;
    const segNumber = recommendationObject.map((item, index) => {
      return item.segmentFlightRef.length || 1;
    });
    const flattenedArray = segNumber.flatMap((item, index) => {
      const modifiedArray = [];
      for (let i = 0; i < item; i++) {
        modifiedArray.push({
          ...obj.flightIndex.groupOfFlights[i],
          ...recommendationObject[index].paxFareProduct,
        });
      }
      return modifiedArray;
    });
    const amadeus = [];
    for (const flightNo of flattenedArray) {
      const amadeus1 = {};
      amadeus1.flightNumber =
        flightNo.flightDetails.flightInformation.flightOrtrainNumber;
      amadeus1.AirlineName =
        flightNo.flightDetails.flightInformation.flightOrtrainNumber;
      const depDate =
        flightNo.flightDetails.flightInformation.productDateTime
          .dateOfDeparture;
      amadeus1.depDate = moment(depDate, "DDMMYYYY").format("YYYY-MM-DD");
      const depTime =
        flightNo.flightDetails.flightInformation.productDateTime
          .timeOfDeparture;
      amadeus1.depTime = moment(depTime, "Hmm").format("HH:mm");
      const arrDate =
        flightNo.flightDetails.flightInformation.productDateTime.dateOfArrival;
      amadeus1.arrDate = moment(arrDate, "DDMMYYYY").format("YYYY-MM-DD");
      const arrTime =
        flightNo.flightDetails.flightInformation.productDateTime.timeOfArrival;
      amadeus1.arrTime = moment(arrTime, "Hmm").format("HH:mm");
      amadeus.push(amadeus1);
    }

    console.log("object============", tvoArray.length);
    result.object = amadeus;
    result.amadeusResponse = flattenedArray;
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get response", error);
    return next(error);
  }
};

exports.combinedAPI = async (req, res, next) => {
  try {
    const data = req.body;
    const api1Url =
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search";
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
     // Fetching data from the first API
     const [response, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      axios.post(url, generateAmadeusRequest(data), {
        headers
      }),
    ]);
    // Fetching data from the first API
    const tvoArray = response.data.Response.Results[0];
    // Transforming data from the first API
    var tvo = [];
    console.log("tvoArray.length================",tvoArray.length);
    if (tvoArray.length > 0) {
      tvo = tvoArray.map((tvoflightNo) => ({
        flightNo: tvoflightNo.Segments[0][0].Airline.FlightNumber,
        AirlineName: tvoflightNo.Segments[0][0].Airline.AirlineName,
        AirportName: tvoflightNo.Segments[0][0].Origin.Airport.AirportName,
        depDate: moment(tvoflightNo.Segments[0][0].Origin.DepTime).format(
          "YYYY-MM-DD"
        ),
        depTime: moment(tvoflightNo.Segments[0][0].Origin.DepTime).format(
          "HH:mm"
        ),
        ArrAirportName:
          tvoflightNo.Segments[0][0].Destination.Airport.AirportName,
        arrDate: moment(tvoflightNo.Segments[0][0].Destination.ArrTime).format(
          "YYYY-MM-DD"
        ),
        arrTime: moment(tvoflightNo.Segments[0][0].Destination.ArrTime).format(
          "HH:mm"
        ),
        fare: tvoflightNo.Fare.PublishedFare,
        AirlineCode: tvoflightNo.Segments[0][0].Airline.AirlineCode,
      }));
    }
    console.log("tvo==================",tvo.length);
    // Processing response from the second API
    const jsonResult = await xmlToJson(amadeusResponse.data);
    const obj =
      jsonResult["soapenv:Envelope"]["soapenv:Body"][
      "Fare_MasterPricerTravelBoardSearchReply"
      ];
    const recommendationObject = obj.recommendation;
    const segNumber = recommendationObject.map((item, index) => {
      return item.segmentFlightRef.length || 1;
    });
    const flattenedArray = [];
    for (let i = 0; i < segNumber.length; i++) {
      const modifiedArray = [];
      for (let j = 0; j < segNumber[i]; j++) {
        modifiedArray.push({
          ...obj.flightIndex.groupOfFlights[j],
          ...recommendationObject[i].paxFareProduct,
        });
      }
      flattenedArray.push(...modifiedArray);
    }
    var amadeus = [];
    console.log("flattenedArray.length ====================",flattenedArray.length );
    if (flattenedArray.length > 0) {
      amadeus = flattenedArray.map((flightNo) => ({
        flightNo:
          flightNo.flightDetails.flightInformation.flightOrtrainNumber,
        depDate: moment(
          flightNo.flightDetails.flightInformation.productDateTime
            .dateOfDeparture,
          "DDMMYYYY"
        ).format("YYYY-MM-DD"),
        depTime: moment(
          flightNo.flightDetails.flightInformation.productDateTime
            .timeOfDeparture,
          "Hmm"
        ).format("HH:mm"),
        arrDate: moment(
          flightNo.flightDetails.flightInformation.productDateTime
            .dateOfArrival,
          "DDMMYYYY"
        ).format("YYYY-MM-DD"),
        arrTime: moment(
          flightNo.flightDetails.flightInformation.productDateTime
            .timeOfArrival,
          "Hmm"
        ).format("HH:mm"),
        fare: flightNo.paxFareDetail.totalFareAmount,
        AirlineCode:
          flightNo.flightDetails.flightInformation.companyId.marketingCarrier,
      }));
    }
    console.log("amadeus==================",amadeus.length);
    const completeResponseCombinedArray = tvoArray.concat(flattenedArray);
    // Filtering and comparing prices
    const finalResult = [];
    // Iterate over each TVO flight
    for (const tvoFlight of tvo) {
      // Find matching Amadeus flight based on flight details
      const matchingAmadeusFlights = amadeus.filter(
        (amadeusFlight) =>
          tvoFlight.flightNo === amadeusFlight.flightNumber &&
          tvoFlight.depDate === amadeusFlight.depDate &&
          tvoFlight.arrDate === amadeusFlight.arrDate &&
          tvoFlight.depTime === amadeusFlight.depTime &&
          tvoFlight.arrTime === amadeusFlight.arrTime
      );
      console.log("matchingAmadeusFlights.length >==========",matchingAmadeusFlights.length);
      // If matching Amadeus flights are found
      if (matchingAmadeusFlights.length > 0) {
        // Find the Amadeus flight with the lowest fare
        const lowestFareAmadeusFlight = matchingAmadeusFlights.reduce(
          (prev, current) =>
            parseFloat(prev.fare) < parseFloat(current.fare) ? prev : current
        );
        // Compare fares and push the appropriate flight into the final result array
        if (
          parseFloat(tvoFlight.fare) < parseFloat(lowestFareAmadeusFlight.fare)
        ) {
          console.log("tvoFlight===============",tvoFlight);

          finalResult.push(tvoFlight);
        }else {
          console.log("lowestFareAmadeusFlight.fare===============",lowestFareAmadeusFlight.fare);

          // Amadeus flight fare is lower, push it into the finalResult array
          finalResult.push(lowestFareAmadeusFlight);
        }
      }else {
        // No matching Amadeus flights found, push TVO flight into the finalResult array
        finalResult.push(tvoFlight);
      }
    }
//     // Iterate over each Amadeus flight
//     for (const amadeusFlight of amadeus) {
//       // Find matching TVO flight based on flight details
//       const matchingTvoFlights = tvo.filter(
//         (tvoFlight) =>
//           tvoFlight.flightNo === amadeusFlight.flightNumber &&
//           tvoFlight.depDate === amadeusFlight.depDate &&
//           tvoFlight.arrDate === amadeusFlight.arrDate &&
//           tvoFlight.depTime === amadeusFlight.depTime &&
//           tvoFlight.arrTime === amadeusFlight.arrTime
//       );

//       if (matchingTvoFlights.length === 0) {
//         finalResult.push(amadeusFlight);
//       } else {
//         // Find the TVO flight with the lowest fare among matching flights
// let lowestFareAmadeusFlight = matchingTvoFlights.reduce(
//   (prev, current) =>
//     parseFloat(prev.fare) < parseFloat(current.fare) ? prev : current
// );

//         matchingTvoFlights.forEach((matchingTvoFlight) => {
//           if (
//             parseFloat(matchingTvoFlight.fare) <
//             parseFloat(lowestFareAmadeusFlight.fare)
//           ) {
//             lowestFareAmadeusFlight = matchingTvoFlight;
//           }
//         });
//         finalResult.push(lowestFareAmadeusFlight);
//       }
//     }
    let matchingFlights = [];
// Iterate over the data array
completeResponseCombinedArray.forEach(obj => {
  if (obj.Segments) {
    finalResult.forEach(value => {
      if (
        value.flightNo == obj.Segments[0][0].Airline.FlightNumber &&
        value.AirlineName == obj.Segments[0][0].Airline.AirlineName &&
        value.AirportName == obj.Segments[0][0].Origin.Airport.AirportName &&
        value.ArrAirportName == obj.Segments[0][0].Destination.Airport.AirportName &&
        value.AirlineCode == obj.Segments[0][0].Airline.AirlineCode &&
        value.fare == obj.Fare.PublishedFare &&
        new Date(value.depDate + "T" + value.depTime).getTime() == new Date(obj.Segments[0][0].Origin.DepTime).getTime() &&
        new Date(value.arrDate + "T" + value.arrTime).getTime() == new Date(obj.Segments[0][0].Destination.ArrTime).getTime()
      ) {
        // Perform some action when the condition is true
        // For example, update properties of value based on obj
        matchingFlights.push(obj);
      }
    });
  } else if (obj.flightDetails) {
    finalResult.forEach(value => {
      if (value.flightNo == obj.flightDetails.flightInformation.flightOrtrainNumber && value.depDate==moment(
          obj.flightDetails.flightInformation.productDateTime
            .dateOfDeparture,
          "DDMMYYYY"
        ).format("YYYY-MM-DD")&&value.depTime==moment(
          obj.flightDetails.flightInformation.productDateTime
            .timeOfDeparture,
          "Hmm"
        ).format("HH:mm")&&value.arrDate==moment(
          obj.flightDetails.flightInformation.productDateTime
            .dateOfArrival,
          "DDMMYYYY"
        ).format("YYYY-MM-DD")&&value.arrTime==moment(
          obj.flightDetails.flightInformation.productDateTime
            .timeOfArrival,
          "Hmm"
        ).format("HH:mm")&&value.AirlineCode == obj.flightDetails.flightInformation.companyId.marketingCarrier &&value.fare ==obj.paxFareDetail.totalFareAmount ) 
        {
          matchingFlights.push(obj);
      }
    });
  }
  
});
console.log("matchingFlights=================",matchingFlights.length);
console.log("finalresultlength",finalResult.length);

// Now matchingFlights array contains objects with matching flight numbers
// console.log(matchingFlights);

    // Sending response
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: finalResult,
      // data: completeResponseCombinedArray,
      matchingFlights:matchingFlights
    });
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
};



exports.combineTVOAMADEUS=async(req,res,next)=>{
  try {
    const data = req.body;
    data.formattedDate =await moment(data.Segments[0].PreferredDepartureTime,'DD MMM, YY').format('DDMMYY'); // Format the date as "DDMMYY"
    const api1Url =commonUrl.api.flightSearchURL;
    
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const flattenedArray = [];
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
      const [tvoResponse, amadeusResponse] = await Promise.all([
        axios.post(api1Url, data),
        axios.post(url, generateAmadeusRequest(data), { headers }),
      ]);
      var tvoArray=[]
      if(tvoResponse.data.Response.ResponseStatus===1){
         tvoArray = tvoResponse.data.Response.Results[0]
      }else{
        tvoArray =  [];
      }
    let jsonResult={}
    if(amadeusResponse.status==200){
       jsonResult = await xmlToJson(amadeusResponse.data);
       const obj =
      jsonResult["soapenv:Envelope"]["soapenv:Body"][
      "Fare_MasterPricerTravelBoardSearchReply"
      ];
    const recommendationObject =await obj.recommendation;
    const segNumber = recommendationObject.map((item, index) => {
      return item.segmentFlightRef.length || 1;
    });
    
    for (let i = 0; i < segNumber.length; i++) {
      const modifiedArray = [];
      for (let j = 0; j < segNumber[i]; j++) {
        modifiedArray.push({
          ...obj.flightIndex.groupOfFlights[j],
          ...recommendationObject[i].paxFareProduct,
        });
      }
      flattenedArray.push(...modifiedArray);
    }
    
    }
    var finalResult=[];
    var selectedArray=[]
    if(tvoArray.length>0){
      selectedArray = await tvoArray.filter((value) => value.IsLCC === true);
      if(selectedArray.length>0){
        finalResult= await selectedArray.concat(flattenedArray);
     }else if(flattenedArray.length<=0){
       finalResult=[...tvoArray];
     }
    }else{
      finalResult= [...flattenedArray]
    }
    
 const length={flattenedArray:flattenedArray.length,tvoArray:tvoArray.length,finalResult:finalResult.length,selectedArray:selectedArray.length}
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: finalResult,
      amadeusResponse:flattenedArray,
length:length,
    });
  } catch (error) {
    console.error("Error while trying to get response", error);
    return next(error);
  }
}



// Function to generate Amadeus SOAP request
const generateAmadeusRequest = (data) => {
  // Generate the SOAP request XML based on the provided data
  const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
  xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
  xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
  xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
  xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
      <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
          <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FMPTBQ_23_4_1A</add:Action>
          <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
          <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
              <link:Consumer>
                  <link:UniqueID>${uniqueId}</link:UniqueID>
              </link:Consumer>
          </link:TransactionFlowLink>
          <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
              <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">
                  <oas:Username>WSSP0THE</oas:Username>
                  <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${NONCE}</oas:Nonce>
                  <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${hashedPassword}</oas:Password>
                  <oas1:Created>${TIMESTAMP}</oas1:Created>
              </oas:UsernameToken>
          </oas:Security>
          <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">
              <UserID POS_Type="1" PseudoCityCode="DELVS38UE" AgentDutyCode="SU" RequestorType="U" />
          </AMA_SecurityHostedUser>
      </soap:Header>        ​
      <soapenv:Body>
      <Fare_MasterPricerTravelBoardSearch xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance&quot; xmlns:xsd="http://www.w3.org/2001/XMLSchema&quot;>
      <numberOfUnit xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
          <unitNumberDetail>
              <numberOfUnits>1</numberOfUnits>
              <typeOfUnit>PX</typeOfUnit>
          </unitNumberDetail>
          <unitNumberDetail>
              <numberOfUnits>250</numberOfUnits>
              <typeOfUnit>RC</typeOfUnit>
          </unitNumberDetail>
      </numberOfUnit>
      <paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
          <ptc>ADT</ptc>
          <traveller>
              <ref>${data.px}</ref>
          </traveller>
      </paxReference>
      <fareOptions xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
          <pricingTickInfo>
              <pricingTicketing>
                  <priceType>RP</priceType>
                  <priceType>ET</priceType>
                  <priceType>RU</priceType>
                  <priceType>TAC</priceType>
              </pricingTicketing>
          </pricingTickInfo>
      </fareOptions>
      <itinerary xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A&quot;>
          <requestedSegmentRef>
              <segRef>1</segRef>
          </requestedSegmentRef>
          <departureLocalization>
              <departurePoint>
                  <locationId>${data.from}</locationId>
              </departurePoint>
          </departureLocalization>
          <arrivalLocalization>
              <arrivalPointDetails>
                  <locationId>${data.to}</locationId>
              </arrivalPointDetails>
          </arrivalLocalization>
          <timeDetails>
              <firstDateTimeDetail>
                  <date>${data.formattedDate}</date>
              </firstDateTimeDetail>
          </timeDetails>
      </itinerary>
  </Fare_MasterPricerTravelBoardSearch>
      </soapenv:Body>
  </soapenv:Envelope>`;

  return soapRequest;
};