const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../enums/status");
const approveStatus = require("../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);

const appVersionSchema = new mongoose.Schema({
    iosVersion:String,
    androidVersion:String
},{timestamps:true});
appVersionSchema.plugin(mongoosePaginate);

appVersionSchema.plugin(aggregatePaginate);
const appVersion = mongoose.model("AppVersion", appVersionSchema);

module.exports = appVersion;
