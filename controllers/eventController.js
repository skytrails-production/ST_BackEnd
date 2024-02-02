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
  findEventData,
  deleteEvent,
  eventList,
  allEvent,
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
      longitude,
      noOfMember,
    } = req.body;
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    const imageFiles = await commonFunction.getImageUrlAWS(req.file);
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
      location: { coordinates: [longitude, latitude] },
      slot: [],
      isPaid: req.body.isPaid,
    };

    const startingDate = Moment(startDate, "YYYY-MM-DD");
    const endingDate = Moment(endDate, "YYYY-MM-DD");
    const storeStartDate = startingDate.format("YYYY-MM-DD");
    // console.log("startingDate:", startingDate, "endingDate:,", endingDate);
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
          startDate: startingDate.format("YYYY-MM-DD"),
          endDate: endingDate.format("YYYY-MM-DD"),
          isAvailable: true,
          peoples: Number(noOfMember),
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
    // console.log("result=============",result);
    // const object={
    //   _id:result._id,
    //   image:result.image,
    //   title:result.title,
    //   content:result.content,
    //   startDate:result.startDate,
    //   endDate:result.endDate,
    //   price:result.price,
    //   slot:result.slot,
    //   bookingPrice: result.bookingPrice,
    // adultPrice: result.adultPrice,
    // childPrice: result.childPrice,
    // couplePrice: result.couplePrice,
    // showType: result.showType,
    // age: result.age,
    // venue: result.venue,
    // status: result.status,
    // createdAt: result.createdAt,
    // updatedAt: result.updatedAt,
    // location:result.coordinates
    // }
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
    const isEventExist = await findEventData({
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

exports.getTopEvents = async (req, res, next) => {
  try {
    const result = await allEvent({ status: status.ACTIVE });
    if (!result || result.length === 0) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    // console.log("length=============",result.length)
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

exports.getAllEventsAggregate = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await getEvent(req.query);
    if (!result) {
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
    console.log("Error while trying to get events", error);
    return next(error);
  }
};
