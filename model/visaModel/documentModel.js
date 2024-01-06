const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
mongoose.pluralize(null);

const documentTypeSchema = new mongoose.Schema(
  {
    documentName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
documentTypeSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("DocumentType", documentTypeSchema);
