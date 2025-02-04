const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status=require('../../enums/status')
const {webAdvertisementServices}=require("../../services/btocServices/webUserOfferServices");
const {createWebadvertisement,findWebadvertisementData,deletWebeadvertisement,webAdvertisementList,updateWebadvertisement,countTotalWebadvertisement,getWebAdvertisment}=webAdvertisementServices;
const {
    couponServices,
  } = require("../../services/btocServices/couponServices");
  const {
    createCoupon,
    findCoupon,
    getCoupon,
    findCouponData,
    deleteCoupon,
    couponList,
    updateCoupon,
    paginateCouponSearch,
  } = couponServices;


exports.getCombineOffer=async(req,res,next)=>{
    try {
        const currentDate = new Date();
       let combineData=await findCouponData({status:status.ACTIVE,expirationDate: { $gte: currentDate }});
        const couponData1=await webAdvertisementList({status:status.ACTIVE,endDate: { $gte: currentDate }});
        combineData = combineData.concat(couponData1);
        if(combineData.length<1){
            return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:combineData})
    } catch (error) {
        return next(error)
    }
}

exports.getOfferById=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const [couponData, offerData] = await Promise.all([
            findCoupon({ _id: id, status: status.ACTIVE }),
            findWebadvertisementData({ _id: id, status: status.ACTIVE }),
        ]);
        const result = couponData || offerData;

        if (result) {
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.DATA_FOUND,
                result,
            });
        }

        // If no data is found
        return res.status(statusCode.OK).send({
            statusCode: statusCode.NotFound,
            responseMessage: responseMessage.DATA_NOT_FOUND,
        });

    } catch (error) {
        return next(error);
    }
}