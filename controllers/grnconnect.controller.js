const aws = require("aws-sdk");
const axios = require("axios");
const { api } = require("../common/const");

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const { GrnCityList, GrnHotelCityMap,GrnCountryList,GrnHotelBooking } = require("../model/grnconnectModel");
const commonFunctions = require("../utilities/commonFunctions");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'application/gzip',
    'api-key': 'b3df547f1c1a2a3989c234bcf2aacaed',
};
const baseurl='https://api-sandbox.grnconnect.com';

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
          rates: req.body.rates,
          hotel_codes:hotelCode,
          currency:req.body.currency,
          client_nationality:req.body.client_nationality,
          checkin:req.body.checkin,
          checkout:req.body.checkout,
          version:req.body.version
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


//hotel Search with pagination

exports.hotelSearchWithPagination=async (req,res) =>{
  try{
      const data={
          ...req.body
      };
      // console.log(data,"data")
      // const hotelCode=await exports.grnHotelCityMap(req.body.cityCode);

       // Calculate pagination parameters
       const page = req.query.page ? parseInt(req.query.page) : 1; // Get page number from query parameter, default to 1 if not provided
       const limit = 100; // Set the limit of hotel codes per page

       // Fetch hotel codes with pagination
       const hotelCode = await exports.grnHotelCityMapWithPagination(req.body.cityCode, page, limit);
      //  console.log(hotelCode,"hotelCode")

      const searchData={
        rooms:req.body.rooms,
        rates:req.body.rates,
        hotel_codes:hotelCode,
        currency:req.body.currency,
        client_nationality:req.body.client_nationality,
        checkin:req.body.checkin,
        checkout:req.body.checkout,
        version:req.body.version
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

//refetch Hotel

exports.refetchHotel = async (req, res) => {
    try{
        const SearchId=req.query.searchId;
        const hcode=req.query.hcode;
        // console.log(`${baseurl}/api/v3/hotels/availability/${data}?rates="concise"`,"console")

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
     const data={
      ...req.body
     };
    
    const response=await axios.delete(`${baseurl}/api/v3/hotels/bookings/`, { headers })

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

  msg = "Hotel Booking Save Successfully in Data Base !";
    actionCompleteResponse(res, response, msg); 
  
 } catch (err) {
  sendActionFailedResponse(res, {}, err.message);
  
 }


}