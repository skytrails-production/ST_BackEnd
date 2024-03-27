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
const streamLength = 8;
const randomBytes = generateRandomBytes(streamLength);

// Function to convert bytes to base64
function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}
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

exports.combinedAPI = async (req, res, next) => {
  try {
    const data = req.body;
    const api1Url =
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search";
    const result = {};
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";
    const response = await axios.post(api1Url, data);
    result.tvoResponse = response.data;
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
    const obj =
      jsonResult["soapenv:Envelope"]["soapenv:Body"][
        "Fare_MasterPricerTravelBoardSearchReply"
      ];
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
    const amadeus=[];
    for(const flightNo of flattenedArray){
        const amadeus={}
        amadeus.flightNumber=flightNo.flightDetails.flightInformation.flightOrtrainNumber;
        const depDate=flightNo.flightDetails.flightInformation.productDateTime.dateOfDeparture;
        amadeus.depDate= moment(depDate, "DDMMYYYY").format("YYYY-MM-DD");;
        const depTime=flightNo.flightDetails.flightInformation.productDateTime.timeOfDeparture;
        amadeus.depTime=moment(depTime, "Hmm").format("HH:mm");;
        const arrDate=flightNo.flightDetails.flightInformation.productDateTime.dateOfArrival;
        amadeus.arrDate= moment(arrDate, "DDMMYYYY").format("YYYY-MM-DD");;
        const arrTime=flightNo.flightDetails.flightInformation.productDateTime.timeOfArrival;
        amadeus.arrTime=moment(arrTime, "Hmm").format("HH:mm");
        amadeus.push(amadeus);
    }
    // const tvoArray=response.data.Results[0].[0];
    // for(const tvoflightNo of ){}
    console.log("object============",amadeus);
    result.object=amadeus;
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

function extractDataFromResponse(response) {
  return response.data;
}
