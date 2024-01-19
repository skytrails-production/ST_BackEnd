const statusCode = require('../../utilities/responceCode');
const responseMessage = require('../../utilities/responses');
const status = require("../../enums/status");
const issuedType = require('../../enums/issuedType');

//********************************************SERVICES*******************************************/
const { userServices } = require("../../services/userServices");
const {createUser,findUser,getUser,findUserData,updateUser,paginateUserSearch,countTotalUser,} = userServices;
const {requireDocServices}=require("../../services/visaAppServices/requireDocumentServices");
const{createRequireDoc,findRequireDocData,findRequireDocData1,deleteRequireDoc,requireDocList,updateRequireDoc,countTotalRequireDoc,getRequireDoc,requireDocListPopulate}=requireDocServices;
const { visaServices } = require('../../services/visaServices');
const { createWeeklyVisa, findWeeklyVisa,findWeeklyVisaPopulate, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa, weeklyVisaListPaginate, getNoVisaByPaginate, montholyVisaListPaginate, onarrivalVisaListPaginate } = visaServices;
const {visaCategoryServices}=require("../../services/visaAppServices/visaCategoryServices");
const {createVisaCategory,findVisaCategoryData,deleteVisaCategory,visaCategoryList,updateVisaCategory,countTotalVisaCategory,getVisaCategory}=visaCategoryServices;
const {docCategoryServices}=require("../../services/visaAppServices/documentCategoryServices");
const {createDocCategory,findDocCategoryData,deleteDocCategory,docCategoryList,updateDocCategory,countTotalDocCategory,getDocCategory}=docCategoryServices;


//************************************API'S Implementation***************************************************/

exports.createRequireDocument = async (req, res, next) => {
    try {
        const { visaCountry, visaType, visaCategory, requiredDocCategory } = req.body;
        const isCountryExist = await findWeeklyVisaPopulate({ countryName: visaCountry });

        if (!isCountryExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }

        const isvisaCategoryExist = await findVisaCategoryData({ categoryName: visaCategory });

        if (!isvisaCategoryExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_NOT_FOUND });
        }

        const obj = {
            visaCountry: isCountryExist._id,
            visaType: isvisaCategoryExist.visaType,
            visaCategory: isvisaCategoryExist._id,
            requiredDocCategory: requiredDocCategory,
            requiredDocumentCategories: [],
        };

        for (const category of requiredDocCategory) {
            const foundCategory = await findDocCategoryData({ categoryName: category });
            if (foundCategory && foundCategory._id) {
                obj.requiredDocumentCategories.push(foundCategory._id);
            }
        }

        const isAlreadyExist = await findRequireDocData({ $and: [{ visaCountry: isCountryExist._id }, { visaCategory: isvisaCategoryExist._id }] });

        if (isAlreadyExist && isAlreadyExist.requiredDocumentCategories && obj.requiredDocumentCategories.some(id => isAlreadyExist.requiredDocumentCategories.includes(id))) {
            const update = await updateRequireDoc({ _id: isAlreadyExist._id }, obj);
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                message: responseMessage.UPDATE_SUCCESS,
                result: update,
            });
        }

        const result = await createRequireDoc(obj);
        await updateWeeklyVisa({ _id: isCountryExist._id }, { requireDocumentId: result._id ,documents:result.requiredDocCategory});
        await updateVisaCategory({ _id: isvisaCategoryExist._id }, { requiredDocuments: result.requiredDocCategory });

        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.CREATED_SUCCESS,
            result: result,
        });
    } catch (error) {
        console.log("Error while creating required document");
        return next(error);
    }
};

exports.getRequireDocument=async(req,res,next)=>{
    try {
        const result=await requireDocListPopulate({});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
   
    } catch (error) {
        console.log("error while trying to get doc category.");
        return next(error)
    }
}

exports.getRequireDocumentById=async(req,res,next)=>{
    try {
        const {docId}=req.query;
        const result=await findRequireDocData({_id:docId});
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
    } catch (error) {
        console.log("error while get data",error);
        return next(error)
    }
}

exports.getRequireDocumentPerCountry=async(req,res,next)=>{
    try {
        const {countryId}=req.query;
        const result=await findRequireDocData1({visaCountry:countryId});
        
        console.log("result==================",result);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND,result: result,});
        }
        return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result,});
    } catch (error) {
        console.log("error while trying to get country docs",error);
        return next(error)
    }
}