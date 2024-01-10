const mongoose = require("mongoose");
const userType = require("../enums/userType");
const { user } = require(".");
const status = require("../enums/status");
const gender=require("../enums/gender")
const approveStatus = require("../enums/approveStatus");
var bcrypt = require("bcryptjs");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String , default:""},
    password: { type: String },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    phone: {
      country_code: {
        type: String,
        default: "+91",
      },
      mobile_number: { type: String },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: String,
    },
    socialId: {
      type: String,
    },
    socialType: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    firstTime: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    gender:{
      type: String,
      enum:[gender.FEMALE,gender.MALE,gender.OTHER]
    },
    Nationality:{
      type: String,
    },
    City:{
      type: String
    },
    State:{
      type: String
    },
    pincode:{
      type:String
    },
    approveStatus: {
      type: String,
      enum: [
        approveStatus.APPROVED,
        approveStatus.PENDING,
        approveStatus.REJECT,
      ],
      default: approveStatus.PENDING,
    },
    userType: {
      type: String,
      enum: [userType.ADMIN, userType.AGENT, userType.USER, userType.SUBADMIN],
      default: userType.USER,
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    reason: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
    },
    otpExpireTime: {
      type: Date,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    fcmToken: {
      type: [],
      _id: false,
      default: [],
    },
    balance: {
      type: Number,
    },
    bio: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
const User = mongoose.model("users", userSchema);
module.exports = User;

// Find admin user(s)
// User.find({ userType: userType.ADMIN }, async (err, result) => {
//   if (err) {
//     console.log("DEFAULT ADMIN ERROR", err);
//   } else if (result.length !== 0) {
//     console.log("Default Admin(s) already exist.");
//   } else {
//     // Create a default admin user
//     const obj = {
//       userType: userType.ADMIN,
//       username: "shivam@123", // Use "username" instead of "userName" if that's your schema field
//       email: "shivam@gmail.com",
//       roles: ["639c3761a9d14355e0713f37"],
//       phone: {
//         country_code: "+91",
//         mobile_number: "99999999999",
//       },
//       password: bcrypt.hashSync("asdf1234", 10),
//       Address: "New Delhi, India", // Use "Address" instead of "address" if that's your schema field
//       isOnline: false,
//       approveStatus: approveStatus.APPROVED, // Set approveStatus as needed
//       status: status.ACTIVE, // Set status as needed
//       isApproved: true,
//     };

//     // Create the default admin user
//     User.create(obj, async (err1, result1) => {
//       if (err1) {
//         console.log("Default admin creation error", err1);
//       } else {
//         console.log("Default admin created", result1);
//       }
//     });
//   }
// });


// (async () => {
//   try {
//     // Find admin user(s)
//     const existingAdmins = await User.find({ userType: userType.ADMIN });

//     if (existingAdmins.length === 0) {
//       // Create a default admin user
//       const obj = {
//         userType: userType.ADMIN,
//         username: 'shivam@123',
//         email: 'shivam@gmail.com',
//         roles: ['639c3761a9d14355e0713f37'],
//         phone: {
//           country_code: '+91',
//           mobile_number: '99999999999',
//         },
//         password: bcrypt.hashSync('asdf1234', 10),
//         Address: 'New Delhi, India',
//         isOnline: false,
//         approveStatus: approveStatus.APPROVED,
//         status: status.ACTIVE,
//         isApproved: true,
//       };

//       // Create the default admin user
//       const createdAdmin = await User.create(obj);
//       console.log('Default admin created:', createdAdmin);
//     } else {
//       console.log('Default Admin(s) already exist.');
//     }
//   } catch (error) {
//     console.error('Error creating default admin:', error);
//   }
// })();
