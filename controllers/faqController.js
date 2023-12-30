const status = require("../enums/status");
const Joi = require('joi')
const schemas = require('../utilities/schema.utilities');
//********************************SERVICES***************************************************/
const { faqServices } = require('../services/faqServices');
const { createfaq, findfaq, findfaqData, deletefaqStatic, updatefaqStatic } = faqServices;
const { staticContentServices } = require('../services/staticContentServices');
const { createstaticContent, findstaticContent, findstaticContentData, deletestaticContentStatic, updatestaticContentStatic } = staticContentServices;
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../common/common");

const staticContentType = require('../enums/staticContentType')

exports.createfaqs = async (req, res, next) => {
    try {
        const { que, ans, type, staticContentTypeId } = req.body;
        // const isExist = await findstaticContent({ _id: staticContentTypeId, status: status.ACTIVE });
        // console.log("isExist===========", isExist);
        // if (!isExist) {
        //     sendActionFailedResponse(res, {}, 'No Data Found');
        // }
        // const isAdmin = await findUser({ _id: req.userId });
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user');
        // }
        const existingData = await findfaq({ category: type });
        if (existingData) {
            const obj={
                Q:que,
                A:ans,
                category:type
            }
            const updatedData = await updatefaqStatic({ _id: existingData._id },obj);
            actionCompleteResponse(res, updatedData, 'Frequently ask quetions updated successfully.');
        } else {
            const obj={
                Q:que,
                A:ans,
                category:type
            }
            const result = await createfaq(obj);
            actionCompleteResponse(res, result, 'Frequently ask quetions created successfully.');
        }
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res, {}, error.message);
        return next(error);
    }
}

exports.listfaqs = async (req, res, next) => {
    try {
        const { staticContentTypeId } = req.query;
        const isExist = await findstaticContent({ _id: staticContentTypeId, status: status.ACTIVE });
        if (!isExist) {
            sendActionFailedResponse(res, {}, 'No Data Found');
        }
        const result = await findfaqData({ type: isExist.type, status: status.ACTIVE });
        if (!result) {
            sendActionFailedResponse(res, {}, 'No Data Found');
        }
        actionCompleteResponse(res, result, 'Frequently ask quetions listed successfully');

    } catch (error) {
        console.log("error========>>>>>>", error);
        return next(error);
    }
}

exports.updatefaqs = async (req, res, next) => {
    const validationSchema = Joi.object({
        faqId: Joi.string().required(),
        Q: Joi.string().optional(),
        A: Joi.string().optional()
    })
    try {
        const validatedBody = await validationSchema.validateAsync(req.body);
        const { faqId } = validatedBody;
        const isAdmin = await findUser({ _id: req.userId });
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user');
        // }
        const result = await updatefaqStatic({ _id: req.body.faqId }, req.body);
        actionCompleteResponse(res, result, 'Frequently ask quetions updated successfully');
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}

exports.deletefaqs = async (req, res, next) => {
    const validationSchema = Joi.object({
        faqId: Joi.string().required()
    })
    try {
        const validatedBody = await validationSchema.validateAsync(req.body);
        const { faqId } = validatedBody;
        const isAdmin = await findUser({ _id: req.userId });
        // if(!isAdmin){
        //     sendActionFailedResponse(res,{},'Unauthorised user');
        // }
        const result = await updatefaqStatic({ _id: req.body.faqId }, { status: status.DELETE });
        actionCompleteResponse(res, result, 'Frequently ask quetions deleted successfully');
    } catch (error) {
        console.log("error========>>>>>>", error);
        // sendActionFailedResponse(res,{},error.message);
        return next(error);
    }
}
