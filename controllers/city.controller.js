const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const {
  cityData,
  cityBusData,
  newhotelCityCode,
  cityBusProductionData
} = require("../model/city.model");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
exports.searchCityData = async (req, res) => {
  try {
    var regex = new RegExp(escapeRegex(req.query.keyword), "gi");
    const response = await cityData.find({ name: regex });
    const msg = "data searched successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.cityBusProductionData = async (req, res) =>{
  const result=await cityBusProductionData.insertMany(req.body);
  res.send({'Data':result})
}

//testing 

// exports.searchCityBusData = async (req, res) => {
//   try {
//     var regex = new RegExp(escapeRegex(req.query.keyword), "gi");
//     const response = await cityBusData.find({ CityName: regex });
//     const msg = "data searched successfully";
//     actionCompleteResponse(res, response, msg);
//   } catch (error) {
//     sendActionFailedResponse(res, {}, error.message);
//   }
// };

//production

exports.searchCityBusData = async (req, res) => {
  try {
    var regex = new RegExp(escapeRegex(req.query.keyword), "gi");
    const response = await cityBusProductionData.find({ CityName: regex });
    const msg = "data searched successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.hotelCitySearch = async (req, res) => {
  try {
    var regex = new RegExp(escapeRegex(req.query.keyword), "gi");
    const response = await newhotelCityCode.find({ $and: [{ country: "India" },{ Destination: regex }]});
    const msg = "data searched successfully";
    actionCompleteResponse(res, response, msg);
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
    }));
    const msg = "All data retrieved successfully";
    actionCompleteResponse(res, responseData, msg);
    
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}