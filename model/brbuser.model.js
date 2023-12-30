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
          
        },
        pan_number: {
          type: String, 
          // default:" ",
          unique:true
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
          
        },
        address_2: {
          type: String,
        },
        fax: {
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
        business_type: {
          type: String,
          
        },
        office_space: {
          type: String,
        },
        IATA_registration_id: {
          type: String,
        },
        IATA_code: {
          type: String,
        },
        TDS: {
          type: String,
        },
        TDS_percentage: {
          type: String,
        },
        references: {
          type: String,
        },
        consolidators: {
          type: String,
        },
        remarks: {
          type: String,
        },
        document_details: {
          pan_card_document: {
            type: String,
          },
        },
      },
      agency_gst_details: {
        agency_name: {
          type: String,
          
        },
        agency_classification: {
          type: String,
          
        },
        agency_GSTIN: {
          type: String,
        },
        state: {
          type: String,
          
        },
        state_code: {
          type: String,
          
        },
        provisional_GSTIN: {
          type: String,
        },
        contact_person: {
          type: String,
        },
        phone_number: {
          type: String,
        },
        telephone_number: {
          type: String,
        },
        email: {
          type: String,
        },
        correspondance_mail_id: {
          type: String,
        },
        GST_registration_status: {
          type: String,
        },
        HSN_SAC_code: {
          type: String,
        },
        composition_levy: {
          type: String,
        },
        address_line1: {
          type: String,
          
        },
        address_line2: {
          type: String,
        },
        pincode: {
          type: String,
          
        },
        agency_city: {
          type: String,
          
        },
        supply_type: {
          type: String,
        },
      },
       markup:{
        bus:{
          type: Number,
          default: 0,
         },
         hotel:{
          type: Number,
          default: 0,
         },
         flight:{
          type: Number,
          default: 0,
         },
         holiday:{
          type: Number,
          default: 0,
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
    isApproved: {
      type: Boolean,
      default: false
    },
    approveStatus: {
      type: String,
      enum: [approveStatus.APPROVED, approveStatus.PENDING, approveStatus.REJECT],
      default: approveStatus.PENDING
    },
    },
    {
      timestamps: true,
    }
  )
  Userb2bSchema.plugin(mongoosePaginate);
const Userb2b= mongoose.model('userb2bs',Userb2bSchema);

module.exports = Userb2b;
