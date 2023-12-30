const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const status=require ('../../enums/status')
mongoose.pluralize(null);

const bookmarSchema = new mongoose.Schema({
    questionId:[ {
        type: mongoose.Types.ObjectId,
        ref: 'forumQue'
    }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    status:{
        type:String,
        default:status.ACTIVE
    },
}, { timestamps: true })
bookmarSchema.plugin(mongoosePaginate);
bookmarSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('bookmark', bookmarSchema);