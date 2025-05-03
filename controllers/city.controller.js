const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const {
  cityData,
  cityBusData,
  newhotelCityCode,
  cityBusProductionData,
  airlineData
} = require("../model/city.model");

const responseMessage = require("../utilities/responses");
const statusCode = require("../utilities/responceCode");


const requestIp = require('request-ip');
const geoip = require('geoip-lite');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
exports.searchCityData = async (req, res) => {
  try {

    const userIP = requestIp.getClientIp(req);

    // const userLocation = geoip.lookup(userIP);
    const userLocation = geoip.lookup(`${req.ip}`||'122.161.49.71');
    // console.log("location", userLocation)

    var regex = new RegExp(`^${escapeRegex(req.query.keyword)}`, "i");
    let response = await cityData.find({$or:[{ AirportCode: regex },{name:regex}, {state:regex},{CountryName:regex}]});


    // console.log(response.length);
    if(response.length===1){
      const value=response[0]?.state || response[0]?.CountryCode
     const addResponse = await cityData.find({$or:[{ state:value  },{CountryCode:value}]});
      // response=[...response, ...addResponse]

      response = combineUnique(response, addResponse, 'id');
    }




     // Sort the search results based on matching country code
     const sortedResponse = response.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const aCountryCode = a.CountryCode.trim().toUpperCase();
      const bCountryCode = b.CountryCode.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = aCountryCode === userCountryCode;
      const bIsMatch = bCountryCode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });

    

    const msg = "data searched successfully";
    actionCompleteResponse(res, sortedResponse, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};




const combineUnique = (array1, array2, uniqueKey) => {
  // Create a Set to track unique keys
  const seen = new Set();
  
  // Create a combined array with unique items
  const uniqueArray = [...array1, ...array2].filter(item => {
    const key = item[uniqueKey];
    if (seen.has(key)) {
      return false; // Duplicate
    } else {
      seen.add(key);
      return true; // Unique
    }
  });

  return uniqueArray;
};

exports.cityBusProductionData = async (req, res) =>{
  const result=await cityBusProductionData.insertMany(req.body);
  res.send({'Data':result})
}

//testing 

// exports.searchCityBusData = async (req, res) => {
//   try {

//     const keyword=req.query.keyword;
//     var regex = new RegExp(escapeRegex(keyword), "gi");
//     const response = await cityBusData.find({ CityName: regex }).select('-_id -__v');

//     const keywordLower = keyword.toLowerCase();

 
//     const startWithKeyword = response.filter(item => item.CityName.toLowerCase().startsWith(keywordLower));
//     const containsKeyword = response.filter(item => item.CityName.toLowerCase().includes(keywordLower) && !item.CityName.toLowerCase().startsWith(keywordLower));


//     const sortedStartWithKeyword = startWithKeyword.sort((a, b) => a.CityName.localeCompare(b.CityName));
//     const sortedContainsKeyword = containsKeyword.sort((a, b) => a.CityName.localeCompare(b.CityName));

//     // Combine results: starting with exact matches, followed by other matches
//     const sortedResponse = sortedStartWithKeyword.concat(sortedContainsKeyword);
//     const msg = "data searched successfully";
//     actionCompleteResponse(res, sortedResponse, msg);
//   } catch (error) {
//     sendActionFailedResponse(res, {}, error.message);
//   }
// };

//production


exports.searchCityBusData = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const regex = new RegExp(escapeRegex(keyword), "gi");

    // Fetch data from the database
    const response = await cityBusProductionData.find({ CityName: regex }).select('-__v -_id');


    const keywordLower = keyword.toLowerCase();

 
    const startWithKeyword = response.filter(item => item.CityName.toLowerCase().startsWith(keywordLower));
    const containsKeyword = response.filter(item => item.CityName.toLowerCase().includes(keywordLower) && !item.CityName.toLowerCase().startsWith(keywordLower));


    const sortedStartWithKeyword = startWithKeyword.sort((a, b) => a.CityName.localeCompare(b.CityName));
    const sortedContainsKeyword = containsKeyword.sort((a, b) => a.CityName.localeCompare(b.CityName));

    // Combine results: starting with exact matches, followed by other matches
    const sortedResponse = sortedStartWithKeyword.concat(sortedContainsKeyword);

    const msg = "Data searched successfully";
    actionCompleteResponse(res, sortedResponse, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};




exports.hotelCitySearch = async (req, res) => {
  try {

    const userIP = requestIp.getClientIp(req);

    // const userLocation = geoip.lookup(userIP);
    const userLocation = geoip.lookup(`${req.ip}` || '122.161.49.71');
    // console.log("location", userLocation)


    var regex = new RegExp(escapeRegex(req.query.keyword), "gi");
    const response = await newhotelCityCode.find({ Destination: regex });
    
    // Sort the search results based on matching country code
    const sortedResponse = response.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const acountrycode = a.countrycode.trim().toUpperCase();
      const bcountrycode = b.countrycode.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = acountrycode === userCountryCode;
      const bIsMatch = bcountrycode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });

    const msg = "data searched successfully";
    actionCompleteResponse(res, sortedResponse, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.searchCityFlight= async (req, res) =>{
  try {
    const allCityBusData = await cityData.find({});

    const responseData = allCityBusData.map((item) => ({
      id: item.id,
      code: item.code,
      AirportCode: item.AirportCode,
      name: item.name,
      CityCode: item.CityCode,
      CountryCode: item.CountryCode,    
      CountryName:item.CountryName
    }));
    const msg = "All data retrieved successfully";
    actionCompleteResponse(res, responseData, msg);
    
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}



exports.airlineDetails= async (req, res) =>{

  try {    

    const response=await airlineData.find().select('-_id');

    const msg = "Airline details fetch successfully";
    actionCompleteResponse(res, response, msg);

    
  } catch (error) {
    sendActionFailedResponse(res, {error}, error.message);    
  }
  
  
}


exports.getAirlineDetailsById=async(req,res,next)=>{
  try {
    const result=await airlineData.find({airlineCode:req.query.airlineCode});
    if(!result){
      const data={airlineCode:req.query.airlineCode,airlineName:"Flight"}
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: data,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
}