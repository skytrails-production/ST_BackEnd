const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const gender = require("../../enums/gender");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const offerType = require("../../enums/offerType");

const seatDynamicSchema = new mongoose.Schema({
  AirlineCode: String,
  FlightNumber: String,
  CraftType: String,
  Origin: String,
  Destination: String,
  AvailabilityType: Number,
  Description: Number,
  Code: String,
  RowNo: String,
  SeatNo: String,
  SeatType: Number,
  SeatWayType: Number,
  Compartment: Number,
  Deck: Number,
  Currency: String,
  Price: Number
});
const flightBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    ticketType: {
      type: String,
    },
    oneWay: {
      type: Boolean,
    },
    bookingId: {
      type: String,
    },
    pnr: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    origin: {
      type: String,
    },
    destination: {
      type: String,
    },

    airlineDetails: [

      {
        _id:false,
        Airline: {
        
            AirlineCode: { type: "string" },
            AirlineName: { type: "string" },
            FlightNumber: { type: "string" },
            FareClass: { type: "string" },
          },
        
        Origin: {
          
            AirportCode: { type: "string" },
            AirportName: { type: "string" },
            CityName: { type: "string" },
            Terminal: { type: "string" },
            DepTime: { type: "string", format: "date-time" },
          
        },
        Destination: {
         
            AirportCode: { type: "string" },
            AirportName: { type: "string" },
            CityName: { type: "string" },
            Terminal: { type: "string" },
            ArrTime: { type: "string", format: "date-time" },
          
        },
        Baggage: { type: "string" },
      },
    ],
    baggage: [
      {
        _id:false,
        AirlineCode: String,
        FlightNumber: String,
        WayType: Number,
        Code: String,
        Description: String,
        Weight: Number,
        Currency: String,
        Price: Number,
        Origin: String,
        Destination: String,
      },
    ],
    mealDynamic: [
      {
        _id:false,
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
        Destination: String,
      },
    ],
    seatDynamic:[seatDynamicSchema],
    passengerDetails: [
      {
        _id:false,
        title: {
          type: String,
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
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["success", "failure", "pending"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum:[bookingStatus.BOOKED,bookingStatus.CANCEL,bookingStatus.FAILED,bookingStatus.PENDING],
      default: bookingStatus.BOOKED
    },
    status: {
      type: String,
      default: status.ACTIVE,
    },
    transactions: {
      type: mongoose.Types.ObjectId,
      ref: "userTransactions",
    },
    bookingType: {
      type: String,
      enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
      default: offerType.FLIGHTS,
    },
    dateOfJourney: { type: String },
    bookingPartyType:{type:String,default:'KAFILA'},
    isKafilaBooking:{type:Boolean,default:true}
  },
  { timestamps: true }
);
flightBookingSchema.plugin(mongoosePaginate);

flightBookingSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("kafilaUserFlightBooking", flightBookingSchema);
