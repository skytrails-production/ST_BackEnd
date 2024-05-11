const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
mongoose.pluralize(null);
const status=require ('../enums/storyStatus')
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
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
    media: [],
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
    multiLocation:{
        type:String
    },
    status:{
        type:String,
        enum:[status.ACTIVE,status.DELETE,status.PENDING],
        default:status.ACTIVE
    },
}, { timestamps: true });

blogSchema.plugin(mongoosePaginate);
blogSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('blog', blogSchema);
