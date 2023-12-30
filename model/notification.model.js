const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notifSchema = new Schema(
  {
    //=========================== USER NOTIFICATIONS =======================================
    from: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    //=========================== ADMIN NOTIFICATIONS =======================================
    adminToUser: { type: Boolean, default: false },
    target: {
      type: String,
      enum: {
        values: ["all"],
        message: "{VALUE} is not supported",
      },
    },
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    notifDate: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    userCount: Number,
  },
  { collection: "notification" }
);

module.exports = Notification = mongoose.model("notification", notifSchema);
