const mongoose = require("mongoose");
const status = require('../../enums/status');
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const markupSchema = new mongoose.Schema({
    hotelMarkup: {
        type: Number,
    },
    flightMarkup: {
        type: Number,
    },
    busMarkup: {
        type: Number,
    },
    holidayPackageMarkup: {
        type: Number,
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default:status.ACTIVE,
    },
},{timestamps:true})
markupSchema.plugin(mongoosePaginate);

markupSchema.plugin(aggregatePaginate);
const markup = mongoose.model('APPMarkup', markupSchema);

module.exports = markup;