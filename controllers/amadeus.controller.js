const axios = require("axios");
const nodeCrypto = require("crypto");
const xml2js = require("xml2js");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
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

  //fare Master Pricer Travel Board Search

exports.fareMasterPricerTravelBoardSearch = async (req, res) => {
  const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

//   console.log("messageId", messageId);
//   console.log("uniqueId", uniqueId);
//   console.log("NONCE", NONCE);
//   console.log("TIMESTAMP", TIMESTAMP);
//   console.log("hashedPassword", hashedPassword);
//   console.log("url", url);

  try {
    // console.log(req.body,"body")
    let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
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

    // console.log("data", data);

    const response = await axios.post(url,data,{headers} );

    const responseData = extractDataFromResponse(response);
    // const jsonResult = await xmlToJson(response.data)
    // const newData=jsonResult['soapenv:Envelope']['soapenv:Body']['Fare_MasterPricerTravelBoardSearchReply'];
    msg = "Flight Searched Successfully!";
    actionCompleteResponse(res, responseData, msg);
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};



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



  exports.FareInformativePricingWithoutPNR =async (req, res,next) =>{

    const {date,to,from}=req.body;
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

 

    try {
        let data =`<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
                <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/TIPNRQ_23_1_1A</add:Action>
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
            </soap:Header>
            <soap:Body>
                <Fare_InformativePricingWithoutPNR xmlns="http://xml.amadeus.com/TIPNRQ_18_1_1A">
                    <passengersGroup>
                        <segmentRepetitionControl>
                            <segmentControlDetails>
                                <quantity>1</quantity>
                                <numberOfUnits>1</numberOfUnits>
                            </segmentControlDetails>
                        </segmentRepetitionControl>
                        <travellersID>
                            <travellerDetails>
                                <measurementValue>1</measurementValue>
                            </travellerDetails>
                        </travellersID>
                        <discountPtc>
                            <valueQualifier>ADT</valueQualifier>
                        </discountPtc>
                    </passengersGroup>
                    <segmentGroup>
                        <segmentInformation>
                            <flightDate>
                                <departureDate>${date}</departureDate>
                            </flightDate>
                            <boardPointDetails>
                                <trueLocationId>${to}</trueLocationId>
                            </boardPointDetails>
                            <offpointDetails>
                                <trueLocationId>${from}</trueLocationId>
                            </offpointDetails>
                            <companyDetails>
                                <marketingCompany>UK</marketingCompany>
                            </companyDetails>
                            <flightIdentification>
                                <flightNumber>1000</flightNumber>
                                <bookingClass>O</bookingClass>
                            </flightIdentification>
                            <flightTypeDetails>
                                <flightIndicator>1</flightIndicator>
                            </flightTypeDetails>
                            <itemNumber>1</itemNumber>
                        </segmentInformation>
                    </segmentGroup>
                    <pricingOptionGroup>
                        <pricingOptionKey>
                            <pricingOptionKey>RP</pricingOptionKey>
                        </pricingOptionKey>
                    </pricingOptionGroup>
                    <pricingOptionGroup>
                        <pricingOptionKey>
                            <pricingOptionKey>RU</pricingOptionKey>
                        </pricingOptionKey>
                    </pricingOptionGroup>
                    <pricingOptionGroup>
                        <pricingOptionKey>
                            <pricingOptionKey>VC</pricingOptionKey>
                        </pricingOptionKey>
                        <carrierInformation>
                            <companyIdentification>
                                <otherCompany>UK</otherCompany>
                            </companyIdentification>
                        </carrierInformation>
                    </pricingOptionGroup>
                </Fare_InformativePricingWithoutPNR>
            </soap:Body>
        </soap:Envelope>`;
        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/TIPNRQ_23_1_1A",
          };
      
        //   console.log("data", data);
      
           const response = await axios.post(url,data,{headers} );
      
           const responseData = extractDataFromResponse(response);
           msg = "Flight Searched Successfully!";
        actionCompleteResponse(res, responseData, msg);        
    }catch (err) {
        // console.log(err)
        sendActionFailedResponse(res, {}, err.message);
      }

  }


  function extractDataFromResponse(response){
    return response.data;
  }