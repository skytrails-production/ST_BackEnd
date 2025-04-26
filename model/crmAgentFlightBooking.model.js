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
  WayType: String,
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
          WayType: String,
          Code: String,
          Description: String,
          AirlineDescription: String,
          Quantity: Number,
          Currency: String,
          Price: Number,
          Origin: String,
          Destination: String
});


const seatDynamicSchema = new mongoose.Schema({
  AirlineCode: String,
  FlightNumber: String,
  CraftType: String,
  Origin: String,
  Destination: String,
  AvailabilityType: String,
  Description: String,
  Code: String,
  RowNo: String,
  SeatNo: String,
  SeatType: String,
  SeatWayType: String,
  Compartment: String,
  Deck: String,
  Currency: String,
  Price: Number
});

const crmAgentFlightBookingSchema = new mongoose.Schema(
    {
      userId: String,
      ticketType:{
        type:String,
      },
      isHold:{
        type:Boolean,
      },
      holdAmount:Number,
      lastTicketDate:String,
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
      seatDynamic:[seatDynamicSchema], 
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
            passportNo:String,
            passportExpiry:String,
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
        default: "success",
      },
      bookingStatus: {
        type: String,
        default: bookingStatus.PENDING
      },
      bookingPartyType:{
        type:String,
        enum: ["Tbo","Amadeus","Kafila"],        
        default:'Tbo'
    }      
    },
    { timestamps: true }
  )
  crmAgentFlightBookingSchema.plugin(mongoosePaginate);
  crmAgentFlightBookingSchema.plugin(aggregatePaginate)
  const CrmAgentFlightBooking = mongoose.model("CrmAgentFlightBooking", crmAgentFlightBookingSchema);

  module.exports = CrmAgentFlightBooking;