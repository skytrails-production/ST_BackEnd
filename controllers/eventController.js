var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const commonFunction = require("../utilities/commonFunctions");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const whatsappAPIUrl = require("../utilities/whatsApi");
const userType = require("../enums/userType");
const status = require("../enums/status");
const Moment = require("moment");
//************SERVICES*************** */

const { eventServices } = require("../services/eventServices");
const { triggerAsyncId } = require("async_hooks");
const {
  createEvent,
  findeventData,
  deleteEvent,
  eventList,
  updateEvent,
  countTotalEvent,
  getEvent,
} = eventServices;

exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      content,
      remainingDays,
      startDate,
      endDate,
      price,
      bookingPrice,
      showType,
      age,
      venue,
      adultPrice,
      childPrice,
      couplePrice,
      startTime,
      endTime,
      breakTime,
      noOfShows,
      slotTime,
      latitude,
      longitude
    } = req.body;
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    const imageFiles = await commonFunction.getImageUrl(req.file);
    if (!imageFiles) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    const object = {
      image: imageFiles,
      title: title,
      content: content,
      startDate: startDate,
      endDate: endDate,
      remainingDays: remainingDays,
      price: price,
      bookingPrice: bookingPrice,
      showType: showType,
      age: age,
      venue: venue,
      adultPrice: adultPrice,
      childPrice: childPrice,
      couplePrice: couplePrice,
      location:{coordinates:[longitude,latitude]},
      slot: [],
    };
    const startingDate = Moment(startDate, "YYYY-MM-DD");
    const endingDate = Moment(endDate, "YYYY-MM-DD");
    console.log("startingDate:",startingDate,"endingDate:,",endingDate)
    while (startingDate <= endingDate) {
        const startingTime = Moment(startTime, "HH:mm");
        const endingTime = Moment(endTime, "HH:mm");
      
        for (let i = 0; i < noOfShows; i++) {
          const slotEndTime = Moment(startingTime).add(slotTime, "minutes");
      
          // Ensure that the show doesn't exceed the ending time
          if (slotEndTime.isAfter(endingTime)) {
            break;
          }
      
          object.slot.push({
            startTime: startingTime.format("HH:mm"),
            endTime: slotEndTime.format("HH:mm"),
            isAvailable: true,
          });
          startingTime.add(slotTime, "minutes");
          if (i < noOfShows - 1) {
            startingTime.add(breakTime, "minutes");
          }
        }
      
        startingDate.add(1, "day");
      }
      
    // console.log("object======", object);
    const result = await createEvent(object);
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.ADS_CREATED,
      result: result,
    });
  } catch (error) {
    console.log("error while creating event", error);
    return next(error);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const result = await eventList({ status: status.ACTIVE });
    if (!result || result.length === 0) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("Error while get data: " + error);
    return next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const isEventExist = await findeventData({
      _id: eventId,
      status: status.ACTIVE,
    });
    if (!isEventExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: isEventExist,
    });
  } catch (error) {
    console.log("Error while get data: " + error);
    return next(error);
  }
};
