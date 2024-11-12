const { required } = require("joi");
const mongoose = require("mongoose");
const { activeStatus } = require("../common/const");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const internationlSchema = mongoose.Schema(


    {

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userb2bs",
      },

      pakage_title: {
        type: String,
        require: true,
        trim:true
      },
      pakage_img: {
        type: String,
        require: false,
        default:""
      },
      package_img: {
        type: Array,
        require: false,
      },      
      destination: {
        type: Array,
        require: true,
      },
      country:{
        type:String,
        set: (value) => value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
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
          required: true,
          default: "INR",
        },
        amount: {
          type: Number,
          required: true,
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
        required: true,
      },
      cancellation_Policy: {
        type: String,
        required: true,
      },
      is_active: {
        type: Number,
        default: activeStatus.IN_ACTIVE,
      },
      package_expiry_date: {
        type: Date,
        default: () => {
          

          const now = new Date();
          now.setMonth(now.getMonth() + 6);
  
          // Format the date as YYYY-MM-DD
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          
          return `${year}-${month}-${day}`;

        }
      }
      
    },
    {
      timestamps: true,
    }

);
internationlSchema.plugin(mongoosePaginate);
const internationl = mongoose.model("internationls", internationlSchema);

// ==========================================> package booking Schema <========================================//

const packagebookingSchema = mongoose.model(
  "packagebookingSchema",
  mongoose.Schema(
    {
      pakageid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "internationl",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      contactNumber: {
        contryCode: {
          type: String,
          default: "+91",
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
      departureCity: {
        type: String,
        required: true,
      },
      adults: {
        type: Number,
      },
      child: {
        type: Number,
      },
      selectRoom: {
        type: Number,
      },
      checkIndate: {
        type: String,
      },
      connected: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);

const confirmPackagebookingSchema = mongoose.model(
  "confirmPackagebookingSchema",
  mongoose.Schema(
    {
      pakageid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "internationl",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      travellers: [
        {
          name: String,
          dob: String,
          gender: String,
        },
      ],
      contact_details: {
        email: {
          type: String,
          required: true,
        },
        fullName: {
          type: String,
          required: true,
        },
        contactNumber: {
          contryCode: {
            type: String,
            default: "+91",
            required: true,
          },
          phone: {
            type: String,
            required: true,
          },
        },
      },
      sale_summary: {
        currency: {
          type: String,
          enum: ["USD", "INR", "EUR"],
          default: "INR",
        },
        price: String,
        fare_breakup: String,
        total_basic_cost: String,
        coupon_discount: String,
        fee_taxes: String,
        gst: String,
        total_gst: String,
      },
      departureCity: {
        type: String,
        required: true,
      },
      adults: {
        type: Number,
      },
      child: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  )
);


// ========================package City Data==========================

const packageCityData = mongoose.model(
  "packageCityDatas",
  mongoose.Schema(
    {
      cityName:{
        type:String,
        lowercase: true
      },    
      description:{
        type:String,
      },
      
      imageUrl: { 
        type: String,
        required: false,
      } 
           
    },
    {
      timestamps: true,
    }
  )
);


// package enquirey shcehma



const packageEnquirySchema = mongoose.model(
  "packageEnquirys",
  mongoose.Schema(
    {
      packageName:String,
      packageAmount:Number,
      name:String, 
      phoneNumber:String,
      email:String,
      dateOfTravel:String,
      departureCity:String,
      noOfAdult:Number,
      noOfChild:Number           
    },
    {
      timestamps: true,
    }
  )
);


module.exports = {
  internationl,
  packagebookingSchema,
  confirmPackagebookingSchema,
  packageCityData,
  packageEnquirySchema
};
