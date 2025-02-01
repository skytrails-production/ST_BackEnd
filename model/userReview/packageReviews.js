const { required } = require("joi");
const mongoose = require("mongoose");
const { activeStatus } = require("../../common/const");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
mongoose.pluralize(null);

const packageRatingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    section: {
      type: String,
      default:"Package"
    },
    gallery:[],
    starRating: {
      type: Number,max:5
    },
    travelDate: { type: String },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packageReviews",
    },
    packageType:{type:String},
    // packageType: {
    //   type: Boolean,
    // //   default: true,
    // },
  },
  { timestamps: true }
);
packageRatingSchema.plugin(mongoosePaginate);
packageRatingSchema.plugin(aggregatePaginate);
const rating = mongoose.model("packageReviews", packageRatingSchema);
module.exports = rating;
