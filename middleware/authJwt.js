const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../model");
const User = db.user;
const Role = db.role;
const userModel=require("../model/btocModel/userModel.js");
const subAdminModel=require("../model/subAdmin/subAdminModel.js");
const responseMessage = require('../utilities/responses');
const statusCode = require('../utilities/responceCode');
const rmModel=require("../model/relationManagerModel/relationShipManagerModel.js");
const partnerModel=require("../model/inventory/hotelinventoryAuth.js")
verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

verifcationToken = (req, res, next) => {
  try {
    if (req.headers.token) {
      jwt.verify(req.headers.token, config.secret, (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(440).send({
              responseCode: 440,
              responseMessage: "Session Expired, Please login again.",
            });
          }
          else {
            // throw apiError.unauthorized(responseMessage.UNAUTHORIZED);
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "User not authorized ."
            })
          }
        }
        else {
          userModel.findOne({ _id: result._id }, (error, result2) => {
            if (error) {
              return next(error)
            }
            else if (!result2) {
              //throw apiError.notFound(responseMessage.USER_NOT_FOUND);
              return res.status(404).json({
                responseCode: 404,
                responseMessage: "USER NOT FOUND"
              })
            }
            else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({
                  responseCode: 403,
                  responseMessage: "You have been blocked by admin ."
                })
              }
              else if (result2.status == "DELETE") {
                return res.status(402).json({
                  responseCode: 402,
                  responseMessage: "Your account has been deleted by admin ."
                })
              }
              else {
                req.userId = result._id;
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    } else {
      throw res.status(404).send({statusCode:statusCode.OK,message:"You are not logged in,please signIn first(❁´◡`❁)"})
    }
  } catch (error) {
    // console.log("error=>>",error);
    return error;
  }
};

verifcationSubAdminToken = (req, res, next) => {
  try {
    if (req.headers.token) {
      jwt.verify(req.headers.token, config.secret, (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(440).send({
              responseCode: 440,
              responseMessage: "Session Expired, Please login again.",
            });
          }
          else {
            // throw apiError.unauthorized(responseMessage.UNAUTHORIZED);
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "User not authorized ."
            })
          }
        }
        else {
          subAdminModel.findOne({ _id: result.id }, (error, result2) => {
            if (error) {
              return next(error)
            }
            else if (!result2) {
              //throw apiError.notFound(responseMessage.USER_NOT_FOUND);
              return res.status(404).json({
                responseCode: 404,
                responseMessage: "USER NOT FOUND"
              })
            }
            else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({
                  responseCode: 403,
                  responseMessage: "You have been blocked by admin ."
                })
              }
              else if (result2.status == "DELETE") {
                return res.status(402).json({
                  responseCode: 402,
                  responseMessage: "Your account has been deleted by admin ."
                })
              }
              else {
                req.userId = result.id;
                // log(req.userId,"req.userId")
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    } else {
      throw res.status(404).send({statusCode:statusCode.OK,message:"Please provide token.!"})
    }
  } catch (error) {
    console.log("error=>>",error);
  }
};

verificationTokenOfRM=(req,res,next)=>{
  try {
    if (req.headers.token) {
      
      jwt.verify(req.headers.token, config.secret, (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(440).send({
              responseCode: 440,
              responseMessage: "Session Expired, Please login again.",
            });
          }
          else {
            // throw apiError.unauthorized(responseMessage.UNAUTHORIZED);
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "User not authorized ."
            })
          }
        }
        else {
          rmModel.findOne({ _id: result._id }, (error, result2) => {
            if (error) {
              return next(error)
            }
            else if (!result2) {
              return res.status(404).json({
                responseCode: 404,
                responseMessage: "USER NOT FOUND"
              })
            }
            else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({
                  responseCode: 403,
                  responseMessage: "You have been blocked by admin ."
                })
              }
              else if (result2.status == "DELETE") {
                return res.status(402).json({
                  responseCode: 402,
                  responseMessage: "Your account has been deleted by admin ."
                })
              }
              else {
                req.userId = result._id;
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    }else{
      throw res.status(404).send({statusCode:statusCode.OK,message:"Please provide token.!"});
    }
  } catch (error) {
    console.log("error======>>",error);
  }
};
verificationTokenOfRMResetPass=(req,res,next)=>{
  try {
    if (req.headers.token) {
      
      jwt.verify(req.headers.token, config.secret, (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(440).send({
              responseCode: 440,
              responseMessage: "Session Expired, Please login again.",
            });
          }
          else {
            // throw apiError.unauthorized(responseMessage.UNAUTHORIZED);
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "User not authorized ."
            })
          }
        }
        else {
          rmModel.findOne({ _id: result._id }, (error, result2) => {
            if (error) {
              return next(error)
            }
            else if (!result2) {
              return res.status(404).json({
                responseCode: 404,
                responseMessage: "USER NOT FOUND"
              })
            }
            else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({
                  responseCode: 403,
                  responseMessage: "You have been blocked by admin ."
                })
              }
              else if (result2.status == "DELETE") {
                return res.status(402).json({
                  responseCode: 402,
                  responseMessage: "Your account has been deleted by admin ."
                })
              }
              else {
                req.userId = result._id;
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    }else{
      throw res.status(404).send({statusCode:statusCode.OK,message:"Please provide token.!"});
    }
  } catch (error) {
    console.log("error======>>",error);
  }
}

verifyTokenOfInvenPartner=(req,res,next)=>{
  try {
    if (req.headers.token) {
      
      jwt.verify(req.headers.token, config.secret, (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res.status(440).send({
              responseCode: 440,
              responseMessage: "Session Expired, Please login again.",
            });
          }
          else {
            // throw apiError.unauthorized(responseMessage.UNAUTHORIZED);
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "User not authorized ."
            })
          }
        }
        else {
          partnerModel.findOne({ _id: result._id }, (error, result2) => {
            if (error) {
              return next(error)
            }
            else if (!result2) {
              return res.status(404).json({
                responseCode: 404,
                responseMessage: "USER NOT FOUND"
              })
            }
            else {
              if (result2.status == "BLOCKED") {
                return res.status(403).json({
                  responseCode: 403,
                  responseMessage: "You have been blocked by admin ."
                })
              }
              else if (result2.status == "DELETE") {
                return res.status(402).json({
                  responseCode: 402,
                  responseMessage: "Your account has been deleted by admin ."
                })
              }
              else {
                req.userId = result._id;
                req.userDetails = result
                next();
              }
            }
          })
        }
      })
    }else{
      throw res.status(404).send({statusCode:statusCode.OK,message:"Please provide token.!"});
    }
  } catch (error) {
    console.log("error======>>",error);
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  verifcationToken,
  verifcationSubAdminToken,
  verificationTokenOfRM,
  verifyTokenOfInvenPartner
};
module.exports = authJwt;
