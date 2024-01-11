const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const issuedType = require("../enums/issuedType");
const authType = require("../enums/authType");
const queryType = require("../enums/offerType");
const visaType = require("../enums/visaType");
// const bookingType=require("../enums/")
const schemas = {
  flightBookingSchema: joi.object().keys({
    userId: joi.string().required(),
    oneWay: joi.boolean().required(),
    bookingId: joi.string().required(),
    pnr: joi.string().required(),
    dateOfJourney: joi.string().required(),
    origin: joi.string().required(),
    destination: joi.string().required(),
    amount: joi.number().required(),
    airlineDetails: joi.object({
      AirlineName: joi.string().required(),
      DepTime: joi.string().required(),
    }),
    passengerDetails: joi.array().items(
      joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        gender: joi.string().allow(""),
        ContactNo: joi.string().allow(""),
        DateOfBirth: joi.string().required(),
        email: joi.string().email().allow(""),
        addressLine1: joi.string().allow(""),
        city: joi.string().allow(""),
      })
    ),
    // flightName: joi.string().required(),
    // pnr: joi.number().required(),
    paymentStatus: joi.string().required(),
    // transactionId: joi.string().required(),
  }),

  walletSchema: joi.object().keys({
    balance: joi.number().required(),
    userId: joi.objectId,
    currency: joi.string().max(3).required(),
  }),

  addwalletAmountSchema: joi.object().keys({
    balance: joi.number().required(),
    currency: joi.string().max(3).required(),
    isAdmin: joi.objectId,
  }),
  payWalletAmount: joi.object().keys({
    amount: joi.number().required(),
  }),

  //bus booking schema validation
  busBookingSchema: joi.object().keys({
    userId: joi.objectId,
    name: joi.string().required(),
    phone: joi.string().max(13).required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    destination: joi.string().required(),
    origin: joi.string().required(),
    dateOfJourney: joi.string().required(),
    busType: joi.string().required(),
    pnr: joi.string().required(),
    busId: joi.number().required(),
    noOfSeats: joi.number().required(),
    amount: joi.number().required(),
  }),

  //hotelBooking schema validation via JOI

  hotelBookingSchema: joi.object().keys({
    userId: joi.objectId,
    name: joi.string().required(),
    phone: joi.string().max(13).required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    destination: joi.string().required(),
    bookingId: joi.string().required(),
    CheckInDate: joi.string().required(),
    CheckOutDate: joi.string().required(),
    hotelName: joi.string().required(),
    hotelId: joi.number().required(),
    cityName: joi.string().required(),
    room: joi.number().required(),
    noOfPeople: joi.number().required(),
    country: joi.string().required(),
    amount: joi.number().required(),
  }),

  //weeklyVisa schema validation via joi

  weeklyVisaSchema: joi.object().keys({
    countryName: joi.string().required(),
    governmentFees: joi.number().optional(),
    validityPeriod: joi.string().optional(),
    lengthOfStay: joi.string().optional(),
    gallery: joi.array().items(joi.string()).optional(),
    visaType: joi.valid(...Object.values(visaType)).optional(),
    platFormFees: joi.number().optional(),
    issuedType: joi
      .string()
      .valid(...Object.values(issuedType))
      .required(),
    continent: joi.string().required(),
    daysToProcess: joi.number().optional(),
    visaCategoryName: joi.string().required(),
  }),
  //static content validation via joi
  staticContentSchema: joi.object().keys({
    title: joi.string().required(),
    description: joi.string().required(),
    type: joi
      .string()
      .valid(
        "FLIGHTS",
        "HOTELS",
        "BUSES",
        "TRAINS",
        "HOLIDAYPACKAGE",
        "CABS",
        "TRAVELINSURENCE",
        "FORXCARD",
        "PRODUCTOFFERING",
        "ABOUTTHESITE",
        "QUICKLINKS",
        "IMPORTANTLINKS",
        "CORPORATETRAVEL",
        "TNC",
        "PRIVACYPOLICY",
        "ABOUTUS",
        "RETURNPOLICY",
        "BOOKINGPOLICY",
        "QUESTION",
        "CONTACTUS"
      )
      .required(),
    subType: joi.string().optional(),
    contactNumber: joi.string().optional(),
    email: joi.string().optional(),
    address: joi.array().optional(),
    latitude: joi.array().optional(),
    longitude: joi.array().optional(),
  }),

  faqSchema: joi.object().keys({
    type: joi
      .string()
      .valid(
        "FLIGHTS",
        "HOTELS",
        "BUSES",
        "TRAINS",
        "HOLIDAYPACKAGE",
        "CABS",
        "TRAVELINSURENCE",
        "FORXCARD",
        "PRODUCTOFFERING",
        "ABOUTTHESITE",
        "QUICKLINKS",
        "IMPORTANTLINKS",
        "CORPORATETRAVEL",
        "TNC",
        "PRIVACYPOLICY",
        "ABOUTUS",
        "RETURNPOLICY",
        "BOOKINGPOLICY",
        "QUESTION"
      )
      .required(),
    que: joi.string().required(),
    ans: joi.string().required(),
    staticContentTypeId: joi.string().optional(),
  }),

  //forumSchema***********
  forumQueSchema: joi.object().keys({
    content: joi.string().required(),
    image: joi.string().optional(),
  }),
  //getData*************
  forumgetSchemas: joi.object().keys({
    search: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional(),
    questionId: joi.string().optional(),
    userId: joi.string().optional(),
  }),

  forumQueAnsComm: joi.object().keys({
    questionId: joi.string().required(),
    content: joi.string().required(),
    userId: joi.string().required(),
    commentId: joi.string().optional(),
  }),

  forumQueAnsgetSchemas: joi.object().keys({
    search: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional(),
    questionId: joi.string().optional(),
    answerId: joi.string().optional(),
    userId: joi.string().optional(),
  }),

  socialLoginSchema: joi.object().keys({
    socialId: joi.string().required(),
    socialType: joi.string().required(),
    deviceType: joi.string().required(),
    username: joi.string().optional(),
    email: joi.string().optional(),
    mobileNumber: joi.string().optional(),
    password: joi.string().optional(),
    userId: joi.string().optional(),
  }),

  subAdminSchema: joi.object().keys({
    username: joi.string().required(),
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    email: joi.string().required(),
    mobile_number: joi.string().required(),
    password: joi.string().required(),
    authType: joi
      .string()
      .valid(...Object.values(authType))
      .required(),
  }),
  updateSubAdmin: joi.object().keys({
    subAdminId: joi.string().required(),
    username: joi.string().optional(),
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    email: joi.string().optional(),
    mobile_number: joi.string().optional(),
  }),
  adminLoginSchema: joi.object().keys({
    email: joi.string().optional(),
    mobileNumber: joi.string().optional(),
    password: joi.string().required(),
  }),
  subAdminLogin: joi.object().keys({
    userName: joi.string().required(),
    password: joi.string().required(),
  }),

  userLoginSchema: joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required(),
  }),

  userSignupSchema: joi.object().keys({
    email: joi.string().required(),
    mobileNumber: joi.string().required(),
    password: joi.string().required(),
    username: joi.string().required(),
    Address: joi.string().required(),
    profilePic: joi.string().optional(),
    userType: joi.string().optional(),
  }),

  userVerifySchema: joi.object().keys({
    otp: joi.string().required(),
    email: joi.string().email().optional(),
    fullName: joi.string().optional(),
    dob: joi.string().optional(),
    socialId: joi.string().optional(),
  }),

  userForgetSchema: joi.object().keys({
    email: joi.string().required(),
  }),

  approveAgentSchema: joi.object().keys({
    userId: joi.string().required(),
    approveStatus: joi.string().required(),
    reason: joi.string().optional(),
  }),
  btoCuserLoginSchema: joi.object().keys({
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^(?!.*(\d)(?:\1{6,})).*[1-9]\d*$/)
      .required(),
  }),
  agetHotelBooking: joi.object().keys({
    page: joi.string().optional(),
    limit: joi.string().optional(),
    search: joi.string().optional(),
    fromDate: joi.string().optional(),
    toDate: joi.string().optional(),
    userId: joi.string().required(),
  }),
  changeRequest: joi.object().keys({
    reason: joi.string().required(),
    changerequest: joi.string().required(),
    bookingId: joi.string().required(),
    agentId: joi.string().required(),
    contactNumber: joi.string().required(),
    id: joi.string().required(),
    amount: joi.number().required(),
  }),
  changeBusRequest: joi.object().keys({
    reason: joi.string().required(),
    changerequest: joi.string().required(),
    busId: joi.string().required(),
    agentId: joi.string().required(),
    contactNumber: joi.string().required(),
    id: joi.string().required(),
    amount: joi.number().required(),
  }),

  cancelFlightBookingSchema: joi.object().keys({
    reason: joi.string().required(),
    flightBookingId: joi.string().required(),
    bookingId: joi.number().required(),
    pnr: joi.string().required(),
    agentId: joi.string().required(),
  }),
  cancelHotelBookingSchema: joi.object().keys({
    reason: joi.string().required(),
    hotelBookingId: joi.string().required(),
    bookingId: joi.number().required(),
    pnr: joi.string().optional(),
    agentId: joi.string().required(),
  }),

  advertisementSchema: joi.object().keys({
    title: joi.string().required(),
    content: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    remainingDays: joi.number().optional(),
  }),

  updateadvertisementSchema: joi.object().keys({
    title: joi.string().required(),
    content: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    remainingDays: joi.number().optional(),
    packageId: joi.string().required(),
  }),

  cancelBusBookingSchema: joi.object().keys({
    reason: joi.string().required(),
    busBookingId: joi.string().required(),
    busId: joi.number().required(),
    pnr: joi.string().optional(),
    agentId: joi.string().required(),
  }),

  cancelUserFlightBookingSchema: joi.object().keys({
    reason: joi.string().required(),
    flightBookingId: joi.string().required(),
    bookingId: joi.number().required(),
    pnr: joi.string().optional(),
  }),

  cancelUserHotelBookingSchema: joi.object().keys({
    reason: joi.string().required(),
    hotelBookingId: joi.string().required(),
    bookingId: joi.number().required(),
    pnr: joi.string().optional(),
  }),
  bookmarkSchema: joi.object().keys({
    questionId: joi.string().required(),
    userId: joi.string().required(),
  }),
  getPostByIdSchema: joi.object().keys({
    postId: joi.string().required(),
  }),
  cancelUserBusBookingSchema: joi.object().keys({
    reason: joi.string().required(),
    busBookingId: joi.string().required(),
    busId: joi.number().required(),
    pnr: joi.string().optional(),
  }),

  updateLocationSchema: joi.object().keys({
    latitude: joi.string().required(),
    longitude: joi.string().required(),
  }),
  markupSchema: joi.object().keys({
    hotelMarkup: joi.number().required(),
    flightMarkup: joi.number().required(),
    busMarkup: joi.number().required(),
    packageMarkup: joi.number().required(),
  }),
  offlineQuerySchema: joi.object().keys({
    email: joi.string().required(),
    contactNumber: joi.string().required(),
    origin: joi.string().optional(),
    destination: joi.string().optional(),
    message: joi.string().required(),
    queryType: joi
      .string()
      .valid(...Object.values(queryType))
      .required(),
  }),
  updateofflineQuerySchema: joi.object().keys({
    queryId: joi.string().required(),
  }),

  razorPaySchema: joi.object().keys({
    amount: joi.number().required(),
  }),
  packageBookingSchema: joi.object().keys({
    packageId: joi.string().required(),
    email: joi.string().required(),
    fullName: joi.string().required(),
    countryCode: joi.string().optional(),
    phone: joi.string().required(),
    departureCity: joi.string().required(),
    adults: joi.number().required(),
    child: joi.number().required(),
    packageType: joi.string().required(),
    departureDate: joi.string().required(),
    noOfPeople:joi.number().required()
  }),
  changeUserRequest: joi.object().keys({
    reason: joi.string().required(),
    changerequest: joi.string().required(),
    bookingId: joi.number().required(),
    contactNumber: joi.string().required(),
    flightBookingId: joi.string().required(),
    pnr: joi.string().required(),
  }),
  paymentSchema: joi.object().keys({
    amount: joi.number().required(),
    paymentId: joi.string().required(),
    bookingType: joi
      .string()
      .valid(...Object.values(queryType))
      .required(),
  }),
  paymentUrlSchema: joi.object().keys({
    name: joi.string().required(),
    amount: joi.number().required(),
    email: joi.string().required(),
    contact: joi.string().required(),
    policyName: joi.string().required(),
  }),
  searchSchema: joi.object().keys({
    origin: joi.string().optional(),
    destination: joi.string().optional(),
    journeyType: joi.string().optional(),
    searchType: joi
      .string()
      .valid(...Object.values(queryType))
      .required(),
    journeyDate: joi.string().optional(),
    cityName: joi.string().optional(),
    checkin: joi.string().optional(),
    checkout: joi.string().optional(),
    rooms: joi.number().optional(),
    days: joi.number().optional(),
  }),
  createAgentSchema: joi.object().keys({
    email: joi.string().required(),
    panNumber: joi.string().required(),
    mobile_number: joi.string().required(),
    password: joi.string().required(),
  }),
  sendPDFSchema: joi.object().keys({
    ticketId: joi.string().required(),
    email: joi.string().required(),
  }),
  bookingFailed: joi.object().keys({
    paymentId: joi.string().required(),
    bookingType: joi.string().required(),
    amount: joi.number().required(),
  }),
  statusSchema: joi.object().keys({
    userId: joi.string().required(),
    approveStatus: joi.string().required(),
  }),

  webAddSchema: joi.object().keys({
    title: joi.string().required(),
    content: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    remainingDays: joi.number().optional(),
    addType: joi.valid(...Object.values(queryType)).required(),
  }),
  transactionSchema: joi.object().keys({
    firstname: joi.string().required(),
    phone: joi.string().required(),
    email: joi.string().required(),
    amount: joi.number().required(),
    productinfo: joi.string().required(),
    surl: joi.string().optional(),
    furl: joi.string().optional(),
    bookingType: joi.string().required(),
  }),
  eventSchema: joi.object().keys({
    title: joi.string().required(),
    content: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    remainingDays: joi.number().optional(),
    price: joi.number().optional(),
    bookingPrice: joi.number().optional(),
    age: joi.string().required(),
    venue: joi.string().required(),
    showType: joi.string().required(),
    adultPrice: joi.number().required(),
    childPrice: joi.number().required(),
    couplePrice: joi.number().required(),
    startTime: joi.string().required(),
    endTime: joi.string().required(),
    breakTime: joi.number().required(),
    noOfShows: joi.string().required(),
    slotTime: joi.number().required(),
    latitude: joi.number().required(),
    longitude: joi.number().required(),
    isPaid: joi.boolean().required(),
    noOfMember: joi.number().required(),
  }),
  eventBookingSchema: joi.object().keys({
    price: joi.number().optional(),
    eventDate: joi.string().required(),
    adults: joi.number().optional(),
    child: joi.number().optional(),
    couple: joi.number().optional(),
    transactionId: joi.string().optional(),
    eventId: joi.string().required(),
    startTime: joi.string().required(),
    EndTime: joi.string().optional(),
    noOfMember: joi.number().required(),
  }),

  webAddSchema: joi.object().keys({
    title: joi.string().required(),
    content: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    remainingDays: joi.number().optional(),
    addType: joi.valid(...Object.values(queryType)).required(),
  }),
  transactionSchema: joi.object().keys({
    firstname: joi.string().required(),
    phone: joi.string().required(),
    email: joi.string().required(),
    amount: joi.number().required(),
    productinfo: joi.string().required(),
    surl: joi.string().optional(),
    furl: joi.string().optional(),
    bookingType: joi.valid(...Object.values(queryType)).required(),
  }),
  transactionSchemaAgent: joi.object().keys({
    userId: joi.string().required(),
    firstname: joi.string().required(),
    phone: joi.string().required(),
    email: joi.string().required(),
    amount: joi.number().required(),
    productinfo: joi.string().required(),
    surl: joi.string().optional(),
    furl: joi.string().optional(),
    bookingType: joi.string().required(),
  }),
  postLikesSchema: {
    postId: joi.string().required(),
  },
  createDocSchema: joi.object().keys({
    documentName: joi.string().required(),
    description: joi.string().required(),
  }),
  docCategorySchema: joi.object().keys({
    categoryName: joi.string().required(),
    description: joi.string().required(),
    documentTypes: joi.string().required(),
  }),
  createVisaCategorySchema: joi.object().keys({
    visaType: joi.valid(...Object.values(visaType)).required(),
    categoryName: joi.string().required(),
    description: joi.string().required(),
  }),
  docRequireSchema: joi.object().keys({
    visaCountry: joi.string().required(),
    visaCategory: joi.string().required(),
    requiredDocCategory: joi.array().required(),
    visaType: joi.valid(...Object.values(visaType)).optional(),
  }),
};

module.exports = schemas;
