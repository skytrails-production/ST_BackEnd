const mongoose = require("mongoose");
const userType = require("../enums/userType");
const { activeStatus } = require("../common/const");
const approveStatus = require("../enums/approveStatus");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const Userb2bSchema = 
  new mongoose.Schema(
    {
      personal_details: {
        first_name: {
          type: String,
        },
        last_name: {
          type: String,
          
        },
        email: {
          type: String,
        },
        mobile: {
          country_code: {
            type: String,
            default: "+91",
          },
          mobile_number: {
            type: String,
          },
        },
        address_details: {
          residential_address: {
            type: String,
            
          },
          address_2: {
            type: String,
          },
          telephone_number: {
            type: String,
          },
          pincode: {
            type: String,
            
          },
          country: {
            type: String,
            default: "INDIA",
          },
          state: {
            type: String,
            
          },
          city: {
            type: String,
            
          },
        },
        password: { type: String },
      },
      agency_details: {
        agency_name: {
          type: String,
          default:" "
        },
        pan_number: {
          type: String, 
          default:" ",
          unique:true,
          // sparse: true
        },
        agency_mobile: {
          country_code: {
            type: String,
            default: "+91",
          },
          mobile_number: {
            type: String,
            
          },
        },
        address: {
          type: String,
          default:" "
        },
        address_2: {
          type: String,
          default:" "
        },
        fax: {
          type: String,
          default:" "
        },
        pincode: {
          type: String,
          default:" "
        },
        country: {
          type: String,
          default: "INDIA",
        },
        state: {
          type: String,
          default:" "
        },
        city: {
          type: String,
          default:" "
        },
        business_type: {
          type: String,
          default:" "
        },
        office_space: {
          type: String,
          default:" "
        },
        IATA_registration_id: {
          type: String,
          default:" "
        },
        IATA_code: {
          type: String,
          default:" "
        },
        TDS: {
          type: String,
          default:" "
        },
        TDS_percentage: {
          type: String,
          default:" "
        },
        references: {
          type: String,
          default:" "
        },
        consolidators: {
          type: String,
          default:" "
        },
        remarks: {
          type: String,
          default:" "
        },
        document_details: {
          pan_card_document: {
            type: String,
            default:" "
          },
        },
      },
      agency_gst_details: {
        agency_name: {
          type: String,
          default:" "
        },
        agency_classification: {
          type: String,
          default:" "
        },
        agency_GSTIN: {
          type: String,
          default:" "
        },
        state: {
          type: String,
          default:" "
        },
        state_code: {
          type: String,
          default:" "
        },
        provisional_GSTIN: {
          type: String,
          default:" "
        },
        contact_person: {
          type: String,
          default:" "
        },
        phone_number: {
          type: String,
          default:" "
        },
        telephone_number: {
          type: String,
          default:" "
        },
        email: {
          type: String,
          default:" "
        },
        correspondance_mail_id: {
          type: String,
          default:" "
        },
        GST_registration_status: {
          type: String,
          default:" "
        },
        HSN_SAC_code: {
          type: String,
          default:" "
        },
        composition_levy: {
          type: String,
          default:" "
        },
        address_line1: {
          type: String,
          default:" "
        },
        address_line2: {
          type: String,
          default:" "
        },
        pincode: {
          type: String,
          default:" "
        },
        agency_city: {
          type: String,
          default:" "
        },
        supply_type: {
          type: String,
          default:" "
        },
      },
       markup:{
        bus:{
          type: Number,
          default: 50,
         },
         hotel:{
          type: Number,
          default: 50,
         },
         flight:{
          type: Number,
          default: 50,
         },
         holiday:{
          type: Number,
          default: 50,
         },
       },
      walletid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallet",
      },
      balance: {
        type: Number,
        
        default: 0,
      },
      is_active: {
        type: Number,
        default: activeStatus.IN_ACTIVE,
      },
      userType: {
        type: String,
        enum: [userType.ADMIN, userType.AGENT, userType.USER, userType.SUBADMIN],
        default: userType.AGENT
      },
      reason: {
        type: String,
        default: "",
      },
      agentCompanyLogo:{
        type:String,
        default:''
      },
    isApproved: {
      type: Boolean,
      default: false
    },
    approveStatus: {
      type: String,
      enum: [approveStatus.APPROVED, approveStatus.PENDING, approveStatus.REJECT],
      default: approveStatus.PENDING
    },
    referralCode: {type:String}, // Add referral code field
    referrerCode: {type:String},
    rewardAmount: { type: Number },
    revenue: { type: Number },
    socialId:{
      instaId:{type:String},
      facebookId:{type:String},
      googleId:{type:String},
      linkedinId:{type:String},
    },
    agentProfileBanner: {type:String},
    companyDomain:{type:String,
      default:"",
    },
    },    
    {
      timestamps: true,
    }
  )
  Userb2bSchema.plugin(mongoosePaginate);
const Userb2b= mongoose.model('userb2bs',Userb2bSchema);

module.exports = Userb2b;
