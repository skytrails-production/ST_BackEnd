const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const gender=require("../../enums/gender");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const offerType=require('../../enums/offerType')
const BookingDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },

        oneWay:{
          type:Boolean,
        },
        bookingId: {
          type:Number,
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
          default: bookingStatus.BOOKED
        },      
        status: {
            type: String,
            default: status.ACTIVE
        },
        transactions: {
            type: mongoose.Types.ObjectId,
            ref: 'userTransactions',
        },
        bookingType: {
            type: String,
            enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
            default: offerType.FLIGHTS
        },dateOfJourney:{type:String}
    },
    { timestamps: true }
)
BookingDetailSchema.plugin(mongoosePaginate);

BookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userflightBookingDetail", BookingDetailSchema);