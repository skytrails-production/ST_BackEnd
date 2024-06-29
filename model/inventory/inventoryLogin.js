const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: "string", required: "true" },
  password: { type: "string", required: "true" },
  hotelName: { type: "string", required: "true" },
  hotelCity: { type: "string", required: "true" },
  hotelState: { type: "string", required: "true" },
});

module.exports = mongoose.model("inventoryLogin", userSchema);
