const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);

const agentRewardSchema = new Schema({
    agentId: { type: Schema.Types.ObjectId, ref: "userb2bs"},
    rewardAmount: { type: Number },
    revenue: { type: Number },
    rewards: [{revenue:{ type: Number },rewardAmount:{type: Number}}]
},{timestamps:true});

agentRewardSchema.plugin(mongoosePaginate);

const AgentReward = mongoose.model("AgentRewards", agentRewardSchema);
module.exports = AgentReward;
