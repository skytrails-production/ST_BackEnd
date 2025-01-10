const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatBotPromptSchema = new Schema(
  {
    prompt: {
      type: String,
    },
    response: {
      type: String,
    },
    category: {
      type: String,
      default: "General",
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "userBtoC",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatBotPrompts", chatBotPromptSchema);
