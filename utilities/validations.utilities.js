const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");
const joi = require('joi'); 
const SchemaValidator = (schema) => { 
  return (req, res, next) => { 
    const { error } = schema.validate(req.body); 
    const valid = error == null; 
    if (valid) { next();} 
    else { 
        const errorMessage = error.details.map((details) => details.message).join(','); 
        return sendActionFailedResponse(res, {}, errorMessage) 
    } 
  } 
} 

module.exports = SchemaValidator;

