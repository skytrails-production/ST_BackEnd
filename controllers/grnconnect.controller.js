const aws = require("aws-sdk");
const axios = require("axios");
const { api } = require("../common/const");

const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const { GrnCityList, GrnHotelCityMap } = require("../model/grnconnectModel");
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


exports.hotelSearch=async (req,res) =>{
    try{
        const data={
            ...req.body
        };
        console.log(data,"data")
        const hotelCode=await exports.grnHotelCityMap(req.body.cityCode);
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
        console.log(searchData,"data")
        // console.log(`${baseurl}/api/v3/hotels/availability`,"console")
        const response = await axios.post(`${baseurl}/api/v3/hotels/availability`, searchData, { headers });   
        
        
        msg = "Hotel Search Successfully!";
        actionCompleteResponse(res, response.data, msg);      
    } catch (err) {
      // console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
}


exports.refetchHotel = async (req, res) => {
    try{
        const data=req.query.searchId;
        console.log(`${baseurl}/api/v3/hotels/availability/${data}?rates="concise"`,"console")

        const response = await axios.get(`${baseurl}/api/v3/hotels/availability/${data}?rates=concise`,{ headers });   
        
        
        msg = "Hotel Refetch Successfully!";
        actionCompleteResponse(res, response.data, msg);      
    } catch (err) {
      // console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }   
}



exports.rateRefetchHotel =async (req, res) =>{
    try{
        const data={
            ...req.body
        };
        const searchId=req.query.searchId;
        console.log(`${baseurl}api/v3/hotels/availability/<sid>/rates/auto?action=recheck`,"console")
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
    console.log(codedata)
    return codedata;
  } catch (error) {
    throw new Error(error.message);
  }
};