const { required } = require("joi");
const mongoose = require("mongoose");
const { activeStatus } = require("../common/const");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
mongoose.pluralize(null);

const packageSchema = new mongoose.Schema(
    {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userb2bs",
        },
        pakage_title: {
          type: String,
                  },
        pakage_img: {
          type: String,
          default:""
        },
        package_img: {
          type: Array,
        },      
        destination: {
          type: Array,
                  },
        country:{
          type:String
        },
        days: {
          type: Number,
          minLength: [2, "Please enter more than two day"],
        },
        schedule: {
          flexible: {
            type: Boolean,
            default: true,
          },
          fixed_departure: {
            type: Boolean,
            default: false,
          },
        },
        pakage_amount: {
          currency: {
            type: String,
            enum: ["USD", "EUR", "INR"],
            
            default: "INR",
          },
          amount: {
            type: Number,
          },
        },
        insclusions: {
          type: Array,
          default: [],
        },
        hotel_details: {
          type: String,
        },
        insclusion_note: {
          type: String,
        },
        exclusion_note: {
          type: String,
        },
        detailed_ltinerary: {
          type: Array,
          default: [],
        },
        overview: {
          type: String,
        },
        select_tags: {
          type: Array,
          default: [],
        },
        term_Conditions: {
          type: String,
        },
        cancellation_Policy: {
          type: String,
        },
        is_active: {
          type: Number,
          default: activeStatus.IN_ACTIVE,
        },
        
      },
      {
        timestamps: true,
      });
packageSchema.plugin(mongoosePaginate);
packageSchema.plugin(aggregatePaginate);
const rating = mongoose.model("holidayPackage", packageSchema);
module.exports = rating;