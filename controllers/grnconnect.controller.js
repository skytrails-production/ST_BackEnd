const aws = require("aws-sdk");
const axios = require("axios");
const { api } = require("../common/const");
const moment = require("moment");
const { userIPDetail } = require("../model/city.model");
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const { GrnCityList, GrnHotelCityMap,GrnCountryList,GrnHotelBooking, GrnLocationCityMap, GrnLocationMaster, TboHotelCityList, CombineHotelCityList } = require("../model/grnconnectModel");
const commonFunctions = require("../utilities/commonFunctions");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});



//testing

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'application/gzip',
    'api-key': process.env.GRNAPIKEY,
};

//production
// const headers = {
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
//   'Accept-Encoding': 'application/gzip',
//   'api-key': 'b79e47991faefb0c7d091b9b6ddc9ea4',
// };

const baseurl=process.env.GRNURL;

//citylist data

exports.getCityListData= async (req, res) =>{
  try{
    const data=req.query.keyword;
    const response = await GrnCityList.find({"cityName":{$regex:data, $options:"i"}}).select('-_id'); 
    // const response=await exports.grnHotelCityMap(cityData[0].cityCode);

    // console.log(cityData[0].cityCode,"cityData")
    msg = "City List Search Successfully!";
    actionCompleteResponse(res, response, msg);      
} catch (err) {
  // console.log(err);
  sendActionFailedResponse(res, {}, err.message);
}

}

//get country list data

exports.getCountryList= async (req, res) =>{

  try{
    const response = await GrnCountryList.find().select('-_id'); 
    msg = "Country List Search Successfully!";
    actionCompleteResponse(res, response, msg);      
} catch (err) {
  // console.log(err);
  sendActionFailedResponse(res, {}, err.message);
}

}

//update cityList with countryName

exports.updateCityListWithCountryNames= async (req, res) =>{
  try{

   // Retrieve all documents from grnCityList collection
   const cityDocuments = await GrnCityList.find({});

   // Iterate through each document in grnCityList collection
   for (const cityDoc of cityDocuments) {
     // Retrieve corresponding country document from grnCountryList
     const countryDoc = await GrnCountryList.findOne({ countryCode: cityDoc.countryCode });

     if (countryDoc) {
       // Update city document with country name
       await GrnCityList.updateOne(
         { _id: cityDoc._id },
         { $set: { countryName: countryDoc.countryName } }
       );
       console.log(`Updated city: ${cityDoc.cityName}, ${countryDoc.countryName}`);
     } else {
       console.log(`Country not found for city: ${cityDoc.cityName}`);
     }
   }

   console.log('All cities updated with country names');
   res.status(200).send('All cities updated with country names');
 } catch (error) {
   console.error('Error:', error);
   res.status(500).send('Error updating cities with country names');
 } finally {
   console.log('Disconnected from MongoDB');
 }

}

//hotel search

exports.hotelSearch=async (req,res) =>{
    try{
        const data={
            ...req.body
        };
        // console.log(data,"data")
        const hotelCode=await exports.grnHotelCityMap(req.body.cityCode);

         

        const searchData={
          rooms:req.body.rooms,
          rates: "comprehensive",
          hotel_codes:hotelCode,
          currency:req.body.currency,
          client_nationality:req.body.client_nationality,
          checkin:req.body.checkin,
          checkout:req.body.checkout,
          version:req.body.version,
          cutoff_time:10000
        }
        // console.log(searchData,"data")
        // console.log(`${baseurl}/api/v3/hotels/availability`,"console")
        const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });   
        
        
        msg = "Hotel Search Successfully!";
        actionCompleteResponse(res, response.data, msg);      
    } catch (err) {
      // console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
}


//singleHotelSearch

exports.singleHotelSearch=async (req,res) =>{
  try{
     
      const searchData={
        rooms:req?.body?.rooms,
        rates: req?.body?.rates,
        hotel_codes:req?.body?.hotel_codes,
        currency:req?.body?.currency,
        client_nationality:req?.body?.client_nationality,
        checkin:req?.body?.checkin,
        checkout:req?.body?.checkout,
        version:req?.body?.version,
        cutoff_time:3000
      }
      // console.log(searchData,"data")
      // console.log(`${baseurl}/api/v3/hotels/availability`,"console")
      const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });   
      
      
      msg = "Single Hotel Search Successfully!";
      actionCompleteResponse(res, response.data, msg);      
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
}


//hotel Search with pagination

exports.hotelSearchWithPagination=async (req,res) =>{
  try{
      
      if(req?.body?.cityCode){
       // Calculate pagination parameters
       const page = req.query.page ? parseInt(req.query.page) : 1; // Get page number from query parameter, default to 1 if not provided
       const limit = 100; // Set the limit of hotel codes per page
      //  console.log(page,"page");

       // Fetch hotel codes with pagination
       const hotelCode = await exports.grnHotelCityMapWithPagination(req.body.cityCode, page, limit);
      

      const searchData={
        rooms:req.body.rooms,
        rates:req.body.rates,
        hotel_codes:hotelCode,
        currency:req.body.currency,
        client_nationality:req.body.client_nationality,
        checkin:req.body.checkin,
        checkout:req.body.checkout,
        cutoff_time: 30000,
        version:req.body.version
      }
      // console.log(searchData,"data");

      // console.log(`${baseurl}/api/v3/hotels/availability`,"console")
      const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });   
      msg = "Hotel Search Successfully!";
      return actionCompleteResponse(res, response.data, msg); 
     }else{
      const searchData={
        rooms:req?.body?.rooms,
        rates:req?.body?.rates,
        hotel_codes:req?.body?.hotel_codes,
        currency:req?.body?.currency,
        client_nationality:req?.body?.client_nationality,
        checkin:req?.body?.checkin,
        checkout:req?.body?.checkout,
        cutoff_time: 5000,
        version:req.body.version
      }
      // console.log(searchData,"data");

      // console.log(`${baseurl}/api/v3/hotels/availability`,"console")
      const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });   
      msg = "Single Hotel Search Successfully!";

      actionCompleteResponse(res, response.data, msg);    
    }  
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
}



//searchMulitHotel

exports.searchMultiHotel = async (req, res) => {
  try {
    let results = [];
    if (req?.body?.cityCode) {

      const totalPage= await GrnHotelCityMap.countDocuments({'cityCode':req?.body?.cityCode});
        // console.log(totalPage,"totalPage");
        let page=Math.ceil(totalPage/100)
      const limit = 100; // Set the limit of hotel codes per page
      const promises = [];
      for (let i = 1; i <= page; i++) {
        //  page = i + 1;
        promises.push(
          (async () => {
            const hotelCode = await exports.grnHotelCityMapWithPagination(req.body.cityCode, i, limit);
            const searchData = {
              rooms: req.body.rooms,
              rates: req.body.rates,
              hotel_codes: hotelCode,
              currency: req.body.currency,
              client_nationality: req.body.client_nationality,
              checkin: req.body.checkin,
              checkout: req.body.checkout,
              cutoff_time: 30000,
              version: req.body.version
            };
            const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });
            return response.data;
          })()
        );
      }

      results = await Promise.all(promises);

      results = results.filter(result => result && !result.errors);
      // const count=results?.reduce((accumulator ,hotel) => {
      //   return accumulator += hotel?.no_of_hotels;
      // }, 0); //count all hotels 
      

        //function remove keys
      function removeKeys(obj, keys) {
        let newObj = { ...obj };
        keys.forEach(key => {
          delete newObj[key];
        });
        return newObj;
      }
      
           
      // Keys to remove
      let keysToRemove = ['hotels', 'search_id','no_of_hotels'];
      
      let updatedObj = removeKeys(results?.[0], keysToRemove);

      // console.log(updatedObj); // remove hotel and searchId from main


      //push hotels and search id for particular hotel

      let modifiedResults = results.reduce((acc, result) => {
        

        result?.hotels?.forEach(hotel => {
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
      
      

      const finalResults={
        hotels:[...modifiedResults],
        no_of_hotels:[...modifiedResults]?.length,
        ...updatedObj
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
        version: req.body.version
      };
      const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });
      const msg = "Single Hotel Search Successfully!";


      if(response.data.hotels){

      response.data.hotels.forEach(hotel => {
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
    try{
        const SearchId=req.query.searchId;
        const hcode=req.query.hcode;

        // console.log(`${baseurl}/api/v3/hotels/availability/${SearchId}?hcode=${hcode}&bundled=true`,"console")

        const response = await axios.get(`${baseurl}/api/v3/hotels/availability/${SearchId}?hcode=${hcode}&bundled=true`,{ headers });   
        
        
        msg = "Hotel Refetch Successfully!";
        actionCompleteResponse(res, response.data, msg);      
    } catch (err) {
      // console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }   
}


// rate Refetch Hotel

exports.rateRefetchHotel =async (req, res) =>{
    try{
        const data={
            ...req.body
        };
        const searchId=req.query.searchId;

        // console.log("data",data)
        // console.log(`${baseurl}api/v3/hotels/availability/<sid>/rates/auto?action=recheck`,"console")
        const response = await axios.post(`${baseurl}/api/v3/hotels/availability/${searchId}/rates/auto?action=recheck`, data, { headers });   
        
        
        msg = "Hotel Rate Refetch Successfully!";
        actionCompleteResponse(res, response.data, msg);      
    } catch (err) {
      // console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }

}




//grnHotelCityMap


exports.grnHotelCityMap = async (cityCode) => {
  try {
    // console.log(cityCode,"citycode")
    const hotelCodes = await GrnHotelCityMap.find({'cityCode':cityCode  });
    
    const codedata = hotelCodes.map(item => `${item.hotelCode}`);
    // console.log(codedata)
    return codedata;
  } catch (error) {
    throw new Error(error.message);
  }
};


//grnHotelCityMap with pagination

exports.grnHotelCityMapWithPagination = async (cityCode, page , limit) => {
  try {
      const hotelCodes = await GrnHotelCityMap.find({'cityCode': cityCode})
                                             .skip((page - 1) * limit)
                                             .limit(limit);
      
      const codedata = hotelCodes.map(item => `${item.hotelCode}`);
      return codedata;
  } catch (error) {
      throw new Error(error.message);
  }
};

//hotel code length

exports.hotelCodeLength = async (cityCode)=>{

  try {
    const hotelCodes = await GrnHotelCityMap.find({'cityCode': cityCode});
    const hotelLength=hotelCodes.length/100;
      //  hotelLength=Number(hotelLength);
      //  console.log(hotelLength>1?parseInt(Number(hotelLength)+Number(1)):1)
    
    return hotelLength>1?parseInt(Number(hotelLength)+Number(1)):1;
    
    
  } catch (error) {
    throw new Error(error.message);
    
  }

}


//get hotel Images

exports.hotelImages = async (req, res) =>{

  try {
    const hotelCode=req.query.hotelCode;
    const response = await axios.get(`${baseurl}/api/v3/hotels/${hotelCode}/images?version=2.0`, { headers });
    
    msg = "Hotel Images Search Successfully!";

        actionCompleteResponse(res, response.data, msg);       
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }

}


//bundledRates

exports.bundledRates=async (req, res)=>{
  try{
    const data=req.query.searchId;
    const payload={
      ...req.body
    };

    // console.log(payload,"payload");
    const response = await axios.post(`${baseurl}/api/v3/hotels/availability/${data}/rates/?action=recheck`,payload,{ headers });   
    
    
    msg = "bunled Rates fetch Successfully!";
    actionCompleteResponse(res, response.data, msg);      
} catch (err) {
  // console.log(err);
  sendActionFailedResponse(res, {}, err.message);
}   

}

//hotel booking

exports.hotelBooking = async (req, res)=>{
  try {
    const data={
      ...req.body
    };
    
    const userIP = requestIp.getClientIp(req);
    const userBookingIpDetails={userIp:userIP,
      bookingType:"HotelBookinGrn"
    };

    await userIPDetail.create(userBookingIpDetails);


    // console.log(data,"data")
    const response=await axios.post(`${baseurl}/api/v3/hotels/bookings`, data, { headers })

    msg = "Hotel Booking Successfully!";
    actionCompleteResponse(res, response.data, msg);  
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
    
  }
}



//hotel Fetch Booking


exports.hotelFetchBooking = async (req, res)=>{

  try {
     const data=req.query.bref;
    
    const response=await axios.post(`${baseurl}/api/v3/hotels/bookings/${data}?type=value`, { headers })

    msg = "Hotel Booking Successfully!";
    actionCompleteResponse(res, response.data, msg); 
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
}


//cancel hotel booking

exports.hotelCancelBooking = async (req, res)=>{

  try {
    const bookingId=req.query.bookingId;
     const data={
      ...req.body
     };

    //  console.log(data,"data");
    
    const response=await axios.delete(`${baseurl}/api/v3/hotels/bookings/${bookingId}`, { headers })

    msg = "Hotel Booking Successfully!";
    actionCompleteResponse(res, response.data, msg); 
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);    
  }
}


exports.addHotelBooking=async (req, res) =>{

 try {
  const data={
    ...req.body
  }
  const response=await GrnHotelBooking.create(data);
  
  await commonFunctions.grnHotelBookingConfirmationMailWithPdf(response);

  msg = "Hotel Booking Save Successfully in Data Base !";
    actionCompleteResponse(res, response, msg); 
  
 } catch (err) {
  sendActionFailedResponse(res, {}, err.message);
  
 }


}


//getAllAgentBooking

exports.getAllAgentBooking = async (req, res ) =>{

  const { page, size, search, userId } = req.query;

  try{

    const limit=Number.parseInt(req?.query?.size)||20;

    const page=Number.parseInt(req?.query?.page)||1;
    const sortBy=req.query.sort||'createdAt';
    const skip=limit*(page-1);
    const totalPages=await GrnHotelBooking.countDocuments();

    const docs=await GrnHotelBooking.find({userId}).sort(sortBy).skip(skip).limit(limit);

    actionCompleteResponse(res, {docs, totalPages}, "success"); 
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }

}



// getGrnAgentSingleBooking

exports.getGrnAgentSingleBooking = async (req, res ) =>{

  const {id } = req.query;

  try{

    // const limit=Number.parseInt(req?.query?.size)||20;

    // const page=Number.parseInt(req?.query?.page)||1;
    // const sortBy=req.query.sort||'createdAt';
    // const skip=limit*(page-1);
    // const totalPages=await GrnHotelBooking.countDocuments();

    const result=await GrnHotelBooking.findOne({_id:id});

    actionCompleteResponse(res, result, "success"); 
    
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }

}




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
    const userIP="223.178.216.116"

    const userLocation = geoip.lookup(userIP);
    // console.log(userLocation,userIP,"userLocation")

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
        .select('-_id')
        .skip(skip)
        .limit(limit),    
      GrnHotelCityMap.aggregate([
        {
          $match: { hotelName: { $regex: keyword, $options: "i" } }
        },
        {
          $lookup: {
            from: "grnCountryList",
            localField: "countryCode",
            foreignField: "countryCode",
            as: "countryDetails"
          }
        },
        {
          $unwind: "$countryDetails"
        },
        {
          $addFields: {
            // cityName: "$countryDetailsWithCity.cityName",
            countryName: "$countryDetails.countryName"
          }
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
            longitude: 1
          }
        },
        {
          $skip: skip   // Applies the skip for pagination
        },
        {
          $limit: limit // Applies the limit for pagination
        }
      ])
    ]);

    cityList=cityList.sort((a, b) => {
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
    hotelList=hotelList.sort((a, b) => {
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
    const message = cityList.length >= 1 ? "Search City and Hotel Successfully!" : "No Data Found!";

    actionCompleteResponse(res, {cityList,hotelList}, message);
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message);
  }
};


//hotel search with hotel code

exports.hotelSearchWithCode=async (req,res) =>{
  try{    

      const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, req.body, { headers });   
 
      msg = "Hotel Search Successfully!";
      actionCompleteResponse(res, response.data, msg);      
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {err}, err.message);
  }
}




//getAllhotelLocationCode using city code


exports.getAllhotelLocationName = async (req, res) => {
  try {
    // Query to find location codes
    const cityCode=req.query.cityCode;
    // console.log(req.query);
    // const cityCode = "124054";
    const result = await GrnLocationCityMap.find({ cityCode });

    // Extract location codes using map
    const locationCodes = result.map(item => item.locationCode);

    // Query to find location names using the extracted location codes
    const results = await GrnLocationMaster.find({
      locationCode: { $in: locationCodes }
    });

    // Extract location names using map
    const locationNames = results.map(item => item.locationName);

    // console.log(locationNames, "data");

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
        { address: { $regex: keyword, $options: "i" } }
      ]
    };

    // Using countDocuments as a function and then the same query for retrieving documents
    // const count = await GrnHotelCityMap.countDocuments(query);
    const response = await GrnHotelCityMap.find(query);

    actionCompleteResponse(res, response , "success");
  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }
};




//tboandGrnCityList

exports.tboandGrnCityList = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    // Fetch data from both collections
    const tboData = await TboHotelCityList.find({ cityName: { $regex: keyword, $options: "i" } }).lean();
    const grnData = await GrnCityList.find({ cityName: { $regex: keyword, $options: "i" } }).lean();

    // Create a map to handle merging and filtering duplicates
    const mergedMap = new Map();

    // Process TboHotelCityList data
    tboData.forEach(tboItem => {
      if (!mergedMap.has(tboItem.cityName)) {
        mergedMap.set(tboItem.cityName, {
          cityName: tboItem.cityName,
          tboCityCode: tboItem.cityCode || null,
          tboCountryName: tboItem.countryName || null,
          tboCountryCode: tboItem.countryCode || null,
          tbostateProvince:tboItem.stateProvince||null,
          tbostateProvinceCode:tboItem.stateProvinceCode||null,
          grnCityCode: null,
          grnCountryName: null,
          grnCountryCode: null
        });
      } else {
        // Update existing entry with TboHotelCityList data
        const existingItem = mergedMap.get(tboItem.cityName);
        existingItem.tboCityCode = tboItem.cityCode || existingItem.tboCityCode;
        existingItem.tboCountryName = tboItem.countryName || existingItem.tboCountryName;
        existingItem.tboCountryCode = tboItem.countryCode || existingItem.tboCountryCode;
        existingItem.tbostateProvince = tboItem.tbostateProvince || existingItem.tbostateProvince;
        existingItem.tbostateProvinceCode = tboItem.tbostateProvinceCode || existingItem.tbostateProvinceCode;
      }
    });

    // Process GrnCityList data
    grnData.forEach(grnItem => {
      if (!mergedMap.has(grnItem.cityName)) {
        mergedMap.set(grnItem.cityName, {
          cityName: grnItem.cityName,
          tboCityCode: null,
          tboCountryName: null,
          tboCountryCode: null,
          tbostateProvince:null,
          tbostateProvinceCode:null,
          grnCityCode: grnItem.cityCode || null,
          grnCountryName: grnItem.countryName || null,
          grnCountryCode: grnItem.countryCode || null
        });
      } else {
        // Update existing entry with GrnCityList data
        const existingItem = mergedMap.get(grnItem.cityName);
        existingItem.grnCityCode = grnItem.cityCode || existingItem.grnCityCode;
        existingItem.grnCountryName = grnItem.countryName || existingItem.grnCountryName;
        existingItem.grnCountryCode = grnItem.countryCode || existingItem.grnCountryCode;
      }
    });

    // Create an array from the map and handle merging duplicates based on country name and code
    const mergedData = Array.from(mergedMap.values());

    // Deduplicate based on exact matches of CountryName and CountryCode
    let finalData = [];
    const seen = new Map();

    mergedData.forEach(item => {
      const key = `${item.cityName}-${item.tboCountryName || item.grnCountryName}-${item.tboCountryCode || item.grnCountryCode}`;
      if (!seen.has(key)) {
        seen.set(key, true);
        finalData.push(item);
      }
    });

    finalData=finalData.sort((a, b) => a.cityName.localeCompare(b.cityName));

    // const sortCitiesByExactMatch=(finalData,keyword)=>{

    const term = keyword.toLowerCase();

    finalData= finalData.sort((a, b) => {
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
    actionCompleteResponse(res,  finalData , "success");

  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }
}


//combineHotelCityList

exports.combineHotelCityList=async (req, res) =>{

  try{

    const grnCities = await GrnCityList.find();
    const tboCities = await TboHotelCityList.find();

    // console.log(tboCities,"hhhh")


    const tboCityMap = new Map();
        tboCities.forEach(city => {
            const key = `${city.cityName.toLowerCase()}_${city.countryCode.toLowerCase()}`;
            tboCityMap.set(key, city);
        });


        // Merge cities
        const mergedCities = [];
        grnCities.forEach(grnCity => {
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
                    grnCountryCode: grnCity.countryCode
                };

                mergedCities.push(mergedCity);
            }
        });

        // Insert merged cities into a new MongoDB collection
        // const mergedCollection = db.collection('MergedCityList');
    
        await CombineHotelCityList.insertMany(mergedCities);
      // console.log(grnCities);

    actionCompleteResponse(res , "success");

  } catch (error) {
    sendActionFailedResponse(res, error, error.message);
  }

}







// exports.combineTboGRnSearchResults = async (req, res) => {
//   try {
//     const countNights = (checkin, checkout) => {
//       const checkinDate = new Date(checkin);
//       const checkoutDate = new Date(checkout);
//       const differenceInMs = checkoutDate - checkinDate;
//       const millisecondsPerDay = 24 * 60 * 60 * 1000;
//       return Math.round(differenceInMs / millisecondsPerDay) || 1;
//     };

//     const transformRooms = (rooms) => {
//       return rooms.map(room => {
//         const hasChildren = Array.isArray(room.children_ages) && room.children_ages.length > 0;
//         return {
//           NoOfAdults: room.adults,
//           NoOfChild: hasChildren ? room.children_ages.length : 0,
//           ChildAge: hasChildren ? room.children_ages : null
//         };
//       });
//     };

//     // Function to handle the additional promise
//     const additionalPromise = async () => {
//       // console.log(moment(req.body.checkin, "YYYY-MM-DD").format("DD/MM/YYYY"));
//       const data = {
//         CheckInDate: moment(req.body.checkin, "YYYY-MM-DD").format("DD/MM/YYYY"),
//         NoOfNights: countNights(req.body.checkin, req.body.checkout),
//         NoOfRooms: req.body.rooms.length,
//         RoomGuests: transformRooms(req.body.rooms),
//         CountryCode: req.body.client_nationality,
//         GuestNationality: req.body.client_nationality,
//         CityId: req.body.tboCityCode,
//         TokenId: req.body.TokenId,
//         EndUserIp: req.body.EndUserIp,
//         ResultCount: null,
//         PreferredCurrency: "INR",
//         MaxRating: 5,
//         MinRating: 0,
//         ReviewScore: null,
//         IsNearBySearchAllowed: false,
//         // other required fields
//       };
     
      
//       // console.log("response", data)
//         const response = await axios.post(`${api.hotelSearchURL}`, data);
//         // console.log("response", response?.data?.HotelSearchResult)
//         const modifyData={
//           TraceId:response?.data?.HotelSearchResult?.TraceId,
//           HotelResults:response?.data?.HotelSearchResult?.HotelResults

//         }
//         return modifyData;       
//     };

  

//     // Function to handle the GRN search
//     const grnSearchPromise = async () => {
//       if (req?.body?.cityCode) {
//         const totalPage = await GrnHotelCityMap.countDocuments({ cityCode: req?.body?.cityCode });
//         const page = Math.ceil(totalPage / 100);
//         const limit = 100;
//         const promises = [];

//         for (let i = 1; i <= page; i++) {
//           promises.push(async () => {
           
//               const hotelCode = await exports.grnHotelCityMapWithPagination(req.body.cityCode, i, limit);
//               const searchData = {
//                 rooms: req.body.rooms,
//                 rates: req.body.rates,
//                 hotel_codes: hotelCode,
//                 currency: req.body.currency,
//                 client_nationality: req.body.client_nationality,
//                 checkin: req.body.checkin,
//                 checkout: req.body.checkout,
//                 cutoff_time: 30000,
//                 version: req.body.version
//               };
//               const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });
//               // console.log(response.data,"grn")
//               return response.data;
//           });

          
//         }

//         const results = await Promise.all(promises.map(p => p()));
//         // console.log("results",results)
//         // return;
//         const validResults = results.filter(result => result && !result.errors);

//         function removeKeys(obj, keys) {
//           let newObj = { ...obj };
//           keys.forEach(key => {
//             delete newObj[key];
//           });
//           return newObj;
//         }

//         let keysToRemove = ['hotels', 'search_id', 'no_of_hotels'];
//         let updatedObj = removeKeys(validResults?.[0], keysToRemove);

//         let modifiedResults = validResults.reduce((acc, result) => {
//           result?.hotels?.forEach(hotel => {
//             acc.push({
//               ...hotel,
//               search_id: result?.search_id,
//             });
//           });
//           return acc;
//         }, []);

//         modifiedResults = modifiedResults.sort((a, b) => a?.min_rate?.price - b?.min_rate?.price);
//         modifiedResults = modifiedResults.filter(hotel => hotel.images.url!= "");

//         return {
//           hotels: modifiedResults,
//           no_of_hotels: modifiedResults.length,
//           ...updatedObj
//         };
//       } 
//     };

//     // Execute both promises in parallel
//     const [additionalDataResult, grnResults] = await Promise.all([
//       additionalPromise(),
//       grnSearchPromise()
//     ]);

//     // Combine results as needed
//     const finalResults = {
//       ...grnResults, // Assuming you want to merge GRN results with additionalDataResult
//       additionalData: additionalDataResult
//     };

//     let combineData=[...finalResults?.hotels,...finalResults?.additionalData?.HotelResults];
//       combineData=combineData.sort((a, b) => a?.min_rate?.price || a?.Price?.PublishedPrice  - b?.min_rate?.price ||b?.Price?.PublishedPrice);


//     const mainData={
//       // Hotels:[...finalResults?.hotels,...finalResults?.additionalData?.HotelResults],
//       Hotels:combineData,
//       no_of_hotels: combineData.length,
//       checkin: finalResults?.checkin,
//       checkout: finalResults?.checkout,
//       no_of_adults: finalResults?.no_of_adults,
//       no_of_nights: finalResults?.no_of_nights,
//       no_of_rooms: finalResults?.no_of_rooms,
//          }

//     const msg = "Multiple Hotel Search Successfully!";
//     return actionCompleteResponse(res, mainData, msg);

//   } catch (err) {
//     console.error('Error in combineTboGRnSearchResults:', err.message);
//     sendActionFailedResponse(res, {}, err.message);
//   }
// };





//


exports.combineTboGRnSearchResults = async (req, res) => {
  try {
    const countNights = (checkin, checkout) => {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const differenceInMs = checkoutDate - checkinDate;
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      return Math.max(Math.round(differenceInMs / millisecondsPerDay), 1);
    };

    const transformRooms = (rooms) => rooms.map(room => {
      const hasChildren = Array.isArray(room.children_ages) && room.children_ages.length > 0;
      return {
        NoOfAdults: room.adults,
        NoOfChild: hasChildren ? room.children_ages.length : 0,
        ChildAge: hasChildren ? room.children_ages : null
      };
    });

    const additionalPromise = async () => {
      try {
        const data = {
          CheckInDate: moment(req.body.checkin, "YYYY-MM-DD").format("DD/MM/YYYY"),
          NoOfNights: countNights(req.body.checkin, req.body.checkout),
          NoOfRooms: req.body.rooms.length,
          RoomGuests: transformRooms(req.body.rooms),
          CountryCode: req.body.client_nationality,
          GuestNationality: req.body.client_nationality,
          CityId: req.body.tboCityCode,
          TokenId: req.body.TokenId,
          EndUserIp: req.body.EndUserIp,
          ResultCount: null,
          PreferredCurrency: "INR",
          MaxRating: 5,
          MinRating: 0,
          ReviewScore: null,
          IsNearBySearchAllowed: false,
        };
        
        const response = await axios.post(`${api.hotelSearchURL}`, data);
        let keysToRemove = ['HotelResults','ResponseStatus','Error'];
          let tboOtherkeys = removeKeys(response?.data?.HotelSearchResult, keysToRemove);
        const modifyData = {
          // TraceId: response?.data?.HotelSearchResult?.TraceId,
          HotelResults: response?.data?.HotelSearchResult?.HotelResults,
          tboOtherkeys:tboOtherkeys
        };
        return modifyData;
      } catch (error) {
        console.error('Error fetching additional data:', error.message);
        return null; // Return null if there's an error
      }
    };

    const grnSearchPromise = async () => {
      if (req.body.cityCode) {
        try {
          const totalPage = await GrnHotelCityMap.countDocuments({ cityCode: req.body.cityCode });
          const page = Math.ceil(totalPage / 100);
          const limit = 100;
          const promises = [];

          for (let i = 1; i <= page; i++) {
            promises.push(async () => {
              const hotelCode = await exports.grnHotelCityMapWithPagination(req.body.cityCode, i, limit);
              const searchData = {
                rooms: req.body.rooms,
                rates: req.body.rates,
                hotel_codes: hotelCode,
                currency: req.body.currency,
                client_nationality: req.body.client_nationality,
                checkin: req.body.checkin,
                checkout: req.body.checkout,
                cutoff_time: 30000,
                version: req.body.version
              };
              const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });
              return response.data;
            });
          }

          const results = await Promise.all(promises.map(p => p()));
          const validResults = results.filter(result => result && !result.errors);

          let keysToRemove = ['hotels', 'search_id', 'no_of_hotels'];
          let updatedObj = removeKeys(validResults?.[0], keysToRemove);

          let modifiedResults = validResults.reduce((acc, result) => {
            result?.hotels?.forEach(hotel => {
              acc.push({ ...hotel, search_id: result?.search_id });
            });
            return acc;
          }, []);

          modifiedResults = modifiedResults
            .filter(hotel => hotel.images.url !== "")
            .sort((a, b) => (a?.min_rate?.price || a?.Price?.PublishedPrice) - (b?.min_rate?.price || b?.Price?.PublishedPrice));

          return {
            hotels: modifiedResults,
            no_of_hotels: modifiedResults.length,
            updatedObj:updatedObj
          };
        } catch (error) {
          console.error('Error fetching GRN data:', error.message);
          return null; // Return null if there's an error
        }
      }
      return null; // Return null if no cityCode is provided
    };

    const [additionalDataResult, grnResults] = await Promise.all([
      additionalPromise(),
      grnSearchPromise()
    ]);

    // Combine results
    let combineData = [];

    if (additionalDataResult?.HotelResults) {
      combineData = [...combineData, ...additionalDataResult.HotelResults];
    }

    if (grnResults?.hotels) {
      combineData = [...combineData, ...grnResults.hotels];
    }

    combineData = combineData
      .sort((a, b) => (a?.min_rate?.price || a?.Price?.PublishedPrice) - (b?.min_rate?.price || b?.Price?.PublishedPrice));

      
    const mainData = {
      Hotels: combineData,
      no_of_hotels: combineData?.length,
      ...grnResults?.updatedObj,
      ...additionalDataResult?.tboOtherkeys
    //   checkin: req.body.checkin,
    //   checkout: req.body.checkout,
    //   no_of_adults: req.body.rooms.reduce((sum, room) => sum + room.adults, 0),
    //   no_of_nights: countNights(req.body.checkin, req.body.checkout),
    //   no_of_rooms: req.body.rooms.length,
    };

    const msg = "Multiple Hotel Search Successfully!";
    return actionCompleteResponse(res, mainData, msg);

  } catch (err) {
    console.error('Error in combineTboGRnSearchResults:', err.message);
    return sendActionFailedResponse(res, {}, err.message);
  }
};




const removeKeys = (obj, keys) => {
  let newObj = { ...obj };
  keys.forEach(key => {
    delete newObj[key];
  });
  return newObj;
};