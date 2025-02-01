const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
const resolveStatus = require("../../enums/errorType");
mongoose.pluralize(null);

const chatBotSchema = new mongoose.Schema(
  {
    userId: {

      type: mongoose.Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    agentId:{ type: String},
    threadId:{ type: String},
    userName: { type: String },
    userPhoneNumber: { type: String },
    query: { type: String },
    respoense: { type: String },
    queryId: { type: String },
    conversationId: {
      type: String,
    },
    messages: [
      {
        sender: { type: String, enum: ["user", "bot"] },
        userQuery: { type: String },
        botRespoense: { type: String },
        audioUrl:{type:String},
        // imageUrl:{type:String},
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isLead: { type: Boolean, default: false },
    queryType:{type:String,enum:['flight','hotel','bus','visa','packages','genereal']},
    TicketNo:{type:String},
    leadStatus: {
      type: String,
      enum: ["NEW", "FOLLOW_UP", "CLOSED"],
      default: "NEW",
    },
    status: {
      type: String,
      enum: [resolveStatus.PENDING, resolveStatus.RESOLVED],
      default: resolveStatus.PENDING,
    },
  },
  { timestamps: true }
);
chatBotSchema.index({ userId: 1 });
chatBotSchema.index({ queryId: 1 });
chatBotSchema.index({ status: 1 });

// Plugins
chatBotSchema.plugin(mongoosePaginate);
chatBotSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("chatBotConversations", chatBotSchema);

