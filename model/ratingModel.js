const { required } = require("joi");
const mongoose = require("mongoose");
const { activeStatus } = require("../common/const");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
mongoose.pluralize(null);

const ratingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'userBtoC'
    },
    userName:{
        type:String
    },
    rate:{
        type:Number
    },
    isPositive:{
        type:Boolean,
        default:true
    },
    comments:{
        type:String
    },
    destination:{
        type:String
    },
    section:{
        type:String
    },
    icon:{
        type:String
    }
},{timestamps:true});
ratingSchema.plugin(mongoosePaginate);
ratingSchema.plugin(aggregatePaginate);
const rating = mongoose.model("userRating", ratingSchema);
module.exports = rating;