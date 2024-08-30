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
  // console.log(
  //   "Buffer.from(bytes).toStringbase64=",
  //   Buffer.from(bytes).toString("base64")
  // );
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

const url = process.env.AMADEUSURL;

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

// Helper function to find and keep flights with the least BaseFare
const getLowestFareFlights = (flights) => {
  const uniqueFlights = {};
  // console.log("flights=============",flights);
  flights.forEach((flight) => {
    const key = `${flight.flightNumber}_${flight.origin}_${flight.departureTime}`;
    if (!uniqueFlights[key] || flight.BaseFare < uniqueFlights[key].BaseFare) {
      uniqueFlights[key] = flight;
    }
  });

  return Object.values(uniqueFlights);
};

// Function to remove duplicates based on a key
function removeDuplicates(arr, key) {
  const seen = [];
  return arr.filter((item) => {
    const duplicate = seen.includes(item.Segments[0][0].Airline[key]);
    seen.push(item.Segments[0][0].Airline[key]);
    return !duplicate;
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
    data.formattedDate = moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY"); // Format the date as "DDMMYY"
    const api1Url = commonUrl.api.flightSearchURL;
    data.totalPassenger = parseInt(data.AdultCount) + parseInt(data.ChildCount);

    const flattenedArray = [];
    let finalFlattenedArray = [];
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const [tvoResponse, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      await axios
        .post(url, generateAmadeusRequest(data), { headers })
        .catch((error) => {
          console.error("Error in Amadeus API request:", error);
          return { data: {} };
        }),
    ]);
    let tvoArray =
      tvoResponse.data.Response.ResponseStatus === 1
        ? tvoResponse.data.Response.Results[0]
        : [];

    tvoArray = removeDuplicates(tvoArray, `FlightNumber`);

    let jsonResult = await xmlToJson(amadeusResponse.data);
    // let finalFlattenedArray = [];

    // let jsonResult = {};
    // jsonResult = await xmlToJson(amadeusResponse.data);
    if (
      amadeusResponse.status == 200 &&
      !jsonResult["soapenv:Envelope"]["soapenv:Body"][
        "Fare_MasterPricerTravelBoardSearchReply"
      ]["errorMessage"]
    ) {
      jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      const recommendationObject = await obj.recommendation;

      const baggageReference = await obj.serviceFeesGrp;
      const freeBaggageAllowance = baggageReference?.freeBagAllowanceGrp;
      let count = 0;
      const segNumber = recommendationObject.map((item, index) => {
        return item.segmentFlightRef.length || 1;
      });
      segNumber.forEach((item, index) => {
        count = count + item;
      });

      const baggaReferenceArray = recommendationObject.reduce(
        (accumulator, item) => {
          if (Array.isArray(item.segmentFlightRef)) {
            accumulator.push(...item.segmentFlightRef);
          } else if (
            item.segmentFlightRef &&
            item.segmentFlightRef.referencingDetail
          ) {
            accumulator.push({ ...item.segmentFlightRef });
          }
          return accumulator;
        },
        []
      );
      // console.log("baggaReferenceArray=============", obj.flightIndex);
      const modifiedArray = [];
      let tempIndex = 0;
      for (let i = 0; i < segNumber.length; i++) {
        for (let j = 0; j < segNumber[i]; j++) {
          modifiedArray.push({
            ...obj.flightIndex.groupOfFlights[j + tempIndex],
            ...obj.recommendation[i].paxFareProduct,
            ...obj.recommendation[i].recPriceInfo,
          });
          // console.log(obj.flightIndex.groupOfFlights[j], "flighNumber");
        }
        tempIndex = tempIndex + segNumber[i];
      }
      flattenedArray.push(...modifiedArray);

      const newFlattnedArray = flattenedArray.map((item, index) => {
        return { ...item, baggage: baggaReferenceArray[index] };
      });
      // console.log(newFlattnedArray[0].baggage.referencingDetail,"newFlattnedArray")
      finalFlattenedArray = newFlattnedArray.map((item, index) => {
        const tempItemBaggage = item.baggage.referencingDetail[1].refNumber;

        // Check if baggageReference.serviceCoverageInfoGrp exists
        if (
          !baggageReference.serviceCoverageInfoGrp ||
          !baggageReference.serviceCoverageInfoGrp[tempItemBaggage - 1]
        ) {
          return { ...item, baggage: undefined };
        }
        const serviceCovInfoGrp =
          baggageReference.serviceCoverageInfoGrp[tempItemBaggage - 1]
            .serviceCovInfoGrp;

        // Check if refInfo exists
        const refInfo = serviceCovInfoGrp?.refInfo;
        if (!refInfo) {
          return { ...item, baggage: undefined };
        }
        const freeAllowanceLuggageIndex = Array.isArray(refInfo)
          ? refInfo.map((info) => info.referencingDetail.refNumber)
          : [refInfo.referencingDetail.refNumber];

        return {
          ...item,
          baggage:
            freeBaggageAllowance[freeAllowanceLuggageIndex - 1] ||
            freeBaggageAllowance,
        };
      });
      // console.log(finalFlattenedArray,"finalFlattenedArray")
    }

    var finalResult = [];
    var selectedArray = [];
    if (tvoArray.length > 0) {
      // console.log("tvoArray.length===========",tvoArray.length);
      selectedArray = await tvoArray.filter((value) => value.IsLCC === true);
      // console.log("finalFlattenedArray=================finalFlattenedArray====",finalFlattenedArray.length);
      if (selectedArray.length > 0) {
        // console.log("selectedArray.length===========",selectedArray.length);
        finalResult = finalFlattenedArray.concat(selectedArray);
        // console.log("v======finalResult==========",finalResult.length);
      } else if (finalFlattenedArray.length <= 0) {
        finalResult = [...tvoArray];
      } else {
        finalResult = [...finalFlattenedArray];
      }
    } else {
      finalResult = [...finalFlattenedArray];
    }
    const length = {
      finalFlattenedArray: finalFlattenedArray.length,
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
        // const totalFare = parseInt(finalRep.monetaryDetail[0].amount);
        // const totalTax = parseInt(finalRep.monetaryDetail[1].amount);
        // const totalAmount = totalFare + totalTax;
        // const totalFare =  parseInt(finalRep.paxFareDetail?.totalFareAmount-finalRep?.paxFareDetail?.totalTaxAmount);
        // console.log("finalRep.paxFareDetail?.totalFareAmount=",typeof(finalRep.paxFareDetail?.totalFareAmount));
        const totalFare =
          Number(finalRep.paxFareDetail?.totalFareAmount) -
          Number(finalRep?.paxFareDetail?.totalTaxAmount);
        // console.log("totalFar=========",typeof(totalFare));
        const totalTax = parseInt(finalRep.monetaryDetail[1].amount);
        const totalAmount = totalFare + totalTax;
        // finalRep.totalAmount = totalAmount;
        finalRep.TotalPublishFare = totalFare;
        // finalRep.totalAmount = totalAmount;
        finalRep.TotalPublishFare = parseInt(totalFare);
        //   // }
        // }
        // finalRep.TotalPublishFare = totalPublishFare;
      } else if (finalRep.Segments) {
        const totalPublishFare = finalRep.Fare.BaseFare;
        finalRep.TotalPublishFare = totalPublishFare;
        // const totalPublishFare = finalRep.Fare.PublishedFare;
        // finalRep.TotalPublishFare = totalPublishFare;
      }
    }
    const sortedData = finalResult.sort(
      (a, b) => a.TotalPublishFare - b.TotalPublishFare
    );
    if(sortedData.length>0){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        tvoTraceId: tvoResponse.data.Response.TraceId,
        result: sortedData,
        length: length,
        tvoArray: tvoArray,
      });
    }else{
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        
      });
    }
   
  } catch (error) {
    // console.error("Error while trying to get response", error);
    return next(error);
  }
};
exports.AMADEUSPriceSort = async (req, res, next) => {
  try {
    let tvoArray = [];
    const data = req.body;
    // console.log("===============", data);
    data.formattedDate = moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY"); // Format the date as "DDMMYY"
    // console.log("data.formattedDate==============", data.formattedDate);
    data.totalPassenger = parseInt(data.AdultCount) + parseInt(data.ChildCount);
    const flattenedArray = [];
    let finalFlattenedArray = [];

    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const amadeusResponse = await axios
      .post(url, generateAmadeusRequest(data), {
        headers,
      })
      .catch((error) => {
        console.error("Error in Amadeus API request:", error);
        return { data: {} };
      });
    let jsonResult = await xmlToJson(amadeusResponse.data);
    if (
      amadeusResponse.status === 200 &&
      !jsonResult["soapenv:Envelope"]["soapenv:Body"][
        "Fare_MasterPricerTravelBoardSearchReply"
      ]["errorMessage"]
    ) {
      jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      const recommendationObject = await obj.recommendation;
      const baggageReference = await obj.serviceFeesGrp;
      const freeBaggageAllowance = baggageReference?.freeBagAllowanceGrp;
      let count = 0;
      const segNumber = recommendationObject.map((item, index) => {
        return item.segmentFlightRef.length || 1;
      });
      segNumber.forEach((item, index) => {
        count = count + item;
      });
      const baggaReferenceArray = recommendationObject.reduce(
        (accumulator, item) => {
          if (Array.isArray(item.segmentFlightRef)) {
            accumulator.push(...item.segmentFlightRef);
          } else if (
            item.segmentFlightRef &&
            item.segmentFlightRef.referencingDetail
          ) {
            accumulator.push({ ...item.segmentFlightRef });
          }
          return accumulator;
        },
        []
      );
      // console.log("baggaReferenceArray=============", obj.flightIndex);
      const modifiedArray = [];
      let tempIndex = 0;
      for (let i = 0; i < segNumber.length; i++) {
        for (let j = 0; j < segNumber[i]; j++) {
          modifiedArray.push({
            ...obj.flightIndex.groupOfFlights[j + tempIndex],
            ...obj.recommendation[i].paxFareProduct,
            ...obj.recommendation[i].recPriceInfo,
          });
        }
        tempIndex = tempIndex + segNumber[i];
      }
      flattenedArray.push(...modifiedArray);
      const newFlattnedArray = flattenedArray.map((item, index) => {
        return { ...item, baggage: baggaReferenceArray[index] };
      });
      finalFlattenedArray = newFlattnedArray.map((item, index) => {
        const tempItemBaggage = item.baggage.referencingDetail[1].refNumber;

        // Check if baggageReference.serviceCoverageInfoGrp exists
        if (
          !baggageReference.serviceCoverageInfoGrp ||
          !baggageReference.serviceCoverageInfoGrp[tempItemBaggage - 1]
        ) {
          return { ...item, baggage: undefined };
        }
        const serviceCovInfoGrp =
          baggageReference.serviceCoverageInfoGrp[tempItemBaggage - 1]
            .serviceCovInfoGrp;

        // Check if refInfo exists
        const refInfo = serviceCovInfoGrp?.refInfo;
        if (!refInfo) {
          return { ...item, baggage: undefined };
        }
        const freeAllowanceLuggageIndex = Array.isArray(refInfo)
          ? refInfo.map((info) => info.referencingDetail.refNumber)
          : [refInfo.referencingDetail.refNumber];

        return {
          ...item,
          baggage:
            freeBaggageAllowance[freeAllowanceLuggageIndex - 1] ||
            freeBaggageAllowance,
        };
      });
    }
    var finalResult = [];
    var selectedArray = [];
    finalResult = [...finalFlattenedArray];
    const length = {
      finalFlattenedArray: finalFlattenedArray.length,
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
        // const totalFare = parseInt(finalRep.monetaryDetail[0].amount);
        // const totalTax = parseInt(finalRep.monetaryDetail[1].amount);
        // const totalAmount = totalFare + totalTax;
        // const totalFare =  parseInt(finalRep.paxFareDetail?.totalFareAmount-finalRep?.paxFareDetail?.totalTaxAmount);
        // console.log("finalRep.paxFareDetail?.totalFareAmount=",typeof(finalRep.paxFareDetail?.totalFareAmount));
        const totalFare =
          Number(finalRep.paxFareDetail?.totalFareAmount) -
          Number(finalRep?.paxFareDetail?.totalTaxAmount);
        // console.log("totalFar=========",typeof(totalFare));
        const totalTax = parseInt(finalRep.monetaryDetail[1].amount);
        const totalAmount = totalFare + totalTax;
        // finalRep.totalAmount = totalAmount;
        finalRep.TotalPublishFare = totalFare;
        // finalRep.totalAmount = totalAmount;
        finalRep.TotalPublishFare = parseInt(totalFare);
        //   // }
        // }
        // finalRep.TotalPublishFare = totalPublishFare;
      } else if (finalRep.Segments) {
        const totalPublishFare = finalRep.Fare.BaseFare;
        finalRep.TotalPublishFare = totalPublishFare;
        // const totalPublishFare = finalRep.Fare.PublishedFare;
        // finalRep.TotalPublishFare = totalPublishFare;
      }
    }

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      tvoTraceId: null,
      result: finalResult,
      length: length,
      tvoArray: tvoArray,
    });
  } catch (error) {
    // console.error("Error while trying to get response", error);
    return next(error);
  }
};
//optimize performance
exports.AMADEUSPriceSortOptimize = async (req, res, next) => {
  try {
    const data = req.body;

    // Format date
    data.formattedDate = moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY");

    // Calculate total passengers
    data.totalPassenger = parseInt(data.AdultCount) + parseInt(data.ChildCount);

    // Define request headers
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };

    // Make API request
    const amadeusResponse = await axios
      .post(url, generateAmadeusRequest(data), { headers })
      .catch((error) => {
        console.error("Error in Amadeus API request:", error);
        return { data: {} };
      });

    // Parse XML to JSON
    let jsonResult = await xmlToJson(amadeusResponse.data);

    if (
      amadeusResponse.status === 200 &&
      !jsonResult["soapenv:Envelope"]["soapenv:Body"][
        "Fare_MasterPricerTravelBoardSearchReply"
      ]["errorMessage"]
    ) {
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      const { recommendation, serviceFeesGrp: baggageReference } = obj;

      // Flatten recommendations
      let flattenedArray = recommendation.flatMap((rec, i) => {
        const segNumber = rec.segmentFlightRef.length || 1;
        return Array.from({ length: segNumber }, (_, j) => ({
          ...obj.flightIndex.groupOfFlights[
            j +
              (i > 0
                ? recommendation
                    .slice(0, i)
                    .reduce((sum, rec) => sum + rec.segmentFlightRef.length, 0)
                : 0)
          ],
          ...rec.paxFareProduct,
          ...rec.recPriceInfo,
        }));
      });

      // Add baggage info
      const baggaReferenceArray = recommendation
        .flatMap((rec) =>
          Array.isArray(rec.segmentFlightRef)
            ? rec.segmentFlightRef
            : [rec.segmentFlightRef]
        )
        .map((ref) => ({ ...ref }));

      const newFlattnedArray = flattenedArray.map((item, index) => {
        const tempItemBaggage = item.baggage?.referencingDetail[1]?.refNumber;

        if (!baggageReference?.serviceCoverageInfoGrp?.[tempItemBaggage - 1]) {
          return { ...item, baggage: undefined };
        }

        const serviceCovInfoGrp =
          baggageReference.serviceCoverageInfoGrp[tempItemBaggage - 1]
            .serviceCovInfoGrp;
        const refInfo = serviceCovInfoGrp?.refInfo;

        if (!refInfo) return { ...item, baggage: undefined };

        const freeAllowanceLuggageIndex = Array.isArray(refInfo)
          ? refInfo.map((info) => info.referencingDetail.refNumber)
          : [refInfo.referencingDetail.refNumber];

        return {
          ...item,
          baggage:
            freeBaggageAllowance[freeAllowanceLuggageIndex - 1] ||
            freeBaggageAllowance,
        };
      });

      // Calculate total publish fare
      newFlattnedArray.forEach((finalRep) => {
        if (finalRep.paxFareDetail) {
          const totalFare =
            Number(finalRep.paxFareDetail.totalFareAmount) -
            Number(finalRep.paxFareDetail.totalTaxAmount);
          const totalTax = parseInt(finalRep.monetaryDetail?.[1]?.amount || 0);
          finalRep.TotalPublishFare = totalFare + totalTax;
        } else if (finalRep.Segments) {
          finalRep.TotalPublishFare = finalRep.Fare.BaseFare;
        }
      });

      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        tvoTraceId: null,
        result: newFlattnedArray,
        length: {
          finalFlattenedArray: newFlattnedArray.length,
        },
      });
    } else {
      return res.status(statusCode.ERROR).send({
        statusCode: statusCode.ERROR,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        tvoTraceId: null,
        result: [],
        length: { finalFlattenedArray: 0 },
      });
    }
  } catch (error) {
    console.error("Error while processing request:", error);
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
      const recommendationObject = await obj.recommendation;
      var segNumber = [];
      // if(recommendationObject.length>0){
      segNumber = recommendationObject.map((item, index) => {
        return item.segmentFlightRef.length || 1;
      });
      // }

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
              finalResult.push(amadeusObj);
              addedObjects.add(amadeusObj);
            }
          }
        } else {
          if (!addedObjects.has(tvoObj)) {
            finalResult.push(tvoObj);
            addedObjects.add(tvoObj);
          }
        }
      }
    }
    // Iterate through each object in amadeus that hasn't been added
    for (const amadeusObj of flattenedArray) {
      if (!addedObjects.has(amadeusObj)) {
        finalResult.push(amadeusObj);
        addedObjects.add(amadeusObj);
      }
    }
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

exports.combineTVOAMADEUSOptimised = async (req, res, next) => {
  try {
    const data = req.body;
    data.formattedDate = moment(
      data.Segments[0].PreferredDepartureTime,
      "DD MMM, YY"
    ).format("DDMMYY");
    data.totalPassenger = parseInt(data.AdultCount) + parseInt(data.ChildCount);
    const api1Url = commonUrl.api.flightSearchURL;

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

    let tvoArray = [];
    if (tvoResponse.data.Response.ResponseStatus === 1) {
      tvoArray = tvoResponse.data.Response.Results[0];
    }
    console.log("amadeusResponse============", amadeusResponse);
    let finalFlattenedArray = [];
    if (amadeusResponse.status === 200) {
      const jsonResult = await xmlToJson(amadeusResponse.data);
      const obj =
        jsonResult["soapenv:Envelope"]["soapenv:Body"][
          "Fare_MasterPricerTravelBoardSearchReply"
        ];
      const recommendationObject = obj.recommendation;
      const baggageReference = obj.serviceFeesGrp;
      const freeBaggageAllowance = baggageReference?.freeBagAllowanceGrp;

      const flattenedArray = recommendationObject.reduce((acc, item, index) => {
        const segRefs = Array.isArray(item.segmentFlightRef)
          ? item.segmentFlightRef
          : [item.segmentFlightRef];
        const flightGroup = obj.flightIndex.groupOfFlights[index];
        const fareProduct = item.paxFareProduct;
        const recPriceInfo = item.recPriceInfo;

        segRefs.forEach((segRef, i) => {
          const baggage = segRefs[i];
          acc.push({
            ...flightGroup,
            ...fareProduct,
            ...recPriceInfo,
            baggage,
          });
        });
        return acc;
      }, []);

      finalFlattenedArray = flattenedArray.map((item, index) => {
        const baggageIndex = item.baggage.referencingDetail[1].refNumber - 1;
        const freeAllowanceIndex =
          baggageReference.serviceCoverageInfoGrp[baggageIndex]
            .serviceCovInfoGrp.refInfo.referencingDetail.refNumber - 1;
        return { ...item, baggage: freeBaggageAllowance[freeAllowanceIndex] };
      });
    }

    const selectedArray = tvoArray.filter((value) => value.IsLCC);
    let finalResult = [...finalFlattenedArray, ...selectedArray];

    if (selectedArray.length === 0 && finalFlattenedArray.length === 0) {
      finalResult = [...tvoArray];
    }

    finalResult = finalResult.map((finalRep) => {
      if (finalRep.propFlightGrDetail) {
        const totalFare = parseInt(finalRep.monetaryDetail[0].amount);
        const totalTax = parseInt(finalRep.monetaryDetail[1].amount);
        finalRep.TotalPublishFare = totalFare + totalTax;
      } else if (finalRep.Segments) {
        finalRep.TotalPublishFare = finalRep.Fare.PublishedFare;
      }
      return finalRep;
    });

    const sortedData = finalResult.sort(
      (a, b) => a.TotalPublishFare - b.TotalPublishFare
    );

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      tvoTraceId: tvoResponse.data.Response.TraceId,
      result: sortedData,
      length: {
        finalFlattenedArray: finalFlattenedArray.length,
        tvoArray: tvoArray.length,
        finalResult: finalResult.length,
        selectedArray: selectedArray.length,
      },
    });
  } catch (error) {
    console.error("Error while trying to get response", error);
    return next(error);
  }
};

exports.combineTvoAmadeusReturn = async (req, res, next) => {
  try {
    const data = req.body;
    data.formattedDate = moment(data.Segments[0].PreferredDepartureTime,"YYYY-MM-DDTHH:mm:ss").format("DDMMYY");
    data.formattedDate1 = moment(data.returnDate, "YYYY-MM-DDTHH:mm:ss").format("DDMMYY");
    const api1Url = commonUrl.api.flightSearchURL;
    data.totalPassenger = parseInt(data.AdultCount) + parseInt(data.ChildCount);
    const flattenedArray = [];
    const headers = {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "http://webservices.amadeus.com/FMPTBQ_23_4_1A",
    };
    const [tvoResponse, amadeusResponse] = await Promise.all([
      axios.post(api1Url, data),
      await axios
        .post(url, generateAmadeusReturn(data), { headers })
        .catch((error) => {
          console.error("Error in Amadeus API request:", error);
          return { data: {} };
        }),
    ]);

    let jsonResult = await xmlToJson(amadeusResponse.data);
    if (amadeusResponse.status == 200 &&!jsonResult["soapenv:Envelope"]["soapenv:Body"]["Fare_MasterPricerTravelBoardSearchReply"]["errorMessage"]) {
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
              ...obj.flightIndex[0].groupOfFlights[j],
              ...obj.flightIndex[1].groupOfFlights[j],
              ...recommendationObject[i].paxFareProduct,
            });
          }
          flattenedArray.push(...modifiedArray);
        }
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          // tvoTraceId: tvoResponse.data.Response.TraceId,
          result: flattenedArray,
          amadus: obj,
          length:flattenedArray.length
    
        });
    }
    
    
  } catch (error) {
    // console.error("Error while trying to get response", error);
    return next(error);
  }
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
              <travelFlightInfo>
                <cabinId>
                 <cabin>${data?.cabinClass || "Y"}</cabin>
                </cabinId>
              </travelFlightInfo>
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

const generateAmadeusReturn = (data) => {
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
              <travelFlightInfo>
                <cabinId>
                 <cabin>${data?.cabinClass || "Y"}</cabin>
                </cabinId>
              </travelFlightInfo>
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
              <itinerary>
        <requestedSegmentRef>
            <segRef>2</segRef>
        </requestedSegmentRef>
        <departureLocalization>
            <departurePoint>
                <locationId>${data.to}</locationId>
            </departurePoint>
        </departureLocalization>
        <arrivalLocalization>
            <arrivalPointDetails>
                <locationId>${data.from}</locationId>
            </arrivalPointDetails>
        </arrivalLocalization>
        <timeDetails>
            <firstDateTimeDetail>
                <date>${data.formattedDate1}</date>
            </firstDateTimeDetail>
        </timeDetails>
    </itinerary>
          </Fare_MasterPricerTravelBoardSearch>
      </soapenv:Body>
  </soapenv:Envelope>`;
  return soapRequest;
};
