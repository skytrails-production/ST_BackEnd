const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const commentStatus=require('../../enums/commentStatus');
const status=require("../../enums/status")
mongoose.pluralize(null);

const reportSchema = new mongoose.Schema({
    postId: { type: mongoose.Types.ObjectId, ref: 'forumQue', required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'userBtoC', required: true },
    reason: { type: String},
    status: {type: String,enum:[status.ACTIVE,status.BLOCK,status.DELETE],default: status.ACTIVE,},
   
}, { timestamps: true });

reportSchema.plugin(mongoosePaginate);
reportSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('forumReport', reportSchema);
