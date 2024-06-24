const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
mongoose.pluralize(null);

const jobApplication = new mongoose.Schema({
    
}, { timestamps: true });
jobApplication.plugin(mongoosePaginate);
jobApplication.plugin(aggregatePaginate);
module.exports = mongoose.model("jobApplications", jobApplication);
