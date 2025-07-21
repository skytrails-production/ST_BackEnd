const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AdminNumber = process.env.ADMINNUMBER;
const sendSMSUtils = require("../../utilities/sendSms");
const whatsApi = require("../../utilities/whatsApi");
const commonFunction = require("../../utilities/commonFunctions");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");

/**********************************SERVICES********************************** */
const {countryWiseFormServices}=require('../../services/intelliVisaServices/countryVisaFormServices');
const{createCountryFrom,insertManyCountryFrom,findCountryFrom,deleteCountryFrom,countryWiseFormList,updateCountryFrom,countTotalCountryFrom}=countryWiseFormServices