const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const commentStatus=require('../../enums/commentStatus')
mongoose.pluralize(null);
const status=require ('../../enums/status')
const forumQueAnsSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    questionId: {
        type: mongoose.Types.ObjectId,
        ref: 'forumQue',
    },
    content: {
        type: String, // Content of the answer
    },
    views: {
        type: Number,
        default: 0,
    },
    media: [
        {
            filename: String, // Original file name
            url: String, // URL to the media file (e.g., stored in cloud storage)
            type: String, // MIME type (e.g., 'image/jpeg', 'video/mp4')
        },
    ],
    isAnyComment: {
        type: Boolean,
        default: false,
    },
    responseCount:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:status.ACTIVE
    },
    commentStatus:{
        type:String,
        enum:[commentStatus.COMMENT,commentStatus.SUBCOMMENT]
    }
}, { timestamps: true });

forumQueAnsSchema.plugin(mongoosePaginate);
forumQueAnsSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('forumQueAns', forumQueAnsSchema);



