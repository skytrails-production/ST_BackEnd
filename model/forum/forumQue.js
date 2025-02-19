const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
mongoose.pluralize(null);
const status=require ('../../enums/storyStatus')
const forumQueSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'userBtoC',
    },
    content: {
        type: String, // Content of the question
    },
    tags: {
        type: [String], // Array of tags for categorization and search
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "userBtoC",
          },
    ],
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
    image:{
        type:String, 
    },
    isLike: {
        type: Boolean,
        default: false,
    },
    isAnyComment: {
        type: Boolean,
        default: false,
    },
    responseCount:{
        type:Number,
        default:0
    },
    likesCount:{
        type:Number,
        default:0
    },
    trending:{
        type:Boolean,
        default:false
    },
    location:{
        type:String, 
    },
    multLocation:{
        type:String
    },
    status:{
        type:String,
        default:status.PENDING
    },
}, { timestamps: true });

forumQueSchema.plugin(mongoosePaginate);
forumQueSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('forumQue', forumQueSchema);
