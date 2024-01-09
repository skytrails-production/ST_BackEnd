const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');

//*****************************************SERVICES************************************************/
const { advertisementServices } = require("../../services/btocServices/advertisementServices");
const { createadvertisement, findadvertisementData, deleteadvertisement, advertisementList, updateadvertisement, countTotaladvertisement ,getAdvertisment} = advertisementServices;
const { flightadvertisementServices } = require("../../services/btocServices/flightAdvertismentServices");
const { createflightadvertisement, findflightadvertisementData, deleteflightadvertisement, advertisementflightList, updateflightadvertisement, countTotalflightadvertisement ,getflightAdvertisment} =flightadvertisementServices;
const { hoteladvertisementServices } = require("../../services/btocServices/hotelAdvertisementServices");
const {createhoteladvertisement,findhoteladvertisementData,deletehoteladvertisement,hoteladvertisementList,updatehoteladvertisement,countTotalhoteladvertisement,gethotelAdvertisment}=hoteladvertisementServices;
const { busadvertisementServices } = require("../../services/btocServices/busAdvertiseMentServices");
const {createbusadvertisement,findbusadvertisementData,deletebusadvertisement,advertisementbusList,updatebusadvertisement,countbusTotaladvertisement,getbusAdvertisment}=busadvertisementServices;
const {couponServices}=require("../../services/btocServices/couponServices");
const {createCoupon,findCoupon,getCoupon,findCouponData,deleteCoupon,couponList,updateCoupon,paginateCouponSearch}=couponServices


exports.createCoupon=async(req, res)=>{
    try {
        const {}=req.body;
        
      const newCoupon = await Coupon.create(req.body);
      res.status(201).json(newCoupon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  