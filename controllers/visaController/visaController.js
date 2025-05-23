let cloudinary = require("cloudinary");

//*********SERVICES********************* */
const { visaServices } = require('../../services/visaServices');
const { createWeeklyVisa,createMultipleVisa, findWeeklyVisa,populatedVisaList, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa, weeklyVisaListPaginate, getNoVisaByPaginate, montholyVisaListPaginate, onarrivalVisaListPaginate ,aiVisaCounPaginate} = visaServices;
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;
const {visaCategoryServices}=require("../../services/visaAppServices/visaCategoryServices");
const {createVisaCategory,findVisaCategoryData,deleteVisaCategory,visaCategoryList,updateVisaCategory,countTotalVisaCategory,getVisaCategory,}=visaCategoryServices;

const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const status = require("../../enums/status");
const issuedTypeEnum = require('../../enums/issuedType');
//common response****************
const statusCode = require('../../utilities/responceCode');
const responseMessage = require('../../utilities/responses');
const commonFunctions = require("../../utilities/commonFunctions");
const { RecordingRulesList } = require("twilio/lib/rest/video/v1/room/roomRecordingRule");

exports.createVisa = async (req, res, next) => {
    try {
        const { countryName, price, validityPeriod, lengthOfStay, visaType, governmentFees, platFormFees, issuedType, continent ,visaCategoryName,aiListed,description} = req.body;
        const iscategoryIdExist=await findVisaCategoryData({visaCategoryName:visaCategoryName}); 
        if(!iscategoryIdExist){
            return res.status(statusCode.badRequest).send({ statusCode: statusCode.badRequest, responseMessage: responseMessage.CATEGORY_NOT_FOUND });
        }
        if (req.files) {
            
            var galleryData = [];
            for (var i = 0; i < req.files.length; i++) {
                const imageData = req.files[i];
                var data = await commonFunctions.getImageUrlAWSByFolderSingle(imageData,"VisaPictures");
                const imageUrl = data;
                galleryData.push(imageUrl);
            }
            req.body.gallery = galleryData;
        }
        if (issuedType == issuedTypeEnum.NO_VISA) {
            const result = await createWeeklyVisa(req.body);
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.VISA_CREATED, result: result })
        } else if (issuedType === issuedTypeEnum.VISA_ON_ARRIVAL) {
            const result = await createWeeklyVisa(req.body);
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.VISA_CREATED, result: result })
        }
        else {
            if (!governmentFees && !platFormFees) {
                return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: "governmentFees and  platFormFees or required" })
            } else if (!platFormFees) {
                return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: " platFormFees or required" })
            } else if (!governmentFees) {
                return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: " platFormFees or required" })
            }
            req.body.price = Number(governmentFees) + Number(platFormFees);
            req.body.visaType=iscategoryIdExist.visaType;
            req.body.visaCategoryId=iscategoryIdExist._id;

            // const object={
            //     countryName:countryName,
            //     price:req.body.price,
            //     validityPeriod:validityPeriod,
            //     lengthOfStay:lengthOfStay,
            //     gallery:gallery,
            //     visaType:iscategoryIdExist.visaType,
            //     continent:continent,
            //     visaCategoryId:iscategoryIdExist._id
            // }
            const result = await createWeeklyVisa(req.body);
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.VISA_CREATED, result: result })
        }

    } catch (error) {
        return next(error);
    }
}

exports.getVisa = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const options = { page, limit };
        const result = await weeklyVisaListPaginate(options);
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);
        const amOrPm = currentDate.getHours() >= 12 ? 'PM' : 'AM';
        const hours = currentDate.getHours() % 12 || 12;
        const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}, ${hours}:${(currentDate.getMinutes() < 10 ? '0' : '')}${currentDate.getMinutes()} ${amOrPm}`;
        result.docs.forEach(doc => {
            doc._doc.pricePerPerson = `${doc.price}/person`
            doc._doc.getData = `${formattedDate}`;
        });
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.NOT_FOUND, result: result })
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.updateVisa = async (req, res, next) => {
    const weeklyVisaDataId = req.body.weeklyVisaDataId;
    try {
        if (!weeklyVisaDataId) {
            sendActionFailedResponse(res, {}, 'weeklyVisaDataId is required')
        }
        const { countryName, price, validityPeriod, lengthOfStay, visaType, continent } = req.body;
        // const isAdmin = await findUser({_id:req.userId});
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        const isDataExist = await findWeeklyVisa({ _id: weeklyVisaDataId, status: status.ACTIVE });
        if (!isDataExist) {
            sendActionFailedResponse(res, {}, 'Data not found')
        }
        const result = await updateWeeklyVisa({ _id: isDataExist._id }, req.body);
        actionCompleteResponse(res, result, 'weeklyVisa updated successfully.')
    } catch (error) {
        // sendActionFailedRespons(res,{},error.message);
        return next(error);
    }
}

exports.deleteVisa = async (req, res, next) => {
    const weeklyVisaDataId = req.body.weeklyVisaDataId;
    try {
        if (!weeklyVisaDataId) {
            ("====================");
            sendActionFailedResponse(res, {}, 'weeklyVisaDataId is required')
        }
        // const isAdmin = await findUser({_id:req.userId});
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user')
        // }
        const isDataExist = await findWeeklyVisa({ _id: weeklyVisaDataId, status: status.ACTIVE });
        if (!isDataExist) {
            sendActionFailedResponse(res, {}, 'Data not found')
        }
        const result = await updateWeeklyVisa({ _id: isDataExist._id }, { status: status.DELETE });
        actionCompleteResponse(res, result, 'weeklyVisa updated successfully.')
    } catch (error) {
        return next(error);
    }
}

exports.getNoVisaList = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await getNoVisaByPaginate(req.query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.NOT_FOUND, result: result })
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error)
    }
}

exports.getMonthlyList = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const result = await montholyVisaListPaginate(req.query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.NOT_FOUND, result: result })
        }
        const currentDate = new Date();
        const guaranteedVisaDate = new Date(currentDate);
        guaranteedVisaDate.setDate(guaranteedVisaDate.getDate() + result.docs[0].daysToProcess);
        const amOrPm = guaranteedVisaDate.getHours() >= 12 ? 'PM' : 'AM';
        const hours = guaranteedVisaDate.getHours() % 12 || 12;
        const formattedDate = `${guaranteedVisaDate.getDate()} ${guaranteedVisaDate.toLocaleString('default', { month: 'short' })}, ${hours}:${(guaranteedVisaDate.getMinutes() < 10 ? '0' : '')}${guaranteedVisaDate.getMinutes()} ${amOrPm}`;
        result.docs.forEach(doc => {
            doc._doc.pricePerPerson = `${doc.price}/person`;
            doc._doc.getData = `Submit Today For Guaranteed Visa By: ${formattedDate}`;
        });
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error)
    }
}

exports.getonArrivalList = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await onarrivalVisaListPaginate(req.query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.NOT_FOUND, result: result })
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error)
    }
}


exports.getWeeklyVisa = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const options = { page, limit };
        const result = await weeklyVisaListPaginate(options);
        const currentDate = new Date();
        const guaranteedVisaDate = new Date(currentDate);
        guaranteedVisaDate.setDate(guaranteedVisaDate.getDate() + result.docs[0].daysToProcess);
        const amOrPm = guaranteedVisaDate.getHours() >= 12 ? 'PM' : 'AM';
        const hours = guaranteedVisaDate.getHours() % 12 || 12;

        const formattedDate = `${guaranteedVisaDate.getDate()} ${guaranteedVisaDate.toLocaleString('default', { month: 'short' })}, ${hours}:${(guaranteedVisaDate.getMinutes() < 10 ? '0' : '')}${guaranteedVisaDate.getMinutes()} ${amOrPm}`;

        result.docs.forEach(doc => {
            doc._doc.pricePerPerson = `${doc.price}/person`;
            doc._doc.getData = `Submit Today For Guaranteed Visa By: ${formattedDate}`;
        });
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.getVisaById=async(req,res,next)=>{
    try {
        const {visaId}=req.query;
        
        const result=await findWeeklyVisa({_id:visaId,status:status.ACTIVE});
        if(!result){
            return res
            .status(statusCode.OK)
            .send({
              statusCode: statusCode.NotFound,
              message: responseMessage.DATA_NOT_FOUND,
            });
        }
        if(result.issuedType=="MONTHLY VISA"||result.issuedType=="WEEKLY VISA"){
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + result.daysToProcess);
            const amOrPm = currentDate.getHours() >= 12 ? 'PM' : 'AM';
            const hours = currentDate.getHours() % 12 || 12;
            const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}, ${hours}:${(currentDate.getMinutes() < 10 ? '0' : '')}${currentDate.getMinutes()} ${amOrPm}`;
            result._doc.pricePerPerson=`${result.price}/person`;
            result._doc.getData = `Submit Today For Guaranteed Visa By: ${formattedDate}`;
        }

            return res
            .status(statusCode.OK)
            .send({
              statusCode: statusCode.OK,
              message: responseMessage.DATA_FOUND,
              result: result,
            });
    } catch (error) {
        return next(error);
    }
}

exports.getAllVisaCountry=async(req,res,next)=>{
    try {
       const result=await populatedVisaList({status:status.ACTIVE});
       if(!result||result.length==0){
        return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND});
    }
    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    
    } catch (error) {
        return next(error )
    }
}


exports.createMultipleVisas=async(req,res,next)=>{
try {
    const visas = req.body.visas;
    const visaDocuments = [];
    for (let visa of visas) {
        const {
            countryName,
            price,
            validityPeriod,
            lengthOfStay,
            visaType,
            governmentFees,
            platFormFees,
            issuedType,
            continent,
            visaCategoryName,
        } = visa;
    
        const isCategoryIdExist = await findVisaCategoryData({ visaCategoryName });
        if (!isCategoryIdExist) {
            return res.status(statusCode.OK).send({
                statusCode: statusCode.badRequest,
                responseMessage: responseMessage.CATEGORY_NOT_FOUND,
            });
        }
        const visaDocument = {
            countryName,
            validityPeriod,
            lengthOfStay,
            continent,
            visaCategoryId: isCategoryIdExist._id,
            visaType: isCategoryIdExist.visaType,
            price: Number(governmentFees) + Number(platFormFees), // Assuming these fields are always present
            issuedType,
        };
        if (req.files) {
            const galleryData = [];
            for (const imageData of req.files) {
                const data = await commonFunctions.getImageUrlAWSByFolder(imageData, "VisaPictures");
                galleryData.push(data);
            }
            visaDocument.gallery = galleryData; // Add gallery to the visa document
        }

        visaDocuments.push(visaDocument);
    }
    const result = await createMultipleVisa(visaDocuments); // Assuming VisaModel is your Mongoose model

    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.VISA_CREATED,
        result: result,
    });
} catch (error) {
    return next(error);
}
}

exports.getAiVisaCountry=async(req,res,next)=>{
    try {
        const { page, limit } = req.query;
        const result = await aiVisaCounPaginate(req.query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.NOT_FOUND, result: result })
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error)
    }
}