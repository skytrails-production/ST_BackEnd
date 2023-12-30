const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const commentStatus=require('../../enums/commentStatus')
mongoose.pluralize(null);
const status=require ('../../enums/status')
const subCommentStatusSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    questionId: {
        type: mongoose.Types.ObjectId,
        ref: 'forumQue',
    },
    commentId:{
        type: mongoose.Types.ObjectId,
        ref: 'forumQueAns',
    },
    
    parentComment:{
        type:mongoose.Types.ObjectId,
        ref:'forumQueAns'
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

subCommentStatusSchema.plugin(mongoosePaginate);
subCommentStatusSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('subCommnet', subCommentStatusSchema);



