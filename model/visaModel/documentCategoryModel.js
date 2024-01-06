const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const issuedType = require("../../enums/issuedType");
mongoose.pluralize(null);

const documentCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    documentTypesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentType",
    },
    documentName: {
      type: String,
    },
  },
  { timestamps: true }
);
documentCategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("DocumentCategory", documentCategorySchema);
