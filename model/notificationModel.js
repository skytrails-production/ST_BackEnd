const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const { string } = require("joi");

mongoose.pluralize(null);

const notificationSchema = new mongoose.Schema({
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userBtoC'},
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type: String,
    },
    notificationType:{type: String,},

    isSend: {
        type: Boolean,
        default:false
    }
}, { timestamps: true })

notificationSchema.plugin(aggregatePaginate);

notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("notifiactionContent", notificationSchema);