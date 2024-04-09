const mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const packageSchema=new mongoose.Schema({
    packageType:{
        type:String
      },
    packageImage:{
        type:String
      },
    packageTitle:{
        type:String
      },
    packageDiscount:{
        type:String
      },
    status:{type:String,enum:[status.ACTIVE,status.BLOCK,status.DELETE],default:status.ACTIVE}
},{timeStamps:true});
packageSchema.plugin(mongoosePaginate);
packageSchema.plugin(aggregatePaginate);
const package = mongoose.model("packageBanner", packageSchema);
module.exports = package;
