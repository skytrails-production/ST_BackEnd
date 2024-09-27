const mongoose = require("mongoose");
const aws = require("aws-sdk");
const inventoryModel = require("../../model/inventory/hotelinventoryAuth"); // Correct import path
const inventoryHotelForm = require("../../model/inventory/hotelForm");
const hotelInventory = require("../../model/inventory/hotelPartener");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const commonFunction = require("../../utilities/commonFunctions");
//**********************************************Model******************************************************/
const {GrnCountryList,TboHotelCityList}=require("../../model/grnconnectModel");

exports.getCountryList=async(req,res,next)=>{
    try {
        const result=await GrnCountryList.find({}).sort({countryName:1}).select('countryName -_id');
        if(result.length<1){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.DATA_NOT_FOUND
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

exports.getStateList=async(req,res,next)=>{
    try {
        const result=await TboHotelCityList.aggregate([
            { $match: { countryName: req.params.countryName } },
            {
                $sort: {
                    stateProvince: 1,
                    cityName: 1
                }
            },
            // {
            //     $project: {
            //         _id: 1,
            //         countryName: 1,
            //         cityName: 1,
            //         stateProvince: { $ifNull: ["$stateProvince", null] }
            //     }
            // }
        ]);

        if(result.length<1){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.DATA_NOT_FOUND
              });
        }       
        // const removeDuplicate=result=>[...new Set(result.stateProvince)] ;
        
        
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result: result,
          });
    } catch (error) {
        return next(error);
    }
}

exports.getCityList=async(req,res,next)=>{
    try {
        const result=await TboHotelCityList.find({stateProvince:req.params.stateName}).sort({cityName:1});
        if(result.length<1){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.DATA_NOT_FOUND
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

exports.getStateAggregateList = async (req, res, next) => {
    try {
        const result = await TboHotelCityList.aggregate([
            { $match: { countryName: req.params.countryName } },
            {
                $group: {
                    _id: { 
                        stateProvince: "$stateProvince" 
                    },
                    cityName: { $first: "$cityName" }
                }
            },
            {
                $sort: {
                    "_id.stateProvince": 1,
                    cityName: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    stateProvince: "$_id.stateProvince",
                    cityName: 1
                }
            }
        ]);

        if (result.length < 1) {
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.DATA_NOT_FOUND
            });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result: result,
            result1:result.length
        });
    } catch (error) {
        return next(error);
    }
};
