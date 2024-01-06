const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
mongoose.pluralize(null);

const visaTypeSchema = new mongoose.Schema({
    visaType:{type:String},
    
    status:{
        type:String,
        enum:[status.ACTIVE,status.BLOCK,status.DELETE],
        default:status.ACTIVE
    },

},{ timestamps: true });
visaTypeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("visaType", visaTypeSchema);