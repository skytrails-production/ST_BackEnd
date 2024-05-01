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

    // console.log("messageId", messageId);
    // console.log("uniqueId", uniqueId);
    // console.log("NONCE", NONCE);
    // console.log("TIMESTAMP", TIMESTAMP);
    // console.log("hashedPassword", hashedPassword);
    // console.log("url", url);

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

    const response = await axios.post(url, data, { headers });

    // const responseData = extractDataFromResponse(response);
    const jsonResult = await xmlToJson(response.data);
    const obj =
      jsonResult["soapenv:Envelope"]["soapenv:Body"][
        "Fare_MasterPricerTravelBoardSearchReply"
      ];
    
    console.log(obj)

      const recommendationObject=obj.recommendation
const segNumber=recommendationObject.map((item,index)=>{
    return item.segmentFlightRef.length || 1 
})
const flattenedArray = segNumber.flatMap((item, index) => {
    const modifiedArray = [];
    for (let i = 0; i < item; i++) {
        modifiedArray.push({...obj.flightIndex.groupOfFlights[i], ...recommendationObject[index].paxFareProduct});
    }
    return modifiedArray;
});

// console.log(flattenedArray);


    msg = "Flight Searched Successfully!";
    actionCompleteResponse(res, flattenedArray, msg);
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

exports.fareInformativePricingWithoutPNR = async (req, res) => {
  const { date, to, from } = req.body;
  const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

  try {
    let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
    xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
    xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
    xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
    xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
<soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">416c513b-f819-3f9c-d9ae-90f41195d60e</add:MessageID>
    <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/ITAREQ_05_2_IA</add:Action>
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
        <UserID POS_Type="1" PseudoCityCode="DELVS38UE" AgentSign="SU" RequestorType="U" />
    </AMA_SecurityHostedUser>
</soap:Header>        ​
<soapenv:Body>
    <Air_SellFromRecommendation>
        <messageActionDetails>
            <messageFunctionDetails>
                <messageFunction>183</messageFunction>
                <additionalMessageFunction>M1</additionalMessageFunction>
            </messageFunctionDetails>
        </messageActionDetails>
        <itineraryDetails>
            <originDestinationDetails>
                <origin>DEL</origin>
                <destination>DXB</destination>
            </originDestinationDetails>
            <message>
                <messageFunctionDetails>
                    <messageFunction>183</messageFunction>
                </messageFunctionDetails>
            </message>
            <segmentInformation>
                <travelProductInformation>
                    <flightDate>
                        <departureDate>200424</departureDate>
                    </flightDate>
                    <boardPointDetails>
                        <trueLocationId>DEL</trueLocationId>
                    </boardPointDetails>
                    <offpointDetails>
                        <trueLocationId>DXB</trueLocationId>
                    </offpointDetails>
                    <companyDetails>
                        <marketingCompany>AI</marketingCompany>
                    </companyDetails>
                    <flightIdentification>
                        <flightNumber>995</flightNumber>
                        <bookingClass>Y</bookingClass>
                    </flightIdentification>
                </travelProductInformation>
                <relatedproductInformation>
                    <quantity>1</quantity>
                    <statusCode>NN</statusCode>
                </relatedproductInformation>
            </segmentInformation>
        </itineraryDetails>
    </Air_SellFromRecommendation>
</soapenv:Body>
</soapenv:Envelope>`;
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/TIPNRQ_23_1_1A",
    };

    //   console.log("data", data);

    const response = await axios.post(url, data, { headers });

    const responseData = extractDataFromResponse(response);
    msg = "Flight Searched Successfully!";
    actionCompleteResponse(res, responseData, msg);
  } catch (err) {
    // console.log(err)
    sendActionFailedResponse(res, {err}, err.message);
  }
};

exports.airSellFromRecommendation = async (req, res) => {
  // const {date,to,from}=req.body;
  const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

  try {
    let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
    xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
    xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
    xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
    xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
<soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
    <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/ITAREQ_05_2_IA</add:Action>
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
        <UserID POS_Type="1" PseudoCityCode="DELVS38UE" AgentSign="SU" RequestorType="U" />
    </AMA_SecurityHostedUser>
</soap:Header>​        ​
<soapenv:Body>
<Air_SellFromRecommendation>
<messageActionDetails>
    <messageFunctionDetails>
        <messageFunction>183</messageFunction>
        <additionalMessageFunction>M1</additionalMessageFunction>
    </messageFunctionDetails>
</messageActionDetails>
<itineraryDetails>
    <originDestinationDetails>
        <origin>DEL</origin>
        <destination>DXB</destination>
    </originDestinationDetails>
    <message>
        <messageFunctionDetails>
            <messageFunction>183</messageFunction>
        </messageFunctionDetails>
    </message>
    <segmentInformation>
        <travelProductInformation>
            <flightDate>
                <departureDate>200424</departureDate>
            </flightDate>
            <boardPointDetails>
                <trueLocationId>DEL</trueLocationId>
            </boardPointDetails>
            <offpointDetails>
                <trueLocationId>DXB</trueLocationId>
            </offpointDetails>
            <companyDetails>
                <marketingCompany>AI</marketingCompany>
            </companyDetails>
            <flightIdentification>
                <flightNumber>995</flightNumber>
                <bookingClass>Y</bookingClass>
            </flightIdentification>
        </travelProductInformation>
        <relatedproductInformation>
            <quantity>1</quantity>
            <statusCode>NN</statusCode>
        </relatedproductInformation>
    </segmentInformation>
</itineraryDetails>
</Air_SellFromRecommendation>
</soapenv:Body>
</soapenv:Envelope>`;

    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/ITAREQ_05_2_IA",
    };
    // console.log("data", data);

      const response = await axios.post(url,data,{headers} );
    //   console.log("api hcall");

       const responseData = extractDataFromResponse(response);
    msg = "Flight Searched Successfully!";
    actionCompleteResponse(res, responseData, msg);
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
};




exports.airSell =async (req, res,next) =>{
    const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

    // console.log("messageId", messageId);
    // console.log("uniqueId", uniqueId);
    // console.log("NONCE", NONCE);
    // console.log("TIMESTAMP", TIMESTAMP);
    // console.log("hashedPassword", hashedPassword);
    // console.log("url", url);

    try {

        const requestBody = req.body;
        const data=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
    <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <ses:Session
            xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="Start" />
        <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
        <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/ITAREQ_05_2_IA</add:Action>
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
            <UserID POS_Type="1" PseudoCityCode="DELVS38UE" AgentSign="SU" RequestorType="U" />
        </AMA_SecurityHostedUser>
    </soap:Header>​        ​
    <soapenv:Body>
    ${requestBody}
    </soapenv:Body>
    </soapenv:Envelope>`;

    // console.log(data,"data")
        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/ITAREQ_05_2_IA",
          };
        //   console.log("data", data);
      
            const response = await axios.post(url,data,{headers} );
          //   console.log("api call");
      
            //  const responseData = extractDataFromResponse(response);
            //  console.log(response.data,"data")

             const xmlResponse = response.data;
        const parser = new xml2js.Parser({ explicitArray: false, trim: true });
        const parsedResponse = await parser.parseStringPromise(xmlResponse);

        // Extract required fields
        const extractedData = {
            MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
            UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
            // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
            SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
            SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
            SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
        };
          msg = "Flight Searched Successfully!";
          actionCompleteResponse(res, extractedData, msg);
       
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);
        next(err);        
    }

}




//pnr AddMulti Elements

exports.pnrAddMultiElements = async (req, res) =>{
    //  const {amadeusmessageid,amadeusuniqueid,amadeussessionid,amadeussequencenumber,amadeussecuritytoken}=req.headers;
    try {

        // const requestBody = req.body;

        // console.log(req.headers.amadeusuniqueid);
        // return;

        const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

        const data=`<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">
    <awsse:SessionId>${req.headers.amadeussessionid}</awsse:SessionId>
    <awsse:SequenceNumber>${Number(req.headers.amadeussequencenumber)+1}</awsse:SequenceNumber>
    <awsse:SecurityToken>${req.headers.amadeussecuritytoken}</awsse:SecurityToken>
  </awsse:Session>
  <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${req.headers.amadeusmessageid}</add:MessageID>
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/PNRADD_21_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
  <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
    <link:Consumer>
      <link:UniqueID>${req.headers.amadeusuniqueid}</link:UniqueID>
    </link:Consumer>
  </link:TransactionFlowLink>
  <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
</soap:Header>        
            <soapenv:Body><PNR_AddMultiElements
            xmlns="http://xml.amadeus.com/PNRADD_17_1_1A">
            <pnrActions>
                <optionCode>0</optionCode>
            </pnrActions>
            <travellerInfo>
                <elementManagementPassenger>
                    <reference>
                        <qualifier>PR</qualifier>
                        <number>1</number>
                    </reference>
                    <segmentName>NM</segmentName>
                </elementManagementPassenger>
                <passengerData>
                    <travellerInformation>
                        <traveller>
                            <surname>Joshi</surname>
                            <quantity>1</quantity>
                        </traveller>
                        <passenger>
                            <firstName>Mohit MR</firstName>
                            <type>ADT</type>
                        </passenger>
                    </travellerInformation>
                </passengerData>
            </travellerInfo>
            <dataElementsMaster>
                <marker1 />
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>1</number>
                        </reference>
                        <segmentName>AP</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>P02</type>
                        </freetextDetail>
                        <longFreetext>mohitjoshi101@gmail.com</longFreetext>
                    </freetextData>
                    <referenceForDataElement>
                        <reference>
                            <qualifier>PR</qualifier>
                            <number>1</number>
                        </reference>
                    </referenceForDataElement>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>2</number>
                        </reference>
                        <segmentName>AP</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>5</subjectQualifier>
                            <type>N</type>
                        </freetextDetail>
                        <longFreetext>E+certportal@trav.net/F</longFreetext>
                    </freetextData>
                    <referenceForDataElement>
                        <reference>
                            <qualifier>PT</qualifier>
                            <number>2</number>
                        </reference>
                    </referenceForDataElement>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>1</number>
                        </reference>
                        <segmentName>AP</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>7</type>
                            <status>A</status>
                        </freetextDetail>
                        <longFreetext>9627466902</longFreetext>
                    </freetextData>
                    <referenceForDataElement>
                        <reference>
                            <qualifier>PR</qualifier>
                            <number>1</number>
                        </reference>
                    </referenceForDataElement>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>1</number>
                        </reference>
                        <segmentName>TK</segmentName>
                    </elementManagementData>
                    <ticketElement>
                        <passengerType>PAX</passengerType>
                        <ticket>
                            <indicator>OK</indicator>
                        </ticket>
                    </ticketElement>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <segmentName>FP</segmentName>
                    </elementManagementData>
                    <formOfPayment>
                        <fop>
                            <identification>CA</identification>
                        </fop>
                    </formOfPayment>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <segmentName>RF</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>P22</type>
                        </freetextDetail>
                        <longFreetext>10612</longFreetext>
                    </freetextData>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <segmentName>OS</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>P27</type>
                            <companyId>UK</companyId>
                        </freetextDetail>
                        <longFreetext>PAX CTCM 9627466902</longFreetext>
                    </freetextData>
                </dataElementsIndiv>
            </dataElementsMaster>
        </PNR_AddMultiElements></soapenv:Body>
        </soapenv:Envelope>`;

        console.log(data,"data")

        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/PNRADD_21_1_1A",
          };

          const response = await axios.post(url,data,{headers} );

          msg = "Add Passenger details Successfully!";
          actionCompleteResponse(res, response.data, msg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}




//farePriceWithBookingClass

exports.farePricePnrWithBookingClass = async (req, res) =>{
    try {

        const { 
            amadeusMessageID,
            amadeusUniqueID,
            amadeusSessionID,
            amadeusSequenceNumber,
            amadeusSecurityToken
          } = req.body;

        const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

        const data=`<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header
            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <awsse:Session
                xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">
                <awsse:SessionId>${amadeusSessionID}</awsse:SessionId>
                <awsse:SequenceNumber>${Number(amadeusSequenceNumber)+1}</awsse:SequenceNumber>
                <awsse:SecurityToken>${amadeusSecurityToken}</awsse:SecurityToken>
            </awsse:Session>
            <add:MessageID
                xmlns:add="http://www.w3.org/2005/08/addressing">${amadeusMessageID}</add:MessageID>
            <add:Action
                xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/TPCBRQ_23_2_1A</add:Action>            <add:To
                xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
            <link:TransactionFlowLink
                xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
                <link:Consumer>
                    <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
                </link:Consumer>
            </link:TransactionFlowLink>
            <AMA_SecurityHostedUser
                xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
            </soap:Header>
            <soapenv:Body>
                <Fare_PricePNRWithBookingClass
                    xmlns="http://xml.amadeus.com/TPCBRQ_18_1_1A">
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
                            <pricingOptionKey>RLO</pricingOptionKey>
                        </pricingOptionKey>
                    </pricingOptionGroup>
                </Fare_PricePNRWithBookingClass>
            </soapenv:Body>
        </soapenv:Envelope>`;
        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/TPCBRQ_23_2_1A",
          };

          const response = await axios.post(url,data,{headers} );

          msg = "Fare Price Pnr Successfully!";
          actionCompleteResponse(res, response.data, msg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}

//ticketCreateTSTFromPricing


exports.ticketCreateTSTFromPricing = async (req, res) =>{
    try {
        const {amadeusMessageID,amadeusUniqueID,amadeusSessionID,amadeusSequenceNumber,amadeusSecurityToken} =req.body;


        const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

        const data=`<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header
            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <awsse:Session
                xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">
                <awsse:SessionId>${amadeusSessionID}</awsse:SessionId>
                <awsse:SequenceNumber>${Number(amadeusSequenceNumber)+1}</awsse:SequenceNumber>
                <awsse:SecurityToken>${amadeusSecurityToken}</awsse:SecurityToken>
            </awsse:Session>
            <add:MessageID
                xmlns:add="http://www.w3.org/2005/08/addressing">${amadeusMessageID}</add:MessageID>
            <add:Action
                xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/TAUTCQ_04_1_1A</add:Action>
            <add:To
                xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
            <link:TransactionFlowLink
                xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
                <link:Consumer>
                    <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
                </link:Consumer>
            </link:TransactionFlowLink>
            <AMA_SecurityHostedUser
                xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
            </soap:Header>
            <soapenv:Body>
                <Ticket_CreateTSTFromPricing
                    xmlns="http://xml.amadeus.com/TAUTCQ_04_1_1A">
                    <psaList>
                        <itemReference>
                            <referenceType>TST</referenceType>
                            <uniqueReference>1</uniqueReference>
                        </itemReference>
                    </psaList>
                </Ticket_CreateTSTFromPricing>
            </soapenv:Body>
        </soapenv:Envelope>`;

        // console.log(data,"data")


        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/TAUTCQ_04_1_1A",
          };

             console.log(res);
          const response = await axios.post(url,data,{headers} );

          msg = "Ticket Create Successfully!";
          actionCompleteResponse(res, response.data, msg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}


//savePnrAddMultiElements

exports.savePnrAddMultiElements = async (req, res) =>{

    const {amadeusMessageID,amadeusUniqueID,amadeusSessionID,amadeusSequenceNumber,amadeusSecurityToken} =req.body;


    try {

        const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

        const data=`<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">
    <awsse:SessionId>${amadeusSessionID}</awsse:SessionId>
    <awsse:SequenceNumber>${Number(amadeusSequenceNumber)+1}</awsse:SequenceNumber>
    <awsse:SecurityToken>${amadeusSecurityToken}</awsse:SecurityToken>
  </awsse:Session>
  <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${amadeusMessageID}</add:MessageID>
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/PNRADD_21_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
  <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
    <link:Consumer>
      <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
    </link:Consumer>
  </link:TransactionFlowLink>
  <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
</soap:Header>
            <soapenv:Body>
            <PNR_AddMultiElements xmlns="http://xml.amadeus.com/PNRADD_17_1_1A">
              <pnrActions>
                  <optionCode>11</optionCode>
              </pnrActions>
              <dataElementsMaster>
                  <marker1 />
                  <dataElementsIndiv>
                      <elementManagementData>
                          <segmentName>RF</segmentName>
                      </elementManagementData>
                      <freetextData>
                          <freetextDetail>
                              <subjectQualifier>3</subjectQualifier>
                              <type>P22</type>
                          </freetextDetail>
                          <longFreetext>Legend</longFreetext>
                      </freetextData>
                  </dataElementsIndiv>
              </dataElementsMaster>
          </PNR_AddMultiElements>
            </soapenv:Body>
        </soapenv:Envelope>`;

        // console.log(data,"data");


        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/PNRADD_21_1_1A",
          };

          const response = await axios.post(url,data,{headers} );

          msg = "Save Pnr Successfully!";
          actionCompleteResponse(res, response.data, msg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}


//signOut


exports.signOut = async (req, res) =>{
    try {

        const url = "https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0";

        const data=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="End">
          <awsse:SessionId>${sessionId}</awsse:SessionId>
          <awsse:SequenceNumber>${sequenceNumber}</awsse:SequenceNumber>
          <awsse:SecurityToken>${securityToken}</awsse:SecurityToken>
        </awsse:Session>
        <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
        <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/VLSSOQ_04_1_1A</add:Action>
        <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeD3.test.webservices.amadeus.com/1ASIWTHESP0</add:To>
        <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
          <link:Consumer>
            <link:UniqueID>${uniqueId}</link:UniqueID>
          </link:Consumer>
        </link:TransactionFlowLink>
        <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
      </soap:Header>​        ​
    <soapenv:Body>
    <Security_SignOut xmlns="http://xml.amadeus.com/VLSSOQ_04_1_1A" />
    </soapenv:Body>
    </soapenv:Envelope>`;

    // console.log(data,"data")
        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/VLSSOQ_04_1_1A",
          };
        //   console.log("data", data);
      
            const response = await axios.post(url,data,{headers} );
          //   console.log("api call");

        // Extract required fields
        
          msg = "Flight Searched Successfully!";
          actionCompleteResponse(res, response.data, msg);
        
    } catch (err) {
        
    }
}

function extractDataFromResponse(response) {
  return response.data;
}
