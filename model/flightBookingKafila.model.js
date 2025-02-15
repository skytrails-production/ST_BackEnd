const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const status =require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const { string } = require("joi");

const baggageSchema = new mongoose.Schema({
  AirlineCode: String,
  FlightNumber: String,
  WayType: Number,
  Code:String,
  Description:String,
  Weight:Number,
  Currency:String,
  Price:Number,
  Origin:String,
  Destination:String
});


const mealDynamicSchema=new mongoose.Schema({
          AirlineCode: String,
          FlightNumber: String,
          WayType: Number,
          Code: String,
          Description: Number,
          AirlineDescription: String,
          Quantity: Number,
          Currency: String,
          Price: Number,
          Origin: String,
          Destination: String
});


const kafilaFlightBookingData = new mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "userb2bs",
      },
      ticketType:{
        type:String,
      },
      oneWay:{
        type:Boolean,
      },
      bookingId: {
        type:String,
      },
      pnr: {
        type: String,
      },
      totalAmount :{
        type: Number,
      },
      origin: {
        type: String,
      },
      destination : {
        type : String,
      },
      
      "airlineDetails": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "Airline": {
              "type": "object",
              "properties": {
                "AirlineCode": { "type": "string" },
                "AirlineName": { "type": "string" },
                "FlightNumber": { "type": "string" },
                "FareClass": { "type": "string" }
              }
            },
            "Origin": {
              "type": "object",
              "properties": {
                "AirportCode": { "type": "string" },
                "AirportName": { "type": "string" },
                "CityName": { "type": "string" },
                "Terminal": { "type": "string" },
                "DepTime": { "type": "string", "format": "date-time" }
              }
            },
            "Destination": {
              "type": "object",
              "properties": {
                "AirportCode": { "type": "string" },
                "AirportName": { "type": "string" },
                "CityName": { "type": "string" },
                "Terminal": { "type": "string" },
                "ArrTime": { "type": "string", "format": "date-time" }
              }
            },
            "Baggage": { "type": "string" }
          }
        }
      },
      baggage: [baggageSchema],
      mealDynamic:[mealDynamicSchema],      
      passengerDetails: {
        type: [
          {
            title:{
              type : String,
            },
            firstName: {
              type: String,
            },
            lastName: {
              type: String,
            },
            gender: {
              type: String,
            },
            ContactNo: {
              type: String,
            },
            DateOfBirth: {
              type: String,
            },
            passportNo:{
              type:String,
              default:""
            },
            passportExpiry: {
            type:String,
            default:""
          },
            email: {
              type: String,
              
            },
            addressLine1: {
              type: String,
            },
            city: {
              type: String,
            },
            TicketNumber: {
              type :String,
            },
            amount:{
              type :Number,
            },
          },
        ],
      },
      paymentStatus: {
        type: String,
        enum: ["success", "failure", "pending"],
        default: "pending",
      },
      bookingStatus: {
        type: String,
        default: bookingStatus.PENDING
      },
      bookingPartyType:{type:String,default:'Kafila'}      
    },
    { timestamps: true }
  )
  kafilaFlightBookingData.plugin(mongoosePaginate);
  kafilaFlightBookingData.plugin(aggregatePaginate)
  module.exports = mongoose.model("KafilaAgentFlightBookings", kafilaFlightBookingData);

  