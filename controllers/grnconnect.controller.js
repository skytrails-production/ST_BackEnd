const aws = require("aws-sdk");
const axios = require("axios");
const { api } = require("../common/const");

const { userIPDetail } = require("../model/city.model");
const requestIp = require('request-ip');

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const { GrnCityList, GrnHotelCityMap,GrnCountryList,GrnHotelBooking, GrnLocationCityMap, GrnLocationMaster } = require("../model/grnconnectModel");
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

exports.searchMulitHotel = async (req, res) => {
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
      return actionCompleteResponse(res, response.data, msg);
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
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    if (!keyword) {
      return sendActionFailedResponse(res, {}, "Keyword is required.");
    }

    // Perform city and hotel searches concurrently
    const [cityList, hotelList] = await Promise.all([
      GrnCityList.find({ cityName: { $regex: keyword, $options: "i" } }).select('-_id').skip(skip).limit(limit),
      GrnHotelCityMap.find({ hotelName: { $regex: keyword, $options: "i" } }).select('-_id -longitude -latitude').skip(skip).limit(limit)
    ]);

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
