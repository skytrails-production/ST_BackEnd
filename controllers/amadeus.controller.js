const axios = require("axios");
const nodeCrypto = require("crypto");
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
                <Fare_MasterPricerTravelBoardSearch
            xmlns="http://xml.amadeus.com/FMPTBQ_14_3_1A">
                    <numberOfUnit>
                        <unitNumberDetail>
                            <numberOfUnits>${req.body.px}</numberOfUnits>
                            <typeOfUnit>PX</typeOfUnit>
                        </unitNumberDetail>
                    </numberOfUnit>
                    <paxReference>
                        <ptc>ADT</ptc>
                        <traveller>
                            <ref>1</ref>
                        </traveller>
                    </paxReference>
                    <fareOptions>
                        <pricingTickInfo>
                            <pricingTicketing>
                                <priceType>IFS</priceType>
                            </pricingTicketing>
                        </pricingTickInfo>
                    </fareOptions>
                    <itinerary>
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

    // const response = await axios.post(url,data,{headers} );
    msg = "Flight Searched Successfully!";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};