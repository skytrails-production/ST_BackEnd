const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
mongoose.pluralize(null);

const jobApplication = new mongoose.Schema({
    firstName:String,
    lastName:String,
    userEmail:String,
    userContactNumber: {
        countryCode: { type: String,default:"+91" },
        number: { type: String },
      },
    jobId:{ type: mongoose.Schema.Types.ObjectId, ref: "skyOpenings" },
    experience:String,
    summary: String,
    document:String,    
}, { timestamps: true });
jobApplication.plugin(mongoosePaginate);
jobApplication.plugin(aggregatePaginate);
module.exports = mongoose.model("jobApplications", jobApplication);
