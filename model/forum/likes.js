const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const commentStatus = require('../../enums/commentStatus');
mongoose.pluralize(null);
const status = require('../../enums/status');

const likeSchema = new mongoose.Schema({
    commentId: { type: mongoose.Types.ObjectId, ref: 'forumQueAns' },
    likes:[ {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    }],
    status: {
        type: String,
        default: status.ACTIVE
    },
}, { timestamps: true })
likeSchema.plugin(mongoosePaginate);
likeSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('likesCommnet', likeSchema);

