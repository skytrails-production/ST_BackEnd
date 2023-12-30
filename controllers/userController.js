const config = require("../config/auth.config");
const db = require("../model");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const userType = require("../enums/userType");
const status = require("../enums/status");
const commonFunction = require('../utilities/commonFunctions');
const approvestatus = require('../enums/approveStatus')
//require responsemessage and statusCode
const statusCode = require('../utilities/responceCode');
const responseMessage = require('../utilities/responses')
//***********************************SERVICES********************************************** */

const { userServices } = require('../services/userServices');
const { responseMessages } = require("../common/const");
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;

exports.signUp = async (req, res, next) => {
    try {
        const { email, mobileNumber, username, Address, userType, profilePic, password } = req.body;
        if (req.body.email) {
            req.body.email = (req.body.email).toLowerCase();
        }
        const isAlreadyExist = await findUser({ $or: [{ email: email }, { 'phone.mobile_number': mobileNumber }]});
        console.log("isAlreadyExist========",isAlreadyExist);
        if (isAlreadyExist) {
            return res.status(statusCode.Conflict).json({ message: responseMessage.USER_ALREADY_EXIST });
        }
        const pass = bcrypt.hashSync(password,10)
        otp = commonFunction.getOTP();
        otpExpireTime = new Date().getTime() + 300000;
        if (profilePic && profilePic !== '') {
            profilePic = await commonFunction.uploadImage(profilePic);
        }
        const object = {
            email: email,
            phone: { mobile_number: mobileNumber },
            username: username,
            Address: Address,
            profilePic: profilePic || " ",
            password: pass,
            otp: otp,
            otpExpireTime: otpExpireTime
        }
        var result = await createUser(object);
        return res.status(statusCode.Conflict).json({ message: responseMessages.REGISTER_SUCCESS, data: result });
    } catch (error) {
        console.log(error);
        return next(error);
    }

}

exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        var userResult = await findUserData({ $and: [{ $or: [{ mobile_number: email }, { email: email }] }] });
        if (!userResult) {
            return res.status(statusCode.NotFound).json({ message: responseMessage.USER_NOT_FOUND });
        };
        if (userResult.otp !== otp) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.INCORRECT_OTP });
        }else if (new Date().getTime() > userResult.otpExpireTime) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.OTP_EXPIRED });
        }
        const updateResult=await updateUser({ _id:userResult._id},{otp:'',otpVerified:true});
        console.log("updateResult=============",updateResult)
        var token = await commonFunction.getToken({ _id: updateResult._id, email: updateResult.email, mobile_number: updateResult.mobile_number, userType: updateResult.userType });
        var obj = {
            _id: updateResult._id,
            name: updateResult.name,
            email: updateResult.email,
            countryCode: updateResult.countryCode,
            phone: updateResult.phone.mobile_number ,
            otpVerified: true,
            token: token
        };
        return res.status(statusCode.OK).json({ message: responseMessage.OTP_VERIFY, result: obj });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (req.body.email) {
            req.body.email = (req.body.email).toLowerCase();
        }
        const isUserExist = await findUserData({ $and: [{ $or: [{ mobile_number: email }, { email: email }] }] });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).json({ message: responseMessage.INCORRECT_LOGIN });
        }
        if (isUserExist.otpVerified === false) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.OTP_NOT_VERIFY });
        }
        const isMatchedUser = bcrypt.compareSync(password, isUserExist.password)
        if (!isMatchedUser) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.INCORRECT_LOGIN });
        }
        var token = await commonFunction.getToken({ _id: isUserExist._id, email: isUserExist.email, mobile_number: isUserExist.mobile_number });
        return res.status(statusCode.OK).json({ message: responseMessage.OTP_VERIFY, result: token });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (req.body.email) {
            req.body.email = (req.body.email).toLowerCase();
        }
        const isUserExist = await findUserData({ $and: [{ $or: [{ mobile_number: email }, { email: email }] }] });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).json({ message: responseMessage.USERS_NOT_FOUND });
        }
        const otp = commonFunction.getOTP();
        const otpExpireTime = new Date().getTime() + 300000;
        const updateUserData = await updateUser({ _id: isUserExist, status: status.ACTIVE }, { $set: { otp: otp, otpExpireTime: otpExpireTime } });
        await commonFunction.sendVerificationMail(isUserExist.email, otp);
        return res.status(statusCode.OK).json({ message: responseMessage.OTP_SEND });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.PASSWORD_NOT_MATCH });
        }
        const isUserExist = await findUserData({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.USERS_NOT_FOUND })
        }
        const pass = bcrypt.hashSync(req.body.password, 10);
        await updateUser({ _id: req.userId, status: status.ACTIVE }, { $set: { password: pass } });
        return res.status(statusCode.OK).json({ message: responseMessage.PWD_CHANGED });
    } catch (error) {
        console.log("Error========", error);
        return next(error);
    }
}

exports.resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const isUserExist = await findUserData({ email: email, status: status.ACTIVE });
        if (!isUserExist) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.USERS_NOT_FOUND });
        } else if (isUserExist.otpVerified == true) {
            return res.status(statusCode.badRequest).json({ message: responseMessage.ALREADY_VERIFIED });
        }
        var otp = commonFunction.getOTP();
        const otpExpireTime = new Date().getTime() + 300000;
        const updateUserData = await updateUser({ _id: isUserExist, status: status.ACTIVE }, { $set: { otp: otp, otpExpireTime: otpExpireTime } });
        await commonFunction.sendEmailOtp(isUserExist.email, otp);
        return res.status(statusCode.OK).json({ message: responseMessage.OTP_SEND });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.editProfile = async (req, res, next) => {
    try {
        const { username, email, mobile_number, profilePic, } = req.body;
        const isUSer = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUSer) {
            return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        }
        if (email || mobile_number) {
            const isExist = await findUser({ $or: [{ email: email }, { mobile_number: mobile_number }], _id: { $nin: isUSer._id } });
            if (isExist) {
                return res.status(statusCode.Conflict).send({ message: responseMessage.USER_ALREADY_EXIST });
            }
        }
        if (req.file) {
            req.body.profilePic = await commonFunction.getImageUrl(req.file);
        }
        const result = await updateUser({ _id: isUSer._id }, req.body);
        return res.status(statusCode.OK).send({ message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error=======>>>>>>", error);
        return next(error);
    }
}

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
          }
        const userList = await findUser({ _id: req.userId, status: status.ACTIVES });
        if (!userList) {
            return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
        }
        const imageUrl = await commonFunction.getImageUrl(req.file);
        if (imageUrl) {
            const result = await updateUser({ _id: userList._id }, { profilePic: imageUrl })
            return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
        }
    } catch (error) {
        console.log("error====>>>", error);
        return next(error);
    }
}


