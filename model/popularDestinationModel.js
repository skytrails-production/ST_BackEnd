const mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const popularSchema=new mongoose.Schema({
    city:{
        type:String
      },
    images:{
        type:String
      },
    description:{
        type:String
      },
    discount:{
        type:String
      },
    status:{type:String,enum:[status.ACTIVE,status.BLOCK,status.DELETE],default:status.ACTIVE}
},{timeStamps:true});
popularSchema.plugin(mongoosePaginate);
popularSchema.plugin(aggregatePaginate);
const package = mongoose.model("popularDestination", popularSchema);
module.exports = package;
