const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");
const joi = require('joi'); 
const SchemaValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const errorMessage = error.details.map((details) => details.message).join(',');
      console.log('Validation Error:', errorMessage); // Log the validation error
      return sendActionFailedResponse(res, {}, errorMessage);
    }
  };
};


module.exports = SchemaValidator;

