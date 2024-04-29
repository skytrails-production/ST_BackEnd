const mongoose = require("mongoose");
const { Schema } = mongoose; // Destructuring directly from mongoose
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);

const referallAmountSchema = new Schema({
    refereeAmount: Number,
    referrerAmount: Number
}, { timestamps: true }); // Moved timestamps option to the schema options object

referallAmountSchema.plugin(mongoosePaginate);

// Renaming the model to follow convention, it should be singular
const UserReferralAmount = mongoose.model("UserReferralAmount", referallAmountSchema);

module.exports = UserReferralAmount;