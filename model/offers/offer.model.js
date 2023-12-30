const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
mongoose.pluralize(null);
const offertype = require("../../enums/offerType");
const status = require('../../enums/status');
const Joi = require('joi');

// Define a Mongoose schema for your offers
const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
  },
    media: {
      type: [
        {
          mediaType: {
            type: String,
            enum: {
              values: ["photo"],
              message: "{VALUE} is not supported",
            },
          },
          link: { type: String },
        },
      ],
      default: [],
    },
    discount: {
      amount: { type: Number, required: true },
      type: { type: String, enum: ["percentage", "fixed"], required: true },
    },
    use_code: String,
    offerdetails: String,
    status: {
      type: String,
      enum: status,
      default: status.ACTIVE,
    },
    offertype:{ 
        type: String,
        enum: offertype,
    }
  },
  { timestamps: true }
);

offerSchema.plugin(mongoosePaginate);
offerSchema.plugin(aggregatePaginate);
// Create a Mongoose model for the offers collection
const Offer = mongoose.model("Offer", offerSchema);


// Define a Joi schema that matches your Mongoose model
const offerSchemaValidation = Joi.object({
  title: Joi.string().required(),
  userId: Joi.alternatives().try(
    Joi.string(),
    Joi.object(),
  ).required(),
  media: Joi.array().items(
    Joi.object({
      mediaType: Joi.string().valid('photo').required(),
      link: Joi.string().required(),
    })
  ),
  discount: Joi.object({
    amount: Joi.number().required(),
    type: Joi.string().valid('percentage', 'fixed').required(),
  }).required(),
  use_code: Joi.string().allow('', null), // Allow empty or null use_code
  offerdetails: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'BLOCKED', 'DELETE'), // Assuming 'status' enum values
  offertype: Joi.string().valid('FLIGHTS', 'HOTELS', 'HOLIDAYS', 'TRAINS', 'CABS', 'BANKOFFERS'), // Assuming 'offertype' enum values
});

module.exports = {
  offerSchemaValidation,
  Offer,
};
