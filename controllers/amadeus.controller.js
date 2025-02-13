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


  const url = process.env.AMADEUSURL;
//fare Master Pricer Travel Board Search

const successMsg = "success";
const failMsg ="error";

//today work on this
exports.fareMasterPricerTravelBoardSearch = async (req, res) => {

  const {to,from,date,px}=req?.body;
    
  // Generate new UUID for each request
  const messageId = uuidv4();
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

  try {
    let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
            <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
                <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FMPTBQ_23_4_1A</add:Action>
                <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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
    xmlns="http://xml.amadeus.com/FMPTBQ_18_1_1A">
    <numberOfUnit>
        <unitNumberDetail>
            <numberOfUnits>250</numberOfUnits>
            <typeOfUnit>RC</typeOfUnit>
        </unitNumberDetail>
        <unitNumberDetail>
            <numberOfUnits>${px}</numberOfUnits>
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
                <priceType>RP</priceType>
                <priceType>RU</priceType>
                <priceType>TAC</priceType>
                <priceType>ET</priceType>
                <priceType>RF</priceType>
            </pricingTicketing>
        </pricingTickInfo>
    </fareOptions>
    <travelFlightInfo>
        <cabinId>
            <cabin>M</cabin>
        </cabinId>
    </travelFlightInfo>
    <itinerary>
        <requestedSegmentRef>
            <segRef>1</segRef>
        </requestedSegmentRef>
        <departureLocalization>
            <departurePoint>
                <locationId>${to}</locationId>
            </departurePoint>
        </departureLocalization>
        <arrivalLocalization>
            <arrivalPointDetails>
                <locationId>${from}</locationId>
            </arrivalPointDetails>
        </arrivalLocalization>
        <timeDetails>
            <firstDateTimeDetail>
                <date>${date}</date>
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


    const response = await axios.post(url, data, { headers });

    const responseData = extractDataFromResponse(response);
    const jsonResult = await xmlToJson(response.data);
    // const obj =
    //   jsonResult["soapenv:Envelope"]["soapenv:Body"][
    //     "Fare_MasterPricerTravelBoardSearchReply"
    //   ];
    

//       const recommendationObject=obj.recommendation
//       let newData=[];
//       if(recommendationObject?.length>=1){
// const segNumber=recommendationObject.map((item,index)=>{
//     return item.segmentFlightRef.length || 1 
// });


// const flattenedArray = segNumber.flatMap((item, index) => {
//     const modifiedArray = [];
//     for (let i = 0; i < item; i++) {
//         modifiedArray.push({...obj.flightIndex.groupOfFlights[i], ...recommendationObject[index].paxFareProduct});
//     }
//     return modifiedArray;
// });
// newData=flattenedArray;

// }else{
//   const modifiedArray = [];
//   // return;
//   modifiedArray.push({...obj.flightIndex.groupOfFlights, ...recommendationObject.paxFareProduct})
//   newData=modifiedArray;
// }


    // actionCompleteResponse(res, newData, successMsg);
    actionCompleteResponse(res, response.data, successMsg);
  } catch (err) {
    sendActionFailedResponse(res, {err}, err.message);
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
    
  // Generate new UUID for each request
  const messageId = uuidv4();
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

  try {

    const requestBody = req.body;

    let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
    xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
    xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
    xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
    xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
    <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <ses:Session xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="Start" />
  <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/TIPNRQ_23_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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
    <soapenv:Body>${requestBody}</soapenv:Body>
</soapenv:Envelope>`;
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/TIPNRQ_23_1_1A",
    };

      // console.log("fare informativeprice without pnr", data);

    const response = await axios.post(url, data, { headers });
    // console.log("response",response)

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

    // const responseData = extractDataFromResponse(response);
    
    actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
  } catch (err) {
    // console.log(err)
    sendActionFailedResponse(res, {err}, err.message);
  }
};

//fareCheckRule 1

exports.fareCheckRule =async (req, res)=>{

    try {

        const { 
            amadeusMessageID,
            amadeusUniqueID,
            amadeusSessionID,
            amadeusSequenceNumber,
            amadeusSecurityToken
          } = req.body;

        

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
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FARQNQ_07_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
  <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
    <link:Consumer>
      <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
    </link:Consumer>
  </link:TransactionFlowLink>
  <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
</soap:Header>
        <soapenv:Body><Fare_CheckRules>
        <msgType>
            <messageFunctionDetails>
                <messageFunction>712</messageFunction>
            </messageFunctionDetails>
        </msgType>
        <itemNumber>
            <itemNumberDetails>
                <number>1</number>
            </itemNumberDetails>
        </itemNumber>
  </Fare_CheckRules></soapenv:Body>
        </soapenv:Envelope>`;
        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/FARQNQ_07_1_1A",
          };

          // console.log(data,"fareRule1");

          const response = await axios.post(url,data,{headers} );

          const xmlResponse = response.data;
          const parser = new xml2js.Parser({ explicitArray: false, trim: true });
          const parsedResponse = await parser.parseStringPromise(xmlResponse);
  
            const extractedData = {
              MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
              UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
              // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
              SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
              SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
              SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
          };

          
          actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
    
}



//fareCheckRuleSecond 2

exports.fareCheckRuleSecond =async (req, res)=>{

  try {

      const { 
          amadeusMessageID,
          amadeusUniqueID,
          amadeusSessionID,
          amadeusSequenceNumber,
          amadeusSecurityToken
        } = req.body;

     

      const data=`<soapenv:Envelope
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
      xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
      xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
      xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
      xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
      <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="End">
    <awsse:SessionId>${amadeusSessionID}</awsse:SessionId>
    <awsse:SequenceNumber>${Number(amadeusSequenceNumber)+1}</awsse:SequenceNumber>
    <awsse:SecurityToken>${amadeusSecurityToken}</awsse:SecurityToken>
  </awsse:Session>
  <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${amadeusMessageID}</add:MessageID>
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FARQNQ_07_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
  <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
    <link:Consumer>
      <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
    </link:Consumer>
  </link:TransactionFlowLink>
  <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
</soap:Header>
      <soapenv:Body><Fare_CheckRules>
      <msgType>
          <messageFunctionDetails>
              <messageFunction>712</messageFunction>
          </messageFunctionDetails>
      </msgType>
      <itemNumber>
          <itemNumberDetails>
              <number>1</number>
          </itemNumberDetails>
      </itemNumber>
      <fareRule>
          <tarifFareRule>
              <ruleSectionId>RU</ruleSectionId>
              <ruleSectionId>MX</ruleSectionId>
              <ruleSectionId>SR</ruleSectionId>
              <ruleSectionId>TR</ruleSectionId>
              <ruleSectionId>AP</ruleSectionId>
              <ruleSectionId>CD</ruleSectionId>
          </tarifFareRule>
      </fareRule>
</Fare_CheckRules></soapenv:Body>
      </soapenv:Envelope>`;
      const headers = {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://webservices.amadeus.com/FARQNQ_07_1_1A",
        };

        // console.log(data,"farecheck rule 2");

        const response = await axios.post(url,data,{headers} );

        const xmlResponse = response.data;
        const parser = new xml2js.Parser({ explicitArray: false, trim: true });
        const parsedResponse = await parser.parseStringPromise(xmlResponse);

          const extractedData = {
            MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
            UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
            // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
            SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
            SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
            SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
        };

        
        actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
      
  } catch (err) {
      sendActionFailedResponse(res, { err }, err.message);        
  }
  
}


//airsell 

exports.airSell =async (req, res) =>{
       

 // Generate new UUID for each request
  const messageId = uuidv4();
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
        <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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

    // console.log(data,"airsell");

        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/ITAREQ_05_2_IA",
          };

      
            const response = await axios.post(url,data,{headers} );
             

             const xmlResponse = response.data;
        const parser = new xml2js.Parser({ explicitArray: false, trim: true });
        const parsedResponse = await parser.parseStringPromise(xmlResponse);

       
        const extractedData = {
            MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
            UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
            // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
            SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
            SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
            SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken'],
            // StatusCode: parsedResponse['soapenv:Envelope']['soapenv:Body']['Air_SellFromRecommendationReply']['itineraryDetails']['segmentInformation']['actionDetails']['statusCode']
        };

        // if(parsedResponse['soapenv:Envelope']?.['soapenv:Body']?.['Air_SellFromRecommendationReply']?.['errorAtMessageLevel']){
        //   return actionCompleteResponse(res, {headers:extractedData,data:response.data}, failMsg);
        //   }
          
          actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);    
    }

}




//pnr AddMulti Elements

exports.pnrAddMultiElements = async (req, res) =>{
    //  const {amadeusmessageid,amadeusuniqueid,amadeussessionid,amadeussequencenumber,amadeussecuritytoken}=req.headers;
    try {

        const requestBody = req.body;


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
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
  <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
    <link:Consumer>
      <link:UniqueID>${req.headers.amadeusuniqueid}</link:UniqueID>
    </link:Consumer>
  </link:TransactionFlowLink>
  <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
</soap:Header>        
            <soapenv:Body>${requestBody}</soapenv:Body>
        </soapenv:Envelope>`;

        // console.log(data,"pnr add multi element");

        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/PNRADD_21_1_1A",
          };

          const response = await axios.post(url,data,{headers} );

          const xmlResponse = response.data;
        const parser = new xml2js.Parser({ explicitArray: false, trim: true });
        const parsedResponse = await parser.parseStringPromise(xmlResponse);

          const extractedData = {
            MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
            UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
            // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
            SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
            SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
            SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
        };

          
          actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
        
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
            amadeusSecurityToken,
            flightCode
          } = req.body;

        
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
                xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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
                                <otherCompany>${flightCode}</otherCompany>
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

          // console.log(data,"Fare price with Booking class");

          const response = await axios.post(url,data,{headers} );
          // console.log(response,"response");
          // return;

          const xmlResponse = response.data;
          const parser = new xml2js.Parser({ explicitArray: false, trim: true });
          const parsedResponse = await parser.parseStringPromise(xmlResponse);
  
            const extractedData = {
              MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
              UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
              // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
              SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
              SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
              SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
          };

          // if(parsedResponse['soapenv:Envelope']?.['soapenv:Body']?.['Fare_PricePNRWithBookingClassReply']?.['applicationError']?.['errorOrWarningCodeDetails']?.['errorDetails']){
          // return actionCompleteResponse(res, {headers:extractedData,data:response.data}, failMsg);
          // }

          
          actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}

//ticketCreateTSTFromPricing


exports.ticketCreateTSTFromPricing = async (req, res) =>{

  const generateXML=(value)=>{
    return Array.from({ length: value }, (_, i) => `
        <psaList>
            <itemReference>
                <referenceType>TST</referenceType>
                <uniqueReference>${i + 1}</uniqueReference>
            </itemReference>
        </psaList>`).join('');
    
}
    try {
        const {amadeusMessageID,amadeusUniqueID,amadeusSessionID,amadeusSequenceNumber,amadeusSecurityToken,totalPax} =req.body;

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
                xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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
                    ${generateXML(totalPax)}                  
                </Ticket_CreateTSTFromPricing>
            </soapenv:Body>
        </soapenv:Envelope>`;

        // console.log(data,"Ticket Create api");


        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/TAUTCQ_04_1_1A",
          };

          const response = await axios.post(url,data,{headers} );

          const xmlResponse = response.data;
          const parser = new xml2js.Parser({ explicitArray: false, trim: true });
          const parsedResponse = await parser.parseStringPromise(xmlResponse);
  
            const extractedData = {
              MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
              UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
              // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
              SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
              SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
              SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
          };

          // if(parsedResponse['soapenv:Envelope']?.['soapenv:Body']?.['Ticket_CreateTSTFromPricingReply']?.['applicationError']){
          //   return actionCompleteResponse(res, {headers:extractedData,data:response.data}, failMsg);
          //   }

          
          actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}


//savePnrAddMultiElements

exports.savePnrAddMultiElements = async (req, res) =>{

    const {amadeusMessageID,amadeusUniqueID,amadeusSessionID,amadeusSequenceNumber,amadeusSecurityToken} =req.body;


    try {

        

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
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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

        // console.log(data,"save pnr ");


        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/PNRADD_21_1_1A",
          };

          const response = await axios.post(url,data,{headers} );

          const xmlResponse = response.data;
          const parser = new xml2js.Parser({ explicitArray: false, trim: true });
          const parsedResponse = await parser.parseStringPromise(xmlResponse);
  
            const extractedData = {
              MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
              UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
              // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
              SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
              SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
              SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken'],
              Pnr: parsedResponse['soapenv:Envelope']['soapenv:Body']['PNR_Reply']['pnrHeader']['reservationInfo']['reservation']['controlNumber']
          };


          // if(parsedResponse['soapenv:Envelope']?.['soapenv:Body']?.['PNR_Reply']?.['generalErrorInfo']){
          //   return actionCompleteResponse(res, {headers:extractedData,data:response.data}, failMsg);
          //   }
          

          
          actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);        
    }
}



exports.pnrRet = async (req, res) =>{
  

  const {amadeusMessageID,amadeusUniqueID,amadeusSessionID,amadeusSequenceNumber,amadeusSecurityToken,pnr} =req.body;


  try {
  
    //   const requestBody = req.body;
      const data=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
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
<add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/PNRRET_21_1_1A</add:Action>
<add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
<link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
<link:Consumer>
  <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
</link:Consumer>
</link:TransactionFlowLink>

<AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
</soap:Header>
  <soapenv:Body>
  <PNR_Retrieve xmlns="http://xml.amadeus.com/PNRRET_17_1_1A">
  <retrievalFacts>
      <retrieve>
          <type>2</type>
      </retrieve>
      <reservationOrProfileIdentifier>
          <reservation>
              <controlNumber>${pnr}</controlNumber>
          </reservation>
      </reservationOrProfileIdentifier>
  </retrievalFacts>
</PNR_Retrieve>
  </soapenv:Body>
  </soapenv:Envelope>`;

  // console.log(data,"pnr retrieve");


      const headers = {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://webservices.amadeus.com/PNRRET_21_1_1A",
        };
     
    
          const response = await axios.post(url,data,{headers} );


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
          SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken'],
          Pnr:parsedResponse['soapenv:Envelope']['soapenv:Body']['PNR_Reply']['pnrHeader']['reservationInfo']['reservation']['controlNumber']
      };
        
        actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
     
  } catch (err) {
      sendActionFailedResponse(res, { err }, err.message);       
  }

}


//airRetrieveSeatMap

exports.airRetrieveSeatMap = async (req, res) =>{
   
    // Generate new UUID for each request
    const messageId = uuidv4();
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
  
      try {
  
          const requestBody = req.body;

          // console.log(requestBody,"requestBody");


          const data=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
          xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
          xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
          xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
          xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
          <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <ses:Session xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="Start" />
  <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/SMPREQ_17_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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
      <soapenv:Body>
      ${req.body}
      </soapenv:Body>
      </soapenv:Envelope>`;
  
      // console.log(data,"seat airmap");

// return;

          const headers = {
              "Content-Type": "text/xml;charset=UTF-8",
              SOAPAction: "http://webservices.amadeus.com/SMPREQ_17_1_1A",
            };
         
        
              const response = await axios.post(url,data,{headers} );

  
               const xmlResponse = response.data;
          const parser = new xml2js.Parser({ explicitArray: false, trim: true });
          const parsedResponse = await parser.parseStringPromise(xmlResponse);

          
          if(parsedResponse['soapenv:Envelope']['soapenv:Body']['soap:Fault']){
            return;
          }
  


          const startIndex = xmlResponse.indexOf('<Air_RetrieveSeatMapReply');
        const endIndex = xmlResponse.indexOf('</Air_RetrieveSeatMapReply>') + '</Air_RetrieveSeatMapReply>'.length;
        const airRetrieveSeatMapReplyData = xmlResponse.slice(startIndex, endIndex);
          // Extract required fields
          // const extractedData = {
          //     MessageID: parsedResponse['soapenv:Envelope']['soapenv:Header']['wsa:RelatesTo']._,
          //     UniqueID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Consumer']['awsl:UniqueID'],
          //     // ServerID: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsl:TransactionFlowLink']['awsl:Receiver']['awsl:ServerID'],
          //     SessionId: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SessionId'],
          //     SequenceNumber: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SequenceNumber'],
          //     SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken']
          //      };
            
            actionCompleteResponse(res, airRetrieveSeatMapReplyData, successMsg);
         
            //  actionCompleteResponse(res, {data:response.data}, successMsg);
         
      } catch (err) {
          sendActionFailedResponse(res, { err }, err.message);       
      }
  


}

// pnrRetrieve

exports.pnrRetrieve = async (req , res) =>{


    
    // Generate new UUID for each request
    const messageId = uuidv4();
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
  
      try {
  
        //   const requestBody = req.body;
          const data=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
          xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
          xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
          xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
          xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
          <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <ses:Session xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="Start" />
  <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageId}</add:MessageID>
  <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/PNRRET_21_1_1A</add:Action>
  <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
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
      <soapenv:Body>
      <PNR_Retrieve xmlns="http://xml.amadeus.com/PNRRET_17_1_1A">
      <retrievalFacts>
          <retrieve>
              <type>2</type>
          </retrieve>
          <reservationOrProfileIdentifier>
              <reservation>
                  <controlNumber>${req.body.pnr}</controlNumber>
              </reservation>
          </reservationOrProfileIdentifier>
      </retrievalFacts>
</PNR_Retrieve>
      </soapenv:Body>
      </soapenv:Envelope>`;
  
      // console.log(data,"pnr retrieve without inser");


          const headers = {
              "Content-Type": "text/xml;charset=UTF-8",
              SOAPAction: "http://webservices.amadeus.com/PNRRET_21_1_1A",
            };
         
        
              const response = await axios.post(url,data,{headers} );

  
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
              SecurityToken: parsedResponse['soapenv:Envelope']['soapenv:Header']['awsse:Session']['awsse:SecurityToken'],
              Pnr:parsedResponse['soapenv:Envelope']['soapenv:Body']['PNR_Reply']['pnrHeader']['reservationInfo']['reservation']['controlNumber']
          };
            
            actionCompleteResponse(res, {headers:extractedData,data:response.data}, successMsg);
         
      } catch (err) {
          sendActionFailedResponse(res, { err }, err.message);       
      }
  

}

//signOut


exports.signOut = async (req, res) =>{
    try {

        const {amadeusMessageID,amadeusUniqueID,amadeusSessionID,amadeusSequenceNumber,amadeusSecurityToken} =req.body;


        

        const data=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1"
        xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1"
        xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1"
        xmlns:app="http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3"
        xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="End">
          <awsse:SessionId>${amadeusSessionID}</awsse:SessionId>
          <awsse:SequenceNumber>${Number(amadeusSequenceNumber)+1}</awsse:SequenceNumber>
          <awsse:SecurityToken>${amadeusSecurityToken}</awsse:SecurityToken>
        </awsse:Session>
        <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${amadeusMessageID}</add:MessageID>
        <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/VLSSOQ_04_1_1A</add:Action>
        <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${url}</add:To>
        <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
          <link:Consumer>
            <link:UniqueID>${amadeusUniqueID}</link:UniqueID>
          </link:Consumer>
        </link:TransactionFlowLink>
        <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1" />
      </soap:Header>​        ​
    <soapenv:Body>
    <Security_SignOut xmlns="http://xml.amadeus.com/VLSSOQ_04_1_1A" />
    </soapenv:Body>
    </soapenv:Envelope>`;

    // console.log(data,"signout");


        const headers = {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: "http://webservices.amadeus.com/VLSSOQ_04_1_1A",
          };

      
            const response = await axios.post(url,data,{headers} );
        
          
          actionCompleteResponse(res, response.data, successMsg);
        
    } catch (err) {
        sendActionFailedResponse(res, { err }, err.message);         
    }
}

function extractDataFromResponse(response) {
  return response.data;
}



