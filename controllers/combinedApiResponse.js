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
  console.log(
    "Buffer.from(bytes).toStringbase64=",
    Buffer.from(bytes).toString("base64")
  );
  return Buffer.from(bytes).toString("base64");
}
const commonUrl = require("../common/const");
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
    data.formattedDate = await moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY"); // Format the date as "DDMMYY"
    const api1Url = commonUrl.api.flightSearchURL;

    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const flattenedArray = [];
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const [tvoResponse, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      axios
        .post(url, generateAmadeusRequest(data), { headers })
        .catch((error) => {
          console.error("Error in Amadeus API request:", error);
          return { data: {} };
        }),
    ]);
    var tvoArray = [];
    console.log(
      "tvoResponse.data.Response============",
      tvoResponse.data.Response
    );
    if (tvoResponse.data.Response.ResponseStatus === 1) {
      tvoArray = tvoResponse.data.Response.Results[0];
    } else {
      tvoArray = [];
    }
    console.log("amadeusResponse.data==============",amadeusResponse.data)
    let jsonResult = {};
    if (amadeusResponse.status == 200) {
      jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
        console.log("obj=================",obj)
      const recommendationObject = await obj.recommendation;
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
    const combinedArray = await tvoArray.concat(flattenedArray);

    if (tvoArray.length > 0) {
    } else if (flattenedArray.length <= 0) {
    }
  } catch (error) {
    console.log("error while trying to get response", error);
    return next(error);
  }
};

exports.combineTVOAMADEUSPriceSort = async (req, res, next) => { 
  try {
    const data = req.body;
    data.formattedDate =  moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY"); // Format the date as "DDMMYY"
    const api1Url = commonUrl.api.flightSearchURL;
    data.totalPassenger = parseInt(data.AdultCount) + parseInt(data.ChildCount);
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const flattenedArray = [];
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const [tvoResponse, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      axios
        .post(url, generateAmadeusRequest(data), { headers })
        .catch((error) => {
          console.error("Error in Amadeus API request:", error);
          return { data: {} };
        }),
    ]);
    var tvoArray = [];
    if (tvoResponse.data.Response.ResponseStatus === 1) {
      tvoArray = tvoResponse.data.Response.Results[0];
    } else {
      tvoArray = [];
    }
    let jsonResult = {};
    if (amadeusResponse.status == 200) {
      jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      const recommendationObject = await obj.recommendation;
      const segNumber = recommendationObject.map((item, index) => {
        return item.segmentFlightRef.length || 1;
      });

      for (let i = 0; i < segNumber.length; i++) {
        const modifiedArray = [];
        for (let j = 0; j < segNumber[i]; j++) {
          modifiedArray.push({
            ...obj.flightIndex.groupOfFlights[j],
            ...recommendationObject[i].paxFareProduct,
            ...obj.recommendation[i].recPriceInfo
          });
        }
        flattenedArray.push(...modifiedArray);
      }
    }
    var finalResult = [];
    var selectedArray = [];
    if (tvoArray.length > 0) {
      selectedArray = await tvoArray.filter((value) => value.IsLCC === true);
      if (selectedArray.length > 0) {

        finalResult = await flattenedArray.concat(selectedArray);
      } else if (flattenedArray.length <= 0) {
        finalResult = [...tvoArray];
      }else{
        finalResult = [...flattenedArray];
      }
    } else {
      finalResult = [...flattenedArray];
    }
    const length = {
      flattenedArray: flattenedArray.length,
      tvoArray: tvoArray.length,
      finalResult: finalResult.length,
      selectedArray: selectedArray.length,
    };
    for (const finalRep of finalResult) {
    let totalPublishFare = 0;
      if (finalRep.propFlightGrDetail) {
        // Iterate over each key and calculate totalAmount separately
        // for (const key of Object.keys(finalRep)) {
        //   const obj = finalRep[key];
        //   // if (obj.hasOwnProperty("paxFareDetail")) {
            const totalFare = parseInt(finalRep.monetaryDetail[0].amount);
            const totalTax = parseInt(finalRep.monetaryDetail[1].amount);
            const totalAmount = totalFare + totalTax;
            // finalRep.totalAmount = totalAmount;
            totalPublishFare += totalAmount;
        //   // }
        // }

        finalRep.TotalPublishFare = totalPublishFare;
      } else if (finalRep.Segments) {
        const totalPublishFare = finalRep.Fare.PublishedFare;
        finalRep.TotalPublishFare = totalPublishFare;
        
      }
    }
const sortedData=finalResult.sort((a,b)=> a.TotalPublishFare - b.TotalPublishFare);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      tvoTraceId: tvoResponse.data.Response.TraceId,
      result: sortedData,
      length: length,
    });
  } catch (error) {
    console.error("Error while trying to get response", error);
    return next(error);
  }
};

exports.combineTVOAMADEUS = async (req, res, next) => {
  try {
    const data = req.body;
    data.formattedDate = await moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY"); // Format the date as "DDMMYY"
    const api1Url = commonUrl.api.flightSearchURL;

    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const flattenedArray = [];
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const [tvoResponse, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      axios
        .post(url, generateAmadeusRequest(data), { headers })
        .catch((error) => {
          console.error("Error in Amadeus API request:", error);
          return { data: {} };
        }),
    ]);
    var tvoArray = [];
    console.log(
      "tvoResponse.data.Response============",
      tvoResponse.data.Response
    );
    if (tvoResponse.data.Response.ResponseStatus === 1) {
      tvoArray = tvoResponse.data.Response.Results[0];
    } else {
      tvoArray = [];
    }
    let jsonResult = {};
    if (amadeusResponse.status == 200) {
      jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      const recommendationObject = await obj.recommendation;
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
    var finalResult = [];
    var selectedArray = [];
    if (tvoArray.length > 0) {
      selectedArray = await tvoArray.filter((value) => value.IsLCC === true);
      if (selectedArray.length > 0) {
        finalResult = await selectedArray.concat(flattenedArray);
      } else if (flattenedArray.length <= 0) {
        finalResult = [...tvoArray];
      }
    } else {
      finalResult = [...flattenedArray];
    }

    const length = {
      flattenedArray: flattenedArray.length,
      tvoArray: tvoArray.length,
      finalResult: finalResult.length,
      selectedArray: selectedArray.length,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: finalResult,
      amadeusResponse: flattenedArray,
      length: length,
    });
  } catch (error) {
    console.error("Error while trying to get response", error);
    return next(error);
  }
};

exports.cobinedAsPerPrice = async (req, res, next) => {
  try {
    const data = req.body;
    data.formattedDate = moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY"); // Format the date as "DDMMYY"
    data.totalPassenger =
      parseInt(data.AdultCount) +
      parseInt(data.ChildCount) +
      parseInt(data.InfantCount);
    const api1Url = commonUrl.api.flightSearchURL;
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const finalResult = [];
    var flattenedArray = [];
    // Fetching data from the  API ************************************************
    const [tvoResponse, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      axios
        .post(url, generateAmadeusRequest(data), { headers })
        .catch((error) => {
          console.error("Error in Amadeus API request:", error);
          return { data: {} };
        }),
    ]);
    var tvoArray =
      tvoResponse.data.Response.ResponseStatus === 1
        ? tvoResponse.data.Response.Results[0]
        : [];

    let jsonResult = {};
    if (amadeusResponse.status == 200) {
      jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      console.log("obj==============", obj.errorMessage);
      const recommendationObject = await obj.recommendation;
      var segNumber = [];
      // if(recommendationObject.length>0){
      segNumber = recommendationObject.map((item, index) => {
        return item.segmentFlightRef.length || 1;
      });
      // }
      console.log("segNumber===========", segNumber.length);

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
    // Keep track of added objects during price comparison
    const addedObjects = new Set();
    // Use for...of loop for better performance
    for (const tvoObj of tvoArray) {
      // let foundMatch = false;
      for (const amadeusObj of flattenedArray) {
        // Use object destructuring for better readability
        const { Segments, Fare } = tvoObj;
        const { flightDetails, paxFareDetail } = amadeusObj;
        console.log("amadeusObj==================", amadeusObj);
        // Perform comparisons
        if (
          Segments[0][0].Airline.FlightNumber ===
            amadeusObj.flightDetails.flightInformation.flightOrtrainNumber &&
          moment(Segments[0][0].Origin.DepTime).format("YYYY-MM-DD") ===
            moment(
              amadeusObj.flightDetails.flightInformation.productDateTime
                .dateOfDeparture,
              "DDMMYYYY"
            ).format("YYYY-MM-DD") &&
          moment(Segments[0][0].Origin.DepTime).format("HH:mm") ===
            moment(
              amadeusObj.flightDetails.flightInformation.productDateTime
                .timeOfDeparture,
              "Hmm"
            ).format("HH:mm") &&
          moment(Segments[0][0].Destination.ArrTime).format("YYYY-MM-DD") ===
            moment(
              amadeusObj.flightDetails.flightInformation.productDateTime
                .dateOfArrival,
              "DDMMYYYY"
            ).format("YYYY-MM-DD") &&
          moment(Segments[0][0].Destination.ArrTime).format("HH:mm") ===
            moment(
              amadeusObj.flightDetails.flightInformation.productDateTime
                .timeOfArrival,
              "Hmm"
            ).format("HH:mm") &&
          Segments[0][0].Airline.AirlineCode ===
            amadeusObj.flightDetails.flightInformation.companyId
              .marketingCarrier
        ) {
          // Compare prices and push to finalResult
          if (
            parseInt(Fare.PublishedFare) <
            parseInt(paxFareDetail.totalFareAmount)
          ) {
            if (!addedObjects.has(tvoObj)) {
              finalResult.push(tvoObj);
              addedObjects.add(tvoObj);
            }
          } else {
            if (!addedObjects.has(amadeusObj)) {
              console.log("!addedObjects.has(amadeusObj)--------------");
              finalResult.push(amadeusObj);
              addedObjects.add(amadeusObj);
            }
          }
        } else {
          if (!addedObjects.has(tvoObj)) {
            console.log("=================", tvoObj.length);
            finalResult.push(tvoObj);
            addedObjects.add(tvoObj);
          }
        }
      }
    }
    // Iterate through each object in amadeus that hasn't been added
    for (const amadeusObj of flattenedArray) {
      if (!addedObjects.has(amadeusObj)) {
        console.log("!addedObjects.has(amadeusObj==================");
        finalResult.push(amadeusObj);
        addedObjects.add(amadeusObj);
      }
    }
    console.log("finalResult=============", finalResult.length);
    // for(const finalSort of finalResult){

    // }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: finalResult,
      flattenedArray: flattenedArray,
      length: {
        flattenedArray: flattenedArray.length,
        tvoArray: tvoArray.length,
        finalResult: finalResult.length,
      },
    });
  } catch (error) {
    console.error("Error:while cobinedAsPerPrice", error);
    return next(error);
  }
};

// Function to generate Amadeus SOAP request
const generateAmadeusRequest1 = (data) => {
  // Generate the SOAP request XML based on the provided data
  // Generate new values for messageId, uniqueId, NONCE, TIMESTAMP, and hashedPassword
  const messageId = uuidv4();
  const uniqueId = uuidv4();
  const NONCE = bytesToBase64(generateRandomBytes(streamLength));
  const TIMESTAMP = new Date().toISOString();
  const CLEARPASSWORD = process.env.AMADAPASS;
  console.log("data.px===========", data.px);
  const buffer = Buffer.concat([
    Buffer.from(NONCE, "base64"),
    Buffer.from(TIMESTAMP),
    nodeCrypto.createHash("sha1").update(Buffer.from(CLEARPASSWORD)).digest(),
  ]);
  console.log("data.totalPassenger========", data.totalPassenger);
  const hashedPassword = nodeCrypto
    .createHash("sha1")
    .update(buffer)
    .digest("base64");
  var soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
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
              <numberOfUnits>${data.totalPassenger}</numberOfUnits>
              <typeOfUnit>PX</typeOfUnit>
          </unitNumberDetail>
          <unitNumberDetail>
              <numberOfUnits>250</numberOfUnits>
              <typeOfUnit>RC</typeOfUnit>
          </unitNumberDetail>
      </numberOfUnit>
      <paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
              <ptc>ADT</ptc>`;
  for (let i = 0; i < data.px; i++) {
    soapRequest += `
              <traveller>
                  <ref>${i + 1}</ref>
              </traveller>`;
  }
  soapRequest += `
          </paxReference>
          `;
  for (let i = 0; i < data.ChildCount; i++) {
    soapRequest += `
    <paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
          <ptc>CH</ptc>
          <traveller>
          <ref>${data.px + i + 1}</ref>
          </traveller>
          </paxReference>`;
  }
  // soapRequest += `</paxReference>`;
  for (let i = 0; i < data.InfantCount; i++) {
    soapRequest += `
    <paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
      <ptc>INF</ptc>
      <traveller>
          <ref>${i + 1}</ref>
          <infantIndicator>${i + 1}</infantIndicator>
      </traveller>
      </paxReference>`;
  }
  soapRequest += `

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
  console.log("soapRequest=============", soapRequest);
  return soapRequest;
};
 
const generateAmadeusRequest = (data) => {
  // Generate the SOAP request XML based on the provided data
  // Generate new values for messageId, uniqueId, NONCE, TIMESTAMP, and hashedPassword
  const messageId = uuidv4();
  const uniqueId = uuidv4();
  const NONCE = bytesToBase64(generateRandomBytes(streamLength));
  const TIMESTAMP = new Date().toISOString();
  const CLEARPASSWORD = process.env.AMADAPASS;
  const buffer = Buffer.concat([
    Buffer.from(NONCE, "base64"),
    Buffer.from(TIMESTAMP),
    nodeCrypto.createHash("sha1").update(Buffer.from(CLEARPASSWORD)).digest(),
  ]);
  const hashedPassword = nodeCrypto
    .createHash("sha1")
    .update(buffer)
    .digest("base64");

  var soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
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
            <numberOfUnits>${data.totalPassenger}</numberOfUnits>
            <typeOfUnit>PX</typeOfUnit>
        </unitNumberDetail>
        <unitNumberDetail>
            <numberOfUnits>250</numberOfUnits>
            <typeOfUnit>RC</typeOfUnit>
        </unitNumberDetail>
    </numberOfUnit>
              <paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
                  <ptc>ADT</ptc>`;
  for (let i = 0; i < data.px; i++) {
    soapRequest += `
                  <traveller>
                      <ref>${i + 1}</ref>
                  </traveller>
                  `;
  }
  soapRequest += `</paxReference>`;
  if (data.ChildCount > 0) {
    soapRequest += `<paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
    <ptc>CH</ptc>`;
    for (let i = 0; i < data.ChildCount; i++) {
      soapRequest += `
  
                      <traveller>
                          <ref>${data.px + i + 1}</ref>
                      </traveller>
                       `;
    }
    soapRequest += `</paxReference>`;
  }

  if (data.InfantCount > 0) {
    for (let i = 0; i < data.InfantCount; i++) {
      soapRequest += `<paxReference xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
      <ptc>INF</ptc>
                      <traveller>
                          <ref>${i + 1}</ref>
                          <infantIndicator>${i + 1}</infantIndicator>
                      </traveller>`;
    }
    soapRequest += `</paxReference>`;
  }
  soapRequest += `
 
              <fareOptions xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
                  <pricingTickInfo>
                      <pricingTicketing>
                          <priceType>RP</priceType>
                          <priceType>ET</priceType>
                          <priceType>RU</priceType>
                          <priceType>TAC</priceType>
                      </pricingTicketing>
                  </pricingTickInfo>
              </fareOptions>
              <itinerary xmlns="http://xml.amadeus.com/FMPTBQ_19_3_1A">
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
