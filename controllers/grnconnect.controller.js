const axios = require("axios");
const { api } = require("../common/const");
const moment = require("moment");
const { userIPDetail } = require("../model/city.model");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const {
  GrnCityList,
  GrnHotelCityMap,
  GrnCountryList,
  GrnHotelBooking,
  GrnLocationCityMap,
  GrnLocationMaster,
  TboHotelCityList,
  CombineHotelCityList,
} = require("../model/grnconnectModel");
const commonFunctions = require("../utilities/commonFunctions");





const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Encoding": "application/gzip",
  "api-key": process.env.GRNAPIKEY,
};


const baseurl = process.env.GRNURL;






//citylist data

exports.getCityListData = async (req, res) => {
  try {
    const data = req.query.keyword;
    const response = await GrnCityList.find({
      cityName: { $regex: data, $options: "i" },
    }).select("-_id");
    // const response=await exports.grnHotelCityMap(cityData[0].cityCode);

    msg = "City List Search Successfully!";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//get country list data

exports.getCountryList = async (req, res) => {
  try {
    const response = await GrnCountryList.find().select("-_id");
    msg = "Country List Search Successfully!";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//update cityList with countryName

exports.updateCityListWithCountryNames = async (req, res) => {
  try {
    // Retrieve all documents from grnCityList collection
    const cityDocuments = await GrnCityList.find({});

    // Iterate through each document in grnCityList collection
    for (const cityDoc of cityDocuments) {
      // Retrieve corresponding country document from grnCountryList
      const countryDoc = await GrnCountryList.findOne({
        countryCode: cityDoc.countryCode,
      });

      if (countryDoc) {
        // Update city document with country name
        await GrnCityList.updateOne(
          { _id: cityDoc._id },
          { $set: { countryName: countryDoc.countryName } }
        );
        
      } else {
        console.log(`Country not found for city: ${cityDoc.cityName}`);
      }
    }

    res.status(200).send("All cities updated with country names");
  } catch (error) {
    res.status(500).send("Error updating cities with country names");
  } finally {
    console.log("Disconnected from MongoDB");
  }
};

//hotel search

exports.hotelSearch = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const hotelCode = await exports.grnHotelCityMap(req.body.cityCode);

    const searchData = {
      rooms: req.body.rooms,
      rates: "comprehensive",
      hotel_codes: hotelCode,
      currency: req.body.currency,
      client_nationality: req.body.client_nationality,
      checkin: req.body.checkin,
      checkout: req.body.checkout,
      version: req.body.version,
      cutoff_time: 10000,
    };
   
    const response = await axios.post(
      `${baseurl}/api/v3/hotels/availability`,
      searchData,
      { headers }
    );

    msg = "Hotel Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//singleHotelSearch

exports.singleHotelSearch = async (req, res) => {
  try {
    const searchData = {
      rooms: req?.body?.rooms,
      rates: req?.body?.rates,
      hotel_codes: req?.body?.hotel_codes,
      currency: req?.body?.currency,
      client_nationality: req?.body?.client_nationality,
      checkin: req?.body?.checkin,
      checkout: req?.body?.checkout,
      version: req?.body?.version,
      cutoff_time: 3000,
    };
 
    const response = await axios.post(
      `${baseurl}/api/v3/hotels/availability`,
      searchData,
      { headers }
    );

    msg = "Single Hotel Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//hotel Search with pagination

exports.hotelSearchWithPagination = async (req, res) => {
  try {
    if (req?.body?.cityCode) {
      // Calculate pagination parameters
      const page = req.query.page ? parseInt(req.query.page) : 1; // Get page number from query parameter, default to 1 if not provided
      const limit = 100; // Set the limit of hotel codes per page

      // Fetch hotel codes with pagination
      const hotelCode = await exports.grnHotelCityMapWithPagination(
        req.body.cityCode,
        page,
        limit
      );

      const searchData = {
        rooms: req.body.rooms,
        rates: req.body.rates,
        hotel_codes: hotelCode,
        currency: req.body.currency,
        client_nationality: req.body.client_nationality,
        checkin: req.body.checkin,
        checkout: req.body.checkout,
        cutoff_time: 30000,
        version: req.body.version,
      };
      const response = await axios.post(
        `${baseurl}/api/v3/hotels/availability`,
        searchData,
        { headers }
      );
      msg = "Hotel Search Successfully!";
      return actionCompleteResponse(res, response.data, msg);
    } else {
      const searchData = {
        rooms: req?.body?.rooms,
        rates: req?.body?.rates,
        hotel_codes: req?.body?.hotel_codes,
        currency: req?.body?.currency,
        client_nationality: req?.body?.client_nationality,
        checkin: req?.body?.checkin,
        checkout: req?.body?.checkout,
        cutoff_time: 5000,
        version: req.body.version,
      };
      const response = await axios.post(
        `${baseurl}/api/v3/hotels/availability`,
        searchData,
        { headers }
      );
      msg = "Single Hotel Search Successfully!";

      actionCompleteResponse(res, response.data, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//searchMulitHotel

exports.searchMultiHotel = async (req, res) => {
  try {
    let results = [];
    if (req?.body?.cityCode) {
      const totalPage = await GrnHotelCityMap.countDocuments({
        cityCode: req?.body?.cityCode,
      });
      let page = Math.ceil(totalPage / 100);
      const limit = 100; // Set the limit of hotel codes per page
      const promises = [];
      for (let i = 1; i <= page; i++) {
        //  page = i + 1;
        promises.push(
          (async () => {
            const hotelCode = await exports.grnHotelCityMapWithPagination(
              req.body.cityCode,
              i,
              limit
            );
            const searchData = {
              rooms: req.body.rooms,
              rates: req.body.rates,
              hotel_codes: hotelCode,
              currency: req.body.currency,
              client_nationality: req.body.client_nationality,
              checkin: req.body.checkin,
              checkout: req.body.checkout,
              cutoff_time: 30000,
              version: req.body.version,
            };
            const response = await axios.post(
              `${baseurl}/api/v3/hotels/availability`,
              searchData,
              { headers }
            );
            return response.data;
          })()
        );
      }

      results = await Promise.all(promises);

      results = results.filter((result) => result && !result.errors);
      // const count=results?.reduce((accumulator ,hotel) => {
      //   return accumulator += hotel?.no_of_hotels;
      // }, 0); //count all hotels

      //function remove keys
      function removeKeys(obj, keys) {
        let newObj = { ...obj };
        keys.forEach((key) => {
          delete newObj[key];
        });
        return newObj;
      }

      // Keys to remove
      let keysToRemove = ["hotels", "search_id", "no_of_hotels"];

      let updatedObj = removeKeys(results?.[0], keysToRemove);

      //push hotels and search id for particular hotel

      let modifiedResults = results.reduce((acc, result) => {
        result?.hotels?.forEach((hotel) => {
          acc?.push({
            ...hotel,
            search_id: result?.search_id,
          });
        });
        return acc;
      }, []);

      modifiedResults = modifiedResults.sort((a, b) => {
        return a?.min_rate?.price - b?.min_rate?.price;
      });

      const finalResults = {
        hotels: [...modifiedResults],
        no_of_hotels: [...modifiedResults]?.length,
        ...updatedObj,
      };

      const msg = "Multiple Hotel Search Successfully!";
      return actionCompleteResponse(res, finalResults, msg);
    } else {
      const searchData = {
        rooms: req?.body?.rooms,
        rates: req?.body?.rates,
        hotel_codes: req?.body?.hotel_codes,
        currency: req?.body?.currency,
        client_nationality: req?.body?.client_nationality,
        checkin: req?.body?.checkin,
        checkout: req?.body?.checkout,
        cutoff_time: 5000,
        version: req.body.version,
      };
      const response = await axios.post(
        `${baseurl}/api/v3/hotels/availability`,
        searchData,
        { headers }
      );
      const msg = "Single Hotel Search Successfully!";

      if (response.data.hotels) {
        response.data.hotels.forEach((hotel) => {
          hotel.search_id = response.data.search_id;
        });

        // Remove search_id from the root level
        delete response.data.search_id;
      }
      // Optionally, prepare the modified data
      const modifiedData = response.data;
      return actionCompleteResponse(res, modifiedData, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//refetch Hotel

exports.refetchHotel = async (req, res) => {
  try {
    const SearchId = req.query.searchId;
    const hcode = req.query.hcode;


    const response = await axios.get(
      `${baseurl}/api/v3/hotels/availability/${SearchId}?hcode=${hcode}&bundled=true`,
      { headers }
    );

    msg = "Hotel Refetch Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

// rate Refetch Hotel

exports.rateRefetchHotel = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const searchId = req.query.searchId;

    const response = await axios.post(
      `${baseurl}/api/v3/hotels/availability/${searchId}/rates/auto?action=recheck`,
      data,
      { headers }
    );

    msg = "Hotel Rate Refetch Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//grnHotelCityMap

exports.grnHotelCityMap = async (cityCode) => {
  try {
    const hotelCodes = await GrnHotelCityMap.find({ cityCode: cityCode });

    const codedata = hotelCodes.map((item) => `${item.hotelCode}`);
    return codedata;
  } catch (error) {
    throw new Error(error.message);
  }
};

//grnHotelCityMap with pagination

exports.grnHotelCityMapWithPagination = async (cityCode, page, limit) => {
  try {
    const hotelCodes = await GrnHotelCityMap.find({ cityCode: cityCode })
      .skip((page - 1) * limit)
      .limit(limit);

    const codedata = hotelCodes.map((item) => `${item.hotelCode}`);
    return codedata;
  } catch (error) {
    throw new Error(error.message);
  }
};

//hotel code length

exports.hotelCodeLength = async (cityCode) => {
  try {
    const hotelCodes = await GrnHotelCityMap.find({ cityCode: cityCode });
    const hotelLength = hotelCodes.length / 100;
    //  hotelLength=Number(hotelLength);

    return hotelLength > 1 ? parseInt(Number(hotelLength) + Number(1)) : 1;
  } catch (error) {
    throw new Error(error.message);
  }
};

//get hotel Images

exports.hotelImages = async (req, res) => {
  try {
    const hotelCode = req.query.hotelCode;
    const response = await axios.get(
      `${baseurl}/api/v3/hotels/${hotelCode}/images?version=2.0`,
      { headers }
    );

    msg = "Hotel Images Search Successfully!";

    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//bundledRates

exports.bundledRates = async (req, res) => {
  try {
    const data = req.query.searchId;
    const payload = {
      ...req.body,
    };

    const response = await axios.post(
      `${baseurl}/api/v3/hotels/availability/${data}/rates/?action=recheck`,
      payload,
      { headers }
    );

    msg = "bunled Rates fetch Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//hotel booking

exports.hotelBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const userIP = requestIp.getClientIp(req);
    const userBookingIpDetails = {
      userIp: userIP,
      bookingType: "HotelBookingGrn",
    };

    await userIPDetail.create(userBookingIpDetails);

    const response = await axios.post(
      `${baseurl}/api/v3/hotels/bookings`,
      data,
      { headers }
    );

    msg = "Hotel Booking Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//hotel Fetch Booking

exports.hotelFetchBooking = async (req, res) => {
  try {
    const data = req.query.bref;

    const response = await axios.post(
      `${baseurl}/api/v3/hotels/bookings/${data}?type=value`,
      { headers }
    );

    msg = "Hotel Booking Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//cancel hotel booking

exports.hotelCancelBooking = async (req, res) => {
  try {
    const bookingId = req.query.bookingId;
    const data = {
      ...req.body,
    };


    const response = await axios.delete(
      `${baseurl}/api/v3/hotels/bookings/${bookingId}`,
      { headers }
    );

    msg = "Hotel Booking Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.addHotelBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const response = await GrnHotelBooking.create(data);

    await commonFunctions.grnHotelBookingConfirmationMailWithPdf(response);

    msg = "Hotel Booking Save Successfully in Data Base !";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//getAllAgentBooking

exports.getAllAgentBooking = async (req, res) => {
  const { page, size, search, userId } = req.query;

  try {
    const limit = Number.parseInt(req?.query?.size) || 20;

    const page = Number.parseInt(req?.query?.page) || 1;
    const sortBy = req.query.sort || "createdAt";
    const skip = limit * (page - 1);
    const totalPages = await GrnHotelBooking.countDocuments();

    const docs = await GrnHotelBooking.find({ userId })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    actionCompleteResponse(res, { docs, totalPages }, "success");
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

// getGrnAgentSingleBooking

exports.getGrnAgentSingleBooking = async (req, res) => {
  const { id } = req.query;

  try {
    // const limit=Number.parseInt(req?.query?.size)||20;

    // const page=Number.parseInt(req?.query?.page)||1;
    // const sortBy=req.query.sort||'createdAt';
    // const skip=limit*(page-1);
    // const totalPages=await GrnHotelBooking.countDocuments();

    const result = await GrnHotelBooking.findOne({ _id: id });

    actionCompleteResponse(res, result, "success");
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//getCityAndHotelSearch

// exports.getCityAndHotelSearch = async (req, res) => {

//   try {

//     const data=req.query.keyword;
//     const resCityList = await GrnCityList.find({"cityName":{$regex:data, $options:"i"}}).select('-_id');
//     const resHotelList= await GrnHotelCityMap.find({$or:[{"address":{$regex:data, $options:"i"}},{"hotelName":{$regex:data, $options:"i"}}]}).select('-_id');

//     const response=[...resCityList,...resHotelList];
//     msg = "Search City and Hotel Successfully!";
//     actionCompleteResponse(res, response, msg);

//   } catch (err) {
//     sendActionFailedResponse(res, {}, err.message);

//   }

// }

exports.getCityAndHotelSearch = async (req, res) => {
  try {
    // const userIP = requestIp.getClientIp(req);
    const userIP = "223.178.216.116";

    const userLocation = geoip.lookup(userIP);

    const keyword = req.query.keyword;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    if (!keyword) {
      return sendActionFailedResponse(res, {}, "Keyword is required.");
    }

    // Perform city and hotel searches concurrently
    // const [cityList, hotelList] = await Promise.all([
    //   GrnCityList.find({ cityName: { $regex: keyword, $options: "i" } }).select('-_id').skip(skip).limit(limit),
    //   GrnHotelCityMap.find({ hotelName: { $regex: keyword, $options: "i" } }).select('-_id -longitude -latitude').skip(skip).limit(limit)
    // ]);

    let [cityList, hotelList] = await Promise.all([
      GrnCityList.find({ cityName: { $regex: keyword, $options: "i" } })
        .select("-_id")
        .skip(skip)
        .limit(limit),
      GrnHotelCityMap.aggregate([
        {
          $match: { hotelName: { $regex: keyword, $options: "i" } },
        },
        {
          $lookup: {
            from: "grnCountryList",
            localField: "countryCode",
            foreignField: "countryCode",
            as: "countryDetails",
          },
        },
        {
          $unwind: "$countryDetails",
        },
        {
          $addFields: {
            // cityName: "$countryDetailsWithCity.cityName",
            countryName: "$countryDetails.countryName",
          },
        },
        {
          $project: {
            hotelCode: 1,
            hotelName: 1,
            cityCode: 1,
            countryCode: 1,
            countryName: 1,
            // cityName:1,
            address: 1,
            latitude: 1,
            longitude: 1,
          },
        },
        {
          $skip: skip, // Applies the skip for pagination
        },
        {
          $limit: limit, // Applies the limit for pagination
        },
      ]),
    ]);

    cityList = cityList.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const acountrycode = a.countryCode.trim().toUpperCase();
      const bcountrycode = b.countryCode.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = acountrycode === userCountryCode;
      const bIsMatch = bcountrycode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });
    hotelList = hotelList.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const acountrycode = a.countryCode.trim().toUpperCase();
      const bcountrycode = b.countryCode.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = acountrycode === userCountryCode;
      const bIsMatch = bcountrycode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });

    // const response = [...cityList, ...hotelList];
    const message =
      cityList.length >= 1
        ? "Search City and Hotel Successfully!"
        : "No Data Found!";

    actionCompleteResponse(res, { cityList, hotelList }, message);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//hotel search with hotel code

exports.hotelSearchWithCode = async (req, res) => {
  try {
    const response = await axios.post(
      `${baseurl}/api/v3/hotels/availability`,
      req.body,
      { headers }
    );

    msg = "Hotel Search Successfully!";
    actionCompleteResponse(res, response.data, msg);
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
};

//getAllhotelLocationCode using city code

exports.getAllhotelLocationName = async (req, res) => {
  try {
    // Query to find location codes
    const cityCode = req.query.cityCode;
    // const cityCode = "124054";
    const result = await GrnLocationCityMap.find({ cityCode });

    // Extract location codes using map
    const locationCodes = result.map((item) => item.locationCode);

    // Query to find location names using the extracted location codes
    const results = await GrnLocationMaster.find({
      locationCode: { $in: locationCodes },
    });

    // Extract location names using map
    const locationNames = results.map((item) => item.locationName);


    actionCompleteResponse(res, locationNames, "success");
  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }
};

// searchHotelByName

exports.searchHotelByName = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const query = {
      $or: [
        { hotelName: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } },
      ],
    };

    // Using countDocuments as a function and then the same query for retrieving documents
    // const count = await GrnHotelCityMap.countDocuments(query);
    const response = await GrnHotelCityMap.find(query);

    actionCompleteResponse(res, response, "success");
  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }
};

//tboandGrnCityList

exports.tboandGrnCityList = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    // Fetch data from both collections
    const tboData = await TboHotelCityList.find({
      cityName: { $regex: keyword, $options: "i" },
    }).lean();
    const grnData = await GrnCityList.find({
      cityName: { $regex: keyword, $options: "i" },
    }).lean();

    // Create a map to handle merging and filtering duplicates
    const mergedMap = new Map();

    // Process TboHotelCityList data
    tboData.forEach((tboItem) => {
      if (!mergedMap.has(tboItem.cityName)) {
        mergedMap.set(tboItem.cityName, {
          cityName: tboItem.cityName,
          tboCityCode: tboItem.cityCode || null,
          tboCountryName: tboItem.countryName || null,
          tboCountryCode: tboItem.countryCode || null,
          tbostateProvince: tboItem.stateProvince || null,
          tbostateProvinceCode: tboItem.stateProvinceCode || null,
          grnCityCode: null,
          grnCountryName: null,
          grnCountryCode: null,
        });
      } else {
        // Update existing entry with TboHotelCityList data
        const existingItem = mergedMap.get(tboItem.cityName);
        existingItem.tboCityCode = tboItem.cityCode || existingItem.tboCityCode;
        existingItem.tboCountryName =
          tboItem.countryName || existingItem.tboCountryName;
        existingItem.tboCountryCode =
          tboItem.countryCode || existingItem.tboCountryCode;
        existingItem.tbostateProvince =
          tboItem.tbostateProvince || existingItem.tbostateProvince;
        existingItem.tbostateProvinceCode =
          tboItem.tbostateProvinceCode || existingItem.tbostateProvinceCode;
      }
    });

    // Process GrnCityList data
    grnData.forEach((grnItem) => {
      if (!mergedMap.has(grnItem.cityName)) {
        mergedMap.set(grnItem.cityName, {
          cityName: grnItem.cityName,
          tboCityCode: null,
          tboCountryName: null,
          tboCountryCode: null,
          tbostateProvince: null,
          tbostateProvinceCode: null,
          grnCityCode: grnItem.cityCode || null,
          grnCountryName: grnItem.countryName || null,
          grnCountryCode: grnItem.countryCode || null,
        });
      } else {
        // Update existing entry with GrnCityList data
        const existingItem = mergedMap.get(grnItem.cityName);
        existingItem.grnCityCode = grnItem.cityCode || existingItem.grnCityCode;
        existingItem.grnCountryName =
          grnItem.countryName || existingItem.grnCountryName;
        existingItem.grnCountryCode =
          grnItem.countryCode || existingItem.grnCountryCode;
      }
    });

    // Create an array from the map and handle merging duplicates based on country name and code
    const mergedData = Array.from(mergedMap.values());

    // Deduplicate based on exact matches of CountryName and CountryCode
    let finalData = [];
    const seen = new Map();

    mergedData.forEach((item) => {
      const key = `${item.cityName}-${
        item.tboCountryName || item.grnCountryName
      }-${item.tboCountryCode || item.grnCountryCode}`;
      if (!seen.has(key)) {
        seen.set(key, true);
        finalData.push(item);
      }
    });

    finalData = finalData.sort((a, b) => a.cityName.localeCompare(b.cityName));

    // const sortCitiesByExactMatch=(finalData,keyword)=>{

    const term = keyword.toLowerCase();

    finalData = finalData.sort((a, b) => {
      // Convert city names to lowercase for case-insensitive comparison
      const cityNameA = a.cityName.toLowerCase();
      const cityNameB = b.cityName.toLowerCase();

      // Check for exact matches
      const isExactMatchA = cityNameA === term;
      const isExactMatchB = cityNameB === term;

      // Sort exact matches to the top
      if (isExactMatchA && !isExactMatchB) return -1;
      if (!isExactMatchA && isExactMatchB) return 1;

      // For non-exact matches, retain original order
      return 0;
    });
    // Send response
    actionCompleteResponse(res, finalData, "success");
  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }
};

//combineHotelCityList

exports.combineHotelCityList = async (req, res) => {
  try {
    const grnCities = await GrnCityList.find();
    const tboCities = await TboHotelCityList.find();


    const tboCityMap = new Map();
    tboCities.forEach((city) => {
      const key = `${city.cityName.toLowerCase()}_${city.countryCode.toLowerCase()}`;
      tboCityMap.set(key, city);
    });

    // Merge cities
    const mergedCities = [];
    grnCities.forEach((grnCity) => {
      const key = `${grnCity.cityName.toLowerCase()}_${grnCity.countryCode.toLowerCase()}`;
      const tboCity = tboCityMap.get(key);

      if (tboCity) {
        const mergedCity = {
          cityName: grnCity.cityName,
          tboCityCode: tboCity.cityCode,
          tboCountryName: tboCity.countryName,
          tboCountryCode: tboCity.countryCode,
          tbostateProvince: tboCity.stateProvince,
          tbostateProvinceCode: tboCity.stateProvinceCode,
          grnCityCode: grnCity.cityCode,
          grnCountryName: grnCity.countryName,
          grnCountryCode: grnCity.countryCode,
        };

        mergedCities.push(mergedCity);
      }
    });

    // Insert merged cities into a new MongoDB collection
    // const mergedCollection = db.collection('MergedCityList');

    await CombineHotelCityList.insertMany(mergedCities);

    actionCompleteResponse(res, "success");
  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }
};

//searchTboandGrnCityList

exports.searchTboandGrnCityList = async (req, res) => {
  try {
    // const userIP = requestIp.getClientIp(req);
    const userIP = "223.178.216.116";

    const userLocation = geoip.lookup(userIP);

    const keyword = req.query.keyword;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    if (!keyword) {
      return sendActionFailedResponse(res, {}, "Keyword is required.");
    }

    // Perform city and hotel searches concurrently
    // const [cityList, hotelList] = await Promise.all([
    //   GrnCityList.find({ cityName: { $regex: keyword, $options: "i" } }).select('-_id').skip(skip).limit(limit),
    //   GrnHotelCityMap.find({ hotelName: { $regex: keyword, $options: "i" } }).select('-_id -longitude -latitude').skip(skip).limit(limit)
    // ]);

    let [cityList, hotelList] = await Promise.all([
      cityListFunction(keyword),
      GrnHotelCityMap.aggregate([
        {
          $match: { hotelName: { $regex: keyword, $options: "i" } },
        },
        {
          $lookup: {
            from: "grnCountryList",
            localField: "countryCode",
            foreignField: "countryCode",
            as: "countryDetails",
          },
        },
        {
          $unwind: "$countryDetails",
        },
        {
          $addFields: {
            // cityName: "$countryDetailsWithCity.cityName",
            countryName: "$countryDetails.countryName",
          },
        },
        {
          $project: {
            hotelCode: 1,
            hotelName: 1,
            cityCode: 1,
            countryCode: 1,
            countryName: 1,
            // cityName:1,
            address: 1,
            latitude: 1,
            longitude: 1,
          },
        },
        {
          $skip: skip, // Applies the skip for pagination
        },
        {
          $limit: limit, // Applies the limit for pagination
        },
      ]),
    ]);

    cityList = cityList.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const acountrycode =
        a?.tboCountryCode?.trim().toUpperCase() ||
        a?.grnCountryCode?.trim().toUpperCase();
      const bcountrycode =
        b?.tboCountryCode?.trim().toUpperCase() ||
        b?.grnCountryCode?.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = acountrycode === userCountryCode;
      const bIsMatch = bcountrycode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });
    hotelList = hotelList.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const acountrycode = a.countryCode.trim().toUpperCase();
      const bcountrycode = b.countryCode.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = acountrycode === userCountryCode;
      const bIsMatch = bcountrycode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });

    // const response = [...cityList, ...hotelList];
    const message =
      cityList.length >= 1
        ? "Search City and Hotel Successfully!"
        : "No Data Found!";

    actionCompleteResponse(res, { cityList, hotelList }, message);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

//tbo grn search hotel combine

exports.searchTboGrnCombineHotelCityWise = async (req, res) => {
  try {
    if (req?.body?.cityCode || req?.body?.tboCityCode) {
      const additionalPromise = async () => {
        try {
          const data = {
            CheckInDate: moment(req?.body?.checkin, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            ),
            NoOfNights: countNights(req?.body?.checkin, req?.body?.checkout),
            NoOfRooms: req?.body?.rooms.length,
            RoomGuests: transformRooms(req?.body?.rooms),
            CountryCode: req?.body?.client_nationality,
            GuestNationality: req?.body?.client_nationality,
            CityId: req?.body?.tboCityCode,
            TokenId: req?.body?.TokenId,
            EndUserIp: req?.body?.EndUserIp,
            ResultCount: null,
            PreferredCurrency: "INR",
            MaxRating: 5,
            MinRating: 0,
            ReviewScore: null,
            IsNearBySearchAllowed: false,
          };

          const response = await axios.post(`${api?.hotelSearchURL}`, data);
          let keysToRemove = ["HotelResults", "ResponseStatus", "Error"];
          let tboOtherkeys = removeKeys(
            response?.data?.HotelSearchResult,
            keysToRemove
          );
          // if (!hotelName === undefined) return;
          const filterTboHotels =
            response?.data?.HotelSearchResult?.HotelResults;
          // const filteredHotels = filterTboHotels?.filter(hotel =>  hotel.hasOwnProperty('HotelName') );
          // const filteredHotels = filterTboHotels?.filter(hotel => hotel.HotelName!==undefined)
          const filteredHotels = filterTboHotels?.filter(
            (hotel) => hotel && "HotelName" in hotel && hotel.HotelName
          );

          const modifyData = {
            // TraceId: response?.data?.HotelSearchResult?.TraceId,
            HotelResults: filteredHotels,
            tboOtherkeys: tboOtherkeys,
          };
          return modifyData;
        } catch (error) {
          return null; 
        }
      };

      const grnSearchPromise = async () => {
        try {
          const totalPage = await GrnHotelCityMap.countDocuments({
            cityCode: req?.body?.cityCode,
          });
          const page = Math.ceil(totalPage / 100);
          const limit = 100;
          const promises = [];

          for (let i = 1; i <= page; i++) {
            promises.push(async () => {
              const hotelCode = await exports.grnHotelCityMapWithPagination(
                req?.body?.cityCode,
                i,
                limit
              );
              const searchData = {
                rooms: req?.body?.rooms,
                rates: req?.body?.rates,
                hotel_codes: hotelCode,
                currency: req?.body?.currency,
                client_nationality: req?.body?.client_nationality,
                checkin: req?.body?.checkin,
                checkout: req?.body?.checkout,
                cutoff_time: 30000,
                version: req?.body?.version,
              };
              const response = await axios.post(
                `${baseurl}/api/v3/hotels/availability`,
                searchData,
                { headers }
              );
              return response.data;
            });
          }

          const results = await Promise.all(promises.map((p) => p()));
          const validResults = results.filter(
            (result) => result && !result.errors
          );

          let keysToRemove = ["hotels", "search_id", "no_of_hotels"];
          let updatedObj = removeKeys(validResults?.[0], keysToRemove);

          let modifiedResults = validResults.reduce((acc, result) => {
            result?.hotels?.forEach((hotel) => {
              acc.push({ ...hotel, search_id: result?.search_id });
            });
            return acc;
          }, []);

          modifiedResults = modifiedResults
            .filter((hotel) => hotel.images.url !== "")
            .sort(
              (a, b) =>
                (a?.min_rate?.price || a?.Price?.PublishedPrice) -
                (b?.min_rate?.price || b?.Price?.PublishedPrice)
            );

          return {
            hotels: modifiedResults,
            no_of_hotels: modifiedResults.length,
            updatedObj: updatedObj,
          };
        } catch (error) {
          return null;
        }
      };

      const [additionalDataResult, grnResults] = await Promise.all([
        additionalPromise(),
        grnSearchPromise(),
      ]);

      // Combine results
      let combineData = [];

      if (additionalDataResult?.HotelResults) {
        combineData = [...combineData, ...additionalDataResult?.HotelResults];
      }

      if (grnResults?.hotels) {
        combineData = [...combineData, ...grnResults.hotels];
      }

      combineData = combineData.sort(
        (a, b) =>
          (a?.min_rate?.price || a?.Price?.PublishedPrice) -
          (b?.min_rate?.price || b?.Price?.PublishedPrice)
      );

      const minPriceMap = new Map();

      combineData.forEach((item) => {
        // Extract hotel name and price dynamically
        const hotelName = item.HotelName || item.name;
        const price = item?.Price?.PublishedPrice || item?.min_rate?.price;

        // Ensure hotelName and price are defined
        // if (!hotelName || price === undefined) return;

        // Initialize the map entry if not already present
        if (!minPriceMap.has(hotelName)) {
          minPriceMap.set(hotelName, { price, ...item });
        } else {
          // Update map entry if the current price is lower
          const currentEntry = minPriceMap.get(hotelName);
          if (price < currentEntry.price) {
            minPriceMap.set(hotelName, { price, ...item });
          }
        }
      });

      // Convert the Map to an array of objects with the desired properties
      const uniqueHotels = Array.from(minPriceMap, ([hotelName, entry]) => {
        // Determine the appropriate hotel name key for the output
        const hotelNameKey = entry.HotelName ? "HotelName" : "name";

        // Construct the result object with the correct hotel name key
        return {
          [hotelNameKey]: hotelName,
          // price: entry.price,
          ...Object.fromEntries(
            Object.entries(entry).filter(
              ([key]) =>
                key !== "HotelName" &&
                key !== "name" &&
                key !== "Price.PublishedPrice" &&
                key !== "min_rate.price"
            )
          ),
        };
      });

      // Step 1: Filter hotels with category 5
      const category5Hotels = uniqueHotels?.filter(
        (hotel) => (hotel?.category || hotel?.HotelCategory) === 5
      );
      // Step 2: Sort category 5 hotels by price in descending order
      const sortedCategory5Hotels = category5Hotels?.sort(
        (a, b) => a.price - b.price
      );

      // Step 3: Select the top 5 hotels from the sorted list
      const top5Hotels = sortedCategory5Hotels?.slice(0, 5);
      const top5HotelsWithFeature = top5Hotels?.map((hotel) => ({
        ...hotel, // Spread existing hotel properties
        featureHotel: true, // Add the new featureHotel property
      }));

      // Step 4: Filter out hotels with category 5 from the original list
      // const hotelsNotInCategory5 = uniqueHotels?.filter(hotel => hotel?.category !== 5);

      // Combine top 5 hotels with the rest
      const finalList = [...top5HotelsWithFeature, ...uniqueHotels];

      const mainData = {
        // hotels: uniqueHotels,
        // no_of_hotels: uniqueHotels?.length,
        hotels: finalList,
        no_of_hotels: finalList?.length,
        ...grnResults?.updatedObj,
        ...additionalDataResult?.tboOtherkeys,
      };

      const msg = "Multiple Hotel Search Successfully!";
      return actionCompleteResponse(res, mainData, msg);
    } else {
      const searchData = {
        rooms: req?.body?.rooms,
        rates: req?.body?.rates,
        hotel_codes: req?.body?.hotel_codes,
        currency: req?.body?.currency,
        client_nationality: req?.body?.client_nationality,
        checkin: req?.body?.checkin,
        checkout: req?.body?.checkout,
        cutoff_time: 5000,
        version: req.body.version,
      };
      const response = await axios.post(
        `${baseurl}/api/v3/hotels/availability`,
        searchData,
        { headers }
      );
      const msg = "Single Hotel Search Successfully!";

      if (response?.data?.hotels) {
        response?.data?.hotels.forEach((hotel) => {
          hotel.search_id = response?.data?.search_id;
        });

        // Remove search_id from the root level
        delete response.data.search_id;
      }
      // Optionally, prepare the modified data
      const modifiedData = response?.data;
      return actionCompleteResponse(res, modifiedData, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

const removeKeys = (obj, keys) => {
  let newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
};

//count night function
const countNights = (checkin, checkout) => {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const differenceInMs = checkoutDate - checkinDate;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(Math.round(differenceInMs / millisecondsPerDay), 1);
};

//tbo rooms payload
const transformRooms = (rooms) =>
  rooms?.map((room) => {
    const hasChildren =
      Array.isArray(room?.children_ages) && room?.children_ages.length > 0;
    return {
      NoOfAdults: room?.adults,
      NoOfChild: hasChildren ? room?.children_ages.length : 0,
      ChildAge: hasChildren ? room?.children_ages : null,
    };
  });

const cityListFunction = async (keyword) => {
  // const page = 1; // Page number
  // const limit = 10; // Number of records per page
  // const skip = (page - 1) * limit; // Calculate the number of records to skip

  const tboData = await TboHotelCityList.find({
    cityName: { $regex: `^${keyword}`, $options: "i" },
  }).lean();
  const grnData = await GrnCityList.find({
    cityName: { $regex: `^${keyword}`, $options: "i" },
  }).lean();

  // Create a map to handle merging and filtering duplicates
  const mergedMap = new Map();

  // Process TboHotelCityList data
  tboData?.forEach((tboItem) => {
    if (!mergedMap.has(tboItem.cityName)) {
      mergedMap.set(tboItem.cityName, {
        cityName: tboItem.cityName,
        tboCityCode: tboItem.cityCode || null,
        tboCountryName: tboItem.countryName || null,
        tboCountryCode: tboItem.countryCode || null,
        tbostateProvince: tboItem.stateProvince || null,
        tbostateProvinceCode: tboItem.stateProvinceCode || null,
        grnCityCode: null,
        grnCountryName: null,
        grnCountryCode: null,
      });
    } else {
      // Update existing entry with TboHotelCityList data
      const existingItem = mergedMap?.get(tboItem.cityName);
      existingItem.tboCityCode = tboItem.cityCode || existingItem.tboCityCode;
      existingItem.tboCountryName =
        tboItem.countryName || existingItem.tboCountryName;
      existingItem.tboCountryCode =
        tboItem.countryCode || existingItem.tboCountryCode;
      existingItem.tbostateProvince =
        tboItem.tbostateProvince || existingItem.tbostateProvince;
      existingItem.tbostateProvinceCode =
        tboItem.tbostateProvinceCode || existingItem.tbostateProvinceCode;
    }
  });

  // Process GrnCityList data
  grnData?.forEach((grnItem) => {
    if (!mergedMap.has(grnItem.cityName)) {
      mergedMap.set(grnItem.cityName, {
        cityName: grnItem.cityName,
        tboCityCode: null,
        tboCountryName: null,
        tboCountryCode: null,
        tbostateProvince: null,
        tbostateProvinceCode: null,
        grnCityCode: grnItem.cityCode || null,
        grnCountryName: grnItem.countryName || null,
        grnCountryCode: grnItem.countryCode || null,
      });
    } else {
      // Update existing entry with GrnCityList data
      const existingItem = mergedMap.get(grnItem.cityName);
      existingItem.grnCityCode = grnItem.cityCode || existingItem.grnCityCode;
      existingItem.grnCountryName =
        grnItem.countryName || existingItem.grnCountryName;
      existingItem.grnCountryCode =
        grnItem.countryCode || existingItem.grnCountryCode;
    }
  });

  // Create an array from the map and handle merging duplicates based on country name and code
  const mergedData = Array.from(mergedMap.values());

  // Deduplicate based on exact matches of CountryName and CountryCode
  let finalData = [];
  const seen = new Map();

  mergedData?.forEach((item) => {
    const key = `${item.cityName}-${
      item.tboCountryName || item.grnCountryName
    }-${item.tboCountryCode || item.grnCountryCode}`;
    if (!seen.has(key)) {
      seen.set(key, true);
      finalData.push(item);
    }
  });

  finalData = finalData?.sort((a, b) => a.cityName.localeCompare(b.cityName));

  // const sortCitiesByExactMatch=(finalData,keyword)=>{

  const term = keyword.toLowerCase();

  finalData = finalData?.sort((a, b) => {
    // Convert city names to lowercase for case-insensitive comparison
    const cityNameA = a.cityName.toLowerCase();
    const cityNameB = b.cityName.toLowerCase();

    // Check for exact matches
    const isExactMatchA = cityNameA === term;
    const isExactMatchB = cityNameB === term;

    // Sort exact matches to the top
    if (isExactMatchA && !isExactMatchB) return -1;
    if (!isExactMatchA && isExactMatchB) return 1;

    // For non-exact matches, retain original order
    return 0;
  });

  return finalData;
};






 //tboGrnCombineHotelSearch with dynamic room payloads handeling


exports.tboGrnCombineHotelSearch = async (req, res) =>{
  try {

    
    if (req?.body?.cityCode || req?.body?.tboCityCode) {
      const additionalPromise = async () => {
        


        try {
          const data = {
            CheckInDate: moment(req?.body?.checkin, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            ),
            NoOfNights: countNights(req?.body?.checkin, req?.body?.checkout),
            NoOfRooms: req?.body?.rooms?.roomCount,
            RoomGuests: tboDistributeGuests(req?.body?.rooms),
            CountryCode: req?.body?.client_nationality,
            GuestNationality: req?.body?.client_nationality,
            CityId: req?.body?.tboCityCode,
            TokenId: req?.body?.TokenId,
            EndUserIp: req?.body?.EndUserIp,
            ResultCount: null,
            PreferredCurrency: "INR",
            MaxRating: 5,
            MinRating: 0,
            ReviewScore: null,
            IsNearBySearchAllowed: false,
          };

          const response = await axios.post(`${api?.hotelSearchURL}`, data);
          let keysToRemove = ["HotelResults", "ResponseStatus", "Error"];
          let tboOtherkeys = removeKeys(
            response?.data?.HotelSearchResult,
            keysToRemove
          );
          // if (!hotelName === undefined) return;
          const filterTboHotels =
            response?.data?.HotelSearchResult?.HotelResults;
          // const filteredHotels = filterTboHotels?.filter(hotel =>  hotel.hasOwnProperty('HotelName') );
          // const filteredHotels = filterTboHotels?.filter(hotel => hotel.HotelName!==undefined)
          const filteredHotels = filterTboHotels?.filter(
            (hotel) => hotel && "HotelName" in hotel && hotel.HotelName
          );

          const modifyData = {
            // TraceId: response?.data?.HotelSearchResult?.TraceId,
            HotelResults: filteredHotels,
            tboOtherkeys: tboOtherkeys,
          };
          return modifyData;
        } catch (error) {
          return null;
        }
      };

      const grnSearchPromise = async () => {
        try {
          const totalPage = await GrnHotelCityMap.countDocuments({
            cityCode: req?.body?.cityCode,
          });
          const page = Math.ceil(totalPage / 100);
          const limit = 100;
          const promises = [];

          for (let i = 1; i <= page; i++) {
            promises.push(async () => {
              const hotelCode = await exports.grnHotelCityMapWithPagination(
                req?.body?.cityCode,
                i,
                limit
              );
              
              const searchData = {
                rooms: grnDistributeGuests(req?.body?.rooms),
                rates: req?.body?.rates,
                hotel_codes: hotelCode,
                currency: req?.body?.currency,
                client_nationality: req?.body?.client_nationality,
                checkin: req?.body?.checkin,
                checkout: req?.body?.checkout,
                cutoff_time: 30000,
                version: req?.body?.version,
              };
            
              const response = await axios.post(
                `${baseurl}/api/v3/hotels/availability`,
                searchData,
                { headers }
              );
              return response.data;
            });
          }

          const results = await Promise.all(promises.map((p) => p()));
          const validResults = results.filter(
            (result) => result && !result.errors
          );

          let keysToRemove = ["hotels", "search_id", "no_of_hotels"];
          let updatedObj = removeKeys(validResults?.[0], keysToRemove);

          let modifiedResults = validResults.reduce((acc, result) => {
            result?.hotels?.forEach((hotel) => {
              acc.push({ ...hotel, search_id: result?.search_id });
            });
            return acc;
          }, []);

          modifiedResults = modifiedResults
            .filter((hotel) => hotel.images.url !== "")
            .sort(
              (a, b) =>
                (a?.min_rate?.price || a?.Price?.PublishedPrice) -
                (b?.min_rate?.price || b?.Price?.PublishedPrice)
            );

          return {
            hotels: modifiedResults,
            no_of_hotels: modifiedResults.length,
            updatedObj: updatedObj,
          };
        } catch (error) {
          return null;
        }
      };

      const [additionalDataResult, grnResults] = await Promise.all([
        additionalPromise(),
        grnSearchPromise(),
      ]);

      // Combine results
      let combineData = [];

      if (additionalDataResult?.HotelResults) {
        combineData = [...combineData, ...additionalDataResult?.HotelResults];
      }

      if (grnResults?.hotels) {
        combineData = [...combineData, ...grnResults.hotels];
      }

      combineData = combineData.sort(
        (a, b) =>
          (a?.min_rate?.price || a?.Price?.PublishedPrice) -
          (b?.min_rate?.price || b?.Price?.PublishedPrice)
      );

      const minPriceMap = new Map();

      combineData.forEach((item) => {
        // Extract hotel name and price dynamically
        const hotelName = item.HotelName || item.name;
        const price = item?.Price?.PublishedPrice || item?.min_rate?.price;

        // Ensure hotelName and price are defined
        // if (!hotelName || price === undefined) return;

        // Initialize the map entry if not already present
        if (!minPriceMap.has(hotelName)) {
          minPriceMap.set(hotelName, { price, ...item });
        } else {
          // Update map entry if the current price is lower
          const currentEntry = minPriceMap.get(hotelName);
          if (price < currentEntry.price) {
            minPriceMap.set(hotelName, { price, ...item });
          }
        }
      });

      // Convert the Map to an array of objects with the desired properties
      const uniqueHotels = Array.from(minPriceMap, ([hotelName, entry]) => {
        // Determine the appropriate hotel name key for the output
        const hotelNameKey = entry.HotelName ? "HotelName" : "name";

        // Construct the result object with the correct hotel name key
        return {
          [hotelNameKey]: hotelName,
          // price: entry.price,
          ...Object.fromEntries(
            Object.entries(entry).filter(
              ([key]) =>
                key !== "HotelName" &&
                key !== "name" &&
                key !== "Price.PublishedPrice" &&
                key !== "min_rate.price"
            )
          ),
        };
      });

      // Step 1: Filter hotels with category 5
      const category5Hotels = uniqueHotels?.filter(
        (hotel) => (hotel?.category || hotel?.HotelCategory) === 5
      );
      // Step 2: Sort category 5 hotels by price in descending order
      const sortedCategory5Hotels = category5Hotels?.sort(
        (a, b) => a.price - b.price
      );

      // Step 3: Select the top 5 hotels from the sorted list
      const top5Hotels = sortedCategory5Hotels?.slice(0, 5);
      const top5HotelsWithFeature = top5Hotels?.map((hotel) => ({
        ...hotel, // Spread existing hotel properties
        featureHotel: true, // Add the new featureHotel property
      }));

      // Step 4: Filter out hotels with category 5 from the original list
      // const hotelsNotInCategory5 = uniqueHotels?.filter(hotel => hotel?.category !== 5);

      // Combine top 5 hotels with the rest
      const finalList = [...top5HotelsWithFeature, ...uniqueHotels];

      const mainData = {
        // hotels: uniqueHotels,
        // no_of_hotels: uniqueHotels?.length,
        hotels: finalList,
        no_of_hotels: finalList?.length,
        ...grnResults?.updatedObj,
        ...additionalDataResult?.tboOtherkeys,
      };

      const msg = "Multiple Hotel Search Successfully!";
      return actionCompleteResponse(res, mainData, msg);
    } else {
      const searchData = {
        rooms: req?.body?.rooms,
        rates: req?.body?.rates,
        hotel_codes: req?.body?.hotel_codes,
        currency: req?.body?.currency,
        client_nationality: req?.body?.client_nationality,
        checkin: req?.body?.checkin,
        checkout: req?.body?.checkout,
        cutoff_time: 5000,
        version: req.body.version,
      };
      const response = await axios.post(
        `${baseurl}/api/v3/hotels/availability`,
        searchData,
        { headers }
      );
      const msg = "Single Hotel Search Successfully!";

      if (response?.data?.hotels) {
        response?.data?.hotels.forEach((hotel) => {
          hotel.search_id = response?.data?.search_id;
        });

        // Remove search_id from the root level
        delete response.data.search_id;
      }
      // Optionally, prepare the modified data
      const modifiedData = response?.data;
      return actionCompleteResponse(res, modifiedData, msg);
    }
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};




function tboDistributeGuests(...values) {


 

  const [{ roomCount: numberOfRooms, adultCount: numberOfAdults, childCount: numberOfChilds, childAge: childAges }] = values;


  const rooms = [];
  
  // Calculate base number of adults and children per room
  let adultsPerRoom = Math.floor(numberOfAdults / numberOfRooms);
  let childrenPerRoom = Math.floor(numberOfChilds / numberOfRooms);
  
  // Remaining adults and children after equal distribution
  let remainingAdults = numberOfAdults % numberOfRooms;
  let remainingChildren = numberOfChilds % numberOfRooms;

  // Distribute adults and children across the rooms
  for (let i = 0; i < numberOfRooms; i++) {
      let roomAdults = adultsPerRoom + (i < remainingAdults ? 1 : 0);
      let roomChildren = childrenPerRoom + (i < remainingChildren ? 1 : 0);
      
      // Initialize room object
      const room = { NoOfAdults: roomAdults };
      
      // if(roomChildren===0){
      room.NoOfChild=0;
      room.ChildAge=null;
      // }

      // Only add Childs and ChildAges if there are children
      if (numberOfChilds > i) {
          const roomChildAges = childAges.splice(0, roomChildren);
          room.NoOfChild = roomChildren>=0?roomChildren:0;
          room.ChildAge  = roomChildAges;
      }
      
      

      rooms.push(room);
  }


  return rooms;
}



function grnDistributeGuests(...myValues) {

   const [{ roomCount: numberOfRooms, adultCount: numberOfAdults, childCount: numberOfChilds, childAge: childAges }] = myValues;

    const rooms = [];
    
    // Calculate base number of adults and children per room
    let adultsPerRoom = Math.floor(numberOfAdults / numberOfRooms);
    let childrenPerRoom = Math.floor(numberOfChilds / numberOfRooms);
    
    // Remaining adults and children after equal distribution
    let remainingAdults = numberOfAdults % numberOfRooms;
    let remainingChildren = numberOfChilds % numberOfRooms;

    // Distribute adults and children across the rooms
    for (let i = 0; i < numberOfRooms; i++) {
        let roomAdults = adultsPerRoom + (i < remainingAdults ? 1 : 0);
        let roomChildren = childrenPerRoom + (i < remainingChildren ? 1 : 0);
        
        // Initialize room object
        const room = { Adults: roomAdults };

        // Only add Childs and ChildAges if there are children
        if (numberOfChilds > i) {
            const roomChildAges = childAges.splice(0, roomChildren);
            // room.Childs = roomChildren;
            room.children_ages = roomChildAges;
        }

        rooms.push(room);
    }

    return rooms;
}